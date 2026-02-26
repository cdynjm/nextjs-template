import { User } from "./user"

export interface AuthSession {
    user: User
    token?: string
    expires?: string
}