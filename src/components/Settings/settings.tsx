"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import ProfileCard from "~/components/Settings/ProfileCard/ProfileCard";
import UserPosts from "~/components/Settings/UserPosts/UserPosts";

function Settings() {
  const { username } = useParams();
  const { data: session } = useSession();

  if (!username) return <div>Invalid username</div>;

  const { data: user, isLoading: userLoading } = api.userpost.getUserByUsername.useQuery({
    username: username as string,
  });

  const { data: posts, isLoading: postsLoading, error, refetch: refetchLikes } =
    api.userpost.getByUser.useQuery({
      userId: user?.id || "",
    });

  if (userLoading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const isCurrentUser = session?.user?.id === user.id;

  return (
    <div className="container border mx-auto max-w-2xl">
      <div className="">
        <ProfileCard user={user} isCurrentUser={isCurrentUser} sessionUserId={session?.user?.id} />
        <UserPosts
          posts={posts || []}
          userImage={user.image}
          userName={user.name}
          isLoading={postsLoading}
          error={error}
          refetchLikes={refetchLikes}
        />
      </div>
    </div>
  );
}

export default Settings;
