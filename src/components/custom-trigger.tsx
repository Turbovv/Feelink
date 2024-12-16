import { useSession } from "next-auth/react";
import { useSidebar } from "./ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export function CustomTrigger() {
  const { toggleSidebar } = useSidebar();
  const { data: session } = useSession();

  return (
    <button onClick={toggleSidebar}>
      <Avatar>
        {session?.user?.image ? (
          <AvatarImage
            src={session.user.image}
            alt={session.user.name || "User"}
          />
        ) : (
          <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
        )}
      </Avatar>
    </button>
  );
}
