'use server'

import { auth } from '@/auth'
import QuickbookAuthSuccess from './__components/quickbook-auth-success'
import { redirect, useRouter } from 'next/navigation'
import { apUrl } from '@/api/server/common'
import { encryptToken } from '@/utils/auth'

export default async function QuickbookAuthSuccessPage() {
  const session:any = await auth()
  const token = session?.user?.access_token
  const refreshToken = encodeURIComponent(session?.user?.refresh_token)

  if (session) {
    const encodedToken = encryptToken(encryptToken(token))
    return redirect(`${apUrl}/verify-token?token=${encodeURIComponent(encodedToken)}&refreshToken=${refreshToken}`)
  }

  return <QuickbookAuthSuccess session={session} />
}
