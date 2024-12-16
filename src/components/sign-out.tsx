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
      className="ml-2 py-2 text-sm text-white rounded hover:bg-red-600"
    >
      Sign out
    </Button>
  );
}
