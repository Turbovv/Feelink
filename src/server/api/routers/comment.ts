// server/api/routers/commentRouter.ts

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  createComment: protectedProcedure
    .input(
      z.object({
        postId: z.string().min(1),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.comment.create({
        data: {
          content: input.content,
          post: { connect: { id: input.postId } },
          createdBy: { connect: { id: ctx.session.user.id } },
        },
      });

      return comment;
    }),
});
