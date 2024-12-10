"use client";

import { api } from "~/trpc/react";
export function Posts() {
  const { data: posts, isLoading, error } = api.post.Posts.useQuery();

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
            <li
              key={post.id}
              className="rounded-md border border-gray-300 p-4 shadow-sm"
            >
              <p className="text-lg font-semibold hover:underline">
                {post.name}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No posts found.</p>
      )}
    </div>
  );
}
