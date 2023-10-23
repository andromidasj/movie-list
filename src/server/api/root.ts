import { createTRPCRouter } from "~/server/api/trpc";
import { listsRouter } from "./routers/list";
import { movieRouter } from "./routers/movie";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  list: listsRouter,
  movie: movieRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
