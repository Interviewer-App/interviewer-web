"use client"

import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { useSession } from "next-auth/react"
import {
    useRouter,
    usePathname,
    redirect,
    useSearchParams,
} from "next/navigation";
import Loading from "@/app/loading";

function SessionValidation({ children }) {
    const { data: session, status } = useSession();
    const pathname = usePathname();
    if (status === "loading") {
        return <Loading />;
    }

    if (!session) {
        const loginURL = `/login?redirect=${encodeURIComponent(pathname)}`;
        redirect(loginURL);
    }

    // if (status === "loading") {
    //     return (
    //       <>
    //         <Loading />
    //       </>
    //     );
    //   } else {
    //     if (!session) {
    //       const loginURL = `/auth/login?redirect=${encodeURIComponent(pathname)}`;
    //       redirect(loginURL);
    //     }
    //   }

    return (
        <SidebarProvider>
            <AppSidebar />
            {children}
        </SidebarProvider>
    );
}

export default SessionValidation;