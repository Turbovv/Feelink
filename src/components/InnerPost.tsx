"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "../components/ui/button";

export default function InnerPage() {
  const { id } = useParams();
  const { data: post, isLoading, isError } = api.post.getById.useQuery({ id });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError || !post) {
    return <p>Post not found.</p>;
  }

  return (
    <div className="container mx-auto mt-8 max-w-2xl">
      <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
      <p className="mb-6 text-gray-700">{post.title}</p>
      {post.gifUrl && (
        <img
          src={post.gifUrl}
          alt="GIF"
          className="mb-6 max-h-64 w-full object-contain rounded border"
        />
      )}
      <Button onClick={() => history.back()}>Go Back</Button>
    </div>
  );
}
