"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { CurrentUser } from '@/types'

interface ProductActionsProps {
  productId: string
  currentUser: CurrentUser
}

export function ProductActions({ productId, currentUser }: ProductActionsProps) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this product? This cannot be undone.')) {
      return
    }

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        // Refresh the page to show the updated list of products
        router.refresh()
      } else {
        const data = await response.json();
        alert(`Failed to delete product: ${data.error || 'Unknown error'}`)
      }
    } catch (error) {
      alert('An unexpected error occurred while deleting.')
    }
  }

  return (
    <div className="flex items-center gap-2">
      {/* The Edit button is available to both Admins and Editors */}
      <Button asChild variant="outline" size="sm">
        <Link href={`/admin/products/${productId}`}>Edit</Link>
      </Button>

      {/* The Delete button is only shown if the user is an ADMIN */}
      {currentUser?.role === 'ADMIN' && (
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
        >
          Delete
        </Button>
      )}
    </div>
  )
}