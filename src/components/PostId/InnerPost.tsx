"use client"
import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { formatDate } from "../../lib/format";
import { LikeButton } from "./LikeButton/like";
import { DeletePost } from "../deletePost";
import Link from "next/link";
import GifModal from "../CreatePost/GifModal/GifModal";
import UploadThing from "../CreatePost/UploadThing/UploadThing";
import { DeleteComment } from "../deleteComment";

export default function InnerPage() {
  const { data: session } = useSession();
  const { id } = useParams();

  if (typeof id !== "string") {
    return <div>Invalid ID</div>;
  }
  const [gifUrl, setGifUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
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

  const { mutate: createComment }: any = api.comment.createComment.useMutation({
    onSuccess: () => {
      setCommentContent("");
      setGifUrl("");
      setImageUrls([]);
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
    if (commentContent.trim() || gifUrl.trim() || imageUrls.length > 0) {
      createComment({ postId: id, content: commentContent, gifUrl, imageUrls });
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
          <Link href={`/settings/${post.createdBy.name}`}>
            <img
              className="h-10 w-10 rounded-full"
              src={post.createdBy.image || "Avatar"}
            />
          </Link>
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
              {post.imageUrls.map((url: any, index: any) => (
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

      <div className="relative border">
        <img
          className="absolute top-12 h-10 w-10 rounded-full"
          src={session?.user.image || "Avatar"}
        />
        <p className="absolute left-14 top-4">
          Replying to{" "}
          <span className="text-blue-500">@{post.createdBy.name}</span>
        </p>
        <textarea
          className="w-full resize-none rounded border border-gray-300 p-10 text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
        {gifUrl && (
          <div className="relative mt-3 ml-10 mr-4">
            <img src={gifUrl} alt="Selected GIF" className=" rounded-3xl w-full" />
            <Button variant="ghost" className="absolute top-1 right-1" onClick={() => setGifUrl("")}>
              X
            </Button>
          </div>
        )}
        {imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Image ${index + 1}`} className="rounded-lg" />
                <Button
                  variant="ghost"
                  className="absolute top-1 right-1"
                  onClick={() => setImageUrls((prev) => prev.filter((_, i) => i !== index))}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4">
          <GifModal onGifSelect={setGifUrl} />

          <UploadThing
            onUploadComplete={(files: any) => {
              setImageUrls((prev) => [...prev, ...files.map((file: any) => file.url)]);
            }}
            onUploadError={(error: any) => alert(error.message)}
          />
          <Button
            className="rounded-full"
            onClick={handleCommentSubmit}
            disabled={!commentContent.trim() && !gifUrl && imageUrls.length === 0}
          >
            Reply
          </Button>
        </div>
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
                  {comment.imageUrls?.length > 0 && (
                    <div className="flex gap-3 mt-3">
                      {comment.imageUrls.map((url: any, index: any) => (
                        <img key={index} src={url} alt={`Comment Image ${index + 1}`} className="rounded-lg" />
                      ))}
                    </div>
                  )}
                  {comment.gifUrl && (
                    <img
                      src={comment.gifUrl}
                      alt="Comment GIF"
                      className="mt-2 rounded-lg"
                    />
                  )}
                </div>
                <p>{formatDate(comment.createdAt, false)}</p>
                {session?.user.id === comment.createdBy.id && (
                  <DeleteComment commentId={comment.id} refetch={refetch} />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
