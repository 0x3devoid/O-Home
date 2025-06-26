import React from 'react'
import Image from 'next/image'
import { HomeIcon, SearchIcon, MessageSquareIcon, UserIcon, SettingsIcon, BellIcon } from 'lucide-react'

const Navbar = () => {
    return (
        <div className='flex flex-col md:justify-end md:items-end gap-6 p-4'>

            <div className='cursor-pointer'>
                <Image src="/images/logo.png" alt="Logo" width={30} height={30} />
            </div>

            <div className='cursor-pointer' >
                <HomeIcon className='w-6 h-6' />
            </div>

            <div className='cursor-pointer' >
                <SearchIcon className='w-6 h-6' />
            </div>

            <div className='cursor-pointer' >
                <BellIcon className='w-6 h-6' />
            </div>

            <div className='cursor-pointer' >
                <MessageSquareIcon className='w-6 h-6' />
            </div> 
            <div className='cursor-pointer' >
                <UserIcon className='w-6 h-6' />
            </div> 
            <div className='cursor-pointer' >
                <SettingsIcon className='w-6 h-6' />
            </div>

        </div>
    )
}

export default Navbar
