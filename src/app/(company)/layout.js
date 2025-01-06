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
export default function CampanyLayout({
    children,
}) {
    return (
        <>
            <SidebarProvider>
                <AppSidebar />
                {children}
            </SidebarProvider>
        </>
    )
}