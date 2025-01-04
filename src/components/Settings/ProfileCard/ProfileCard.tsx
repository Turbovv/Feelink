import { FollowUnfollowButton } from "~/components/Settings/follow";
import UserStats from "../UserStats/UserStats";
import { formatYearMonth } from "~/lib/format";
import { Calendar } from "lucide-react";
import { useRouter } from "next/navigation";


function ProfileCard({ user, isCurrentUser, sessionUserId }:any) {
  const router = useRouter();

  const handleEditProfile = () => {
    router.push("/settings/profile");
  };

  const formattedCreatedAt = formatYearMonth(user.createdAt);

  return (
    <div className="col-span-1 rounded-lg dark:bg-black shadow-md dark:text-white">
      <div className="">
        <div className="">
          <img src={user.background} alt="background" className="relative border border-gray-400 h-48 w-full object-cover" />
         <div className="flex items-center justify-between p-6">
         <img
            src={user.image || "/default-avatar.png"}
            alt="Avatar"
            className="mb-4 h-24 w-24 rounded-full object-cover shadow-md"
          />
          <div className="">
            {isCurrentUser ? (
              <button
                onClick={handleEditProfile}
                className="px-4 py-2 dark:text-white dark:bg-black rounded-3xl border hover:bg-gray-300"
              >
                Edit Profile
              </button>
            ) : (
              sessionUserId !== user.id && (
                <FollowUnfollowButton
                  userId={user.id}
                  isFollowing={user.isFollowing || false}
                />
              )
            )}
          </div>
         </div>
        </div>

      <div className=" p-6">  
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
          <UserStats
            username={user.name || ""}
            followersCount={user.followers?.length || 0}
            followingCount={user.following?.length || 0}
          />
        </div></div>
      </div>
    </div>
  );
}

export default ProfileCard;
