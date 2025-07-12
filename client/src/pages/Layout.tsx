import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { assets } from '../assets/assets'
import { Menu, X } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { SignIn, useUser } from '@clerk/clerk-react';

const Layout = () => {
  const navigate = useNavigate();
  const [sideBar, setSideBar] = useState(false);
  const {user} = useUser();
  return user ? (
    <div className='flex flex-col items-start justify-start h-screen'>
     <nav className='w-full px-8 min-h-14 flex items-center justify-between border-b border-gray-200'>
       <img src={assets.logo} alt="alt" onClick={() => navigate('/')} className='cursor-pointer w-32 sm:w-44'/>
       {
        sideBar ? <X onClick={() => setSideBar(false)} className='size-6 sm:hidden text-gray-600' />
         : <Menu onClick={() => setSideBar(true)} className='size-6 sm:hidden text-gray-600'/>
       }
     </nav>
     <div className='flex-1 w-full flex h-[calc(100vh-64px)]'>
       <Sidebar sideBar={sideBar} setSideBar={setSideBar}/>
       <div className='flex-1 bg-[#F4F7FB]'>
        <Outlet/>
       </div>
     </div>
    </div>
  ) : <div className='flex h-screen items-center justify-center'>
    <SignIn/>
  </div>
}

export default Layout
