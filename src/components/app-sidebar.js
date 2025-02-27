"use client";
import * as React from "react";
import { Calendar, Home, Inbox, Activity, Atom, Timer, UserPlus, MonitorCheck, MessageCircleQuestion , Warehouse, UserRound, CalendarFold, Swords, BookOpenText } from "lucide-react";
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
import { SiEclipsejetty } from "react-icons/si";

const commonItems = [


];

const companyItems = [
  {
    title: "Interviews",
    url: "/interviews",
    icon: MonitorCheck,
  },
  {
    title: "Insights",
    url: "/interview-category",
    icon: MessageCircleQuestion ,
  },
  {
    title: "Comapny Profile",
    url: "/company-profile",
    icon: Warehouse,
  },
  {
    title: "Interview-comparision",
    url: "/Interview-comparision",
    icon: Swords,
  },
];

const candidateItems = [
  {
    title: "My Interviews",
    url: "/my-interviews",
    icon: CalendarFold,
  },
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
  {
    title: "user profile",
    url: "/user-profile",
    icon: UserRound,
  },
  // {
  //   title: "user Assesments",
  //   url: "/Assesments",
  //   icon: BookOpenText,
  // },
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
    name: "Skillchecker",
    logo: SiEclipsejetty,
    plan: "Decisions at Jet Speed",
  },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const role = session?.user?.role;

  // const session=await getSession();
  const userEmail = session?.user?.email;
  // const userRole=session?.user?.role;

  const [userData, setUserData] = React.useState({
    user: {
      name: role,
      email: userEmail,
      avatar: "https://github.com/shadcn.png",
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
                      className={`${isActive(item.url)
                          ? "bg-primary text-white bg-black" // active styles
                          : "text-slate-300 hover:bg-primary hover:text-white"
                        } flex items-center p-7 rounded-md text-base font-semibold`}
                    >
                      <item.icon className="mr-2 w-20 h-20" />
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
