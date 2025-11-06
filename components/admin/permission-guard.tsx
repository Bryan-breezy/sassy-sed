import type React from "react"
import type { Role } from "@/lib/auth"
import type { Resource, Action } from "@/lib/types"
import { hasPermission } from "@/lib/permissions"

interface PermissionGuardProps {
  children: React.ReactNode
  resource: Resource
  action: Action
  userRole?: Role
  fallback?: React.ReactNode
}

export function PermissionGuard({ 
  children, 
  resource, 
  action, 
  userRole, 
  fallback = null 
}: PermissionGuardProps) {
  if (!userRole || !hasPermission(userRole, resource, action)) {
    return <>{fallback}</>
  }
  
  return <>{children}</>
}
