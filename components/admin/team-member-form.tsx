"use client"

import { useState, FormEvent } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

type TeamMember = {
  id: string
  name: string
  image?: string
  createdAt?: Date
  UpdatedAt?: Date
}

interface TeamMemberFormProps {
  teamMember: TeamMember | null
}

export function TeamMemberForm({ teamMember }: TeamMemberFormProps) {
  const router = useRouter()
  const isEditMode = !!teamMember?.id

  const [isLoading, setLoading] = useState(false)
  const [error, setError ] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: teamMember?.name || "",
    image: teamMember?.image || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

  const payload = {
    name: formData.name,
    image: formData.image || null,
  }

    const endpoint = isEditMode ? `/api/team-members/${teamMember?.id}` : "/api/team-members"
    const method = isEditMode ? "PATCH" : "POST"

    try {
      const response = await fetch(endpoint, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (response.ok) {
        router.push("/admin/team")// Redirect to team list on success
        router.refresh()
      } else{
        const data = await response.json()
        setError(data.error || "An error occurred")
      }
    } catch (error) {
        setError("An unexpected error occurred")
    } finally{
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {isEditMode ? 'Edit Team Member' : 'New Team Member Details'}
        </CardTitle>
          {isEditMode && teamMember && (
            <CardDescription>
              'Update the details of <strong>{teamMember.name}</strong>.
            </CardDescription>
          )}
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter the team member's name"
              required
            />
          </div>
          <div>
            <Label htmlFor="image">Image URL</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="e.g., /uploads/member-photo.png (Optional)"
            />
          </div>

          {isEditMode &&teamMember && (
            <div className="space-y-4 pt-4 border-t">
              <div>
                <Label className="text-xs text-gray-500">Created at</Label>
                <p className="text-sm">{new Date(teamMember.createdAt || '').toLocaleDateString()}</p>
              </div>

              <div>
                <Label className="text-xs text-gray-500">Last updated</Label>
                <p className="text-sm">{new Date(teamMember.UpdatedAt || '').toLocaleDateString()}</p>
              </div>
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? 'Save Changes' : 'Create Member'}
            </Button>
            
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}