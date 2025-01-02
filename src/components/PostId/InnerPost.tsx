  "use client"
import { useState } from "react";
import { api } from "~/trpc/react";
import { Button } from "../ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogClose } from "../ui/dialog";
import { ArrowLeft, Ellipsis, MessageCircle } from "lucide-react";
import EditPost from "./EditPost/EditPost";
import { useSession } from "next-auth/react";
import { formatDate } from "../../lib/format";
import { LikeButton } from "./LikeButton/like";
import { DeletePost } from "../deletePost";
import Link from "next/link";
import { useParams } from "next/navigation";
import GifModal from "../CreatePost/GifModal/GifModal";
import UploadThing from "../CreatePost/UploadThing/UploadThing";

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

  const { mutate: createComment } = api.comment.createComment.useMutation({
    onSuccess: () => {
      setCommentContent("");
      setGifUrl("");
      setImageUrls([]);
      refetch();
    },
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false); // New state for dialog visibility

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
      <div className="border p-5">
        <div className="flex items-center justify-between gap-5 ">
          <Button variant={"ghost"} onClick={() => history.back()}>
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl">Post</h1>
          {session?.user.id === post.createdBy.id && (
            <div>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => setIsDialogOpen(true)} variant="outline">
                  <Ellipsis />
                  </Button>
                </DialogTrigger>
                <DialogContent>
              {session?.user.id === post.createdBy.id && (
              <DeletePost postId={post.id} refetch={refetch} />
            )}
                  <EditPost
                    postId={post.id}
                    initialTitle={post.title}
                    initialGifUrl={post.gifUrl}
                    initialImageUrls={post.imageUrls}
                    refetch={refetch}
                  />
                  <DialogClose asChild>
      
                  </DialogClose>
                </DialogContent>
              </Dialog>
            </div>
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
    </div>
  );
}
