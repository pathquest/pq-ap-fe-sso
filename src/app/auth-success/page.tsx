'use server'

import { auth } from '@/auth'
import AuthSuccess from './__components/auth-success'
import { redirect, useRouter } from 'next/navigation'
import { apUrl } from '@/api/server/common'
import { encryptToken } from '@/utils/auth'

export default async function AuthSuccessPage() {
  const session = await auth()
  const token = session?.user?.access_token
  const refreshToken = session?.user?.refresh_token

  if (session) {
    const encodedToken = encryptToken(encryptToken(token))
    return redirect(`${apUrl}/verify-token?token=${encodeURIComponent(encodedToken)}&refreshToken=${refreshToken}`)
  }

  return <AuthSuccess session={session} />
}
