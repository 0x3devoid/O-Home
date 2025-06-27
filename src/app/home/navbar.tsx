import React from 'react'
import Image from 'next/image'
import { Home, Search, MessageSquare, User, Settings, Bell } from 'lucide-react'
const Navbar = () => {
    return (
        <div className='h-full overflow-y-auto border-r md:border-[#808080]'>
            <div className='w-[38px] md:w-full flex flex-col md:justify-end md:items-end gap-6 p-2 md:p-4'>
                <div className='cursor-pointer'>
                           <div className='flex justify-center'>
                                <Image src="/images/logo.png" alt="." width={35} height={35} />
                            </div>
                </div>

                <div className='cursor-pointer'>
                    <Home className='w-6 h-6' />
                </div>

                <div className='cursor-pointer'>
                    <Search className='w-6 h-6' />
                </div>

                <div className='cursor-pointer'>
                    <Bell className='w-6 h-6' />
                </div>

                <div className='cursor-pointer'>
                    <MessageSquare className='w-6 h-6' />
                </div> 
                
                <div className='cursor-pointer'>
                    <User className='w-6 h-6' />
                </div> 
                
                <div className='cursor-pointer'>
                    <Settings className='w-6 h-6' />
                </div>
            </div>
        </div>
    )
}

export default Navbar
