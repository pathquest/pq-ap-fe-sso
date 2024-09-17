'use server'

import { auth } from '@/auth'
import QuickbookAuthSuccess from './__components/quickbook-auth-success'
import { redirect, useRouter } from 'next/navigation'
import { apUrl } from '@/api/server/common'

export default async function QuickbookAuthSuccessPage() {
  const session = await auth()
  const token = session?.user?.access_token

  if (session) {
    return redirect(`${apUrl}/verify-token?token=${token}`)
  }

  return <QuickbookAuthSuccess session={session} />
}
