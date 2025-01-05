"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useSidebar } from "./ui/sidebar";

export default function SignOut() {
  const { toggleSidebar } = useSidebar();

  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' }); 
    router.push('/');
    toggleSidebar()
  };

  return (
    <Button
      onClick={handleSignOut}
      className="ml-2 py-2 text-sm text-white rounded hover:bg-red-600"
    >
      Sign out
    </Button>
  );
}
