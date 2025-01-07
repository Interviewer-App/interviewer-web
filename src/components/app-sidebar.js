"use client"

import * as React from "react"
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { useSession } from "next-auth/react"

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
} from "@/components/ui/sidebar"
import { NavUser } from "@/components/nav-user"
import Link from "next/link"
import { TeamSwitcher } from "./team-switcher" // Import TeamSwitcher

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
]

const companyItems = [
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
]

const candidateItems = [
  // {
  //   title: "Interview session",
  //   url: "/interview-session",
  //   icon: Home,
  // },
]

const adminItems = [
  // {
  //   title: "Interviews",
  //   url: "/interviews",
  //   icon: Home,
  // },
  // {
  //   title: "Settings",
  //   url: "/settings",
  //   icon: Settings,
  // },
]

// Sample user data.
const data = {
  user: {
    name: "Company",
    email: "shadcn@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
}

// Team data (single team, but passed as an array)
const teams = [
  {
    name: "Hello",
    logo: Inbox, // Example logo; replace with actual component or URL for team logo
    plan: "Pro",
  },
]

export function AppSidebar() {
  const { data: session } = useSession()
  const role = session?.user?.role // Assuming role is set on the user object in the session

  let items = commonItems
  if (role === "COMPANY") {
    items = [...items, ...companyItems]
  } else if (role === "CANDIDATE") {
    items = [...items, ...candidateItems]
  } else if (role === "ADMIN") {
    items = [...items, ...adminItems]
  }

  return (
    <Sidebar>
      <SidebarHeader>
        {/* Pass the teams array to the TeamSwitcher component */}
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
                    <Link href={item.url}>
                      <item.icon />
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
        {/* Display the NavUser component with user data */}
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
