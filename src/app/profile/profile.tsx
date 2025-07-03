'use client'
import React from 'react'
import { ArrowBigLeft, ArrowLeft, Search } from 'lucide-react'
import Image from 'next/image'
import MiniNav from './mininav'
const Profile = () => {
    return (
        <div className='h-full mobile-no-scrollbar md:border-r border-[#8899] md:mr-2'>
     

            <div className='flex justify-between items-center px-2'>
                <div className='flex items-center gap-10'>
                    <div className='cursor-pointer'>
                        <ArrowLeft className='w-5 h-5 text-white font-extrabold cursor-pointer' />
                    </div>

                    <div className='flex flex-col items-center gap-2'>
                        <h1 className='text-white font-extrabold text-lg'>DEVOID</h1>
                        <span className='text-gray-500 text-[10px]'>
                            3,849 posts
                        </span>
                    </div>
                </div>


                <div className='mr-0 md:mr-2 '>
                    <Search className='w-5 h-5 text-white font-extrabold cursor-pointer' />
                </div>

            </div>

            <div className='flex justify-center items-center m-auto w-full h-[150px] md:h-[250px] border border-[#8899] bg-[#8899]'>

            </div>


            <div className='px-2 flex justify-between'>

                <div className='mt-[-50px] z-10'>
                    <Image src={"/images/cat_nft.jpg"} className='rounded-full' width={100} height={100} alt='.' />
                </div>


                <button className='mt-5 text-xs text-[#000] rounded-full p-1 px-4 bg-[#fff] border cursor-pointer font-bold'>Follow</button>

            </div>

            <div className='flex flex-col items-start mt-2 p-2 gap-1'>

                <h2 className='text-[22px] font-extrabold'>0x3Devoid</h2>
                <span className='text-xs text-gray-500'>@Devoid</span>
                <span className='text-xs'>Joined 2025</span>
                <span className='text-xs '>Location: Lagos, Nigeria</span>

                <div className='flex items-center gap-2 mt-2'>
                    <span className='text-xs text-gray-500'><span className='text-white font-extrabold'>2,740</span> Followers</span>
                    <span className='text-xs text-gray-500'> <span className='text-white font-extrabold'>540</span> Following</span>
                </div>

            </div>

<MiniNav/>


        </div>
    )
}

export default Profile