'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '@/lib/session'
import { supabaseAdmin } from '@/lib/supabase-admin'

export async function deleteProduct(productId: string) {
  try {
    const session = await getSession()
    
    if (!session?.user) {
      return { success: false, error: "Unauthorized: Please log in" }
    }

    // Check permissions (Admin only for delete)
    const userRole = session.user.role
    if (!userRole?.includes('ADMIN')) {
      return { success: false, error: "Forbidden: Only admins can delete products" }
    }

    // Delete product using Supabase
    const { error } = await supabaseAdmin
      .from('Product')
      .delete()
      .eq('id', productId)

    if (error) {
      console.error("Failed to delete product:", error)
      return { success: false, error: "Failed to delete product" }
    }

    // Invalidate cache to reflect changes on the product list page
    revalidatePath('/admin/products')
    revalidatePath('/products')
    
    return { success: true }
  } catch (error) {
    console.error("Failed to delete product:", error)
    return { success: false, error: "Failed to delete product" }
  }
}
