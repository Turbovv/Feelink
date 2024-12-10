
import {
  createTRPCRouter,
  publicProcedure,
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  Posts: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    return posts;
  }),
});
