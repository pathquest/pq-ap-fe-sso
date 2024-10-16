'use client'
import agent from '@/api/axios'
import NavBar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import image from '@/assets/images/contactReseller.png'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Call from '@/assets/Icons/profile/Call'
import Mail from '@/assets/Icons/profile/Mail'
import { useSession } from 'next-auth/react'
import { apUrl } from '@/api/server/common'

interface ProfileData {
    id: number
    products: Product[]
}

interface Product {
    [x: string]: unknown
    name: string
}
const ContactReseller: React.FC = () => {
    const router = useRouter()
    const { data: session }:any = useSession()
    const token = session?.user?.access_token
    const refreshToken = encodeURIComponent(session?.user?.refresh_token)

    useEffect(() => {
        setClicked(true)
        userConfig()
    }, [])

    const [profileData, setProfileData] = useState<ProfileData | null>(null)
    const [clicked, setClicked] = useState<boolean>(false)

    // user config check
    const userConfig = async () => {
        try {
            const response = await agent.APIs.getUserConfig()
            if (response.ResponseStatus === 'Success') {
                localStorage.setItem('UserId', response.ResponseData.UserId)
                localStorage.setItem('OrgId', response.ResponseData.OrganizationId)
                localStorage.setItem('IsAdmin', response.ResponseData.IsAdmin)
                localStorage.setItem('IsOrgAdmin', response.ResponseData.IsOrganizationAdmin)
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (profileData) {
            const isMapped = profileData.products.some((product) => product.is_mapped)

            if (isMapped) {
                setClicked(false)
                router.push(`${apUrl}/verify-token?token=${token}&refreshToken=${refreshToken}`)
            }
        } else {
            setClicked(false)
        }
    }, [profileData])

    const globalData = (data: any) => {
        setProfileData(data)
    }

    return (
        <>
            <NavBar onData={globalData} />
            <div className='flex flex-col-reverse md:flex-row w-full px-4 md:px-[10%] bg-[#F6F6F6] gap-8 md:gap-16 min-h-[80vh] items-center justify-center' onClick={() => router.push('/subscription/reseller')}>
                <div className='w-full md:w-auto'><Image src={image} alt='Abc' width={600} /></div>
                <div className='flex flex-col w-full md:w-auto text-center md:text-left'>
                    <span className='text-[22px] text-[#02B89D] font-bold'>Thank you for adding details</span>
                    <span className='text-[28px] md:text-[34px] text-black font-medium pt-[15px]'>Our sales representative
                        will contact you shortly</span>
                    <span className='text-[16px] font-medium pt-[15px]'>You have to choose a custom made plan to register your business</span>
                    <div className='flex flex-col md:flex-row gap-4 md:gap-8 pt-[15px]'>
                        <div className='flex justify-center items-center'>
                            <Call />
                            <span className='pl-2 text-[20px] text-black font-medium'>+91 7990572305</span>
                        </div>
                        <div className='flex justify-center items-center'>
                            <Mail />
                            <span className='pl-2 text-[20px] text-[#02B89D] font-medium'>support@pathquest.com</span>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}
export default ContactReseller