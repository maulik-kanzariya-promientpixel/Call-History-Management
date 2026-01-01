import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <div className="w-64 shrink-0">
          <AppSidebar />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="w-full sticky top-0 z-10">
            <Navbar />
          </div>

          <div className="flex-1 overflow-auto p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
