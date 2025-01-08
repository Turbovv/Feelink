"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FollowUnfollowButton } from "~/components/Settings/follow";
import { Button } from "~/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";

const FollowingPage: React.FC = () => {
  const { username } = useParams();
  const { data: session } = useSession();

  if (!username) return <div>Invalid username</div>;

  const { data: user, isLoading: userLoading } =
    api.userpost.getUserByUsername.useQuery({
      username: username as string,
    });

  const { data: followings, isLoading: followingLoading } =
    api.follow.getFollowingWithStatus.useQuery({
      userId: user?.id ?? "",
    });
      useEffect(() => {
        if (user?.name) {
          document.title = "Peope Followed by" + ' - ' + user.name
        } else {
          document.title = "Feelink";
        }
      }, [user]);

  if (!user) return <div>User not found</div>;

  return (
    <div className="container mx-auto max-w-2xl">
         <Button variant="ghost" onClick={() => history.back()}>
            <ArrowLeft />
          </Button>
      <div className="border bg-white shadow-md dark:bg-gray-800 dark:text-white">
        {userLoading ?? followingLoading ? (
          <div>Loading...</div>
        ) : followings?.length ? (
          followings.map((following) => (
            <div
              key={`${following.userId}-${following.followingId}`}
              className="font-semibold"
            >
              <div className="flex items-center justify-between border-b py-4">
                <div className="flex items-center gap-2">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={following.following.image ?? "/default-avatar.png"}
                    alt={following.following.name}
                  />
                  <Link
                    href={`/settings/${following.following.name}`}
                    className="hover:underline"
                  >
                    {following.following.name}
                  </Link>
                </div>
                {session?.user?.id !== following.followingId && (
                  <FollowUnfollowButton
                    userId={following.followingId}
                    isFollowing={following.isFollowingBack ?? false}
                  />
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No following yet</p>
        )}
      </div>
    </div>
  );
};

export default FollowingPage;
