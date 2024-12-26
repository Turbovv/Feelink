"use client";

import { useState } from "react";
import { api } from "~/trpc/react";

interface FollowUnfollowButtonProps {
  userId: string;
  isFollowing: boolean;
}

export const FollowUnfollowButton: React.FC<FollowUnfollowButtonProps> = ({ userId, isFollowing }) => {
  const [following, setFollowing] = useState(isFollowing);
  const [isHovered, setIsHovered] = useState(false);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`px-4 py-2 font-semibold rounded-full transition-colors duration-300 ${
        following
          ? isHovered
            ? "border border-red-500 text-red-500"
            : "bg-black border text-white"
          : "bg-white text-black border"
      }`}
    >
      {following ? (isHovered ? "Unfollow" : "Following") : "Follow"}
    </button>
  );
};
