"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"

// Your UI Components
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { RoleBadge } from "./role-badge"
import type { Role } from "@/lib/auth"

// Icons
import { LayoutDashboard, Package, ImageIcon, UserCheck, Menu, LogOut } from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Media", href: "/admin/media", icon: ImageIcon },
]

const userManagementNav = {
  name: "User Management",
  href: "/admin/users",
  icon: UserCheck,
}

// --- The component now receives the user as a prop ---
export function AdminNav({ user }: { user: { id: string; name: string; role: Role } }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const router = useRouter()

  const canManageUsers = user.role === 'ADMIN'

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  // A reusable component for the navigation content
  const NavContent = () => (
    <div className="flex h-full flex-col">
      <div className="flex h-16 shrink-0 items-center border-b px-4">
        <Link href="/admin" onClick={() => setSidebarOpen(false)}>
          <Image 
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${process.env.NEXT_PUBLIC_BUCKET_NAME}/1758702949667-sassy_logo_trans.webp`}
            alt="Sassy Products Logo" 
            width={120} 
            height={120} 
          />
        </Link>
      </div>

      <nav className="flex flex-1 flex-col p-4">
        <ul className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul className="-mx-2 space-y-1">
              {navigation.map((item) => {
                const isActive = pathname.startsWith(item.href);
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                        isActive ? "bg-gray-100 text-indigo-600" : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-6 w-6 shrink-0" />
                      {item.name}
                    </Link>
                  </li>
                )
              })}
              {canManageUsers && (
                <li>
                  <Link
                    href={userManagementNav.href}
                    className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                      pathname.startsWith(userManagementNav.href) ? "bg-gray-100 text-indigo-600" : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <userManagementNav.icon className="h-6 w-6 shrink-0" />
                    {userManagementNav.name}
                  </Link>
                </li>
              )}
            </ul>
          </li>
        </ul>

        <div className="mt-auto -mx-4 border-t border-gray-200 pt-4">
          <div className="flex items-center gap-x-3 px-6 py-3">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
              <div className="mt-1"><RoleBadge role={user.role} /></div>
            </div>
          </div>
          <div className="px-4">
            {/* <Button 
                variant="ghost" 
                className="w-full justify-start text-gray-700 hover:text-red-600" 
                onClick={handleLogout}
              >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button> */}

          <Link href="/login" className="w-full justify-start text-gray-700 hover:text-red-600" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
                Sign out
          </Link>
        
          </div>
        </div>
      </nav>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar using ShadCN's Sheet */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" className="fixed top-4 left-4 z-50 lg:hidden" size="icon">
            <Menu className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white">
          <NavContent />
        </div>
      </div>
    </>
  )
}