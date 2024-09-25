'use client'
import agent from '@/api/axios'
import NavBar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import image from '@/assets/images/contactReseller.png'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Call from '@/assets/Icons/profile/Call'
import Mail from '@/assets/Icons/profile/Mail'
import BackIcon from '@/assets/Icons/billposting/accountpayable/BackIcon'
import { Button } from 'pq-ap-lib'

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
                router.push('/verify-token')
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
            <div className='w-full justify-start bg-[#F6F6F6] items-center py-5 flex xs:px-[30px] sm:px-[90px] md:px-[100px] lg:px-[138px] '>
                <span
                    className='cursor-pointer rounded-full bg-white p-1.5'
                    onClick={() => router.push('/products/addorganization')}
                    tabIndex={0}
                    onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && router.push('/products/addorganization')}
                >
                    <BackIcon />
                </span>
                <span className='pl-[13px] !text-[14px] !font-medium'>Back</span>
            </div>
            <div className='flex flex-col-reverse md:flex-row w-full px-4 md:px-[10%] bg-[#F6F6F6] gap-8 md:gap-16 min-h-[80vh] items-center justify-center'>
                <div
                    className={`h-auto w-[330px] p-5 rounded-lg border group shadow-lg`}
                >
                    <div className='flex flex-col'>
                        <div className='flex w-full flex-col justify-start items-center'>
                            <span className='text-[#333333] font-medium text-[18px]'>Enterprise Plan</span>
                            <span className='text-[#6E6D7A] pt-5 font-proxima font-normal text-[24px]'>Custom <br />$2200</span>
                        </div>
                        <div className='flex flex-col pt-[53px] gap-4 justify-start items-start'>
                            <div className='flex items-start'>
                                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.88 9.94L5.16 8.22C5.01333 8.07333 4.82667 8 4.6 8C4.37333 8 4.18667 8.07333 4.04 8.22C3.89333 8.36667 3.82 8.55333 3.82 8.78C3.82 9.00667 3.89333 9.19333 4.04 9.34L6.32 11.62C6.48 11.78 6.66667 11.86 6.88 11.86C7.09333 11.86 7.28 11.78 7.44 11.62L11.96 7.1C12.1067 6.95333 12.18 6.76667 12.18 6.54C12.18 6.31333 12.1067 6.12667 11.96 5.98C11.8133 5.83333 11.6267 5.76 11.4 5.76C11.1733 5.76 10.9867 5.83333 10.84 5.98L6.88 9.94ZM8 16.5C6.89333 16.5 5.85333 16.29 4.88 15.87C3.90667 15.45 3.06 14.88 2.34 14.16C1.62 13.44 1.05 12.5933 0.63 11.62C0.21 10.6467 0 9.60667 0 8.5C0 7.39333 0.21 6.35333 0.63 5.38C1.05 4.40667 1.62 3.56 2.34 2.84C3.06 2.12 3.90667 1.55 4.88 1.13C5.85333 0.71 6.89333 0.5 8 0.5C9.10667 0.5 10.1467 0.71 11.12 1.13C12.0933 1.55 12.94 2.12 13.66 2.84C14.38 3.56 14.95 4.40667 15.37 5.38C15.79 6.35333 16 7.39333 16 8.5C16 9.60667 15.79 10.6467 15.37 11.62C14.95 12.5933 14.38 13.44 13.66 14.16C12.94 14.88 12.0933 15.45 11.12 15.87C10.1467 16.29 9.10667 16.5 8 16.5Z" fill="#02B89D" />
                                </svg>
                                <span className='pl-3 text-[14px] text-[#333333]'>Up to 2000+ Bills/Invoices</span>
                            </div>
                            <div className='flex items-start'>
                                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.88 9.94L5.16 8.22C5.01333 8.07333 4.82667 8 4.6 8C4.37333 8 4.18667 8.07333 4.04 8.22C3.89333 8.36667 3.82 8.55333 3.82 8.78C3.82 9.00667 3.89333 9.19333 4.04 9.34L6.32 11.62C6.48 11.78 6.66667 11.86 6.88 11.86C7.09333 11.86 7.28 11.78 7.44 11.62L11.96 7.1C12.1067 6.95333 12.18 6.76667 12.18 6.54C12.18 6.31333 12.1067 6.12667 11.96 5.98C11.8133 5.83333 11.6267 5.76 11.4 5.76C11.1733 5.76 10.9867 5.83333 10.84 5.98L6.88 9.94ZM8 16.5C6.89333 16.5 5.85333 16.29 4.88 15.87C3.90667 15.45 3.06 14.88 2.34 14.16C1.62 13.44 1.05 12.5933 0.63 11.62C0.21 10.6467 0 9.60667 0 8.5C0 7.39333 0.21 6.35333 0.63 5.38C1.05 4.40667 1.62 3.56 2.34 2.84C3.06 2.12 3.90667 1.55 4.88 1.13C5.85333 0.71 6.89333 0.5 8 0.5C9.10667 0.5 10.1467 0.71 11.12 1.13C12.0933 1.55 12.94 2.12 13.66 2.84C14.38 3.56 14.95 4.40667 15.37 5.38C15.79 6.35333 16 7.39333 16 8.5C16 9.60667 15.79 10.6467 15.37 11.62C14.95 12.5933 14.38 13.44 13.66 14.16C12.94 14.88 12.0933 15.45 11.12 15.87C10.1467 16.29 9.10667 16.5 8 16.5Z" fill="#02B89D" />
                                </svg>
                                <span className='pl-3 text-[14px] text-[#333333]'>Email / Chat Support</span>
                            </div>
                            <div className='flex items-start'>
                                <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6.88 9.94L5.16 8.22C5.01333 8.07333 4.82667 8 4.6 8C4.37333 8 4.18667 8.07333 4.04 8.22C3.89333 8.36667 3.82 8.55333 3.82 8.78C3.82 9.00667 3.89333 9.19333 4.04 9.34L6.32 11.62C6.48 11.78 6.66667 11.86 6.88 11.86C7.09333 11.86 7.28 11.78 7.44 11.62L11.96 7.1C12.1067 6.95333 12.18 6.76667 12.18 6.54C12.18 6.31333 12.1067 6.12667 11.96 5.98C11.8133 5.83333 11.6267 5.76 11.4 5.76C11.1733 5.76 10.9867 5.83333 10.84 5.98L6.88 9.94ZM8 16.5C6.89333 16.5 5.85333 16.29 4.88 15.87C3.90667 15.45 3.06 14.88 2.34 14.16C1.62 13.44 1.05 12.5933 0.63 11.62C0.21 10.6467 0 9.60667 0 8.5C0 7.39333 0.21 6.35333 0.63 5.38C1.05 4.40667 1.62 3.56 2.34 2.84C3.06 2.12 3.90667 1.55 4.88 1.13C5.85333 0.71 6.89333 0.5 8 0.5C9.10667 0.5 10.1467 0.71 11.12 1.13C12.0933 1.55 12.94 2.12 13.66 2.84C14.38 3.56 14.95 4.40667 15.37 5.38C15.79 6.35333 16 7.39333 16 8.5C16 9.60667 15.79 10.6467 15.37 11.62C14.95 12.5933 14.38 13.44 13.66 14.16C12.94 14.88 12.0933 15.45 11.12 15.87C10.1467 16.29 9.10667 16.5 8 16.5Z" fill="#02B89D" />
                                </svg>
                                <span className='pl-3 text-[14px] text-[#333333]'>Premium Support</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex flex-col justify-center items-center pt-10'>
                        <Button
                            className={`btn-sm mx-1.5 my-3 !h-9 !w-[214px] uppercase rounded-full font-semibold tracking-wider`}
                            variant={`btn-outline-primary`}
                            onClick={() => router.push('/verify-token')}>
                            Get Started Now
                        </Button>
                    </div>
                    <span className='uppercase flex justify-center items-center font-bold underline text-[14px] text-[#02B89D] pt-6 pb-3'>See More</span>
                </div>
            </div>
        </>

    )
}
export default ContactReseller