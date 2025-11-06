import { notFound } from "next/navigation"
import { UserForm } from "@/components/admin/user-form"
import { getUserById } from "@/lib/data"
import type { Role } from "@/lib/auth" 

interface EditUserPageProps {
  params: Promise<{ id: string }>
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { id } = await params

  const dbUser = await getUserById(id)

  if (!dbUser) {
    notFound()
  }

  const user = {
    ...dbUser,
    role: dbUser.role as Role,
    createdAt: typeof dbUser.createdAt === 'string' 
      ? new Date(dbUser.createdAt) 
      : dbUser.createdAt,
    updatedAt: typeof dbUser.updatedAt === 'string' 
      ? new Date(dbUser.updatedAt) 
      : dbUser.updatedAt,
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Edit User</h1>
        <p className="text-gray-600">You are changing the role for user: "**{user.name}**"</p>
      </div>
      <UserForm user={user} />
    </div>
  )
}
