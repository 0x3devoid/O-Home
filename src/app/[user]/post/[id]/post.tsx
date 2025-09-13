"use client"
import React, { useState, useRef } from 'react'
import { BookmarkIcon, DotIcon, MessageCircle, HeartIcon, BarChart2, X } from 'lucide-react'
import Image from 'next/image'
import Comments from './comments'
import ReuseableComponents from '@/app/utils/reuseableComponents'

const post = () => {
    const [isCommentOpen, setIsCommentOpen] = useState(false)
    const overlayRef = useRef<HTMLDivElement>(null)

    const toggleComment = () => setIsCommentOpen(!isCommentOpen)
    const closeComment = () => setIsCommentOpen(false)

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === overlayRef.current) {
            closeComment()
        }
    }


    return (
        <div className='mt-[50px] lg:mt-0 h-full mobile-no-scrollbar'>
            <ReuseableComponents path='Post' />
            <div className='border-b border-[#31313199] w-full pr-3 p-2'>
                <div className='w-full'>
                    <div className='flex justify-between items-start gap-3 mt-5 mb-3'>
                        <div className=''>
                            <Image src={"/images/cat_nft.jpg"} className='rounded-full' width={40} height={40} alt='.' />
                        </div>

                        <div className='w-full flex items-start justify-between'>

                            <div className=' gap-1 mb-2'>
                                <h3 className='font-extrabold text-sm md:text-lg'>Devoid</h3>
                                <h3 className='text-[#8899] text-[12px] md:text-lg'>@Dev_Bot</h3>
                            </div>

                        </div>
                    </div>


                    <div className='mt-5'>

                        <p>🏡 FOR SALE: Luxury Home in the Heart of Lekki, Lagos!</p>
                        <p>


                            Experience upscale living in one of Lagos' most sought-after neighborhoods! This stunning 4-bedroom fully detached duplex is the perfect blend of elegance, comfort, and security.

                        </p>
                        <p>
                            Located in a serene, gated estate

                        </p>
                        <p>
                            📍 Location: Lekki, Lagos

                        </p>
                        <p>
                            💰 Price: Competitive and negotiable

                        </p><p>
                            📞 Contact: ....

                        </p><p>
                            📆 Schedule a tour today and make this dream home yours!

                        </p>
                    </div>
                    <div className='flex justify-center items-center m-auto w-full md:w-[500px] h-[150px] md:h-[300px] rounded-2xl border-[0.1px] border-[#31313199] mt-5'>

                    </div>

                    <div className='flex justify-start items-start mt-5 gap-1'>
                        <span className='text-[10px] lg:text-xs text-gray-500'>20:18 . </span>
                        <span className='text-[10px] lg:text-xs text-gray-500'>07/09/2025 . </span>
                        <span className='text-[10px] lg:text-xs text-gray-500'> <span className='text-white'>500K</span> Views</span>
                    </div>

                    <div className='flex items-center justify-between mt-2 space-x-2 w-full md:w-[500px] m-auto'>
                        <button onClick={toggleComment} className='text-[#8899] cursor-pointer rounded-full hover:rounded-full  hover:text-[#76ff93] p-1 transition-colors duration-100 flex'><MessageCircle className='w-3 h-5 mr-1 lg:w-5 lg:h-5' /> <span className='text-[8px] md:text-[12px] mt-[5px]'>526</span> </button>
                        <button className='text-[#8899] cursor-pointer rounded-full hover:rounded-full  hover:text-[#dd6794] p-1 transition-colors duration-100 flex'><HeartIcon className='w-3 h-5 mr-1 lg:w-5 lg:h-5' /><span className='text-[8px] md:text-[12px] mt-[5px]'>200</span></button>
                        <button className='text-[#8899] cursor-pointer rounded-full hover:rounded-full  hover:text-[#926de9] p-1 transition-colors duration-100 flex'><BarChart2 className='w-3 h-7 mr-1 lg:w-5 lg:h-8' /><span className='text-[8px] md:text-[12px] mt-[10px]'>1.1k</span></button>
                        <button className='text-[#8899] cursor-pointer rounded-full hover:rounded-full  hover:text-[#258339] p-1 transition-colors duration-100 flex'><BookmarkIcon className='w-3 h-3 mr-1 lg:w-5 lg:h-5' /></button>
                    </div>
                </div>
            </div>


            <Comments />



            {/* comment modal */}
            {isCommentOpen && (
                <div
                    ref={overlayRef}
                    className="fixed inset-0 bg-black bg-opacity-60 z-70 flex items-center justify-center md:items-start md:mt-[50px] mt-[50px]"
                    onClick={handleOverlayClick}
                >
                    <div
                        className="
                        font-sans
                        bg-[#000] border border-[#31313199] z-80
                        w-full h-full rounded-none   
                        md:w-[50%] md:max-h-[80vh] md:rounded-2xl 
                        shadow-lg p-4 relative overflow-y-auto
                        "
                    >
                        <button
                            onClick={closeComment}
                            className="absolute top-3 right-3 text-[#8899] hover:text-white"
                        >
                            <X className="w-6 h-6" />
                        </button>


                        <div>
                            {/* POST REPLYING */}
                            <div className='mt-10'>
                                <div className='w-full flex items-start gap-5'>

                                    <div className='flex-shrink-0'>
                                        <Image src={"/images/cat_nft.jpg"} className='rounded-full' width={40} height={40} alt='.' />
                                    </div>


                                    <div>
                                        <div className='flex items-start justify-start gap-1 mb-2'>
                                            <h3 className='font-extrabold text-sm md:text-lg'>Devoid</h3>
                                            <h3 className='text-[#8899] text-sm md:text-lg'>@Dev_Bot</h3>
                                            <h3 className='text-[#8899] flex text-sm md:text-lg'>
                                                <DotIcon className='w-5 h-5' /> 4h
                                            </h3>
                                        </div>

                                        <div className='mt-2 font-sans'>
                                            <p>🏡 FOR SALE: Luxury Home in the Heart of Lekki, Lagos!</p>
                                            <p>Experience upscale living in one of Lagos' most sought-after neighborhoods!</p>
                                            <p>📍 Location: Lekki, Lagos</p>
                                            <p>💰 Price: Competitive and negotiable</p>
                                            <p>📞 Contact: ....</p>
                                            <p>📆 Schedule a tour today and make this dream home yours!</p>
                                        </div>
                                    </div>

                                </div>

                            </div>
                            {/* COMMENT */}
                            <div className='flex justify-start items-start gap-3 mt-10'>
                                <div className='flex-shrink-0'>
                                    <Image src={"/images/monkey.jpg"} className='rounded-full' width={40} height={40} alt='.' />
                                </div>

                                <div className='flex-1'>
                                    <textarea
                                        className='w-full bg-transparent border-b border-[#31313199] focus:border-[#83495f] focus:outline-none resize-none text-sm min-h-[120px] max-h-[180px] pb-2'
                                        placeholder="Post your reply"
                                    ></textarea>
                                </div>

                            </div>


                        </div>

                        <button className='bg-[#83495f] text-sm hover:bg-[#68213c] text-white px-5 py-1 rounded-full mt-4 float-right transition-colors duration-100'>
                            Reply 
                        </button>


                    </div>
                </div>

            )}

        </div>
    )
}

export default post
