import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import SessionValidation from "@/context/SessionContext"

export default function CandidateLayout({ children }) {

  return (
    <>
     <SessionValidation>
              {children}
      </SessionValidation>
    </>
  )
}
