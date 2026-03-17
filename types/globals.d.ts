export interface User {
    id: string
    encrypted_id: string
    name: string
    email: string
    password: string
    role: string
    created_at: Date
    updated_at: Date
    deleted_at: Date
}