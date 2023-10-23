import { BookmarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useLocalStorage } from "@mantine/hooks";
import clsx from "clsx";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { COLOR_LIST } from "~/components/ListForm";
import { type TabEnumType } from "~/components/Tabs";
import { api } from "~/utils/api";

const Home: NextPage = () => {
  const { data } = api.list.getAllLists.useQuery();
  const [, setActiveTab] = useLocalStorage<TabEnumType>({
    key: "activeTab",
    defaultValue: "toWatch",
  });
  const [, setSearchQuery] = useLocalStorage({
    key: "newSearchQuery",
    defaultValue: "",
  });

  useEffect(() => {
    setActiveTab("toWatch");
    setSearchQuery("");
  }, [setActiveTab, setSearchQuery]);

  const plexLists = data?.map((list) => (
    <Link key={list.id} href={`/list/${list.id}`}>
      <button
        className={clsx(
          "relative block h-28 w-full rounded-2xl bg-gradient-to-br py-2 px-4 sm:h-32 md:h-40",
          COLOR_LIST.find((c) => c.color === list.color)?.gradients
        )}
      >
        <span className="text-2xl font-bold drop-shadow-md sm:text-3xl">
          {list.name}
        </span>

        <div className="absolute top-2 left-2 flex items-center gap-1 rounded-full bg-black/20 py-1 px-2 text-xs font-bold">
          <BookmarkIcon className="h-3 w-3" />
          <span>{list._count.movies}</span>
        </div>
      </button>
    </Link>
  ));

  return (
    <>
      <Head>
        <title>Plex Movie List</title>
        <meta name="description" content="Movie List for Plex" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-slate-900">
        <header className="sticky top-0 z-10 flex h-28 items-end bg-black/80 p-6 backdrop-blur-lg">
          <div className="flex w-full items-center justify-between">
            <h1 className="text-4xl font-bold">Lists</h1>
            <Link className="text-4xl text-blue-300" href="/new-list">
              <PlusIcon className="h-7 w-7" />
            </Link>
          </div>
        </header>

        <div className="flex flex-col gap-4 p-6 sm:grid sm:grid-cols-2 md:grid-cols-3">
          {plexLists}
        </div>
      </main>
    </>
  );
};

export default Home;
