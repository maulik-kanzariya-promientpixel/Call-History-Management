import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/Sidebar/Sidebar";
import Navbar from "@/components/Navbar/Navbar";

const MainLayout = () => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">

        <aside className="w-64 shrink-0 border-r border-border">
          <AppSidebar />
        </aside>


        <div className="flex flex-1 flex-col">
          <Navbar />

          <main className="flex-1 overflow-auto p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default MainLayout;
