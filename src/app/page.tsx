'use server'
import { redirect } from 'next/navigation'

const Home = async () => {

  return redirect('/signin')
  
}

export default Home
