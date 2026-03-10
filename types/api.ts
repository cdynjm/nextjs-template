import { User } from "@/types";
export interface ApiResponse {
    user?: User
    description: string
    success: boolean
    message?: string
    error?: string
}