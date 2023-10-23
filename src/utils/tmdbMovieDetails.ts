import axios from "axios";
import { type TmdbMovieType } from "~/types/tmdb/movie";

export async function tmdbMovieDetails(movieId: string) {
  const API_KEY = process.env.TMDB_API_KEY;

  const res = await axios.get<TmdbMovieType>(
    `https://api.themoviedb.org/3/movie/${movieId}`,
    {
      params: {
        api_key: API_KEY,
        language: "en-US",
        append_to_response: "release_dates",
      },
    }
  );

  // const parsedRes = tmdbMovieSchema.safeParse(res.data);

  return {
    ...res.data,
    year: res.data.release_date.split("-")[0],
    contentRating: res.data.release_dates.results
      .find((result) => result.iso_3166_1 === "US")
      ?.release_dates.find(({ certification }) => !!certification)
      ?.certification,
  };
}
