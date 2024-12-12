import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, createTRPCRouter } from "~/server/api/trpc";

export const gifRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        query: z.string().min(1, "Query is required"),
      })
    )
    .query(async ({ input }) => {
      const apiKey = process.env.GIPHY_API_KEY;
      if (!apiKey) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "GIPHY API key is not set in the environment variables.",
        });
      }

      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(
          input.query
        )}&limit=100`
      );

      if (!response.ok) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Failed to fetch GIFs.",
        });
      }

      const data = await response.json();
      return data.data.map((gif: any) => ({
        id: gif.id,
        url: gif.images.fixed_height.url,
      }));
    }),
});
