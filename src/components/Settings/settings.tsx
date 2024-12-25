"use client";

import { api } from "~/trpc/react";
import { FollowUnfollowButton } from "~/components/Settings/follow";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Avatar, AvatarImage } from "../ui/avatar";
import Link from "next/link";
import { formatDate } from "~/lib/format";

const Settings: React.FC = () => {
  const { username } = useParams(); 
    const { data: session } = useSession();

  if (!username) return <div>Invalid username</div>;
  const {
    data: posts,
    isLoading: postsLoading,
    error,
  } = api.userpost.getByUser.useQuery();
  
  const { data: user, isLoading } = api.userpost.getUserByUsername.useQuery({ username: username as string });

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;
  
  const isCurrentUser = session?.user?.id === user.id;

  return (
    <div className="container mx-auto mt-8 px-4 sm:px-6">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="col-span-1 rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md dark:text-white">
          <div className="flex flex-col items-center">
            <img
              src={user?.image || "/default-avatar.png"}
              alt="Avatar"
              className="mb-4 h-24 w-24 rounded-full object-cover shadow-md"
            />
            <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
              {user?.name || "User Name"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <div className="flex gap-2 mt-2 mb-2">
            <a
                href={`/settings/${user.name}/followers`}
                className="text-blue-500 hover:underline"
              >
            <p className="text-sm text-gray-600">{user.followers?.length || 0} Followers</p>
              </a>
            <p className="text-sm text-gray-600">{user.following?.length || 0} Following</p>
            </div>
            {!isCurrentUser && session?.user?.id !== user.id && (
                     <FollowUnfollowButton userId={user.id} isFollowing={user.isFollowing || false} />
                )}
          </div>
        </div>

        <div className="col-span-3 rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md dark:text-white">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Your Posts {posts?.length}
          </h2>
          {postsLoading ? (
            <p className="text-gray-600 dark:text-gray-400">Loading your posts...</p>
          ) : error ? (
            <p className="text-red-500 dark:text-red-400">{error.message}</p>
          ) : (
            <div className="space-y-6">
             {posts && posts.length > 0 ? (
                posts?.map((post: any) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="text-lg font-semibold hover:underline dark:hover:text-blue-400"
                  >
                    <div className="flex items-start gap-4 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 p-4 shadow-sm transition duration-200 hover:bg-gray-100 dark:hover:bg-gray-800">
                      <img
                        src={user.image || "/default-avatar.png"}
                        alt="Avatar"
                        className="mb-4 h-12 w-12 rounded-full object-cover shadow-md"
                      />
                      <div className="flex-1">
                        <div className="flex gap-1 items-center">
                          <p className="text-gray-800 dark:text-gray-200">{user.name}</p>
                          <span className="text-gray-500 dark:text-gray-400">·</span>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{formatDate(post.createdAt)}</p>
                        </div>
                        <p className="text-gray-800 dark:text-gray-200">{post.title}</p>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          {post.description}
                        </p>
                        {post.gifUrl && (
                          <img
                            src={post.gifUrl}
                            alt="GIF"
                            className="mt-4 rounded-md shadow-md"
                          />
                        )}
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
      </div>
    </div>
  );
};

export default Settings;
