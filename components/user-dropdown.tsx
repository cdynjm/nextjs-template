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
import { LogOutIcon, User2Icon } from "lucide-react";
import { useAuth } from "@/lib/auth/client-use-auth";

export function UserDropdown() {
  const { user } = useAuth();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <span className="text-sm hidden md:block">{user?.name}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem>
          <NProgressLink
            href={route("/profile")}
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
