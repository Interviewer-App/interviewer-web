"use client"

import { useEffect, useState } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/ui/theme-provider"

export default function AdminLayout({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null 

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <div className="dark"> 
              {children}
            </div>
          </ThemeProvider>
        </main>
      </SidebarProvider>
    </>
  )
}
