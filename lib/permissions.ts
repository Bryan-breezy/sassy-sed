import type { Resource, Action } from "./types"
import type { Role as UserRole } from "@prisma/client"

const PERMISSIONS: Record<UserRole, Record<Resource, Action[]>> = {
  ADMIN: {
    products: ["create", "read", "update", "delete"],
    team: ["create", "read", "update", "delete"],
    media: ["create", "read", "update", "delete"],
    users: ["create", "read", "update", "delete"],
  },
  EDITOR: {
    products: ["read", "update"],
    team: ["create", "read", "update"],
    media: ["read", "update"],
    users: [],
  },
}

export function hasPermission(role: UserRole, resource: Resource, action: Action): boolean {
  return PERMISSIONS[role]?.[resource]?.includes(action) ?? false
}

export function canManageUsers(role: UserRole): boolean {
  return hasPermission(role, "users", "read")
}

export function canDelete(role: UserRole, resource: Resource): boolean {
  return hasPermission(role, resource, "delete")
}
