import { ChevronLeftIcon } from "@heroicons/react/24/outline";
import { useToggle } from "@mantine/hooks";
import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import DeleteListModal from "~/components/DeleteListModal";
import ListForm, { COLOR_LIST } from "~/components/ListForm";
import { api } from "~/utils/api";
import { durationToString } from "~/utils/durationToString";

export default function Edit() {
  const router = useRouter();
  const { listId } = router.query;

  const { data } = api.list.getListContents.useQuery(Number(listId), {
    enabled: !!listId,
  });

  const [showModal, toggleModal] = useToggle();

  if (!data?.id) return <></>;

  const watched = data.movies.filter((m) => m.watched);
  const inList = data.movies.filter((m) => m.inList);
  const color = COLOR_LIST.find((c) => c.color === data.color)?.gradients;

  const durationSum = watched.reduce((sum, movie) => {
    return sum + movie.runtime;
  }, 0);

  const watchedTime = durationToString(durationSum);

  return (
    <>
      {showModal && (
        <DeleteListModal toggleModal={toggleModal} listData={data} />
      )}

      <div>
        <header className="fixed top-0 z-10 w-full">
          <div className="grid h-14 grid-cols-4 items-center bg-gradient-to-b from-black to-black/80 px-2 py-1 backdrop-blur-lg">
            <Link
              className="col-span-1 flex items-center text-blue-400"
              href={`/list/${String(listId)}`}
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="text-lg">List</span>
            </Link>
            <h1 className="col-span-2 overflow-clip overflow-ellipsis whitespace-nowrap text-center text-lg">
              List Details
            </h1>
          </div>
        </header>

        <main className="relative mt-14 flex flex-col gap-6 p-6">
          <h1 className="text-center text-3xl">{data?.name}</h1>

          <div className="grid grid-cols-2 gap-5">
            <div
              className={clsx(
                "flex flex-col gap-4 rounded-3xl p-5",
                "bg-gradient-to-br",
                color
              )}
            >
              <h1 className="text-center text-xl uppercase">Movies Watched</h1>
              <h2 className="text-center text-5xl font-bold">
                {watched.length}
              </h2>
            </div>

            <div
              className={clsx(
                "flex flex-col gap-4 rounded-3xl p-5",
                "bg-gradient-to-br",
                color
              )}
            >
              <h1 className="text-center text-xl uppercase">Movies To Watch</h1>
              <h2 className="text-center text-5xl font-bold">
                {inList.length}
              </h2>
            </div>

            <div
              className={clsx(
                "col-span-2 flex flex-col gap-4 rounded-3xl p-5",
                "bg-gradient-to-br",
                color
              )}
            >
              <h1 className="text-center text-xl uppercase">
                Total Watch Time
              </h1>
              <h2 className="text-center text-5xl font-bold">{watchedTime}</h2>
            </div>
          </div>

          <hr className="my-5 h-[1px] border-none bg-slate-700" />

          <span className="text-lg font-bold uppercase">Edit list</span>

          <ListForm formType="edit" currList={Number(listId) || 0} />

          <br />

          <span className="text-lg font-bold uppercase">Danger Zone</span>

          <button
            className="rounded-xl bg-red-600 p-2"
            onClick={() => toggleModal()}
          >
            Delete List
          </button>
        </main>
      </div>
    </>
  );
}
