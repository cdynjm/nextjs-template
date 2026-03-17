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
  SidebarFooter,
  SidebarRail,
} from "@/components/ui/sidebar";

import { usePathname } from "next/navigation";
import { Building2, UserIcon } from "lucide-react";
import { AppHeader } from "./app-header";
import { NProgressLink, route } from "./ui/nprogress-link";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/lib/auth/session/client-use-auth";
import { signOut } from "next-auth/react";
import { BottomNavbar } from "./bottom-navbar";
import { getMenuByRole } from "@/lib/sidebar";

export function AppSidebar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const menus = getMenuByRole(user?.role as undefined);

  const teams = [
    {
      name: "BudgeTRACK",
      logo: Building2,
      plan: "Provincial Budget Office",
    },
  ];

  const roleMap: Record<string, string> = {
    admin: "Admin",
  };

  return (
    <>
      <Sidebar
        variant="sidebar"
        collapsible="icon"
        className="border-transparent"
      >
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
                    <SidebarMenuItem
                      key={item.name}
                      className={
                        isActive ? "bg-muted text-black rounded-sm" : ""
                      }
                    >
                      <SidebarMenuButton asChild>
                        <NProgressLink
                          href={item.path}
                          className={`flex items-center gap-2 ${isActive ? "font-semibold hover:text-black hover:bg-transparent" : "hover:text-inherit"}`}
                        >
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

        <SidebarFooter className="mb-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-200">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-medium">{user?.name}</span>
                      <span className="truncate text-xs uppercase">{user?.role ? roleMap[user.role] : ""}</span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gray-200">
                          {user?.name?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-medium">
                          {user?.name}
                        </span>
                        <span className="truncate text-xs uppercase">{user?.role ? roleMap[user.role] : ""}</span>
                      </div>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <NProgressLink
                      href={route("profile")}
                      className="flex items-center gap-2"
                    >
                      <UserIcon />
                      Profile
                    </NProgressLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() =>
                      signOut({
                        callbackUrl: "/",
                      })
                    }
                  >
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <BottomNavbar />
    </>
  );
}
