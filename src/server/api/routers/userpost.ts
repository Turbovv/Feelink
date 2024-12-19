import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
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
  getUserByUsername: publicProcedure
    .input(z.object({ username: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { name: input.username },
        include: {
          followers: true,
          following: true,
        },
      });

      if (!user) return null;

      const followersCount = user.followers.length;
      const followingCount = user.following.length;
      const isFollowing = user.followers.some(
        (follower) => follower.userId === ctx.session?.user?.id
      );

      return {
        ...user,
        followersCount,
        followingCount,
        isFollowing,
      };
    }),

  getUserById: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { id: input.userId },
        include: {
          followers: true,
          following: true,
        },
      });

      if (!user) throw new Error("User not found");

      const isFollowing = user.followers.some(
        (follower) => follower.userId === ctx.session.user.id
      );

      return {
        ...user,
        isFollowing,
      };
    }),
});