import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { CalendarIcon, StarIcon } from "@heroicons/react/24/solid";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/utils/api";
import { parseRuntime } from "~/utils/parseRuntime";
import { IMDB_MOVIE_URL, TMDB_IMAGE_URL, TMDB_MOVIE_URL } from "consts";
import dayjs from "dayjs";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import urlJoin from "url-join";
import EditWatchedStatusButtons from "./EditWatchedStatusButtons";

export default function MovieDetails() {
  const router = useRouter();
  let { listId, movieId } = router.query;

  if (typeof listId !== "string") listId = listId?.toString() ?? "";
  if (typeof movieId !== "string") movieId = movieId?.toString() ?? "";

  const { data: movie } = api.movie.getMovieInfo.useQuery(movieId, {
    enabled: !!movieId,
  });

  const { data: lists = [] } = api.list.getAllLists.useQuery();

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

            <div className="my-8 text-center space-y-4">
              <EditWatchedStatusButtons listId={listId} movieId={movieId} />
              <Drawer>
                <DrawerTrigger className="text-blue-500">
                  Add to other list...
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader className="sr-only">
                    <DrawerTitle>Add movie to another list</DrawerTitle>
                    <DrawerDescription>
                      Add this movie to another list
                    </DrawerDescription>
                  </DrawerHeader>{" "}
                  <ScrollArea>
                    <div className="flex flex-col gap-8 py-8 px-4 max-h-[70vh] mb-12">
                      {lists
                        .filter((list) => String(list.id) !== listId)
                        .map((list) => (
                          <EditWatchedStatusButtons
                            key={list.id}
                            listId={String(list.id)}
                            movieId={movieId}
                          />
                        ))}
                    </div>
                  </ScrollArea>
                </DrawerContent>
              </Drawer>
            </div>

            <div className="space-y-4">
              <h2 className="font-bold text-muted-foreground text-center uppercase">
                Links
              </h2>
              <div className="grid grid-cols-2 gap-2 h-14">
                <a
                  href={urlJoin(TMDB_MOVIE_URL, String(movie.id))}
                  target="_blank"
                  rel="noreferrer"
                  className="relative bg-black rounded-lg"
                >
                  <Image
                    src="/TMDB_logo.svg"
                    alt="TMDb Logo"
                    fill
                    className="size-full object-contain p-2"
                  />
                </a>
                {!!movie.imdb_id && (
                  <a
                    href={urlJoin(IMDB_MOVIE_URL, String(movie.imdb_id))}
                    target="_blank"
                    rel="noreferrer"
                    className="relative bg-black rounded-lg"
                  >
                    <Image
                      src="/IMDB_logo.png"
                      alt="IMDb Logo"
                      fill
                      className="size-full object-contain"
                    />
                  </a>
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
