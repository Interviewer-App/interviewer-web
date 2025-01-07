import { SidebarProvider, SidebarTrigger, SidebarInset, } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import SessionValidation from "@/context/SessionContext";
export default function CampanyLayout({
    children,
}) {
    return (
        <>
           <SessionValidation> {children}</SessionValidation>
        </>
    )
}