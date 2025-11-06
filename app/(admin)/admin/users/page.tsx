import Link from "next/link"
import { getSession } from "@/lib/session"
import { getAllUsers } from "@/lib/data" // This function is now wrapped in a try/catch
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert" // Assuming you have an Alert component
import { Terminal, Plus } from "lucide-react"

// UI Components
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Role } from "@/lib/auth"
import { RoleBadge } from "@/components/admin/role-badge"
import { UserActions } from "@/components/admin/user-actions"
import { UserForAdminList } from '@/types'

export default async function UsersPage() {
  let allUsers: UserForAdminList[] = []
  let session
  let error: string | null = null

  try {
    [allUsers, session] = await Promise.all([
      getAllUsers(),
      getSession()
    ])
  } catch (e) {
    console.error("Error fetching user data:", e);
    error = "Could not load user data. Please check the server connection and database availability.";
  }
  
  // Ensure allUsers is an array even on failure, for safe rendering
  if (!Array.isArray(allUsers)) {
      allUsers = [];
  }

  const currentUser = session?.user as UserForAdminList

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">User Management</h1>
          <p className="text-gray-600">Manage staff accounts and permissions.</p>
        </div>
        {/* Permission Check: Only Admins can create new users */}
        { currentUser?.role === 'ADMIN' &&
          <Button asChild>
            <Link href="/admin/users/new">
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Link>
          </Button>
        }
      </div>

      {/* --- Error Display --- */}
      {error && (
        <Alert variant="destructive" className="mt-4">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* --- User List or Empty State --- */}
      <div className="space-y-4">
        {allUsers.length > 0 ? (
          allUsers.map((user) => (
            <Card key={user.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{user.name}</h3>
                      <RoleBadge role={user.role as Role} />
                      {user.id === currentUser?.id && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">You</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">
                      Joined on: {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <UserActions userId={user.id} currentUser={currentUser} />
                </div>
              </CardContent>
            </Card>
          ))
        ) : !error && (
          <div className="text-center py-10 border border-dashed rounded-lg bg-gray-50">
            <h4 className="font-semibold text-gray-700">No Staff Accounts Found</h4>
            <p className="text-gray-500 text-sm mt-1">Create a new user account to get started with management.</p>
          </div>
        )}
      </div>
    </div>
  );
}
