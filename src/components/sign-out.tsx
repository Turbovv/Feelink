"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

export default function SignOut() {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' }); 
    router.push('/');
  };

  return (
    <Button
      onClick={handleSignOut}
      className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
    >
      Sign out
    </Button>
  );
}
