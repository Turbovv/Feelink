"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { LikeButton } from "../PostId/LikeButton/like";
import CreatePost from "../CreatePost/page";
import { formatDate } from "~/lib/format";

export function Posts() {
  const {
    data: posts,
    isLoading,
    error,
    refetch: refetchLikes,
  } = api.post.Posts.useQuery();

  if (isLoading) {
    return (
      <p className="text-center text-gray-500 dark:text-gray-400">Loading...</p>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 dark:text-red-400">
        Error: {error.message}
      </p>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl">
      <CreatePost />
      {posts && posts.length > 0 ? (
        <ul className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              // href={`/posts/${post.id}`}
              className="text-lg font-semibold"
            >
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg dark:bg-neutral-900 dark:hover:shadow-xl">
                <Link
                  href={`/posts/${post.id}`}
                >
                  <div className="flex gap-2">
                    <img
                      className="h-14 w-14 rounded-full"
                      src={post.createdBy.image || "Avatar"}
                      alt="Avatar"
                    />
                    <div>
                      <div className="flex gap-5">
                        <p className="text-gray-900 dark:text-gray-100">
                          {post.createdBy.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(post.createdAt, false)}
                        </p>
                      </div>
                      <p className="text-gray-800 dark:text-gray-200">
                        {post.title}
                      </p>
                      {post.gifUrl && (
                        <img
                          src={post.gifUrl}
                          alt="Gif"
                          className="mt-2 w-full  rounded-lg border border-gray-200 dark:border-gray-700"
                        />
                      )}
                    </div>
                  </div>
                </Link>

                <div className="mt-4 flex items-center gap-5">
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MessageCircle />
                    {post.Comment.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <LikeButton
                      postId={post.id}
                      isLiked={post.isLiked}
                      refetchLikes={refetchLikes}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {post._count.Like}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No posts found.
        </p>
      )}
    </div>
  );
}
