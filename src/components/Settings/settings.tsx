"use client";

import { useParams } from "next/navigation";
import { api } from "~/trpc/react";
import { useSession } from "next-auth/react";
import ProfileCard from "~/components/Settings/ProfileCard/ProfileCard";
import UserPosts from "~/components/Settings/UserPosts/UserPosts";
import { useEffect } from "react";

function Settings() {
  const { username } = useParams();
  const { data: session } = useSession();

  if (!username) return <div>Invalid username</div>;

  const decodedUsername = decodeURIComponent(username as string);
  const { data: user, isLoading: userLoading } = api.userpost.getUserByUsername.useQuery({
    username: decodedUsername,
  });

  const { data: posts, isLoading: postsLoading, error, refetch: refetchLikes } =
    api.userpost.getByUser.useQuery({
      userId: user?.id ?? "",
    });
      useEffect(() => {
        if (user?.name) {
          document.title = user.name
        } else {
          document.title = "Feelink";
        }
      }, [user]);

  if (userLoading) return <div>Loading...</div>;
  if (!user) return <div>User not found</div>;

  const isCurrentUser = session?.user?.id === user.id;

  return (
    <div className="container border mx-auto max-w-2xl">
      <div>
        <ProfileCard user={user} isCurrentUser={isCurrentUser} sessionUserId={session?.user?.id} />
        <UserPosts
          posts={posts ?? []}
          userImage={user.image}
          userName={user.name}
          isLoading={postsLoading}
          error={error}
          refetchLikes={refetchLikes}
          isAuthenticated={!!session?.user}
        />
      </div>
    </div>
  );
}

export default Settings;
