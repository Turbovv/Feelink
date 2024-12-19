import { Heart } from "lucide-react";
import { useState } from "react";
import { api } from "~/trpc/react";

interface LikeButtonProps {
  postId: string;
  isLiked: boolean;
  refetchLikes: () => void;
}

export const LikeButton: React.FC<LikeButtonProps> = ({ postId, isLiked, refetchLikes }) => {
  const [liked, setLiked] = useState(isLiked);

  const likeMutation = api.like.likePost.useMutation({
    onSuccess: () => {
      setLiked(true);
      refetchLikes(); 
    },
  });

  const unlikeMutation = api.like.unlikePost.useMutation({
    onSuccess: () => {
      setLiked(false);
      refetchLikes();
    },
  });

  const handleLike = () => {
    likeMutation.mutate({ postId });
  };

  const handleUnlike = () => {
    unlikeMutation.mutate({ postId });
  };

  return (
    <button
      onClick={liked ? handleUnlike : handleLike}
      className="flex items-center  py-2 font-semibold rounded focus:outline-none"
    >
      <Heart
        className={`w-6 h-6 transition-colors ${
          liked ? "fill-red-500 text-red-500" : "fill-none text-gray-500"
        }`}
      />
    </button>
  );
};
