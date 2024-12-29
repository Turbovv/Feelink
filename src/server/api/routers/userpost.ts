import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const settingsRouter = createTRPCRouter({
  
  getByUser: protectedProcedure
  .input(z.object({ userId: z.string() }))
  .query(async ({ ctx, input }) => {
    const userId = input.userId;

    const userPosts = await ctx.db.post.findMany({
      where: { createdById: userId },
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: true,
        Comment: true,
        _count: {
          select: {
            Like: true,
          },
        },
        Like: {
          where: {
            userId: ctx.session.user.id,
          },
          select: {
            userId: true,
          },
        },
      },
    });

    return userPosts.map((post) => ({
      ...post,
      isLiked: post.Like?.some((like) => like.userId === ctx.session.user.id) || false,
    }));
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
    updateProfile: protectedProcedure
    .input(
      z.object({
        image: z.string().url().optional(),
        background: z.string().url().optional(),
        description: z.string().max(500).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;

      const updatedUser = await ctx.db.user.update({
        where: { id: userId },
        data: {
          image: input.image || undefined,
          background: input.background || undefined,
          description: input.description || undefined,
        },
      });

      return {
        success: true,
        user: {
          image: updatedUser.image,
          background: updatedUser.background,
          description: updatedUser.description,
        },
      };
    }),
});