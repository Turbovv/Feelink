"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FollowUnfollowButton } from "~/components/Settings/follow";

const FollowersPage: React.FC = () => {
  const { username } = useParams();
  const { data: session } = useSession();

  if (!username) return <div>Invalid username</div>;

  const { data: user, isLoading } = api.userpost.getUserByUsername.useQuery({
    username: username as string,
  });
  const { data: followers } = api.follow.getFollowers.useQuery({
    userId: user?.id || "",
  });

  if (!user) return <div>User not found</div>;

  return (
    <div className="">
      <div className="bg-white dark:bg-gray-800 border shadow-md dark:text-white">
        {isLoading ? (
          <div>Loading...</div>
        ) : followers?.length ? (
          followers.map((followers) => (
            <div key={followers.userId} className="font-semibold">
              <div className="flex justify-between items-center border-b py-4">
                <div className="flex items-center gap-2">
                  <img
                    className="w-12 h-12 rounded-full"
                    src={followers.user.image || "/default-avatar.png"}
                    alt={followers.user.name}
                  />
                  <Link
                    href={`/settings/${followers.user.name}`}
                    className="hover:underline"
                  >
                    {followers.user.name}
                  </Link>
                </div>
                {session?.user?.id !== followers.userId && (
                  <FollowUnfollowButton
                    userId={followers.userId}
                    isFollowing={followers.isFollowing || false}
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No followers yet</p>
        )}
      </div>
    </div>
  );
};

export default FollowersPage;
