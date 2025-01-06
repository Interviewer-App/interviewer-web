import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function AdminLayout({ children }) {

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
          {children}
      </SidebarProvider>
    </>
  )
}