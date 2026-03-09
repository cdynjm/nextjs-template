import { User } from "@/types";
export interface ApiResponse {
    user?: User
    success: boolean
    message?: string
    error?: string
}