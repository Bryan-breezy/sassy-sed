import { getSession } from "@/lib/session"
import { NextRequest, NextResponse } from 'next/server'

export type Role = "ADMIN" | "EDITOR"

export type RouteHandler = (req: NextRequest, context: any) => Promise<NextResponse | Response>

export function withAuthorization(handler: RouteHandler,allowedRoles: Role[] = ["ADMIN"]): RouteHandler {
  return async (req: NextRequest, context: any) => { 
    try {
      const session = await getSession()
      
      if (!session.user) {
        return NextResponse.json(
          { error: 'Unauthorized: Please log in first.' }, 
          { status: 401 }
        )
      }

      console.log('✅ User found:', session.user.name)
      console.log('👤 User Role:', session.user.role)

      // Get user role from session (already validated in getSession)
      const userRole = session.user.role as Role

      // Role validation
      if (!userRole || !allowedRoles.includes(userRole)) {
        console.log('❌ Insufficient permissions. User role:', userRole, 'Required:', allowedRoles)
        return NextResponse.json(
          { error: "Forbidden: You don't have permission for this action." },
          { status: 403 }
        )
      }

      console.log('✅ Authorization successful')
      // Proceed if authorized
      return handler(req, context)
    } catch (error) {
      console.error("❌ Authorization error:", error)
      return NextResponse.json(
        { error: "Internal server error during authorization" },
        { status: 500 }
      )
    }
  }
}