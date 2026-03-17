"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { NProgressLink, route } from "./ui/nprogress-link";
import { ChevronsUpDown, LogOutIcon, User2Icon } from "lucide-react";
import { useAuth } from "@/lib/auth/session/client-use-auth";

export function UserDropdown() {
  const { user } = useAuth();

  const roleMap: Record<string, string> = {
    admin: "Admin",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-row items-center gap-1 justify-start">
            <span className="text-sm hidden md:block">{user?.name ?? ""}</span>{" "}
            |
            <small className="text-start uppercase">
              {user?.role ? roleMap[user.role] : ""}
            </small>
          </div>
          <ChevronsUpDown className="ml-auto h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {/* User Info Header */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100">
          <Avatar className="h-10 w-10">
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase() ?? "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user?.name ?? ""}</span>
            <small className="text-xs uppercase text-gray-500">
              {user?.role ? roleMap[user.role] : ""}
            </small>
          </div>
        </div>

        {/* Menu Items */}
        <DropdownMenuItem>
          <NProgressLink
            href={route("profile")}
            className="flex items-center gap-2"
          >
            <User2Icon />
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
          <span className="flex items-center gap-2">
            <LogOutIcon />
            Logout
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
