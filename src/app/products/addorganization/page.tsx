'use client'
import agent from '@/api/axios'
import { apUrl } from '@/api/server/common'
import BackIcon from '@/assets/Icons/billposting/accountpayable/BackIcon'
import NavBar from '@/components/Navbar'
import { IndustryTypeData } from '@/data/reseller'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Button,
  Loader,
  Radio,
  Select,
  Text,
  Toast,
} from 'pq-ap-lib'
import React, { useEffect, useState } from 'react'
interface ProfileData {
  id: number
  products: Product[]
}

interface Product {
  [x: string]: unknown
  name: string
}
const AddOrganization: React.FC = () => {
  const router = useRouter()
  const { data: session } = useSession()
  const token = session?.user?.access_token
  useEffect(() => {
    setClicked(true)
    userConfig()
  }, [])

  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [productData, setProductData] = useState([])
  const [clicked, setClicked] = useState<boolean>(false)
  const [optionError, setOptionError] = useState<boolean>(false)
  const [optionId, setOptionId] = useState<number>(0)
  const [orgTypeId, setOrgTypeId] = useState<number>(2)
  const [orgIndustryList, setOrgIndustryList] = useState([])
  const [orgName, setOrgName] = useState<string>('')
  const [orgNameErr, setOrgNameErr] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const getProductData = async () => {
    setClicked(true)
    try {
      const response = await agent.APIs.getProducts()
      if (response.ResponseStatus === 'Success') {
        const data = response.ResponseData
        setProductData(data)
        setClicked(false)
      }
    } catch (error) {
      setClicked(false)
      console.error(error)
    }
  }

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
        router.push(`${apUrl}/verify-token?token=${token}`)
      }
    } else {
      setClicked(false)
    }
  }, [profileData])

  const handleOrgDropDown = async () => {
    try {
      const response = await agent.APIs.getIndustryTypes()

      if (response.ResponseStatus === 'Success') {
        let responseData = await response.ResponseData
        if (!responseData) {
          responseData = null
        } else {
          setOrgIndustryList(response.ResponseData)
        }
      }
    } catch (error: any) {
      console.error(error)
    }
  }

  const handleSaveOrg = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    orgName.trim().length <= 0 && setOrgNameErr(true)
    optionId <= 0 && setOptionError(true)
    if (orgName.length > 0 && optionId > 0) {
      setIsLoading(true)
      try {
        const response = await agent.APIs.organizationSave({
          id: 0,
          name: orgName,
          productId: orgTypeId,
          industryType: optionId,
          parentOrgId: null,
        })

        if (response.ResponseStatus === 'Success') {
          setIsLoading(false)
          router.push(`${apUrl}/verify-token?token=${token}&isFirstConfig=true`)
        } else {
          setIsLoading(false)
          const data = response.Message
          if (data === null) {
            Toast.error('Please try again later.')
          } else {
            Toast.error(data)
          }
        }
      } catch (error) {
        setIsLoading(false)
        console.error(error)
      }
    }
  }

  const globalData = (data: any) => {
    setProfileData(data)
  }

  useEffect(() => {
    getProductData()
    handleOrgDropDown()
  }, [])

  return (
    <>
      {clicked ? (
        <span className='flex min-h-screen items-center justify-center'>
          <Loader helperText />
        </span>
      ) : (
        <>
          <NavBar onData={globalData} />
          <div className='w-auto justify-start items-center py-6 flex xs:mx-[30px] sm:mx-[90px] md:mx-[100px] lg:mx-[138px] '>
            <span
              className='cursor-pointer rounded-full bg-white p-1.5'
              onClick={() => router.push('/products')}
              tabIndex={0}
              onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && router.push('/products')}
            >
              <BackIcon />
            </span>
            <span className='pl-[13px] !text-[14px] !font-medium'>Back to product selection</span>
          </div>

          <div className='flex w-full min-h-[80vh] flex-col items-center justify-start pt-[3%]'>
            <div className='w-[356px] items-center justify-center'>
              <span className=' pb-[15px] flex items-start text-[16px] font-bold text-[#333333] sm:mx-auto'>
                Organization Details
              </span>

              <form
                className='flex w-full flex-col items-center justify-start py-2 text-start'
                onSubmit={handleSaveOrg}
              >
                <div className='w-full pb-5'>

                  <Text
                    key={orgTypeId}
                    validate
                    label='Organization Name'
                    maxChar={100}
                    placeholder='Please Enter Organization Name'
                    name='text'
                    getValue={(e: any) => setOrgName(e)}
                    hasError={orgNameErr}
                    getError={(e: any) => { }}
                    value={orgName}
                  />
                </div>
                <div className='w-full overflow-visible pb-5'>
                  <Select
                    className='!overflow-visible'
                    id='basic'
                    type='icons'
                    options={orgIndustryList}
                    validate
                    label='Industry type'
                    search
                    defaultValue={optionId}
                    getValue={(value: any) => setOptionId(value)}
                    hasError={optionError}
                    getError={(e: any) => { }}
                  />
                </div>

                {isLoading ? (
                  <Loader size='sm' />
                ) : (
                  <Button type='submit' variant='btn-primary' className='mt-[20px] !w-[350px] rounded-full !font-semibold'>
                    Save
                  </Button>
                )}
              </form>
            </div>
          </div>
        </>
      )}
    </>
  )
}
export default AddOrganization