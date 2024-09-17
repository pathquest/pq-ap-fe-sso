'use client'

import React from 'react'
import WrapperManage from '@/components/Common/WrapperManage'

type pageProps = {
  children: React.ReactNode
}

function layout({ children }: pageProps) {

  return (
    <WrapperManage>
      <div className='w-[100%]'>
        {children}
      </div>
    </WrapperManage>
  )
}

export default layout
