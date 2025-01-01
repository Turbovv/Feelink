"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { formatDate } from "../../lib/format";
import { LikeButton } from "./LikeButton/like";
import { DeletePost } from "../deletebutton";

export default function InnerPage() {
  const { data: session } = useSession();
  const { id } = useParams();

  if (typeof id !== "string") {
    return <div>Invalid ID</div>;
  }

  const {
    data: post,
    isLoading,
    isError,
    refetch,
  } = api.post.getById.useQuery({ id });
  const { data: likeStatus } = api.like.getLikeStatus.useQuery({ postId: id });

  const {
    data: likeCount,
    isLoading: isLikeCountLoading,
    refetch: refetchLikes,
  } = api.like.getLikeCount.useQuery({ postId: id });
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
      <div className="border border-red-500 p-5">
        <div className="flex items-center gap-5">
          <Button variant={"ghost"} onClick={() => history.back()}>
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl">Post</h1>
        </div>

        <div className="mb-5 mt-5 flex items-start space-x-3">
          <img
            className="h-10 w-10 rounded-full"
            src={post.createdBy.image || "Avatar"}
          />
          <div>
            <p>{post.createdBy.name}</p>
          </div>
        </div>

        <div>
          <h1 className="mb-4">{post.title}</h1>
          {post.gifUrl && (
            <img
              src={post.gifUrl}
              alt="Gif"
              className="mt-2 w-full rounded-lg border border-gray-200 dark:border-gray-700"
            />
          )}

          {post.imageUrls?.length > 0 && (
            <div className="mt-5 flex gap-4">
              {post.imageUrls.map((url, index) => (
                <img
                  key={index}
                  src={url}
                  alt={`Image ${index + 1}`}
                  className="w-full h-auto rounded-lg mb-4"
                />
              ))}
            </div>
          )}
          <p>{formatDate(post.createdAt.toString(), true)}</p>
          <div className="flex items-center gap-5">
            <p className="flex items-center gap-2">
              <MessageCircle />
              {post.comments.length}
            </p>
            <div className="flex items-center gap-2">
              <LikeButton
                postId={post.id}
                isLiked={likeStatus?.liked ?? false}
                refetchLikes={refetchLikes}
              />
              <span className="text-sm text-gray-600">{likeCount}</span>
            </div>
          </div>
        </div>

        {session?.user.id === post.createdBy.id && (
          <DeletePost postId={post.id} refetch={refetch} />
        )}
      </div>

      <div className="relative w-full">
        <img
          className="absolute left-2 top-12 h-10 w-10 rounded-full"
          src={session?.user.image || "Avatar"}
        />
        <p className="absolute left-14 top-4">
          Replying to{" "}
          <span className="text-blue-500">
            @{post.createdBy.name}
          </span>
        </p>
        <textarea
          className="w-full resize-none rounded border border-gray-300 p-14 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          className={`absolute right-2 rounded bg-white px-4 py-2 text-black transition-all hover:bg-gray-300 ${commentContent.trim()
            ? "visible bottom-5 opacity-100"
            : "invisible -bottom-4 opacity-0"
          }`}
          onClick={handleCommentSubmit}
          disabled={!commentContent.trim()}
        >
          Reply
        </button>
      </div>

      <div className="">
        <div className="">
          {post.comments?.map((comment: any) => (
            <div
              key={comment.id}
              className="break-words rounded border border-gray-300 p-4"
              style={{
                wordBreak: "break-word",
              }}
            >
              <div className="flex items-start space-x-3">
                <img
                  className="h-10 w-10 rounded-full"
                  src={comment.createdBy.image || "Avatar"}
                />
                <div>
                  <p className="font-semibold">{comment.createdBy.name}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    {comment.content}
                  </p>
                </div>
                <p>{formatDate(comment.createdAt, false)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
