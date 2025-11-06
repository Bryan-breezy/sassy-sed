import { getSession } from "@/lib/session"
import { redirect } from "next/navigation"
import type { User } from '@/types'

import { AdminNav } from "@/components/admin/admin-nav"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()
  const user = session.user as User

  if (!user || (user.role !== 'ADMIN' && user.role !== 'EDITOR')) {
    redirect('/login')
  }

  return (
    <div>
      <AdminNav user={user} />

      <main className="lg:pl-64">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}