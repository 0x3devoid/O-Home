import React from 'react'
import Image from 'next/image'
import { Home, Search, MessageSquare, User, Settings, Bell } from 'lucide-react'
const Navbar = () => {
    return (
        <div className='h-full overflow-y-auto border-r border-[#808080]'>
            <div className='w-[38px] md:w-full flex flex-col justify-center items-center md:justify-end md:items-end gap-2 md:gap-4 p-2 md:p-4'>
                <div className='cursor-pointer mb-3'>
                           <div className='flex justify-center'>
                                <Image src="/images/logo.png" alt="." width={35} height={35} />
                            </div>
                </div>

                <div className='cursor-pointer rounded-full hover:rounded-full hover:bg-[#999999] p-2 transition-colors duration-100'>
                    <Home className='w-4 h-4 md:w-6 md:h-6' />
                </div>

                <div className='cursor-pointer  rounded-full hover:rounded-full hover:bg-[#999999] p-2 transition-colors duration-100'>
                    <Search className='w-4 h-4 md:w-6 md:h-6' />
                </div>

                <div className='cursor-pointer rounded-full hover:rounded-full hover:bg-[#999999] p-2 transition-colors duration-100'>
                    <Bell className='w-4 h-4 md:w-6 md:h-6' />
                </div>

                <div className='cursor-pointer rounded-full hover:rounded-full hover:bg-[#999999] p-2 transition-colors duration-100'>
                    <MessageSquare className='w-4 h-4 md:w-6 md:h-6' />
                </div> 
                
                <div className='cursor-pointer rounded-full hover:rounded-full hover:bg-[#999999] p-2 transition-colors duration-100'>
                    <User className='w-4 h-4 md:w-6 md:h-6' />
                </div> 
                
                <div className='cursor-pointer rounded-full hover:rounded-full hover:bg-[#999999] p-2 transition-colors duration-100'>
                    <Settings className='w-4 h-4 md:w-6 md:h-6' />
                </div>
            </div>
        </div>
    )
}

export default Navbar
