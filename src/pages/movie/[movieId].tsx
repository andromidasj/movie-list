import {
  BookmarkIcon as BookmarkOutline,
  CheckCircleIcon as CheckOutline,
  ChevronLeftIcon,
} from "@heroicons/react/24/outline";
import {
  BookmarkIcon as BookmarkFilled,
  CalendarIcon,
  CheckCircleIcon as CheckFilled,
  StarIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { TMDB_IMAGE_URL } from "consts";
import dayjs from "dayjs";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import Confetti from "react-dom-confetti";
import urlJoin from "url-join";
import { api } from "~/utils/api";
import { parseRuntime } from "~/utils/parseRuntime";

export default function MovieDetails() {
  const router = useRouter();
  let { listId, movieId } = router.query;

  if (typeof listId !== "string") listId = listId?.toString() ?? "";
  if (typeof movieId !== "string") movieId = movieId?.toString() ?? "";

  const { data: movie } = api.movie.getMovieInfo.useQuery(movieId, {
    enabled: !!movieId,
  });

  const { data: movieStatus } = api.movie.getMovieWatchedStatus.useQuery(
    { id: Number(movieId) || 0, listId: Number(listId) },
    { enabled: !!movieId && !!listId }
  );

  const utils = api.useUtils();

  const { mutate: changeMovieStatus } = api.movie.changeMovieStatus.useMutation(
    {
      async onMutate({ listId, action }) {
        await utils.movie.getMovieWatchedStatus.cancel();

        const prevData = utils.movie.getMovieWatchedStatus.getData();

        const newStatus: {
          inList?: boolean;
          watched?: boolean;
        } = {};

        switch (action) {
          case "addToList":
            newStatus.inList = true;
            break;

          case "removeFromList":
            newStatus.inList = false;
            break;

          case "markWatched":
            newStatus.watched = true;
            newStatus.inList = false;
            break;

          case "markUnwatched":
            newStatus.watched = false;
            break;

          default:
            break;
        }

        // Optimistically update the data with our new post
        utils.movie.getMovieWatchedStatus.setData(
          { id: movie?.id || 0, listId },
          (old) => ({ ...old, ...newStatus } as typeof old)
        );

        action === "markWatched" && toggleConfetti();

        // Return the previous data so we can revert if something goes wrong
        return { prevData };
      },
      onError(_err, { movie, listId }, ctx) {
        // If the mutation fails, use the context-value from onMutate
        utils.movie.getMovieWatchedStatus.setData(
          { id: movie.id, listId },
          ctx?.prevData
        );
      },
      async onSettled() {
        // Sync with server once mutation has settled
        await utils.movie.getMovieWatchedStatus.invalidate();
      },
    }
  );

  const [confetti, setConfetti] = useState(false);

  const toggleConfetti = () => {
    setConfetti(true);
    setTimeout(() => {
      setConfetti(false);
    }, 2000);
  };

  const iconClass = "h-6 w-6";
  const buttonClass =
    "flex justify-center gap-4 p-4 rounded-lg select-none transition-transform active:scale-95";

  const runtime = parseRuntime(movie?.runtime);

  return (
    !!movie && (
      <>
        <Head>
          <title>Plex Movie List | Movie</title>
          <meta name="description" content="Movie List for Plex" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <header className="fixed top-0 z-50 grid h-14 w-full grid-cols-4 items-center bg-gradient-to-b from-black to-black/80 px-2 py-1 backdrop-blur-lg">
            <button
              className="col-span-1 flex items-center text-blue-400"
              onClick={() => router.back()}
            >
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
            <h1 className="col-span-2 overflow-clip overflow-ellipsis whitespace-nowrap text-center text-lg">
              {movie.title}
            </h1>
          </header>

          {movie.backdrop_path ? (
            <Image
              src={urlJoin(TMDB_IMAGE_URL, "original", movie.backdrop_path)}
              alt={`Background poster for ${movie.title}`}
              className="mt-14 rounded-b-3xl drop-shadow-xl"
              priority
              width={600}
              height={300}
            />
          ) : (
            <div className="h-14" />
          )}

          <div className="flex flex-col gap-5 p-5">
            {(movie.contentRating || runtime || !!movie.vote_average) && (
              <div className="flex items-center justify-between text-xs text-slate-400">
                <div className="flex shrink-0 items-center gap-4">
                  {movie.contentRating && (
                    <span className="shrink-0 rounded border-[1px] border-slate-400 px-[6px] py-[2px] text-[10px] font-bold">
                      {movie.contentRating}
                    </span>
                  )}
                  <span className="shrink-0 italic">{runtime}</span>
                </div>

                {movie.vote_average && (
                  <div className="flex items-center gap-1">
                    <span>{movie.vote_average.toFixed(1)} / 10</span>
                    <StarIcon className="h-3 w-3" />
                  </div>
                )}
              </div>
            )}

            {/* Title, Rating & Runtime */}
            <div className="flex items-start justify-between gap-2">
              <h2 className="text-xl font-bold">
                {movie.title} ({movie.year})
              </h2>
            </div>

            {/* Banner to show release date for unreleased movies */}
            {dayjs().isBefore(dayjs(movie.release_date)) && (
              <div className="flex gap-1 self-start rounded-md border-2 border-yellow-500 bg-stone-800 px-2 py-1 text-xs font-bold text-yellow-500">
                <CalendarIcon className="h-4 w-4" />
                <span className="">
                  Releasing on{" "}
                  {dayjs(movie.release_date).format("MMMM D, YYYY")}
                </span>
              </div>
            )}

            {/* Banner chips */}
            <div className="mx-[-20px] flex gap-2 overflow-x-scroll px-5 scrollbar-hide">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="whitespace-nowrap rounded-full border-2 border-blue-400 px-3 py-1 text-xs font-bold uppercase text-blue-300"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            <p>{movie.overview}</p>

            <div className="my-[-10px] flex justify-center">
              <Confetti active={confetti} />
            </div>

            <div className="flex flex-col gap-2">
              <h3 className="text-center font-bold uppercase text-slate-400">
                {movieStatus?.listName}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {!!movieStatus?.inList ? (
                  <button
                    className={clsx(buttonClass, "bg-blue-500")}
                    onClick={() => {
                      changeMovieStatus({
                        listId: Number(listId),
                        movie,
                        action: "removeFromList",
                      });
                    }}
                  >
                    <BookmarkFilled className={iconClass} />
                    <span>Watchlist</span>
                  </button>
                ) : (
                  <button
                    className={clsx(buttonClass, "bg-black")}
                    onClick={() => {
                      changeMovieStatus({
                        listId: Number(listId),
                        movie,
                        action: "addToList",
                      });
                    }}
                  >
                    <BookmarkOutline className={iconClass} />
                    <span>Add to List</span>
                  </button>
                )}

                {!!movieStatus?.watched ? (
                  <button
                    className={clsx(buttonClass, "bg-blue-500")}
                    onClick={() => {
                      changeMovieStatus({
                        listId: Number(listId),
                        movie,
                        action: "markUnwatched",
                      });
                    }}
                  >
                    <CheckFilled className={iconClass} />
                    <span>Watched</span>
                  </button>
                ) : (
                  <button
                    className={clsx(buttonClass, "bg-black")}
                    onClick={() => {
                      changeMovieStatus({
                        listId: Number(listId),
                        movie,
                        action: "markWatched",
                      });
                    }}
                  >
                    <CheckOutline className={iconClass} />
                    <span>Unwatched</span>
                  </button>
                )}
              </div>
            </div>

            {/* <a
              href={movie.publicPagesURL}
              className="mb-10 flex justify-center gap-4 rounded-lg bg-black p-4"
            >
              <div className="flex gap-2">
                <span className="">Open in</span>
                <Image
                  src={plexLogo}
                  alt="Plex Logo"
                  width={38}
                  className="object-contain"
                />
              </div>
              <ArrowTopRightOnSquareIcon className="h-6 w-6" />
            </a> */}
          </div>
        </main>
      </>
    )
  );
}
