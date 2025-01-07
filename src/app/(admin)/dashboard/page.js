import { AppSidebar } from "@/components/app-sidebar";
import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AdminDashboard() {
  return (
    <>
   <SidebarInset>
         <header className="flex h-16 shrink-0 items-center gap-2">
             <div className="flex items-center gap-2 px-3">
               <SidebarTrigger />
               <Separator orientation="vertical" className="mr-2 h-4" />
               <Breadcrumb>
                 <BreadcrumbList>
                   <BreadcrumbItem className="hidden md:block">
                     <BreadcrumbLink href="#">
                       Admin
                     </BreadcrumbLink>
                   </BreadcrumbItem>
                   <BreadcrumbSeparator className="hidden md:block" />
                   <BreadcrumbItem>
                     <BreadcrumbPage>Dashboard</BreadcrumbPage>
                   </BreadcrumbItem>
                 </BreadcrumbList>
               </Breadcrumb>
             </div>
           </header>
           </SidebarInset>

            </>
            )

}