"use client";

import { MessageCircle } from "lucide-react";
import { api } from "~/trpc/react";
import { LikeButton } from "../PostId/LikeButton/like";
import CreatePost from "../CreatePost/page";
import { formatDate } from "~/lib/format";
import { useSession } from "next-auth/react";
import { DeletePost } from "../deletePost";
import { useRouter } from "next/navigation";

export function Posts() {
  const { data: session } = useSession();
  const router = useRouter()
  const {
    data: posts,
    refetch,
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
        <div className="">
          {posts.map((post) => (
            <div key={post.id} className="text-lg font-semibold">
              <div className="relative rounded-lg border  border-gray-200 bg-white p-2 shadow-md transition dark:bg-black hover:shadow-lg dark:hover:shadow-xl">
               {session?.user.id === post.createdBy.id && (
              <div className="absolute right-4 top-4"> 
                  <DeletePost  postId={post.id} refetch={refetch} />
               </div>
                )}
                <div className="cursor-pointer"  onClick={async () => await router.push(`/posts/${post?.id}`)}>
                   <div className="flex items-center gap-2">
                   <img
                      className="h-14 w-14 rounded-full"
                      src={post.createdBy.image ?? "Avatar"}
                      alt="Avatar"
                    />
                      <div className="flex gap-5">
                        <p className="text-gray-900 dark:text-gray-100">
                          {post.createdBy.name}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {formatDate(post.createdAt.toString(), false)}
                        </p>
                      </div>
                   </div>
                     <div className="ml-16 mr-2">
                     <p className="text-gray-800 dark:text-gray-200">
                        {post.title}
                      </p>
                      {post.gifUrl && (
                        <img
                          src={post.gifUrl}
                          alt="Gif"
                          className="mt-2 w-full rounded-3xl border border-gray-200 dark:border-gray-700"
                        />
                      )}
                      {post.imageUrls && post.imageUrls.length > 0 && (
                        <div className="mt-2 flex   gap-4">
                          {post.imageUrls.map((url, index) => (
                            <img
                              key={index}
                              src={url}
                              alt={`Uploaded image ${index + 1}`}
                              className="w-full h-full  rounded-lg object-cover"
                            />
                          ))}
                        </div>
                      )}
                     </div>
                </div>
             
                <div className="mt-4 flex items-center gap-10  ml-16">
                  <p onClick={() => router.push(`/posts/${post.id}`)} className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400">
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
        </div>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400">
          No posts found.
        </p>
      )}
    </div>
  );
}
