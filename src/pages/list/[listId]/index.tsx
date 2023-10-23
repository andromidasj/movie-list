import {
  ChevronLeftIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { MagnifyingGlassIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useDebouncedValue, useLocalStorage } from "@mantine/hooks";
import { TMDB_IMAGE_URL } from "consts";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import urlJoin from "url-join";
import Tabs, { type TabEnumType } from "~/components/Tabs";
import { api } from "~/utils/api";

export default function List() {
  const router = useRouter();
  const { listId } = router.query;

  const [searchVal, setSearchVal] = useState("");

  const [activeTab = 'toWatch', setActiveTab] = useLocalStorage<TabEnumType>({
    key: "activeTab",
    defaultValue: "toWatch",
  });

  const [newSearchQuery, setNewSearchQuery] = useLocalStorage({
    key: "newSearchQuery",
    defaultValue: "",
  });

  const [debounced] = useDebouncedValue(newSearchQuery || '', 400);

  const { data: listContents } = api.list.getListContents.useQuery(
    Number(listId),
    { enabled: activeTab !== "search" && !!listId }
  );

  // search TMDB api for movie
  const { data: searchMovieList = [] } = api.movie.searchMovie.useQuery(
    { query: debounced },
    { enabled: !!newSearchQuery && activeTab === "search" }
  );

  if (!listContents) return <>Loading...</>;

  const filteredMovieList = listContents.movies
    .filter((movie) => {
      if (activeTab === "toWatch") return movie.inList;
      if (activeTab === "watched") return movie.watched;
    })
    .filter((movie) =>
      movie.title.toLowerCase().includes(searchVal.toLowerCase())
    )
    .sort((a, b) => {
      if (a.watchedDate && b.watchedDate) {
        if (a.watchedDate > b.watchedDate) return -1;
        if (a.watchedDate < b.watchedDate) return 1;
      }
      if (a.watchedDate && !b.watchedDate) return -1;
      if (!a.watchedDate && b.watchedDate) return 1;

      if (a.listedDate && b.listedDate) {
        if (a.listedDate > b.listedDate) return -1;
        if (a.listedDate < b.listedDate) return 1;
      }
      if (a.listedDate && !b.listedDate) return -1;
      if (!a.listedDate && b.listedDate) return 1;

      return 0;
    });

  return (
    <>
      <Head>
        <title>Plex Movie List | Plex Watchlist</title>
        <meta name="description" content="Movie List for Plex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-black to-black/80 backdrop-blur-lg">
          <div className="grid h-14 grid-cols-4 items-center py-1 px-2">
            <Link
              className="col-span-1 flex items-center text-blue-400"
              href="/"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="text-lg">Lists</span>
            </Link>
            <h1 className="col-span-2 overflow-clip overflow-ellipsis whitespace-nowrap text-center text-lg">
              {listContents?.name}
            </h1>
            <Link href={`${String(listId)}/edit`} className="justify-self-end">
              <InformationCircleIcon className="h-7 w-7 text-blue-400" />
            </Link>
          </div>

          <div className="relative flex h-14 w-full p-1 pt-0">
            <input
              type="text"
              id="search"
              placeholder="Search"
              className="m-2 mt-0 w-full rounded-full bg-slate-900/80 pl-12"
              value={activeTab === "search" ? newSearchQuery : searchVal}
              onChange={
                activeTab === "search"
                  ? (e) => setNewSearchQuery(e.target.value)
                  : (e) => setSearchVal(e.target.value)
              }
            />

            <MagnifyingGlassIcon className="absolute top-2 left-6 h-7 w-7 text-slate-400" />

            {(activeTab === "search" && !!newSearchQuery) ||
            (activeTab !== "search" && !!searchVal) ? (
              <XCircleIcon
                className="absolute top-2 right-6 h-7 w-7"
                onClick={() => {
                  setSearchVal("");
                  setNewSearchQuery("");
                  document.getElementById("search")?.focus();
                }}
              />
            ) : (
              <></>
            )}
          </div>
        </header>

        {
          <div className="my-28 grid w-full grid-cols-3 gap-3 gap-y-5 p-3 sm:grid-cols-4 md:grid-cols-6">
            {activeTab === "search"
              ? searchMovieList.map((movie, index) => {
                  if (!movie.poster_path) return;
                  return (
                    <Link
                      href={{
                        pathname: `/movie/${movie.id}`,
                        query: { listId: listContents?.id },
                      }}
                      key={movie.id}
                      className="flex aspect-[2/3] flex-col gap-1 text-center text-sm"
                    >
                      <div className="relative aspect-[2/3]">
                        <Image
                          className="rounded"
                          src={urlJoin(
                            TMDB_IMAGE_URL,
                            "w500",
                            movie.poster_path
                          )}
                          alt={`Poster for ${movie.title}`}
                          fill
                          sizes="30vw"
                          priority={index < 9}
                        />
                      </div>
                      <h1 className="px-1">
                        {movie.title} {movie.year && `(${movie.year})`}
                      </h1>
                    </Link>
                  );
                })
              : filteredMovieList.map((movie, index) => (
                  <Link
                    href={{
                      pathname: urlJoin("/movie", String(movie.tmdbId)),
                      query: { listId: listContents?.id },
                    }}
                    key={movie.id}
                    className="flex aspect-[2/3] flex-col gap-1 text-center text-sm"
                  >
                    <div className="relative aspect-[2/3]">
                      <Image
                        className="rounded"
                        src={urlJoin(TMDB_IMAGE_URL, "w500", movie.poster)}
                        alt={`Poster for ${movie.title}`}
                        fill
                        sizes="30vw"
                        priority={index < 9}
                      />
                    </div>
                    <h1 className="px-1">
                      {movie.title} ({movie.year})
                    </h1>
                  </Link>
                ))}
          </div>
        }

        <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </main>
    </>
  );
}
