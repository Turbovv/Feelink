"use client";

import { signOut } from "next-auth/react";
import { Button } from "./ui/button";

export default function SignOut() {
  return (
    <Button
      onClick={() => signOut()}
      className="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600"
    >
      Sign out
    </Button>
  );
}
