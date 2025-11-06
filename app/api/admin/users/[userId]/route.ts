import { NextResponse } from 'next/server'
import { withAuthorization } from '@/lib/auth'
import { getSession } from '@/lib/session'
import { z } from 'zod'
import { supabaseAdmin } from '@/lib/supabase-admin'

export const dynamic = 'force-dynamic'

const roleUpdateSchema = z.object({
  role: z.enum(['ADMIN', 'EDITOR'])
})

// ====================================================================
// GET: Fetch a single user (Admin only)
// ====================================================================
const getSingleUserHandler = async (
  request: Request,
  { params }: { params: { userId: string } }
) => {
  try {
    const { userId } = params

    const { data: user, error } = await supabaseAdmin
      .from('User')
      .select('id, name, role, createdAt, updatedAt')
      .eq('id', userId)
      .single()

    if (error || !user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Failed to fetch user:', error)
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 })
  }
}

// ====================================================================
// PATCH: Update user role (Admin only)
// ====================================================================
const updateUserRoleHandler = async (
  request: Request,
  { params }: { params: { userId: string } }
) => {
  const session = await getSession()
  const { userId } = params

  // Prevent admins from changing their own role
  if (session.user?.id === userId) {
    return NextResponse.json({ error: "Admins cannot change their own role." }, { status: 403 })
  }
  
  try {
    const body = await request.json()
    const validation = roleUpdateSchema.safeParse(body)

    if (!validation.success) {
      return NextResponse.json({ error: validation.error.formErrors.fieldErrors }, { status: 400 })
    }

    const { role } = validation.data

    // Check if user exists first
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('User')
      .select('id')
      .eq('id', userId)
      .single()

    if (checkError || !existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update user role
    const { data: updatedUser, error: updateError } = await supabaseAdmin
      .from('User')
      .update({ 
        role,
        updatedAt: new Date().toISOString()
      })
      .eq('id', userId)
      .select('id, name, role, createdAt, updatedAt')
      .single()

    if (updateError) {
      console.error('Supabase update error:', updateError)
      return NextResponse.json({ error: 'Failed to update user role.' }, { status: 500 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error(`Failed to update role for user ${userId}:`, error)
    return NextResponse.json({ error: 'Failed to update user role.' }, { status: 500 })
  }
}

// ====================================================================
// DELETE: Delete user (Admin only)
// ====================================================================
const deleteUserHandler = async (
  request: Request,
  { params }: { params: { userId: string } }
) => {
  const { userId } = params

  const session = await getSession()
  if (session.user?.id === userId) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 403 })
  }

  try {
    // Check if user exists first
    const { data: existingUser, error: checkError } = await supabaseAdmin
      .from('User')
      .select('id')
      .eq('id', userId)
      .single()

    if (checkError || !existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user has associated products (foreign key constraint)
    const { data: userProducts, error: productsError } = await supabaseAdmin
      .from('Product')
      .select('id')
      .eq('authorId', userId)
      .limit(1)

    if (productsError) {
      console.error('Error checking user products:', productsError)
    }

    if (userProducts && userProducts.length > 0) {
      return NextResponse.json({ 
        error: 'Cannot delete user. They are still the author of products. Please reassign or delete their content first.' 
      }, { status: 409 })
    }

    // Delete the user
    const { error: deleteError } = await supabaseAdmin
      .from('User')
      .delete()
      .eq('id', userId)

    if (deleteError) {
      console.error('Supabase delete error:', deleteError)
      
      // Check for foreign key constraint violations
      if (deleteError.code === '23503') { // PostgreSQL foreign key violation
        return NextResponse.json({ 
          error: 'Cannot delete user. They are still referenced by other records. Please reassign or delete their content first.' 
        }, { status: 409 })
      }
      
      return NextResponse.json({ error: 'Failed to delete user.' }, { status: 500 })
    }

    return new NextResponse(null, { status: 204 }) // Success, No Content
  } catch (error) {
    console.error(`Error deleting user ${userId}:`, error)
    return NextResponse.json({ error: 'Failed to delete user due to a server error.' }, { status: 500 })
  }
}

// Export with authorization
export const GET = withAuthorization(getSingleUserHandler, ['ADMIN'])
export const PATCH = withAuthorization(updateUserRoleHandler, ['ADMIN'])
export const DELETE = withAuthorization(deleteUserHandler, ['ADMIN'])
