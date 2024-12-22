"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { formatDate } from "../../lib/format";
import { LikeButton } from "./LikeButton/like";

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
  const { data: likeStatus, } = api.like.getLikeStatus.useQuery({ postId: id });

  const { data: likeCount, isLoading: isLikeCountLoading, refetch: refetchLikes } = api.like.getLikeCount.useQuery({ postId: id });
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
      <div className="border border-red-500">
        <div className="flex items-center gap-8">
          <Button variant={"outline"} onClick={() => history.back()}>
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl">Post</h1>
        </div>

        <div className="mb-5 ml-5 mt-5 flex items-start space-x-3">
          <img
            className="h-10 w-10 rounded-full"
            src={post.comments?.[0]?.createdBy.image || "Avatar"}
          />
          <div>
            <p>{post.comments?.[0]?.createdBy.name}</p>
          </div>
        </div>

        <div className="p-5">
          <h1 className="mb-4">{post.title}</h1>
          <img
            src={post.gifUrl}
            alt="GIF"
            className="mb-3 w-full rounded-2xl"
          />
          <p>{formatDate(post.createdAt, true)}</p>
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
      </div>

      <div className="relative w-full ">
        <img
          className="absolute left-2 top-12 h-10 w-10 rounded-full"
          src={session?.user.image || "Avatar"}
        />
        <p className="absolute left-14 top-4">
          Replying to{" "}
          <span  className="text-blue-500">@{post.comments?.[0]?.createdBy.name}</span>
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
          className={`absolute right-2 rounded bg-blue-500 px-4 py-2 text-white transition-all hover:bg-blue-600 ${
            commentContent.trim()
              ? "visible bottom-5 opacity-100"
              : "invisible -bottom-4 opacity-0"
          }`}
          onClick={handleCommentSubmit}
          disabled={!commentContent.trim()}
        >
          Post
        </button>
      </div>

      <div className=" border border-blue-500">
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
                  <p className="mt-2 text-sm text-gray-600">{comment.content}</p>
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