"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SignIn from "~/components/sign-in";

export default function GoogleAuth() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    router.push("/");
    return null;
  }

  return (
   <SignIn
         provider="google"
         label="Sign with Google"
         bgColor="bg-gray-800"
         hoverColor="bg-gray-900"
       />
  );
}
