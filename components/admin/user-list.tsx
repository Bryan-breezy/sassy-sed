"use client"

import { useState, useMemo } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UserActions } from "@/components/admin/user-actions"
import { RoleBadge } from "@/components/admin/role-badge"
import { Search } from "lucide-react"
import type { User, CurrentUser } from '@/types'

interface UsersListProps {
  initialUsers: User[]
  currentUser: CurrentUser
}

export function UsersList({ initialUsers, currentUser }: UsersListProps) {
  const [searchTerm, setSearchTerm] = useState('')

  // Filter the users based on the search term
  const filteredUsers = useMemo(() => {
    return initialUsers.filter(user =>
      (user.name ?? '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [initialUsers, searchTerm])

  return (
    <div>
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4 mt-6">
        {filteredUsers.map((user) => (
          <Card key={user.id}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <RoleBadge role={user.role} />
                    {user.id === currentUser?.id && (
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">You</span>
                    )}
                  </div>
                </div>
                <UserActions userId={user.id} currentUser={currentUser} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}