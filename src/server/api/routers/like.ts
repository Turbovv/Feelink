import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const likeRouter = createTRPCRouter({
  getLikeStatus: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const like = await ctx.db.like.findUnique({
        where: {
          userId_postId: {
            userId: ctx.session.user.id,
            postId: input.postId,
          },
        }
    })
      
      return { liked: !!like };
    }),
    getLikeCount: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .query(async ({ ctx, input }) => {
      const likeCount = await ctx.db.like.count({
        where: {
          postId: input.postId,
        },
      });
      return likeCount;
    }),
    
  likePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const existingLike = await ctx.db.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId: input.postId,
          },
        },
      });

      if (existingLike) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You have already liked this post.",
        });
      }

      await ctx.db.like.create({
        data: {
          userId,
          postId: input.postId,
        },
      });
    }),

  unlikePost: protectedProcedure
    .input(z.object({ postId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const likeEntry = await ctx.db.like.findUnique({
        where: {
          userId_postId: {
            userId,
            postId: input.postId,
          },
        },
      });

      if (!likeEntry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You have not liked this post.",
        });
      }

      await ctx.db.like.delete({
        where: {
          userId_postId: {
            userId,
            postId: input.postId,
          },
        },
      });
    }),
});
