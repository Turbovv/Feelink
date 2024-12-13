"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface AuthButtonProps {
  provider: "google" | "discord";
  label: string;
  bgColor: string;
  hoverColor: string;
}

export default function SignIn({ provider, label, bgColor, hoverColor }: AuthButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/");
    return null;
  }

  return (
    <button
      onClick={() => signIn(provider)}
      className={`w-full rounded px-4 py-2 text-white ${bgColor} hover:${hoverColor}`}
    >
      {label}
    </button>
  );
}
