"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import GoogleAuth from "~/components/auth/Google/page";
import DiscordAuth from "~/components/auth/Discord/page";
import { useEffect } from "react";

export default function SignInPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (session) return null;

  return (
    <div className="py-24 flex min-h-[80dvh] items-center justify-center mx-auto">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">Sign In</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Sign in to your account using one of the options below.
          </p>
        </div>

        <div className="space-y-4"> 
          <GoogleAuth />
          <DiscordAuth />
        </div>
      </div>
    </div>
  );
}
