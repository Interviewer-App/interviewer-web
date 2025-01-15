"use client";

import * as React from "react";
import { Calendar, Home, Inbox,Activity, Atom, Timer, UserPlus} from "lucide-react";
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
import { getSession } from "next-auth/react";

const commonItems = [
  // {
  //   title: "Dashboard",
  //   url: "/dashboard",
  //   icon: Inbox,
  // },
  // {
  //   title: "Interviews",
  //   url: "/interviews",
  //   icon: Home,
  // },
  // {
  //   title: "Interview session",
  //   url: "/interview-session",
  //   icon: Home,
  // },
  // {
  //   title: "Users",
  //   url: "/users",
  //   icon: Inbox,
  // },
  // {
  //   title: "AI",
  //   url: "/AI",
  //   icon: Search,
  // },

];

const companyItems = [
  {
    title: "Interviews",
    url: "/interviews",
    icon: Home,
  },
  {
    title: "Interviews category",
    url: "/interview-category",
    icon: Atom ,
  },
];
const candidateItems = [
  {
    title: "Interview scheduls",
    url: "/interview-schedules",
    icon: Timer,
  },
  {
    title: "Joined Interviews",
    url: "/joined-interviews",
    icon: UserPlus,
  },
];
const adminItems = [
  {
    title: "Users",
    url: "/users",
    icon: Inbox,
  },
];



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

    // const session=await getSession();
  const userEmail=session?.user?.email;
    // const userRole=session?.user?.role;

    const [userData, setUserData] = React.useState({
      user: {
        name: role,
        email: userEmail,
        avatar: "/avatars/shadcn.jpg",
      },
    });


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
        <NavUser user={userData.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
