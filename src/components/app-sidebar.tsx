"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

import SignOut from "./sign-out";
import React from "react";

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();
  const { data: session } = useSession();
  const router = useRouter();

  const items = [
    {
      title: "Settings",
      url: session?.user?.name ? `/settings/${session.user.name}` : "/",
      icon: Settings,
    },
    {
      title: "Profile",
      url: session?.user?.name ? `/settings/profile` : "/",
      icon: Settings,
    },
  ];

  const handleNavigation = (url: string) => {
    router.push(url); 
    toggleSidebar();
  };

  return (
    <Sidebar  side="right">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex justify-between items-center p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                {session?.user?.image ? (
                  <AvatarImage src={session.user.image} alt={session.user.name || "User"} />
                ) : (
                  <AvatarFallback>{session?.user?.name?.[0] || "U"}</AvatarFallback>
                )}
              </Avatar>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                {session?.user?.name || "Guest"}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={toggleSidebar}>
              X
            </Button>
          </SidebarGroupLabel>

          <SidebarGroupContent className="mt-5">
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem className="mb-2" key={item.title}>
                  <SidebarMenuButton
                    className="flex items-center gap-3 p-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    onClick={() => handleNavigation(item.url)}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>

          <div className="mt-5">
            <SignOut />
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
