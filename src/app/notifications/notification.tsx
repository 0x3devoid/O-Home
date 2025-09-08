'use client'
import React from 'react'
import { Search, Settings } from 'lucide-react'
import MiniNav from './mininav'


const NotificationBar = () => {
  return (
    <div className='mt-14 lg:mt-4'>
      <div className='flex p-2 gap-5 md:gap-10'>
         <h2 className='font-extrabold text-xl'>Notifications</h2>
      </div>

      <MiniNav/>

    </div>
  )
}

export default NotificationBar
