// @ts-nocheck -- Node's type-stripping loader requires the explicit .ts extension.
import assert from "node:assert/strict";
import test from "node:test";

import { tmdbMovieSchema } from "../src/types/tmdb/movie.ts";

const movieWithCollectionPoster = (posterPath) => ({
  adult: false,
  backdrop_path: "/backdrop.jpg",
  belongs_to_collection: {
    id: 123,
    name: "Example Collection",
    poster_path: posterPath,
    backdrop_path: "/collection-backdrop.jpg",
  },
  budget: 1,
  genres: [{ id: 18, name: "Drama" }],
  homepage: "",
  id: 37799,
  imdb_id: "tt0000001",
  original_language: "en",
  original_title: "Example Movie",
  overview: "",
  popularity: 1,
  poster_path: "/poster.jpg",
  production_companies: [],
  production_countries: [],
  release_date: "2010-01-01",
  revenue: 1,
  runtime: 90,
  spoken_languages: [],
  status: "Released",
  tagline: "",
  title: "Example Movie",
  video: false,
  vote_average: 1,
  vote_count: 1,
  release_dates: { results: [] },
});

test("accepts a TMDB collection whose poster path is null", () => {
  const movie = tmdbMovieSchema.parse(movieWithCollectionPoster(null));

  assert.equal(movie.belongs_to_collection?.poster_path, null);
});
