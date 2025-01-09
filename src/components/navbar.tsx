"use client";

import { ModeToggle } from "./ui/mode-toggle";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { AppSidebar } from "../components/app-sidebar";
import { CustomTrigger } from "./custom-trigger";
import React from "react";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === "/auth/sign-in") {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0  flex h-14 w-full items-center justify-between bg-opacity-50  bg-white px-4  dark:bg-black dark:bg-opacity-50"
    >
      <div
        className="cursor-pointer text-lg font-semibold"
        onClick={() => router.push("/")}
      >
        Feelink
      </div>

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
