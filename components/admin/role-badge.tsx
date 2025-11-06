import { Badge } from "@/components/ui/badge"
import type { Role } from "@/lib/auth"

interface RoleBadgeProps {
  role: Role
}

export function RoleBadge({ role }: RoleBadgeProps) {
  const variants = {
    ADMIN: "bg-red-100 text-red-800 hover:bg-red-100",
    EDITOR: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  }

  const labels = {
    ADMIN: "Admin",
    EDITOR: "Editor",
  }

  return (
    <Badge variant="secondary" className={variants[role]}>
      {labels[role]}
    </Badge>
  )
}
