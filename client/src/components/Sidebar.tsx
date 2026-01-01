import { NavLink } from "react-router-dom"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"

import { ThemeToggle } from "./theme-toggle"
import { Home, Settings, PanelLeft } from "lucide-react"

export function AppSidebar() {
    const { state } = useSidebar()


    const menuItems = [
        { name: "My History", icon: <Home className="h-5 w-5" />, path: "/" },
        { name: "Call History", icon: <Settings className="h-5 w-5" />, path: "/history" },
    ]

    return (
        <Sidebar
            collapsible="icon"
            className="[--sidebar-width:200px]"
        >

            <div className="flex items-center justify-between px-4 py-3">
                {state === "expanded" && (
                    <span className="text-sm font-semibold tracking-wide">Dashboard</span>
                )}
                <SidebarTrigger>
                    <PanelLeft className="h-5 w-5" />
                </SidebarTrigger>
            </div>


            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.name}>
                                    <NavLink
                                        to={item.path}
                                        className={({ isActive }) =>
                                            `flex items-center gap-2 p-2 rounded transition-colors ${isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                                            }`
                                        }
                                    >
                                        {item.icon}
                                        {state === "expanded" && <span>{item.name}</span>}
                                    </NavLink>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>


            <SidebarFooter className="flex justify-center p-3">
                <ThemeToggle />
            </SidebarFooter>
        </Sidebar>
    )
}
