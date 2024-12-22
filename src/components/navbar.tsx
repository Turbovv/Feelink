"use client";

import { ModeToggle } from "./ui/mode-toggle";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";
import { AppSidebar } from "../components/app-sidebar";
import { CustomTrigger } from "./custom-trigger";
import React from "react";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  if (pathname === "/auth/sign-in") {
    return null;
  }

  return (
    <div className="flex h-16 w-full items-center justify-between px-4">
      <Link href="/" className="text-lg font-semibold">
        Feelink
      </Link>

      <div className="flex items-center gap-4">
        <AppSidebar />
        <ModeToggle />
        {session ? (
        <CustomTrigger />
        ) : (
          <Link
            href="/auth/sign-in"
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:underline dark:text-gray-200"
          >
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
}
