'use server'

import ProductList from './__components/ProductList'
import { redirect, useSearchParams } from 'next/navigation'
import { auth } from '@/auth'
import { apUrl, biUrl, getUserProfile } from '@/api/server/common'
import { encryptToken } from '@/utils/auth'

export default async function ProductsPage({ searchParams }: { searchParams: { [key: string]: string } }) {
  const session: any = await auth()
  const userProfile: any = await getUserProfile()
  const isMapped = userProfile.products.some((product: any) => product.is_mapped)
  const isBI = userProfile.products.some((product: any) => product.is_default && product.is_active && product.id === 1)
  const isAP = userProfile.products.some((product: any) => product.is_default && product.is_active && product.id === 2)
  const token = session?.user?.access_token
  const refreshToken = encodeURIComponent(session?.user?.refresh_token)
  const products = searchParams.products ?? ''

  const BIMapped = () => {
    const objToken = { "token": `Bearer ${token}` }
    const encodedToken = encryptToken(encryptToken(JSON.stringify(objToken)))
    return redirect(`${biUrl}/manage-company?auth=${encodeURIComponent(encodedToken)}`)
  }

  const APMapped = () => {
    const encodedToken = encryptToken(encryptToken(token))
    return redirect(`${apUrl}/verify-token?token=${encodeURIComponent(encodedToken)}&refreshToken=${refreshToken}&isFirstConfig=false`)
  }

  if (products) {
    if (isBI && products === 'BI') {
      if (isMapped) {
       return BIMapped()
      }
    }

    if (isAP && products === 'AP') {
      if (isMapped) {
        return APMapped()
      }
    }
  } else {
    if (isBI) {
      if (isMapped) {
        return BIMapped()
      }
    }

    if (isAP) {
      if (isMapped) {
       return APMapped()
      }
    }
  }

  if (!session) {
    return redirect(`/signin`)
  }

  return <ProductList session={session} />
}
