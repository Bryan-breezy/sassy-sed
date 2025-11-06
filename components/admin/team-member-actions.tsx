"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Edit, Trash2 } from 'lucide-react'
// The AlertDialog components for the delete confirmation
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type CurrentUser = {
  id: string;
  name: string;
  role: string;
} | null | undefined; // Can be null or undefined if not logged in

interface TeamMemberActionsProps {
  memberId: string;
  currentUser: CurrentUser;
}

export function TeamMemberActions({ memberId, currentUser }: TeamMemberActionsProps) {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/team-members/${memberId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Refresh the page to show the updated list
        router.refresh(); 
      } else {
        const data = await response.json();
        alert(`Failed to delete member: ${data.error || 'Unknown error'}`);
      }
    } catch (error) {
      alert('An unexpected error occurred while deleting.');
    }
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {/* Edit button is available to Admins and Editors */}
      { (currentUser?.role === 'ADMIN' || currentUser?.role === 'EDITOR') &&
        <Button asChild variant="outline" size="sm">
          <Link href={`/admin/team/${memberId}`}>Edit</Link>
        </Button>
      }

      {/* Delete button is only shown if the user is an ADMIN */}
      {currentUser?.role === 'ADMIN' && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the team member's profile.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
}