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

import { ThemeToggle } from "../ThemeToggle/ThemeToggle"
import { LayoutDashboard, Phone, PanelLeft } from "lucide-react"
import { cn } from "@/utils/general/utils"

export function AppSidebar() {
    const { state } = useSidebar()

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/" },
        { name: "Call History", icon: Phone, path: "/history" },
    ]

    return (
        <Sidebar
            collapsible="icon"
            className="[--sidebar-width:240px] border-r border-border/40"
        >
            <div className="flex items-center justify-between px-4 py-4 border-b border-border/40">
                {state === "expanded" && (
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            CRM System
                        </span>
                        <span className="text-xs text-muted-foreground">Call Management</span>
                    </div>
                )}
                <SidebarTrigger className="ml-auto">
                    <PanelLeft className="h-5 w-5"/>
                </SidebarTrigger>
            </div>

            <SidebarContent className="px-3">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Navigation
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon
                                return (
                                    <SidebarMenuItem key={item.name}>
                                        <NavLink
                                            to={item.path}
                                            className={({ isActive }) =>
                                                cn(
                                                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                                                    "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                                                    isActive
                                                        ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                                                        : "text-sidebar-foreground"
                                                )
                                            }
                                        >
                                            <Icon className="h-5 w-5 shrink-0" />
                                            {state === "expanded" && <span>{item.name}</span>}
                                        </NavLink>
                                    </SidebarMenuItem>
                                )
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="border-t border-border/40 p-4">
                <div className="flex justify-center">
                    <ThemeToggle />
                </div>
            </SidebarFooter>
        </Sidebar>
    )
}
