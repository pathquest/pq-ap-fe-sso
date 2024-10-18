'use client'

import { handleTokenSave } from '@/actions/server/auth'
import agent, { invalidateSessionCache } from '@/api/axios'
import { apUrl } from '@/api/server/common'
import { encryptToken } from '@/utils/auth'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader, Toast } from 'pq-ap-lib'
import { useEffect, useState } from 'react'

const QuickbookAuthSuccess = ({ session }: any) => {
  // const user = session ? session?.user : {}
  const router = useRouter()
  // const { update } = useSession()
  // const token = session?.user?.access_token
  // const refreshToken = encodeURIComponent(session?.user?.refresh_token)
  const [loader, setLoader] = useState(true)

  const searchParams = useSearchParams()
  const accessToken = searchParams.get('code')

  useEffect(() => {
    const sendToken = async () => {
      if (accessToken !== '') {
        try {
          const response = await agent.APIs.qboLogin(`/qbo-signin?qbocode=${accessToken}`)

          if (response.ResponseStatus === 'Success') {
            setLoader(false)
            const data = response.Message
            const ResponseData = response.ResponseData

            await handleTokenSave({
              email: ResponseData.Username,
              access_token: ResponseData.Token,
              expires_at: ResponseData.TokenExpiry,
              refresh_token: ResponseData.RefreshToken
            })

            invalidateSessionCache();
            hasProduct(ResponseData.Token, ResponseData.RefreshToken)

            Toast.success('Success', 'You are successfully logged in.')


          } else {
            setLoader(false)
            const data = response.Message
            if (data === 'invalid request!') {
              Toast.error(data || 'Failed please try again later.', 'please try after sometime.')
              router.push('/signin')
            } else {
              const data = response.Message
              if (data === null) {
                Toast.error('Error', 'Failed please try again later.')
              } else {
                Toast.error('Error', data)
              }
              router.push('/signin')
            }
          }
        } catch (error) {
          setLoader(false)
          console.error(error)
        }
      }
    }
    if (accessToken !== '') {
      sendToken()
    }
  }, [accessToken])

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
      {loader && (
        <div className='flex min-h-screen flex-col items-center justify-center gap-2'>
          <Loader helperText />
        </div>
      )}
    </div>
  )
}

export default QuickbookAuthSuccess
