"use client";

import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { api } from "~/trpc/react";
import { LikeButton } from "../PostId/LikeButton/like";
export function Posts() {
  const { data: posts, isLoading, error,  refetch: refetchLikes } = api.post.Posts.useQuery();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div className="mx-auto mt-8 w-full max-w-3xl">
    {posts && posts.length > 0 ? (
      <ul className="space-y-4">
        {posts.map((post) => (
          <Link
          key={post.id}

          href={`/posts/${post.id}`}
          className="text-lg font-semibold"
        >
          <div
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg"
          >
            <div className="flex gap-2">
            <img className="w-14 h-14 rounded-full" src={post.createdBy.image || "Avatar"} alt="Avatar" />
           <div>
           <p>{post.createdBy.name}</p>
            
              <p>
              {post.title}
              </p>
            <img src={post.gifUrl} alt="Gif" />
           </div>
            </div>
            <div className="flex items-center gap-5">
          <p className="flex items-center gap-2">
          <MessageCircle />
            {post.Comment.length}
            </p>
          <div className="flex items-center gap-2">
          <LikeButton
              postId={post.id}
              isLiked={false}
              refetchLikes={refetchLikes}
            />
            <span className="text-sm text-gray-600">{post._count.Like}</span>
          </div>
          </div>
          </div>
            </Link>
        ))}
      </ul>
    ) : (
      <p className="text-center text-gray-500">No posts found.</p>
    )}
  </div>
  
  );
}
