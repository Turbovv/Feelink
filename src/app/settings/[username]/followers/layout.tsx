"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ReactNode, useState } from "react";
import { Button } from "~/components/ui/button";
import { api } from "~/trpc/react";

interface SettingsLayoutProps {
  children: ReactNode;
}

const SettingsLayout: React.FC<SettingsLayoutProps> = ({ children }) => {
  const { username } = useParams();
  const { data: user, isLoading } = api.userpost.getUserByUsername.useQuery({
    username: username as string,
  });

  const [activeTab, setActiveTab] = useState("followers");  

  return (
    <div>
      <div className="container mx-auto max-w-2xl">
        <div className="flex gap-2 border-b">
          <Button
            variant="ghost"
            onClick={() => setActiveTab("followers")}
            className={`relative ${
              activeTab === "followers"
                ? "text-black dark:text-white font-semibold"
                : "text-gray-500"
            }`}
          >
            <Link href={`/settings/${user?.name}/followers`}>
              Followers
            </Link>
            {activeTab === "followers" && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 dark:bg-white" />
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => setActiveTab("following")}
            className={`relative ${
              activeTab === "following"
                ? "text-black dark:text-white font-semibold"
                : "text-gray-500"
            }`}
          >
            <Link href={`/settings/${user?.name}/following`}>
              Following
            </Link>
            {activeTab === "following" && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black dark:bg-white" />
            )}
          </Button>
        </div>
        <div className=" col-span-3 rounded-lg bg-white dark:bg-gray-800 p-6 shadow-md dark:text-white">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SettingsLayout;
