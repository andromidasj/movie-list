import axios from "axios";
import { TMDB_API_URL } from "consts";
import urlJoin from "url-join";
import { z } from "zod";
import { prisma } from "~/server/db";
import { tmdbMovieSchema, type TmdbMovieType } from "~/types/tmdb/movie";
import { type TmdbSearchType } from "~/types/tmdb/search";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const movieRouter = createTRPCRouter({
  getMovieInfo: publicProcedure.input(z.string()).query(async ({ input }) => {
    const res = await axios.get<TmdbMovieType>(
      urlJoin(TMDB_API_URL, "movie", input),
      {
        params: {
          api_key: process.env.TMDB_API_KEY,
          language: "en-US",
          append_to_response: "release_dates",
        },
      }
    );

    return tmdbMovieSchema.parse(res.data);
  }),

  searchMovie: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input: { query } }) => {
      const res = await axios.get<TmdbSearchType>(
        urlJoin(TMDB_API_URL, "search", "movie"),
        {
          params: {
            api_key: process.env.TMDB_API_KEY,
            language: "en-US",
            query,
          },
        }
      );

      return res.data.results.map((movie) => ({
        ...movie,
        year: movie.release_date.split("-")[0],
      }));
    }),

  getMovieWatchedStatus: publicProcedure
    .input(z.object({ id: z.number(), listId: z.number() }))
    .query(async ({ input: { id, listId } }) => {
      const list = await prisma.list.findFirst({
        where: { id: listId },
      });

      const movie = await prisma.movie.findFirst({
        where: { tmdbId: id, listId },
      });

      return {
        listName: list?.name,
        inList: !!movie?.inList,
        watched: !!movie?.watched,
        listedAt: movie?.listedDate,
        watchedAt: movie?.watchedDate,
      };
    }),

  changeMovieStatus: publicProcedure
    .input(
      z.object({
        movie: tmdbMovieSchema,
        listId: z.number(),
        action: z.enum([
          "addToList",
          "removeFromList",
          "markWatched",
          "markUnwatched",
        ]),
      })
    )
    .mutation(async ({ input: { movie, listId, action } }) => {
      const movieInDb = await prisma.movie.findFirst({
        where: { tmdbId: movie.id, listId },
        include: { List: true },
      });

      switch (action) {
        case "addToList":
          await prisma.movie.upsert({
            where: { id: movieInDb?.id || 0 },
            create: {
              tmdbId: movie.id,
              listId,
              inList: true,
              watched: false,
              poster: movie.poster_path,
              title: movie.title,
              year: movie.year,
              listedDate: new Date(),
              runtime: movie.runtime,
              imdbId: movie.imdb_id,
            },
            update: {
              inList: true,
              listedDate: new Date(),
              tmdbId: movie.id,
              imdbId: movie.imdb_id,
              poster: movie.poster_path,
            },
          });
          break;

        case "removeFromList":
          await prisma.movie.update({
            where: { id: movieInDb?.id || 0 },
            data: {
              inList: false,
              listedDate: null,
              tmdbId: movie.id,
              imdbId: movie.imdb_id,
            },
          });
          break;

        case "markWatched":
          await prisma.movie.upsert({
            where: { id: movieInDb?.id || 0 },
            create: {
              tmdbId: movie.id,
              listId,
              watched: true,
              inList: false,
              poster: movie.poster_path,
              title: movie.title,
              year: movie.year,
              watchedDate: new Date(),
              runtime: movie.runtime,
              imdbId: movie.imdb_id,
            },
            update: {
              watched: true,
              watchedDate: new Date(),
              inList: false,
              listedDate: null,
              poster: movie.poster_path,
            },
          });
          break;

        case "markUnwatched":
          await prisma.movie.update({
            where: { id: movieInDb?.id || 0 },
            data: {
              watched: false,
              watchedDate: null,
            },
          });
          break;

        default:
          break;
      }

      // Delete entry from movie table if not listed or watched
      const updatedMovieInDb = await prisma.movie.findFirst({
        where: { tmdbId: movie.id, listId },
        include: { List: true },
      });

      if (
        updatedMovieInDb &&
        !updatedMovieInDb.inList &&
        !updatedMovieInDb.watched
      ) {
        await prisma.movie.delete({
          where: { id: updatedMovieInDb.id },
        });
      }
    }),
});
