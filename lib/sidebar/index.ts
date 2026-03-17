import { Role, MenuItem } from "./types"
import { adminMenu } from "./admin.menu"

export type { Role, MenuItem }

const menuMap: Record<Role, MenuItem[]> = {
    admin: adminMenu,
}

export function getMenuByRole(role: Role | undefined): MenuItem[] {
    if (!role) return []
    return menuMap[role] ?? []
}