"use client"

import * as React from "react"
import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
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

// Menu items.
const items = [
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
    title: "Interviews",
    url: "/interview-session",
    icon: Home,
  },
]

// Sample user data.
const data = {
  user: {
    name: "Shadcn",
    email: "shadcn@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
}

// Team data (single team, but passed as an array)
const teams = [
  {
    name: "Shadcn",
    logo: Inbox, // Example logo; replace with actual component or URL for team logo
    plan: "Pro",
  },
]

export function AppSidebar() {
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
