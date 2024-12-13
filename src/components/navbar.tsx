"use client";

import { ModeToggle } from "./ui/mode-toggle";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import SignOut from "./sign-out";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname === "/auth/sign-in") {
    return null;
  }

  return (
    <div className="flex h-16 items-center justify-between px-16">
      <Link href="/">Feelink</Link>
      <div className="flex items-center gap-5">
        {session ? (
          <div className="flex items-center gap-3">
            <Link href="/create">Create</Link>
              <img
                src={session.user.image || "Avatar"}
                alt={session.user.name || "User"}
                className="h-8 w-8 rounded-full"
              />
            <span>{session.user?.name}</span>
            <SignOut />
          </div>
        ) : (
          <Link href="/auth/sign-in" >
            <p>Sign In</p>
          </Link>
        )}
        <ModeToggle />
      </div>
    </div>
  );
}
