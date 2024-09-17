'use server'

import { auth } from '@/auth'
import AuthSuccess from './__components/auth-success'
import { redirect, useRouter } from 'next/navigation'
import { apUrl } from '@/api/server/common'

export default async function AuthSuccessPage() {
  const session = await auth()
  const token = session?.user?.access_token

  if (session) {
    return redirect(`${apUrl}/verify-token?token=${token}`)
  }

  return <AuthSuccess session={session} />
}
