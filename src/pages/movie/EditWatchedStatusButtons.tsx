import {
  BookmarkIcon as BookmarkOutline,
  CheckCircleIcon as CheckOutline,
} from "@heroicons/react/24/outline";
import {
  BookmarkIcon as BookmarkFilled,
  CheckCircleIcon as CheckFilled,
} from "@heroicons/react/24/solid";
import useChangeMovieStatusMutation from "~/hooks/useChangeMovieStatusMutation";
import { api } from "~/utils/api";
import clsx from "clsx";
import { useState } from "react";
import Confetti from "react-dom-confetti";

type Props = {
  listId: string;
  movieId: string;
};

const buttonClass =
  "flex justify-center gap-4 p-4 rounded-lg select-none transition-transform active:scale-95";

export default function EditWatchedStatusButtons({ listId, movieId }: Props) {
  const [confetti, setConfetti] = useState(false);

  const toggleConfetti = () => {
    setConfetti(true);
    setTimeout(() => {
      setConfetti(false);
    }, 2000);
  };
  const { data: movie } = api.movie.getMovieInfo.useQuery(movieId, {
    enabled: !!movieId,
  });

  const { mutate: changeMovieStatus } = useChangeMovieStatusMutation({
    movieId: Number(movieId) || 0,
    toggleConfetti,
  });

  const { data: movieStatus } = api.movie.getMovieWatchedStatus.useQuery(
    { id: Number(movieId) || 0, listId: Number(listId) },
    { enabled: !!movieId && !!listId }
  );

  if (!movie) return <>Loading...</>;

  return (
    <div>
      <div className="flex justify-center">
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
              <BookmarkFilled className="size-6" />
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
              <BookmarkOutline className="size-6" />
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
              <CheckFilled className="size-6" />
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
              <CheckOutline className="size-6" />
              <span>Unwatched</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// function AddOrRemoveFromListButton({movieStatus}: {movieStatus: MovieStatus}) {
//  return (<>
//  {!!movieStatus?.inList ? (
//           <button
//             className={clsx(buttonClass, "bg-blue-500")}
//             onClick={() => {
//               changeMovieStatus({
//                 listId: Number(listId),
//                 movie,
//                 action: "removeFromList",
//               });
//             }}
//           >
//             <BookmarkFilled className="size-6" />
//             <span>Watchlist</span>
//           </button>
//         ) : (
//           <button
//             className={clsx(buttonClass, "bg-black")}
//             onClick={() => {
//               changeMovieStatus({
//                 listId: Number(listId),
//                 movie,
//                 action: "addToList",
//               });
//             }}
//           >
//             <BookmarkOutline className="size-6" />
//             <span>Add to List</span>
//           </button>
//         )}</>)
// }
