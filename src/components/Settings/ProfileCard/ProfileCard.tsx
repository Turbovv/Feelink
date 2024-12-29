import { FollowUnfollowButton } from "~/components/Settings/follow";
import UserStats from "../UserStats/UserStats";
import { formatYearMonth } from "~/lib/format";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProfileCardProps {
  user: {
    createdAt: string | number | Date;
    following: any;
    followers: any;
    id: string;
    image: string | null;
    name: string | null;
    email: string | null;
    isFollowing?: boolean;
    description: string
    background: string,
  };
  isCurrentUser: boolean;
  sessionUserId: string | undefined;
}

function ProfileCard({ user, isCurrentUser, sessionUserId }: ProfileCardProps) {
    const router = useRouter(); 

  const handleEditProfile = () => {
    router.push("/settings/profile");
  };
  const formattedCreatedAt = formatYearMonth(user.createdAt);
  return (
    <div className="col-span-1 rounded-lg dark:bg-black bg-white p-6 shadow-md  dark:text-white">
      <div className="">
        <div className="">
          <img src={user.background} alt="background" />
          <img
            src={user.image || "/default-avatar.png"}
            alt="Avatar"
            className="mb-4 h-24 w-24 rounded-full object-cover shadow-md"
          />
          <div>
          {isCurrentUser && (
          <button
            onClick={handleEditProfile}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Edit Profile
          </button>
        )}
            {!isCurrentUser && sessionUserId !== user.id && (
              <FollowUnfollowButton userId={user.id} isFollowing={user.isFollowing || false} />
            )}
          </div>
        </div>
        <h2 className="mb-2 text-lg font-semibold text-gray-800 dark:text-gray-200">
          {user.name || "User Name"}
        </h2>
        <div className="flex gap-3 items-center">
          <p>{user.description}</p>

          <p className="text-sm flex gap-1 text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            Joined {formattedCreatedAt}
          </p>
        </div>
        <div className="mb-2 mt-2 flex gap-2">
          <UserStats username={user.name || ""} followersCount={user.followers?.length || 0} followingCount={user.following?.length || 0} />
        </div>

      </div>
    </div>
  );
}

export default ProfileCard;
