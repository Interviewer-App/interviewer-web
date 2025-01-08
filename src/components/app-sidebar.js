"use client";

import * as React from "react";
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react";
import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation"; //use next/navigation insted of next/router(ref:stackoverflow)
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavUser } from "@/components/nav-user";
import Link from "next/link";
import { TeamSwitcher } from "./team-switcher"; 

const commonItems = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: Inbox,
  },
  {
    title: "Interviews",
    url: "/interviews",
    icon: Home,
  },
  {
    title: "Interview session",
    url: "/interview-session",
    icon: Home,
  },
  {
    title: "Users",
    url: "/users",
    icon: Inbox,
  },
  {
    title: "AI",
    url: "/AI",
    icon: Search,
  },
  {
    title: "Interview scheduls",
    url: "/interview-schedules",
    icon: Search,
  },
];

const companyItems = [];
const candidateItems = [];
const adminItems = [];

const data = {
  user: {
    name: "Company",
    email: "shadcn@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
};

const teams = [
  {
    name: "Hello",
    logo: Inbox, 
    plan: "Pro",
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role; 

  let items = commonItems;
  if (role === "COMPANY") {
    items = [...items, ...companyItems];
  } else if (role === "CANDIDATE") {
    items = [...items, ...candidateItems];
  } else if (role === "ADMIN") {
    items = [...items, ...adminItems];
  }

  //checking currenbt link is active or not
  const isActive = (url) => pathname === url;

  return (
    <Sidebar>
      <SidebarHeader>
       
        <TeamSwitcher teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`${
                        isActive(item.url)
                          ? "bg-primary text-white bg-gray-950" // active styles
                          : "text-slate-300 hover:bg-primary hover:text-white"
                      } flex items-center p-4 rounded-md text-xs`}
                    >
                      <item.icon className="mr-2" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
