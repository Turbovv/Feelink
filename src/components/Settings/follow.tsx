"use client";

import { useState } from "react";
import { api } from "~/trpc/react"; 

interface FollowUnfollowButtonProps {
  userId: string; 
  isFollowing: boolean;
}

export const FollowUnfollowButton: React.FC<FollowUnfollowButtonProps> = ({ userId, isFollowing }) => {
  const [following, setFollowing] = useState(isFollowing);

  const utils = api.useContext(); 

  const followMutation = api.follow.followUser.useMutation({
    onSuccess: () => {
      setFollowing(true);
      utils.userpost.getUserByUsername.invalidate(); 
    },
    onError: (error) => {
      console.error("Follow error:", error);
    },
  });

  const unfollowMutation = api.follow.unfollowUser.useMutation({
    onSuccess: () => {
      setFollowing(false);
      utils.userpost.getUserByUsername.invalidate();
    },
    onError: (error) => {
      console.error("Unfollow error:", error);
    },
  });

  const handleFollow = () => {
    followMutation.mutate({ followingId: userId });
  };

  const handleUnfollow = () => {
    unfollowMutation.mutate({ followingId: userId });
  };

  return (
    <button
      onClick={following ? handleUnfollow : handleFollow}
      className={`px-4 py-2 text-white font-semibold rounded ${
        following ? "bg-red-500 hover:bg-red-600" : "bg-blue-500 hover:bg-blue-600"
      }`}
    >
      {following ? "Unfollow" : "Follow"}
    </button>
  );
};
