import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  Posts: publicProcedure.query(async ({ ctx }) => {
    const posts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    return posts;
  }),
  
  create: protectedProcedure
  .input(
    z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      gifUrl: z.string().url().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.db.post.create({
      data: {
        title: input.title,
        description: input.description,
        gifUrl: input.gifUrl ?? "",
        createdBy: { connect: { id: ctx.session.user.id } },
      },
    });
  }),
});
