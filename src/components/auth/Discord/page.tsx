import Link from "next/link";

import { auth } from "~/server/auth";
import {  HydrateClient } from "~/trpc/server";
import DiscordIcon from "../../ui/icons/discordicon";

export default async function Discord() {
  const session = await auth();


  return (
    <HydrateClient>
      <div className="flex gap-5">
        <Link
          href={session ? "/api/auth/signout" : "/api/auth/signin"}
          className="flex gap-3 rounded-full bg-white/10 font-semibold no-underline transition hover:bg-white/20"
        >
          {session ? "Sign out" : "Sign in"}

          {!session && <DiscordIcon />}
        </Link>
        <p className="text-center">
          {session && <span>{session.user?.name}</span>}
        </p>
      </div>
    </HydrateClient>
  );
}
