
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const settingsRouter = createTRPCRouter({

  getByUser: protectedProcedure
  .query(async ({ ctx }) => {
    const userPosts = await ctx.db.post.findMany({
      where: { createdById: ctx.session.user.id },
      orderBy: { createdAt: "desc" },
    });

    return userPosts;
  }),
});
