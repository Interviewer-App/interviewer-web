import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import SessionValidation from "@/context/SessionContext";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";

export default function CandidateLayout({ children }) {
  return (
    <>
      <AppRouterCacheProvider>
        <div className="dark">
          <SessionValidation>{children}</SessionValidation>
        </div>
      </AppRouterCacheProvider>
    </>
  );
}
