'use client'

import { handleTokenSave } from '@/actions/server/auth'
import agent, { invalidateSessionCache } from '@/api/axios'
import { apUrl } from '@/api/server/common'
import { handleLoginError } from '@/utils'
import { encryptToken } from '@/utils/auth'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader, Toast } from 'pq-ap-lib'
import { useEffect, useState } from 'react'

const AuthSuccess = ({ session }: any) => {
  // const user = session ? session?.user : {}
  const router = useRouter()
  // const { update } = useSession()

  const [loader, setLoader] = useState(true)

  let accessToken: string | null = ''
  let token: string | null = ''
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const params = new URLSearchParams(hash);
    accessToken = params.get('access_token');
    token = params.get('id_token');
  }
  // const searchParams = useSearchParams()
  // const accessToken = searchParams.get('access_token')!
  // const token = searchParams.get('id_token')!

  useEffect(() => {
    const sendToken = async () => {
      if (accessToken === '' || token === '') return

      try {
        const response = await agent.APIs.socialLogin({
          SocialLoginType: 1,
          AccessToken: accessToken ?? '',
          Token: token ?? '',
        })

        setLoader(false)
        const dataMessage = response.Message

        if (response.ResponseStatus === 'Success') {
          Toast.success('Success', dataMessage || 'You are successfully logged in.')

          const ResponseData = response.ResponseData

          await handleTokenSave({
            email: ResponseData.Username,
            access_token: ResponseData.Token,
            expires_at: ResponseData.TokenExpiry,
            refresh_token: ResponseData.RefreshToken
          })

          invalidateSessionCache();
          hasProduct(ResponseData.Token, ResponseData.RefreshToken)
        } else {
          handleLoginError(dataMessage)
          router.push('/signin')
        }
      } catch (error) {
        setLoader(false)
        console.error(error)
      }
    }
    sendToken()
  }, [accessToken, token])

  const hasProduct = async (token: any, refreshToken: any) => {
    const response = await agent.APIs.getUserProfile()

    if (response?.ResponseStatus === 'Success') {
      const isMapped = response?.ResponseData.products.some((product: any) => product.is_mapped)

      if (isMapped) {
        const encodedToken = encryptToken(encryptToken(token))
        router.push(`${apUrl}/verify-token?token=${encodeURIComponent(encodedToken)}&refreshToken=${refreshToken}`)
      } else {
        router.push(`/products`)
      }
    }
  }

  return (
    <div className='flex min-h-screen flex-col items-center justify-center pt-5'>
      <Toast position='top_right' />
      {loader && <Loader helperText />}
    </div>
  )
}

export default AuthSuccess
