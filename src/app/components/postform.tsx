"use client"
import React from 'react'
import {  ImageIcon, VideoIcon, LocateIcon, SmileIcon, Calendar1 } from 'lucide-react'
import Image from 'next/image';


const PostForm = () => {
    return (
        <div className=' border-b border-[#31313199] w-full pr-3'>
            <div className='w-full flex justify-between items-start gap-3 mt-5 mb-3'>
                <div className='flex-shrink-0 ml-3'>
                                      <Image src={"/images/cat_nft.jpg"} className='rounded-full' width={50} height={50} alt='.' />
                  
                </div>

                <div className='flex-1'>
                    <textarea
                        className='w-full h-20 p-1 text-[12px] md:text-sm border-none outline-none resize-none bg-transparent'
                        placeholder='What property is available?'
                    ></textarea>

                    <div className='flex items-center justify-between mt-2 pt-3 border-t-[0.1px] border-[#31313199]'>
                        <div className='flex items-center space-x-2 '>
                            <button className='text-blue-500 '><ImageIcon className='w-5 h-5' /></button>
                            <button className='text-blue-500 '><VideoIcon className='w-5 h-5' /></button>
                            <button className='text-blue-500 '><LocateIcon className='w-5 h-5' /></button>
                            <button className='text-blue-500 '><SmileIcon className='w-5 h-5' /></button>
                            <button className='text-blue-500 '><Calendar1 className='w-5 h-5' /></button>
                        </div>
                        <button className='px-4 py-2  bg-[#8899] rounded-3xl text-[12px] md:text-sm text-[#000] font-extrabold'>Post</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostForm
