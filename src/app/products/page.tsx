'use server'

import ProductList from './__components/ProductList'
import { redirect, useRouter } from 'next/navigation'
import { auth } from '@/auth'
import { apUrl, getUserProfile } from '@/api/server/common'

export default async function ProductsPage() {
  const session:any = await auth()
  const userProfile: any = await getUserProfile()
  const isMapped = userProfile.products.some((product: any) => product.is_mapped)
  const token = session?.user?.access_token
  const refreshToken = encodeURIComponent(session?.user?.refresh_token)

  if(isMapped) {
    return redirect(`${apUrl}/verify-token?token=${token}&refreshToken=${refreshToken}&isFirstConfig=false`)
  }


  if (!session) {
    return redirect(`${apUrl}/verify-token?token=${token}&refreshToken=${refreshToken}&isFirstConfig=false`)
  }

  return <ProductList session={session}/>
}
