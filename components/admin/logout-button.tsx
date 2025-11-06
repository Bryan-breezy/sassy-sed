"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

export function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true)
    console.log(`Logout Button clicked. Sedning POST to /api/auth/logout...`)

    try {
      // Call the logout API endpoint
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
      })

      if (response.ok) {
        console.log('Logout: Succesfull')
        // If logout is successful, redirect the user to the login page
        router.push('/login')
        // Refresh the entire page to ensure all cached user data is cleared
        router.refresh()
      } else {
        // Handle cases where logout might fail (e.g., server is down)
        alert('Logout failed. Please try again.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('An unexpected error occurred during logout.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} disabled={isLoading} >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  )
}