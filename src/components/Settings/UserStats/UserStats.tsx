import Link from "next/link";

interface UserStatsProps {
  username: string;
  followersCount: number;
  followingCount: number;
}

function UserStats({ username, followersCount, followingCount }: UserStatsProps) {
  return (
    <>
      <Link href={`/settings/${username}/following`} className="hover:underline">
        <p className="text-sm text-gray-600"><span className="dark:text-white">{followingCount}</span> Following</p>
      </Link>
      <Link href={`/settings/${username}/followers`} className="text-blue-500 hover:underline">
        <p className="text-sm text-gray-600"><span className="dark:text-white">{followersCount}</span> Followers</p>
      </Link>
    </>
  );
}

export default UserStats;
