import { NextResponse } from 'next/server'
import bcrypt from 'bcrypt'
import { getSession } from '@/lib/session'
import { supabase } from '@/lib/supabase-client'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, password } = body

    if (!name || !password) {
      return NextResponse.json({ error: 'Name and password are required' }, { status: 400 })
    }

    // Find the user in Supabase
    const { data: user, error } = await supabase
      .from('User')
      .select('*')
      .eq('name', name)
      .single()

    if (error || !user) {
      console.error('User not found:', error)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Compare the provided password with the stored hash
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create session
    const session = await getSession()
    session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
    }
    await session.save()

    // Return user without password hash
    const { passwordHash: _, ...userWithoutPassword } = user
    return NextResponse.json(userWithoutPassword, { status: 200 })

  } catch (error) {
    console.error('Login Error:', error)
    return NextResponse.json({ error: 'An internal server error occurred' }, { status: 500 })
  }
}
