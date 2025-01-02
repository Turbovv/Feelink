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
    userId: user?.id ?? "",
  });

  if (!user) return <div>User not found</div>;

  return (
    <div className="">
      <div className="bg-white dark:bg-gray-800 border shadow-md dark:text-white">
        {isLoading ? (
          <div>Loading...</div>
        ) : followers?.length ? (
          followers.map((follower) => (
            <div key={follower.userId} className="font-semibold">
              <div className="flex justify-between items-center border-b py-4">
                <div className="flex items-center gap-2">
                  <img
                    className="w-12 h-12 rounded-full"
                    src={follower.user.image ?? "/default-avatar.png"}
                    alt={follower.user.name}
                  />
                  <Link
                    href={`/settings/${follower.user.name}`}
                    className="hover:underline"
                  >
                    {follower.user.name}
                  </Link>
                </div>
                {session?.user?.id !== follower.userId && (
                  <FollowUnfollowButton
                    userId={follower.userId}
                    isFollowing={follower.isFollowing ?? false}
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
