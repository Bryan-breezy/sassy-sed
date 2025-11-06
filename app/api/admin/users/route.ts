import { NextResponse } from 'next/server'
import { withAuthorization } from '@/lib/auth'
import bcrypt from 'bcrypt'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-admin'

const UserRole = {
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR', 
} as const

// ====================================================================
// GET: List all users (Admin only)
// ====================================================================
const getAllUsersHandler = async (request: Request) => {
  try {
    const { data: users, error } = await supabaseAdmin
      .from('User')
      .select(`
        id,
        name,
        role,
        createdAt,
        updatedAt
      `)
      .order('createdAt', { ascending: true })

    if (error) {
      console.error('Supabase fetch error:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    return NextResponse.json(users || [])
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
  }
}

// ====================================================================
// POST: Create new user (Admin only)
// ====================================================================
const createUserSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters long.'),
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  role: z.nativeEnum(UserRole).default(UserRole.EDITOR),
})

const createUserHandler = async (request: Request) => {
  try {
    const body = await request.json()
    const validation = createUserSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ 
        error: validation.error.formErrors 
      }, { status: 400 })
    }

    const { name, password, role } = validation.data

    // Check if user already exists
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('User')
      .select('id')
      .eq('name', name)
      .single()

    if (existingUser) {
      return NextResponse.json({ 
        error: 'User with that name already exists' 
      }, { status: 409 })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Generate unique ID (since your table uses text ID)
    const userId = generateId()

    // Create new user
    const { data: newUser, error: createError } = await supabaseAdmin
      .from('User')
      .insert([{
        id: userId,
        name,
        passwordHash,
        role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }])
      .select(`
        id,
        name,
        role,
        createdAt,
        updatedAt
      `)
      .single()

    if (createError) {
      console.error('Supabase create error:', createError)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    return NextResponse.json(newUser, { status: 201 })
  } catch (error) {
    console.error('Create User Error:', error)
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
  }
}

// Helper function to generate IDs
function generateId(): string {
  return `user_${Math.random().toString(36).substring(2, 15)}_${Date.now().toString(36)}`
}

// Export with authorization
export const GET = withAuthorization(getAllUsersHandler, ['ADMIN'])
export const POST = withAuthorization(createUserHandler, ['ADMIN'])
