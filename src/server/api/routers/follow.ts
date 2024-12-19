import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const followRouter = createTRPCRouter({
  getFollowing: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.userFollowing.findMany({
        where: { userId: input.userId },
        include: { following: true },
      });
    }),

  getFollowers: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      return ctx.db.userFollowing.findMany({
        where: { followingId: input.userId },
        include: { user: true },
      });
    }),

  followUser: protectedProcedure
    .input(z.object({ followingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      if (userId === input.followingId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You cannot follow yourself.",
        });
      }

      const existingFollow = await ctx.db.userFollowing.findUnique({
        where: {
          userId_followingId: {
            userId,
            followingId: input.followingId,
          },
        },
      });

      if (existingFollow) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "You are already following this user.",
        });
      }

      await ctx.db.userFollowing.create({
        data: {
          userId,
          followingId: input.followingId,
        },
      });
    }),

  unfollowUser: protectedProcedure
    .input(z.object({ followingId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const followEntry = await ctx.db.userFollowing.findUnique({
        where: {
          userId_followingId: {
            userId,
            followingId: input.followingId,
          },
        },
      });

      if (!followEntry) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "You are not following this user.",
        });
      }

      await ctx.db.userFollowing.delete({
        where: {
          userId_followingId: {
            userId,
            followingId: input.followingId,
          },
        },
      });
    }),
});
