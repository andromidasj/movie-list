import { z } from "zod";

// Define the movie schema
const movieSchema = z.object({
  adult: z.boolean(),
  backdrop_path: z.string().nullable(),
  genre_ids: z.array(z.number()),
  id: z.number(),
  original_language: z.string(),
  original_title: z.string(),
  overview: z.string(),
  popularity: z.number(),
  poster_path: z.string(),
  release_date: z.string(),
  title: z.string(),
  video: z.boolean(),
  vote_average: z.number(),
  vote_count: z.number(),
});

// Define the results schema as an array of movie schemas
const resultsSchema = z.array(movieSchema);

// Define the main schema
export const movieSearchSchema = z.object({
  page: z.number(),
  results: resultsSchema,
  total_pages: z.number(),
  total_results: z.number(),
});

export type TmdbSearchType = z.infer<typeof movieSearchSchema>;
