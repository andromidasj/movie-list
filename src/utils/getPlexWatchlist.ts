import { TRPCError } from "@trpc/server";
import axios from "axios";
import { z } from "zod";
import { type PlexWatchlistResponse } from "~/types";

const plexListSchema = z.object({
  movieId: z.string(),
  title: z.string(),
  year: z.number(),
  poster: z.string().url(),
  runtime: z.number(),
});

type PlexList = z.infer<typeof plexListSchema>;

export const WATCHLIST_URL =
  "https://discover.provider.plex.tv/library/sections/watchlist/all";
export const MOVIE_TYPE_FILTER = 1;
const WATCHLIST_SIZE = 200; // 200 seems to be the limit for getting Watchlist items

/**
 * @param token - Plex Token
 * @returns Movie type without "id" or "watched"
 */
export async function getPlexWatchlist(token: string): Promise<PlexList[]> {
  try {
    // make network call to plex watchlist api
    const movies = (
      await axios.get<PlexWatchlistResponse>(WATCHLIST_URL, {
        headers: { Accept: "application/json" },
        params: {
          "X-Plex-Token": token,
          type: MOVIE_TYPE_FILTER,
          "X-Plex-Container-Size": WATCHLIST_SIZE,
        },
      })
    ).data.MediaContainer.Metadata;

    return movies.map((m) => ({
      movieId: m.ratingKey,
      title: m.title,
      year: m.year,
      poster: m.thumb,
      watched: !!m.viewCount,
      runtime: m.duration,
    }));
  } catch (error) {
    // TODO: an error with the plex token happened, so instead throw an error that requires changing the token in the DB.
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid Plex Token. Please enter a valid token.",
        });
      }
    }
    throw new TRPCError({
      code: "BAD_REQUEST",
    });
  }
}
