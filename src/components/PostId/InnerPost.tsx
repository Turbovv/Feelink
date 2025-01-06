"use client"
import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { ArrowLeft, Ellipsis, MessageCircle } from "lucide-react";
import { useSession } from "next-auth/react";
import { formatDate } from "../../lib/format";
import { LikeButton } from "./LikeButton/like";
import Link from "next/link";
import { useParams } from "next/navigation";
import GifModal from "../CreatePost/GifModal/GifModal";
import UploadThing from "../CreatePost/UploadThing/UploadThing";
import { DeleteComment } from "../deleteComment";
import PostOwnerDialog from "../PostOwnerDialog/PostOwnerDialog";

export default function InnerPage() {
  const { data: session } = useSession();
  const { id } = useParams();

  if (typeof id !== "string") {
    return <div>Invalid ID</div>;
  }

  const [gifUrl, setGifUrl] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [videoUrls, setVideoUrls] = useState<string[]>([]);

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
      setGifUrl("");
      setImageUrls([]);
      setVideoUrls([]);
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
    if (commentContent.trim() || gifUrl.trim() || imageUrls.length > 0 || videoUrls.length > 0) {
      createComment({ postId: id, content: commentContent, gifUrl, imageUrls, videoUrls });
    }
  };

  return (
    <div className="container mx-auto max-w-2xl">
      <div className="border p-5">
        <div className="flex items-center justify-between gap-5">
          <Button variant="ghost" onClick={() => history.back()}>
            <ArrowLeft />
            <h1 className="text-2xl">Post</h1>
          </Button>
          {session?.user.id === post.createdBy.id && (
            <PostOwnerDialog post={post} session={session} refetch={refetch} />
          )}
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
              className="mt-2 mb-2 w-full h-auto rounded-lg border border-gray-200 dark:border-gray-700"
            />
          )}
          {post.imageUrls.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {post.imageUrls.map((url, index) => (
                <img key={index} src={url} className="w-full h-auto rounded-lg" />
              ))}
            </div>
          )}
          {post.videoUrls.length > 0 && (
            <div className="flex flex-wrap gap-4">
              {post.videoUrls.map((url, index) => (
                <video key={index} src={url} className="w-full h-auto rounded-lg" controls />
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
      </div>

      <div className="relative border">
        <img
          className="absolute top-8 ml-2 h-10 w-10 rounded-full"
          src={session?.user.image || "Avatar"}
        />
        <p className="absolute left-14 top-4">
          Replying to{" "}
          <span className="text-blue-500">@{post.createdBy.name}</span>
        </p>
        <textarea
          className="w-full resize-none rounded p-14 text-xl"
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
            <img src={gifUrl} alt="Selected GIF" className="rounded-3xl w-full h-auto" />
            <Button variant="ghost" className="absolute top-1 right-1" onClick={() => setGifUrl("")}>
              X
            </Button>
          </div>
        )}
        {imageUrls.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3 ml-10 mr-4">
            {imageUrls.map((url, index) => (
              <div key={index} className="relative">
                <img src={url} alt={`Image ${index + 1}`} className="rounded-3xl w-full h-auto" />
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
        {videoUrls.length > 0 && (
          <div className="flex flex-wrap gap-3 mt-3 ml-10 mr-4">
            {videoUrls.map((url, index) => (
              <div key={index} className="relative">
                <video src={url} controls className="rounded-3xl w-full h-auto" />
                <Button
                  variant="ghost"
                  className="absolute top-1 right-1"
                  onClick={() => setVideoUrls((prev) => prev.filter((_, i) => i !== index))}
                >
                  X
                </Button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-end px-2 mb-2">
          <GifModal onGifSelect={setGifUrl} />
          <UploadThing
            onUploadComplete={(files) => {
              if (files.some((file: any) => file.type.startsWith("image/"))) {
                setImageUrls((prev) => [
                  ...prev,
                  ...files.filter((file: any) => file.type.startsWith("image/")).map((file) => file.url),
                ]);
              } else {
                setVideoUrls((prev) => [
                  ...prev,
                  ...files.filter((file: any) => file.type.startsWith("video/")).map((file) => file.url),
                ]);
              }
            }}
            onUploadError={(error) => alert(error.message)}
          />
          <Button
            className="rounded-full"
            onClick={handleCommentSubmit}
            disabled={!commentContent.trim() && !gifUrl && imageUrls.length === 0 && videoUrls.length === 0}
          >
            Reply
          </Button>
        </div>
      </div>

      <div>
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
              <div className="flex-1">
                <div className="flex justify-between">
                  <div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{comment.createdBy.name}</p>
                        <p className="text-sm text-gray-400">
                          {formatDate(comment.createdAt, false)}
                        </p>
                      </div>
                      <p className="mt-2 text-sm dark:text-white">{comment.content}</p>
                    </div>
                  </div>
                </div>

                {comment.videoUrls?.length > 0 && (
                  <div className="flex flex-wrap gap-3 mt-3 ml-10 mr-4">
                    {comment.videoUrls.map((url: any, index: any) => (
                      <video key={index} src={url} controls className="rounded-3xl w-full h-auto" />
                    ))}
                  </div>
                )}
                {comment.imageUrls?.length > 0 && (
                  <div className="mt-3 gap-3">
                    {comment.imageUrls.map((url: any, index: any) => (
                      <img key={index} src={url} alt={`Comment Image ${index + 1}`} className="rounded-lg w-full h-auto" />
                    ))}
                  </div>
                )}

                {comment.gifUrl && (
                  <img
                    src={comment.gifUrl}
                    alt="Comment GIF"
                    className="mt-2 rounded-lg w-full h-auto"
                  />
                )}
              </div>
              {session?.user.id === comment.createdBy.id && (
                <div className="ml-auto">
                  <DeleteComment commentId={comment.id} refetch={refetch} />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
