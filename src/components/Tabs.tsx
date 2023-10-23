import {
  BookmarkIcon,
  CheckCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/solid";
import clsx from "clsx";
import { type Dispatch, type SetStateAction } from "react";
import { z } from "zod";

const TabEnum = z.enum(["toWatch", "watched", "search"]);
export type TabEnumType = z.infer<typeof TabEnum>;

interface Props {
  activeTab: TabEnumType;
  setActiveTab: Dispatch<SetStateAction<TabEnumType>>;
}

export default function Tabs({ activeTab, setActiveTab }: Props) {
  const tabStyle = clsx("h-6 w-6");

  return (
    <nav className="fixed bottom-0 z-50 flex h-24 w-full justify-around bg-black/80 pt-2 text-sm backdrop-blur-lg">
      <button
        onClick={() => setActiveTab("toWatch")}
        className={clsx(
          "flex flex-col items-center gap-1",
          activeTab === "toWatch" && "text-blue-400"
        )}
      >
        <BookmarkIcon className={tabStyle} />
        <span>To Watch</span>
      </button>
      <button
        onClick={() => setActiveTab("watched")}
        className={clsx(
          "flex flex-col items-center gap-1",
          activeTab === "watched" && "text-blue-400"
        )}
      >
        <CheckCircleIcon className={tabStyle} />
        <span>Watched</span>
      </button>
      <button
        onClick={() => {
          activeTab === "search"
            ? document.getElementById("search")?.focus()
            : setActiveTab("search");
        }}
        className={clsx(
          "flex flex-col items-center gap-1",
          activeTab === "search" && "text-blue-400"
        )}
      >
        <MagnifyingGlassIcon className={tabStyle} />
        <span>Search</span>
      </button>
    </nav>
  );
}
