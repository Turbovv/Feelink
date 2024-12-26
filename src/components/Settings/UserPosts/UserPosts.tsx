import Link from "next/link";
import { formatDate } from "~/lib/format";

interface PostsListProps {
  posts: Array<{
    id: string;
    title: string;
    description: string;
    gifUrl?: string;
    createdAt: string;
  }>;
  userImage: string | null;
  userName: string | null;
  isLoading: boolean;
  error: Error | null;
}

function PostsList({ posts, userImage, userName, isLoading, error }: PostsListProps) {
  return (
    <div className="  shadow-md dark:bg-black dark:text-white">
      <div className="flex justify-between w-full  border items-center px-20 p-2">
      <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 ">
         Posts
      </h2>
      <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 ">
         Replies
      </h2>
      <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200 ">
         Media
      </h2>
      </div>

      {isLoading ? (
        <p className="text-gray-600 dark:text-gray-400">Loading your posts...</p>
      ) : error ? (
        <p className="text-red-500 dark:text-red-400">{error.message}</p>
      ) : (
        <div className="space-y-6 ">
          {posts.length > 0 ? (
            posts.map((post) => (
              <Link key={post.id} href={`/posts/${post.id}`} className="text-lg font-semibold dark:hover:text-blue-400 ">
                <div className="flex  gap-2  rounded-md  p-4 shadow-sm transition duration-200 dark:border dark:bg-black">
                  <img src={userImage || "/default-avatar.png"} alt="Avatar" className="h-12 w-12 rounded-full object-cover shadow-md" />
                  <div className="flex-1">
                    <div className="flex items-center gap-1">
                      <p className="text-gray-800 dark:text-gray-200 hover:underline">{userName}</p>
                      <span className="text-gray-500 dark:text-gray-400">·</span>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(post.createdAt)}</p>
                    </div>
                    <p className="text-gray-800 dark:text-gray-200">{post.title}</p>
                    {post.gifUrl && <img src={post.gifUrl} alt="GIF" className="mt-4 rounded-xl shadow-md w-full  border border-gray-200" />}
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No posts found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default PostsList;
