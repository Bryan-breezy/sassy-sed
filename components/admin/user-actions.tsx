"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import type { UserActionsProps } from '@/types'

export function UserActions({ userId, currentUser }: UserActionsProps) {
  const router = useRouter()
  
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const endpoint = `/ap/admin/users/${userId}`

      console.log(`Attempting to delete ${endpoint}`)
      
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.refresh(); // Refresh the user list on success
      } else {
        const data = await response.json();
        alert(`Failed to delete user: ${data.error || 'Server error'}`);
      }
    } catch (error) {
      alert('An unexpected error occurred while deleting.');
      console.error("Delete user error:", error);
    } finally {
      setIsDeleting(false);
      setIsConfirmingDelete(false); // Close the modal
    }
  };
  
  // An admin should not be able to delete their own account
  const isSelf = currentUser?.id === userId;

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {/* --- The Edit button remains the same --- */}
        {currentUser?.role === 'ADMIN' &&
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/users/${userId}`}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Role
            </Link>
          </Button>
        }

        {/* --- The Delete button now just opens our modal --- */}
        {currentUser?.role === 'ADMIN' && !isSelf && (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setIsConfirmingDelete(true)} // <-- Set state to true to show modal
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        )}
      </div>

      {/* --- OUR CUSTOM CONFIRMATION MODAL --- */}
      {/* It only renders when `isConfirmingDelete` is true */}
      {isConfirmingDelete && (
        <div 
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center"
          aria-modal="true"
          role="dialog"
        >
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md m-4">
            <h2 className="text-lg font-semibold text-gray-900">Are you absolutely sure?</h2>
            <p className="mt-2 text-sm text-gray-600">
              This action cannot be undone. This will permanently delete this user's account.
            </p>
            <div className="mt-6 flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setIsConfirmingDelete(false)} // <-- Close the modal
                disabled={isDeleting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete} // <-- Call the actual delete function
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Continue'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}