"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "./ui/button";
import { useState } from "react";
import { formatDate } from "~/lib/format"

export default function InnerPage() {
  const { id } = useParams();
  const { data: post, isLoading, isError, refetch  } = api.post.getById.useQuery({ id });

  const [commentContent, setCommentContent] = useState("");

  const { mutate: createComment } = api.comment.createComment.useMutation({
    onSuccess: () => {
      setCommentContent("");
      refetch();
    },
  });

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError || !post) {
    return <p>Post not found.</p>;
  }

  const handleCommentSubmit = () => {
    if (commentContent.trim()) {
      createComment({ postId: id, content: commentContent });
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
  <h1 className="mb-4 text-3xl font-bold">{post.title}</h1>
  <p className="mb-6 text-gray-700">{post.title}</p>
  {post.gifUrl && (
    <img
      src={post.gifUrl}
      alt="GIF"
      className="max-h-64 w-full object-contain rounded border"
    />
  )}
  <div className="relative w-full">
    <textarea
      className="w-full p-5 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      placeholder="Post your reply"
      value={commentContent}
      rows={1}
      style={{
        overflow: "hidden",
        wordBreak: "break-word",
      }}
      onChange={(e) => {
        setCommentContent(e.target.value);
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
      }}
    />
    <button
      className={`absolute right-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all ${
        commentContent.trim() ? "opacity-100 visible bottom-2" : "opacity-0 invisible -bottom-4"
      }`}
      onClick={handleCommentSubmit}
      disabled={!commentContent.trim()}
    >
      Post
    </button>
  </div>

  <div className="">
    <div className="">
      {post.Comment?.map((comment: any) => (
        <div
          key={comment.id}
          className="p-4 border border-gray-300 rounded break-words"
          style={{
            wordBreak: "break-word",
          }}
        >
          <p className="font-semibold">{comment.createdBy.name}</p>
           <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(post.createdAt)}</p>
          <p className="mt-2 text-sm text-gray-600">{comment.content}</p>
        </div>
      ))}
    </div>
  </div>

  <Button onClick={() => history.back()}>Go Back</Button>
</div>

  );
}
