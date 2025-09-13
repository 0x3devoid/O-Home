"use client"
import React, { useState, useRef } from 'react'
import { BookmarkIcon, DotIcon, MessageCircle, HeartIcon, BarChart2, MoreHorizontal, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const Posts = () => {
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
        <div className='border-b border-[#31313199] w-full pr-3'>
            <div className='w-full flex justify-between items-start gap-3 mt-5 mb-3'>
                <Link href='/profile'>
                    <div className='flex-shrink-0 ml-3'>
                        <Image src={"/images/cat_nft.jpg"} className='rounded-full' width={40} height={40} alt='.' />
                    </div>
                </Link>

                <div className='flex-1'>
                    {/* post header */}
                    <div className='w-full flex items-start justify-between'>
                        <Link href='/profile'>
                            <div className='flex items-start justify-start gap-1 mb-2'>
                                <h3 className='font-extrabold text-sm md:text-lg'>Devoid</h3>
                                <h3 className='text-[#8899] text-sm md:text-lg'>@Dev_Bot</h3>
                                <h3 className='text-[#8899] flex text-sm md:text-lg'>
                                    <DotIcon className='w-5 h-5' /> 4h
                                </h3>
                            </div>
                        </Link>

                        <div className='cursor-pointer text-[#8899] rounded-full hover:bg-[#dd6794] hover:text-[#68213c] p-2 mt-[-7px] transition-colors duration-100'>
                            <MoreHorizontal className='w-4 h-4 md:w-6 md:h-6' />
                        </div>
                    </div>

                    {/* post body */}
                    <Link href='/0x3devoid/post/25378899253'>
                        <div className='mt-2'>
                            <p>🏡 FOR SALE: Luxury Home in the Heart of Lekki, Lagos!</p>
                            <p>Experience upscale living in one of Lagos' most sought-after neighborhoods!</p>
                            <p>📍 Location: Lekki, Lagos</p>
                            <p>💰 Price: Competitive and negotiable</p>
                            <p>📞 Contact: ....</p>
                            <p>📆 Schedule a tour today and make this dream home yours!</p>
                        </div>
                    </Link>

                    {/* fake media box */}
                    <div className='flex justify-center items-center m-auto w-full md:w-[500px] h-[150px] md:h-[300px] rounded-2xl border-[0.1px] border-[#31313199] mt-5'></div>

                    {/* actions */}
                    <div className='flex items-center justify-between mt-2 space-x-2 w-full md:w-[500px] m-auto'>
                        <button onClick={toggleComment} className='text-[#8899] hover:text-[#76ff93] p-1 flex'>
                            <MessageCircle className='w-3 h-5 mr-1 lg:w-5 lg:h-5' />
                            <span className='text-[8px] md:text-[12px] mt-[5px]'>526</span>
                        </button>
                        <button className='text-[#8899] hover:text-[#dd6794] p-1 flex'>
                            <HeartIcon className='w-3 h-5 mr-1 lg:w-5 lg:h-5' />
                            <span className='text-[8px] md:text-[12px] mt-[5px]'>200</span>
                        </button>
                        <button className='text-[#8899] hover:text-[#926de9] p-1 flex'>
                            <BarChart2 className='w-3 h-7 mr-1 lg:w-5 lg:h-8' />
                            <span className='text-[8px] md:text-[12px] mt-[10px]'>1.1k</span>
                        </button>
                        <button className='text-[#8899] hover:text-[#258339] p-1 flex'>
                            <BookmarkIcon className='w-3 h-3 mr-1 lg:w-5 lg:h-5' />
                        </button>
                    </div>
                </div>
            </div>

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

export default Posts
