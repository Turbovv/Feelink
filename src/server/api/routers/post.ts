/* eslint-disable */
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
      isLiked: post.Like?.some((like) => like.userId === userId) ?? false,
    }));
  }),
  
  
  create: protectedProcedure
  .input(
    z.object({
      title: z.string().min(1),
      gifUrl: z
        .string()
        .optional()
      // eslint-disable-next-line
        .refine((url: any) => url === "" || /^https?:\/\//.test(url), {
          // eslint-disable-next-line
          message: "Invalid gif URL",
        }),
      imageUrls: z
        .array(z.string().url())
        .optional()
        // eslint-disable-next-line
        .refine((urls) => urls !== undefined && (urls.length === 0 || urls.every((url) => url)), {
          // eslint-disable-next-line
          message: "Invalid image URLs",
        }),
        videoUrls: z.array(z.string().url()).optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    return ctx.db.post.create({
      data: {
        title: input.title,
        gifUrl: input.gifUrl ?? "",
        imageUrls: input.imageUrls ?? [],
        videoUrls: input.videoUrls ?? [], 
        createdBy: { connect: { id: ctx.session.user.id } },
      },
    });
  }),

  deletePost: protectedProcedure
    .input(z.object({ postId: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findUnique({
        where: { id: input.postId },
        select: { createdById: true },
      });

      if (!post) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Post not found",
        });
      }

      if (post.createdById !== ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You are not authorized to delete this post",
        });
      }

      await ctx.db.comment.deleteMany({
        where: { postId: input.postId },
      });

      await ctx.db.like.deleteMany({
        where: { postId: input.postId },
      });

      await ctx.db.post.delete({
        where: { id: input.postId },
      });

      return { success: true, message: "Post deleted successfully" };
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
      imageUrls: post.imageUrls,
      createdAt: post.createdAt,
      videoUrls: post.videoUrls, 
      createdBy: {
        id: post.createdBy.id,
        name: post.createdBy.name,
        image: post.createdBy.image,
      },
      comments: post.Comment.map((comment) => ({
        id: comment.id,
        content: comment.content,
        createdAt: comment.createdAt,
        gifUrl: comment.gifUrl,
        imageUrls: comment.imageUrls,
        videoUrls: comment.videoUrls, 
        createdBy: {
          id: comment.createdBy.id,
          name: comment.createdBy.name,
          image: comment.createdBy.image,
        },
      })),
    };
  }),

  editPost: protectedProcedure
  .input(
    z.object({
      postId: z.string().min(1),
      title: z.string().min(1),
      gifUrl: z
        .string()
        .optional()
        .refine((url: any) => !url || /^https?:\/\//.test(url), {
          message: "Invalid gif URL",
        }),
      imageUrls: z
        .array(z.string().url())
        .optional()
        .refine((urls: any) => urls.every((url: any) => url), {
          message: "Invalid image URLs",
        }),
        videoUrls: z.array(z.string().url()).optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const post = await ctx.db.post.findUnique({
      where: { id: input.postId },
      select: { createdById: true },
    });

    if (!post) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Post not found",
      });
    }

    if (post.createdById !== ctx.session.user.id) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You are not authorized to edit this post",
      });
    }

    return ctx.db.post.update({
      where: { id: input.postId },
      data: {
        title: input.title,
        gifUrl: input.gifUrl ?? "",
        videoUrls: input.videoUrls ?? [], 
        imageUrls: input.imageUrls ?? [],
      },
    });
  }),

});
