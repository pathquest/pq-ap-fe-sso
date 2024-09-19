'use server'

import ProductList from './__components/ProductList'
import { redirect, useRouter } from 'next/navigation'
import { auth } from '@/auth'
import { apUrl, getUserProfile } from '@/api/server/common'

export default async function ProductsPage() {
  const session = await auth()
  const userProfile: any = await getUserProfile()
  const isMapped = userProfile.products.some((product: any) => product.is_mapped)
  const token = session?.user?.access_token

  if(isMapped) {
    return redirect(`${apUrl}/verify-token?token=${token}&isFirstConfig=false`)
  }


  if (!session) {
    return redirect(`${apUrl}/verify-token?token=${token}&isFirstConfig=false`)
  }

  return <ProductList session={session}/>
}
