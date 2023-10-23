import { z } from "zod";

export const tmdbMovieSchema = z
  .object({
    adult: z.boolean(),
    backdrop_path: z.string().nullable(),
    belongs_to_collection: z
      .object({
        id: z.number().optional(),
        name: z.string().optional(),
        poster_path: z.string().optional(),
        backdrop_path: z.string().optional(),
      })
      .nullable(),
    budget: z.number(),
    genres: z.array(
      z.object({
        id: z.number(),
        name: z.string(),
      })
    ),
    homepage: z.string(),
    id: z.number(),
    imdb_id: z.string().nullable(),
    original_language: z.string(),
    original_title: z.string(),
    overview: z.string(),
    popularity: z.number(),
    poster_path: z.string(),
    production_companies: z.array(
      z.object({
        id: z.number(),
        logo_path: z.string().nullable(),
        name: z.string(),
        origin_country: z.string(),
      })
    ),
    production_countries: z.array(
      z.object({
        iso_3166_1: z.string(),
        name: z.string(),
      })
    ),
    release_date: z.string(),
    revenue: z.number(),
    runtime: z.number(),
    spoken_languages: z.array(
      z.object({
        english_name: z.string(),
        iso_639_1: z.string(),
        name: z.string(),
      })
    ),
    status: z.string(),
    tagline: z.string(),
    title: z.string(),
    video: z.boolean(),
    vote_average: z.number(),
    vote_count: z.number(),
    release_dates: z.object({
      results: z.array(
        z.object({
          iso_3166_1: z.string(),
          release_dates: z.array(
            z.object({
              certification: z.string(),
              descriptors: z.array(z.string()),
              iso_639_1: z.string(),
              note: z.string().optional(),
              release_date: z.string(),
              type: z.number(),
            })
          ),
        })
      ),
    }),
  })
  .transform((data) => ({
    ...data,
    year: Number(data.release_date.split("-")[0]),
    contentRating: data.release_dates.results
      .find((result) => result.iso_3166_1 === "US")
      ?.release_dates.find(({ certification }) => !!certification)
      ?.certification,
  }));

export type TmdbMovieType = z.infer<typeof tmdbMovieSchema>;
