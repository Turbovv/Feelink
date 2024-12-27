import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure
} from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  Posts: publicProcedure.query(async ({ ctx }) => {
    const userId = ctx.session?.user?.id;
  
    const posts = await ctx.db.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        createdBy: true,
        Comment: true,
        _count: {
          select: {
            Like: true,
          },
        },
        Like: userId
          ? {
              where: {
                userId: userId,
              },
              select: {
                userId: true,
              },
            }
          : false,
      },
    });
    return posts.map((post) => ({
      ...post,
      isLiked: post.Like?.some((like) => like.userId === userId) || false,
    }));
  }),
  
  
  create: protectedProcedure
  .input(
    z.object({
      title: z.string().min(1),
      gifUrl: z.string().url().optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.db.post.create({
      data: {
        title: input.title,
        gifUrl: input.gifUrl ?? "",
        createdBy: { connect: { id: ctx.session.user.id } },
      },
    });
  }),
  getById: publicProcedure
  .input(
    z.object({
      id: z.string().min(1),
    })
  )
  .query(async ({ ctx, input }) => {
    const post = await ctx.db.post.findUnique({
      where: { id: input.id },
      include: {
        createdBy: true,
        Comment: {
          include: {
            createdBy: true,
          },
        },
      },
    });

    if (!post) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Post not found",
      });
    }

    return {
      id: post.id,
      title: post.title,
      gifUrl: post.gifUrl,
      createdAt: post.createdAt,
      createdBy: {
        name: post.createdBy.name,
        image: post.createdBy.image,
      },
      comments: post.Comment.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        createdBy: {
          name: comment.createdBy.name,
          image: comment.createdBy.image,
        },
      })),
    };
  }),

});
