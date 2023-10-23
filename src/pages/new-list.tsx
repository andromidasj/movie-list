import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import ListForm from "~/components/ListForm";

export default function NewList() {
  return (
    <main>
      <header className="sticky top-0 z-50 grid h-14 grid-cols-4 items-center bg-black py-1 px-2">
        <Link className="col-span-1 flex items-center text-blue-400" href="/">
          <ChevronLeftIcon className="h-5 w-5" />
          <span className="text-lg">Lists</span>
        </Link>
        <h1 className="col-span-2 text-center text-lg ">Add a New List</h1>
      </header>

      <div className="flex flex-col gap-6 p-6">
        <ListForm formType="add" />
      </div>
    </main>
  );
}
