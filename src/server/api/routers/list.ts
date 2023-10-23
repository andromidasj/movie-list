import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { prisma } from "~/server/db";
import { checkPlexConnection } from "~/utils/checkPlexConnection";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const listsRouter = createTRPCRouter({
  getAllLists: publicProcedure.query(async () => {
    const lists = await prisma.list.findMany({
      include: {
        _count: { select: { movies: { where: { inList: true } } } },
      },
    });

    return lists;

    // const parsedList = AllListsReturnTypeSchema.parse(lists);

    // for (const list of parsedList) {
    //   if (list.isPlex) {
    //     try {
    //       // TODO: combine with getPlexWatchlist too keep code DRY
    //       const res = await axios.get<PlexWatchlistResponse>(WATCHLIST_URL, {
    //         headers: {
    //           Accept: "application/json",
    //         },
    //         params: {
    //           "X-Plex-Token": list.plexToken,
    //           type: MOVIE_TYPE_FILTER,
    //         },
    //       });
    //       list._count = { movies: res.data.MediaContainer.totalSize };
    //       list.connected = true;
    //     } catch (error) {
    //       list.connected = false;
    //     }
    //   }
    // }

    // return parsedList;
  }),

  getListContents: publicProcedure
    /**
     * @param input - The List ID
     */
    .input(z.number())
    .query(async ({ input }) => {
      const list = await prisma.list.findFirst({
        where: { id: input },
        include: { movies: true },
      });

      if (!list) {
        // throw error?
        throw new TRPCError({ code: "NOT_FOUND", message: "List not found" });
      }

      return list;
    }),

  addNewList: publicProcedure
    .input(
      z.object({
        name: z.string(),
        color: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { name, color } = input;

      try {
        const newList = await prisma.list.create({
          data: { name, color },
        });
        return {
          success: true,
          data: newList,
        };
      } catch (error) {
        return {
          success: false,
          message: "Couldn't create list. Does that name already exist?",
        };
      }
    }),

  editList: publicProcedure
    .input(
      z.object({
        id: z.number(),
        newName: z.string().optional(),
        newToken: z.string().optional(),
        newColor: z.string().optional(),
      })
    )
    .mutation(async ({ input: { id, newName, newToken, newColor } }) => {
      if (newToken) {
        const validToken = await checkPlexConnection(newToken);
        /**
         * TODO: allow for empty token, removing a connection to Plex.
         * Will require acknowledgement that watchlist will be gone
         * (watched movies will stay).
         */

        if (!validToken) throw { success: false, message: "Token not valid" };
      }
      return await prisma.list.update({
        where: { id },
        data: {
          name: newName,
          color: newColor,
        },
      });
    }),

  deleteList: publicProcedure
    .input(z.number())
    .mutation(async ({ input: listId }) => {
      return await prisma.list.delete({ where: { id: listId } });
    }),

  isExisting: publicProcedure.input(z.string()).query(async ({ input }) => {
    const existingList = await prisma.list.findFirst({
      where: { name: input },
    });
    return !!existingList;
  }),
});
