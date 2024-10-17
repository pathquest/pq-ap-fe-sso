'use server'

import ProductList from './__components/ProductList'
import { redirect } from 'next/navigation'
import { auth } from '@/auth'
import { apUrl, getUserProfile } from '@/api/server/common'
import { encryptToken } from '@/utils/auth'

export default async function ProductsPage() {
  const session:any = await auth()
  const userProfile: any = await getUserProfile()
  const isMapped = userProfile.products.some((product: any) => product.is_mapped)
  const isBI = userProfile.products.some((product: any) => product.is_default && product.is_active && product.id === 1)
  const isAP = userProfile.products.some((product: any) => product.is_default && product.is_active && product.id === 2)
  const token = session?.user?.access_token
  const refreshToken = encodeURIComponent(session?.user?.refresh_token)

  if(isBI) {
    if(isMapped) {
      const objToken = { "token": `Bearer ${token}` }
      const encodedToken = encryptToken(encryptToken(JSON.stringify(objToken)))
      return redirect(`https://stagingbi.pacificabs.com/manage-company?auth=${encodeURIComponent(encodedToken)}`)
    }
  }

  if(isAP) {
    if(isMapped) {
      const encodedToken = encryptToken(encryptToken(token))
      return redirect(`${apUrl}/verify-token?token=${encodeURIComponent(encodedToken)}&refreshToken=${refreshToken}&isFirstConfig=false`)
    }
  }

  if (!session) {
    return redirect(`/signin`)
  }

  return <ProductList session={session}/>
}
