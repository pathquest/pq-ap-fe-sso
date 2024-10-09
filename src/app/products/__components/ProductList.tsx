'use client'
import agent from '@/api/axios'
import { apUrl } from '@/api/server/common'
import APIcon from '@/assets/Icons/Product Icons/APIcon'
import BiIcon from '@/assets/Icons/Product Icons/BIIcon'
import NavBar from '@/components/Navbar'
import { useRouter } from 'next/navigation'
import { Button, Loader, Typography } from 'pq-ap-lib'
import React, { useEffect, useState } from 'react'

interface ProfileData {
  id: number
  products: Product[]
}

interface Product {
  [x: string]: unknown
  name: string
}
const ProductList = ({ session }: any) => {
  const router = useRouter()
  const token = session?.user?.access_token
  const refreshToken = session?.user?.refresh_token

  useEffect(() => {
    setClicked(true)
    userConfig()
  }, [])

  const [selectedProduct, setSelectedProduct] = useState<string | null>(null)
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [productData, setProductData] = useState([])
  const [clicked, setClicked] = useState<boolean>(false)

  const getProductData = async () => {
    setClicked(true)
    try {
      const response = await agent.APIs.getProducts()
      if (response.ResponseStatus === 'Success') {
        const data = response.ResponseData
        const result = data.filter((item: any) => item.name == "PathQuest AP");
        setProductData(result)
        // setProductData(data.sort((a: any, b: any) => {
        //   if (a.id < b.id) return 1;
        //   if (a.id > b.id) return -1;
        //   return 0;
        // }))
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
        router.push(`${apUrl}/verify-token?token=${token}&refreshToken=${refreshToken}`)
      }
    } else {
      setClicked(false)
    }
  }, [profileData])

  const productItems = productData.map((product: any) => {
    return (
      <div
        className={`h-[262px] px-[60px] w-auto rounded-lg border ${selectedProduct === product.name ? 'border-primary shadow-lg' : 'border-lightSilver'
          } group hover:border-primary hover:shadow-lg`}
        key={Math.random()}
      >
        <div className='flex flex-col h-[65px] w-auto justify-center items-center mt-14'>
          <div>
            {/* {product.name === 'PathQuest BI' && <BiIcon bgColor={'#F4F4F4'} />} */}
            {product.name === 'PathQuest AP' && <APIcon bgColor={'#F4F4F4'} />}
          </div>
          <div className='pt-5'>
            <Typography className='inline-block text-center font-medium text-[18px]'>
              {product.name === 'PathQuest BI' ? 'Business Intelligence' : 'Accounts Payable'}
            </Typography>
          </div>
        </div>
        <div className='flex flex-col justify-center items-center pt-10'>
          <Button
            className={`btn-sm mx-1.5 my-3 !h-9 !w-[214px] uppercase rounded-full font-semibold tracking-wider`}
            variant={`btn-outline-primary`}
            onClick={() => handleRadioChange(product.name, product.id)}>
            Subscribe Now
          </Button>
        </div>
      </div>
    )
  })

  const handleRadioChange = async (productName: string, productId: string) => {
    setSelectedProduct(productName)
    productName === 'PathQuest AP' && router.push('/products/addorganization')
  }

  const globalData = (data: any) => {
    setProfileData(data)
  }

  useEffect(() => {
    getProductData()
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
          <div className='w-auto py-6  xs:mx-[30px] sm:mx-[90px] md:mx-[100px] lg:mx-[138px] '>
            <Typography type='h4' className='text-[24px] font-bold'>Unleash the Power of Our Top Products - Your Ultimate Solutions!</Typography>
            <div className='pt-2 xs:w-full sm:w-[80%] md:w-[63%] lg:w-[63%]'>
              <Typography type='label' className='inline-block text-[16px]'>
                PathQuest simplifies accounting and financial reporting, delivers insights and forecasts, and provides real-time
                spend insights while automating accounts payable invoices and avoiding cash flow crises and manual inefficiencies.
              </Typography>
            </div>
          </div>

          <div className='grid w-auto gap-4 xs:mx-[30px] xs:mb-[30px] sm:mx-[90px] sm:grid-cols-2 md:mx-[100px] md:grid-cols-2 lg:mx-[138px] lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4'>
            {productItems}
          </div>
        </>
      )}
    </>
  )
}
export default ProductList