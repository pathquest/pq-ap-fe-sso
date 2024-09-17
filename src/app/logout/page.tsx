'use client'

import { handleSignOut } from "@/actions/server/auth"
import { useEffect } from "react"


export default function SignInPage() {
  useEffect(() => {
    const logOutActions = async () => {
      await handleSignOut()
    }
    logOutActions()
  }, [])

  return <></>
}
