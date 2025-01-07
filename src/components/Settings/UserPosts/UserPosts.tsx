import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { LikeButton } from "../../PostId/LikeButton/like";
import { formatDate } from "~/lib/format";
import NoPosts from "~/components/no-posts";



function PostsList({ posts, userImage, userName, isLoading, error, refetchLikes }: any) {
  return (
    <div className="shadow-md dark:bg-black dark:text-white">
      <div className="flex justify-center w-full border-b border-red-500 items-center px-20 p-2">
        <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Posts</h2>
      </div>
      {isLoading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading your posts...</p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400">{error.message}</p>
      ) : (
        <div className="">
          {posts.length > 0 ? (
            posts.map((post: any) => (
              <div
                key={post.id}
                className="text-lg font-semibold dark:hover:text-blue-400 border"
              >
                <Link
                  href={`/posts/${post.id}`}
                  className="">
                  <div className="rounded-md p-4 shadow-sm transition duration-200 ">
                    <div className="flex gap-2 ">
                      <img
                        src={userImage || "/default-avatar.png"}
                        alt="Avatar"
                        className="h-12 w-12 rounded-full object-cover shadow-md"
                      />
                      <div className="flex  items-center gap-1 ">
                        <p className="text-gray-800 dark:text-gray-200 hover:underline">{userName}</p>
                        <span className="text-gray-500 dark:text-gray-400">·</span>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(post.createdAt)}</p>
                      </div>
                    </div>
                    <div className=" ml-14 ">
                      <p className="text-gray-800 dark:text-gray-200 mb-4">{post.title}</p>
                      {post.gifUrl && (
                        <img
                          src={post.gifUrl}
                          alt="GIF"
                          className="rounded-xl shadow-md w-full"
                        />
                      )}
                      
                      {post.imageUrls.length > 0 && (
                        <div className="mb-4">
                          <img
                            src={post.imageUrls}
                            alt="Image"
                            className="w-full rounded-md shadow-md"
                          />
                        </div>
                      )}

                      {post.videoUrls.length > 0 && (
                        <div >
                          <video
                            src={post.videoUrls}
                            controls
                            className="w-full rounded-md"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
                <div className="flex items-center px-20 gap-10">
                  <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                    <MessageCircle />
                    {post.Comment.length}
                  </p>
                  <div className="flex items-center gap-2">
                    <LikeButton
                      postId={post.id}
                      isLiked={post.isLiked || false}
                      refetchLikes={refetchLikes}
                    />
                    <span className="text-sm text-gray-600 dark:text-gray-400">{post._count.Like}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NoPosts />
          )}
        </div>
      )}
    </div>
  );
}

export default PostsList;
