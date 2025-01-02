import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const commentRouter = createTRPCRouter({
  createComment: protectedProcedure
    .input(
      z.object({
        postId: z.string().min(1),
        content: z.string().min(1),
        gifUrl: z.string().optional(),
        imageUrls: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.postId },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      const comment = await ctx.db.comment.create({
        data: {
          content: input.content,
          gifUrl: input.gifUrl ?? null,
          imageUrls: input.imageUrls ?? [],
          post: { connect: { id: input.postId } }, 
          createdBy: { connect: { id: ctx.session.user.id } }, 
        },
      });

      return comment;
    }),

  deleteComment: protectedProcedure
    .input(z.object({
      commentId: z.string().min(1),
    }))
    .mutation(async ({ ctx, input }) => {
      const comment = await ctx.db.comment.findUnique({
        where: { id: input.commentId },
        include: { createdBy: true },
      });

      if (!comment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found",
        });
      }

      if (comment.createdBy.id !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can only delete your own comments",
        });
      }

      await ctx.db.comment.delete({
        where: { id: input.commentId },
      });

      return { success: true };
    }),
});
