"use client"
import React from 'react'
import { UserCircleIcon, ImageIcon, VideoIcon, LocateIcon, SmileIcon, Calendar1 } from 'lucide-react'
const PostForm = () => {
    return (
        <div className='border-b border-t border-[#8899] w-full'>
            <div className='w-full flex justify-between items-start gap-3 mt-5 mb-3'>
                <div className='flex-shrink-0 ml-1'>
                    <UserCircleIcon className='w-5 h-5 md:w-8 md:h-8 text-gray-500' />
                </div>

                <div className='flex-1'>
                    <textarea
                        className='w-full h-20 p-1 text-[12px] md:text-sm border-none outline-none resize-none bg-transparent'
                        placeholder='What property is available?'
                    ></textarea>

                    <div className='flex items-center justify-between mt-2 pt-3 border-t border-[#8899]'>
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
