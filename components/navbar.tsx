"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserDropdown } from "./user-dropdown";

interface NavbarProps {
  title?: string;
}

export function Navbar({ title }: NavbarProps) {
  return (
    <div className="sticky top-0 z-50 border-b bg-background">
      <div className="flex items-center justify-between px-6 h-14">
        <div className="flex items-center gap-3">
          <SidebarTrigger />
          <h1 className="text-[13px] font-semibol text-gray-600">{title}</h1>
        </div>
        <UserDropdown />
      </div>
    </div>
  );
}
