import { NavLink, useLocation } from "react-router-dom"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"

import { ThemeToggle } from "../ThemeToggle/ThemeToggle"
import { LayoutDashboard, Phone } from "lucide-react"
import { cn } from "@/utils/general/utils"

export function AppSidebar() {
    const { state } = useSidebar()
    const location = useLocation()

    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, path: "/" },
        { name: "Call History", icon: Phone, path: "/history" },
    ]

    return (
        <Sidebar
            collapsible="icon"
            className="[--sidebar-width:240px] border-r border-border/40"
        >
            <div className={cn(
                "flex items-center border-b border-border/40 py-4",
                state === "expanded" ? "justify-between px-4" : "justify-center"
            )}>
                {state === "expanded" && (
                    <div className="flex flex-col">
                        <span className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                            CRM System
                        </span>
                        <span className="text-xs text-muted-foreground">Call Management</span>
                    </div>
                )}
                <SidebarTrigger className={state === "expanded" ? "ml-auto" : ""} />
            </div>

            <SidebarContent className="px-3 group-data-[collapsible=icon]:px-0">
                <SidebarGroup>
                    <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider group-data-[collapsible=icon]:hidden">
                        Navigation
                    </SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {menuItems.map((item) => {
                                const Icon = item.icon
                                const isActive = item.path === "/" 
                                    ? location.pathname === "/"
                                    : location.pathname.startsWith(item.path)
                                
                                return (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={isActive}
                                            tooltip={item.name}
                                        >
                                            <NavLink to={item.path}>
                                                <Icon className="h-5 w-5 shrink-0" />
                                                <span>{item.name}</span>
                                            </NavLink>
                                        </SidebarMenuButton>
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
