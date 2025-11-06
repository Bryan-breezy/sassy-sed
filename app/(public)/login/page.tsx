import { redirect } from 'next/navigation'
import { getSession } from '@/lib/session'
import { LoginForm } from '@/components/admin/login-form'

export default async function LoginPage() {
  const session = await getSession()

  if (session.user) {
    redirect('/admin')
  }
  return <LoginForm />
}