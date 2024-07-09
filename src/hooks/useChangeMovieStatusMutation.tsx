import { api } from "~/utils/api";

type Props = {
  movieId: number;
  toggleConfetti?: () => void;
};

export default function useChangeMovieStatusMutation({
  movieId,
  toggleConfetti,
}: Props) {
  const utils = api.useUtils();

  return api.movie.changeMovieStatus.useMutation({
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
        { id: movieId || 0, listId },
        (old) => ({ ...old, ...newStatus } as typeof old)
      );

      action === "markWatched" && toggleConfetti?.();

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
  });
}
