"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";
import { LayoutDashboard, Users2, Building2, Zap, Gift } from "lucide-react";
import { AppHeader } from "./app-header";
import { NProgressLink } from "./ui/nprogress-link";

const menus = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    name: "Users",
    icon: Users2,
    path: "/users",
  },
];

const teams = [
  {
    name: "Acme Inc",
    logo: Building2,
    plan: "Enterprise",
  },
  {
    name: "Acme Corp.",
    logo: Zap,
    plan: "Startup",
  },
  {
    name: "Evil Corp.",
    logo: Gift,
    plan: "Free",
  },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar variant="sidebar" collapsible="icon" className="border-transparent">
      <SidebarHeader className="mt-2">
        <AppHeader teams={teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="mt-[-10px]">Pages</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menus.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <SidebarMenuItem key={item.name} className={isActive ? "bg-muted text-black rounded-sm" : ""}>
                    <SidebarMenuButton asChild>
                      <NProgressLink href={item.path} className={`flex items-center gap-2 ${isActive ? "font-semibold hover:text-black hover:bg-transparent" : "hover:text-inherit"}`}>
                        <item.icon />
                        <span>{item.name}</span>
                      </NProgressLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      
    </Sidebar>
  );
}