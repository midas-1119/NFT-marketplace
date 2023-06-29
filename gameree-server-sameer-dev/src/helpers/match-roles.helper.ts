export const matchRoles = (roles: string[], userRoles: string[]): boolean => {
    return roles.some(r => userRoles.indexOf(r) >= 0)
}