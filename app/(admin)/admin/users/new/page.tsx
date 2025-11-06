import { UserForm } from "@/components/admin/user-form"

export default function NewUserPage() {

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Create New User</h1>
        <p className="text-gray-600">Create a new account for an Admin or Editor.</p>
      </div>

      <UserForm user={null} />
    </div>
  );
}