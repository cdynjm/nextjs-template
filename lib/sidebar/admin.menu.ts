import { LayoutDashboard, Users2 } from "lucide-react"
import { MenuItem } from "./types"

export const adminMenu: MenuItem[] = [
    {
        name: "Dashboard",
        icon: LayoutDashboard,
        path: "/admin/dashboard",
    },
    {
        name: "Users",
        icon: Users2,
        path: "/admin/users",
    },
]