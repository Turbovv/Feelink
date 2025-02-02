import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";

export const followRouter = createTRPCRouter({
  getFollowingWithStatus: publicProcedure // Changed from protectedProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id; // Optional chaining for unauthorized users

    const following = await ctx.db.userFollowing.findMany({
      where: { userId: input.userId },
      include: {
        following: true,
      },
    });

    const followingWithStatus = await Promise.all(
      following.map(async (entry) => {
        const isFollowingBack = userId
          ? await ctx.db.userFollowing.findUnique({
              where: {
                userId_followingId: {
                  userId: entry.following.id,
                  followingId: userId,
                },
              },
            })
          : null;

        return {
          ...entry,
          isFollowingBack: !!isFollowingBack,
        };
      })
    );

    return followingWithStatus;
  }),

getFollowers: publicProcedure // Changed from protectedProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ ctx, input }) => {
    const userId = ctx.session?.user?.id; // Optional chaining for unauthorized users

    const followers = await ctx.db.userFollowing.findMany({
      where: { followingId: input.userId },
      include: {
        user: true,
      },
    });

    const followersWithStatus = await Promise.all(
      followers.map(async (follower) => {
        const isFollowing = userId
          ? await ctx.db.userFollowing.findUnique({
              where: {
                userId_followingId: {
                  userId,
                  followingId: follower.userId,
                },
              },
            })
          : null;

        return {
          ...follower,
          isFollowing: !!isFollowing,
        };
      })
    );

    return followersWithStatus;
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
