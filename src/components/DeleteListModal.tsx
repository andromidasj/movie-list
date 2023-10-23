import { XMarkIcon } from "@heroicons/react/24/solid";
import { useClickOutside } from "@mantine/hooks";
import { type inferRouterOutputs } from "@trpc/server";
import { useRouter } from "next/router";
import { type AppRouter } from "~/server/api/root";
import { api } from "~/utils/api";

type ReactQueryOptions = inferRouterOutputs<AppRouter>;

type Props = {
  toggleModal: () => void;
  listData: ReactQueryOptions["list"]["getListContents"];
};

export default function DeleteListModal({ toggleModal, listData }: Props) {
  const router = useRouter();
  const ref = useClickOutside(() => toggleModal());

  const deleteList = api.list.deleteList.useMutation({
    async onSuccess() {
      await router.replace("/");
    },
  });

  if (!listData.id) return <>ERROR</>;

  return (
    <>
      <div className="fixed inset-0 z-20 bg-gray-500/50 p-5">
        <div
          className="flex w-full flex-col gap-6 rounded-lg bg-black p-4"
          ref={ref}
        >
          <div className="flex justify-between">
            <span>Are you sure?</span>
            <button onClick={toggleModal}>
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <span className="text-center text-xl">
            Deleting list: {listData.name}
          </span>

          <p className="text-2xl">
            <span className="font-bold text-red-500">Deleting</span> this list
            will cause all of its data to be{" "}
            <span className="font-bold text-red-500">permanentely lost</span>.
            Any watchlist synced through Plex will be preserved in Plex, but the
            watched movies will be lost.
          </p>

          <div className="flex justify-between gap-4">
            <button
              className="rounded-lg bg-red-500 py-2 px-4 font-bold"
              onClick={() => deleteList.mutate(listData.id)}
            >
              DELETE FOREVER
            </button>
            <button
              className="rounded-lg bg-blue-500 py-2 px-4"
              onClick={toggleModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
