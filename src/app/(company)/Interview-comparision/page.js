"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import React from 'react'
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
  } from "@/components/ui/sidebar";
  import { Plus   } from "lucide-react";

const InterviewComparision = () => {
  return (
    <div className="w-full">
         <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-3">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Interview Categories</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
 
        <div className="px-9 py-4 w-full max-w-[1500px] bg-black mx-auto h-full">
  <h1 className="text-3xl font-semibold">comparision</h1>
  <div className="bg-slate-600/10 w-full h-fit p-9 rounded-lg mt-5">
    <div className="flex items-center justify-between mb-5">
      
      <h1 className="text-2xl font-semibold">Interview comparision</h1>
      

      {/* Add Category Button */}
      <button
        
        className="rounded-lg bg-white text-black font-bold px-2 py-2"
      >
       Compare All Interviews
      </button>
    </div>


  </div>
</div>


      </SidebarInset>
    </div>
  )
}

export default InterviewComparision