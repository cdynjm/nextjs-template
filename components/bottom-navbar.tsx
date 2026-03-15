"use client";

import { NProgressLink, route } from "./ui/nprogress-link";
import { LayoutDashboard, UserIcon, Users2 } from "lucide-react";
import { usePathname } from "next/navigation";

const menus = [
  { name: "Dashboard", icon: LayoutDashboard, path: route("dashboard") },
  { name: "Users", icon: Users2, path: route("users") },
  { name: "Profle", icon: UserIcon, path: route("profile") },
];

export function BottomNavbar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t md:hidden">
      <ul className="flex justify-around">
        {menus.map((item) => {
          const isActive = pathname === item.path;
          return (
            <li key={item.name} className="flex-1 text-center py-1">
              <NProgressLink
                href={item.path}
                className={`flex flex-col items-center justify-center gap-1 text-sm ${
                  isActive ? "text-primary font-semibold" : "text-gray-500"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <small>{item.name}</small>
              </NProgressLink>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
