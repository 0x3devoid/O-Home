'use client'
import React from 'react'
import { Search, Settings } from 'lucide-react'
import MiniNav from './mininav'
import ReuseableComponents from '../utils/reuseableComponents'

const NotificationBar = () => {
  return (
    <div className='mt-14 lg:mt-4'>
      <ReuseableComponents path='Notifications' />
   

      <MiniNav/>

    </div>
  )
}

export default NotificationBar
