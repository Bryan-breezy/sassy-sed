import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function POST() {
  try {
    const session = await getSession()
    
    // Destroy the session
    await session.destroy()

    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 })
  } catch (error) {
    console.error('Logout Error:', error)
    return NextResponse.json({ error: 'Failed to logout' }, { status: 500 })
  }
}
