"use client"
import React from 'react'
import Image from 'next/image'
import { Home, Search, MessageSquare, User, Settings, Bell } from 'lucide-react'
const Navbar = () => {
    return (
        <div className='h-full mobile-no-scrollbar border-r border-[#8899]'>
               <style jsx>{`
                .mobile-no-scrollbar {
                    overflow-y: auto;
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none; /* Internet Explorer 10+ */
                }
                .mobile-no-scrollbar::-webkit-scrollbar {
                    display: none; /* Safari and Chrome */
                }
                @media (min-width: 768px) {
                    .mobile-no-scrollbar {
                        scrollbar-width: auto;
                        -ms-overflow-style: auto;
                    }
                    .mobile-no-scrollbar::-webkit-scrollbar {
                        display: block;
                    }
                }
            `}</style>

            <div className='w-[38px] md:w-full flex flex-col justify-center items-center md:justify-end md:items-end gap-2 md:gap-4 p-2 md:p-4'>
                <a href='/home' className='cursor-pointer mb-3'>
                           <div className='flex justify-center'>
                                <Image src="/images/logo.png" alt="." width={35} height={35} />
                            </div>
                </a>

                <a href='/home' className='cursor-pointer rounded-full hover:rounded-full hover:bg-[#8899] p-2 transition-colors duration-100'>
                    <Home className='w-4 h-4 md:w-6 md:h-6' />
                </a>

                <a href='/explore' className='cursor-pointer  rounded-full hover:rounded-full hover:bg-[#8899] p-2 transition-colors duration-100'>
                    <Search className='w-4 h-4 md:w-6 md:h-6' />
                </a>

                <a href='/notifications' className='cursor-pointer rounded-full hover:rounded-full hover:bg-[#8899] p-2 transition-colors duration-100'>
                    <Bell className='w-4 h-4 md:w-6 md:h-6' />
                </a>

                <a href='/message' className='cursor-pointer rounded-full hover:rounded-full hover:bg-[#8899] p-2 transition-colors duration-100'>
                    <MessageSquare className='w-4 h-4 md:w-6 md:h-6' />
                </a> 
                
                <a href='/profile' className='cursor-pointer rounded-full hover:rounded-full hover:bg-[#8899] p-2 transition-colors duration-100'>
                    <User className='w-4 h-4 md:w-6 md:h-6' />
                </a> 
                
                <a href='/settings' className='cursor-pointer rounded-full hover:rounded-full hover:bg-[#8899] p-2 transition-colors duration-100'>
                    <Settings className='w-4 h-4 md:w-6 md:h-6' />
                </a>

                
            </div>
        </div>
    )
}

export default Navbar
