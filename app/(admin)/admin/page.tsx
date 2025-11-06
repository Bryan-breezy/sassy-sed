import { redirect } from "next/navigation"
import Link from "next/link"
import { getSession } from "@/lib/session"
import { supabaseAdmin } from "@/lib/supabase-admin"

// UI Components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PermissionGuard } from "@/components/admin/permission-guard"

// Icons
import { Package, Users, ImageIcon, UserCheck, Plus } from "lucide-react"

// Types
import type { Role as UserRole } from "@prisma/client"

interface StatData {
  products: { value: number }
  media: { value: number }
  users: { value: number }
}

// --- Server-side data fetching functions ---
async function getDashboardStats(): Promise<StatData | null> {
  try {
    // Use Supabase client directly instead of fetch
    const [
      productCount,
      mediaCount,
      userCount
    ] = await Promise.all([
      // Product count
      supabaseAdmin
        .from('Product')
        .select('id', { count: 'exact', head: true }),
      
      // Media count from storage
      supabaseAdmin.storage
        .from('uploads')
        .list(),
      
      // Total user count
      supabaseAdmin
        .from('User')
        .select('id', { count: 'exact', head: true })
    ])

    // Handle potential errors
    if (productCount.error) {
      console.error("Product count error:", productCount.error)
    }
    if (mediaCount.error) {
      console.error("Media count error:", mediaCount.error)
    }
    if (userCount.error) {
      console.error("User count error:", userCount.error)
    }

    const mediaFiles = mediaCount.data || []
    const mediaFileCount = mediaFiles.length

    return {
      products: { value: productCount.count || 0 },
      media: { value: mediaFileCount },
      users: { value: userCount.count || 0 },
    }
  } catch (error) {
    console.error("Error in getDashboardStats:", error)
    return null
  }
}

// --- The Main Page Component ---
export default async function AdminDashboard() {
  // Fetch session and stats in parallel
  const [session, statsData] = await Promise.all([
    getSession(),
    getDashboardStats()
  ])
  
  const user = session?.user

  // If no user, redirect to login
  if (!user) {
    redirect("/login")
  }

  // If user doesn't have admin/editor role, show access denied
  if (!['ADMIN', 'EDITOR'].includes(user.role as UserRole)) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center text-red-600">Access Denied</CardTitle>
            <CardDescription className="text-center">
              You don&apos;t have permission to access the admin dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/">Return to Home</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // --- Map the fetched data to your stats array ---
  const stats = [
    { 
      name: "Total Products", 
      value: statsData?.products.value ?? 0, 
      icon: Package 
    },
    { 
      name: "Media Files", 
      value: statsData?.media.value ?? 0, 
      icon: ImageIcon 
    },
    { 
      name: "Total Users", 
      value: statsData?.users.value ?? 0, 
      icon: UserCheck 
    },
  ]

  const quickActions = [
    { 
      title: "Add Product", 
      description: "Create a new product", 
      href: "/admin/products/new", 
      icon: Package, 
      resource: "products" as const, 
      action: "create" as const 
    },
    { 
      title: "Upload Media", 
      description: "Upload images and files", 
      href: "/admin/media", 
      icon: ImageIcon, 
      resource: "media" as const, 
      action: "create" as const 
    },
    { 
      title: "Manage Users", 
      description: "Manage staff accounts", 
      href: "/admin/users", 
      icon: UserCheck, 
      resource: "users" as const, 
      action: "read" as const 
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Welcome back, {user.name}</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>

            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              {/* You can add logic for the &apos;change&apos; text later if needed */}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((action) => (
            <PermissionGuard 
              key={action.title} 
              resource={action.resource} 
              action={action.action} 
              userRole={user.role as UserRole}
            >
              <Card className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2">
                    <action.icon className="h-5 w-5 text-indigo-600" />
                    <CardTitle className="text-base">{action.title}</CardTitle>
                  </div>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <Button asChild className="w-full">
                    <Link href={action.href}>
                      <Plus className="h-4 w-4 mr-2" />
                      Get Started
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </PermissionGuard>
          ))}
        </div>
      </div>
    </div>
  )
}