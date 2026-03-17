export type Role = "admin"

export type RouteGuard = {
    matcher: (path: string) => boolean
    apiMatcher?: (path: string) => boolean
    authRequired: boolean
    allowedRoles?: Role[]
    redirectIfAuth?: string
    redirectIfUnauth?: string
    redirectIfUnauthorized?: string
}