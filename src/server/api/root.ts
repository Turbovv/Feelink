import { postRouter } from "~/server/api/routers/post";
import { gifRouter } from './routers/gif'
import { settingsRouter } from './routers/userpost'
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { commentRouter } from "./routers/comment";
import { followRouter } from "./routers/follow";
import { likeRouter } from "./routers/like";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  gif: gifRouter,
  userpost: settingsRouter,
  comment: commentRouter,
  follow: followRouter,
  like: likeRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
