"use client"
import React from 'react'
import { Search, MoreHorizontal } from 'lucide-react'
import Image from 'next/image'

const SearchBar = () => {
    return (
        <div className='pl-2 h-full mobile-no-scrollbar md:border-l md:border-[#8899]'>

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

            <div className='border border-[#8899] rounded-3xl p-2 px-2'>
                <div className='flex items-center justify-center'>
                    <Search className='w-6 h-6 text-gray-500 mr-2' />
                    <input
                        type='text'
                        placeholder='Search...'
                        className='w-full bg-[transparent] rounded-lg focus:outline-none outline-none'
                    />
                </div>
            </div>


            <div className='border border-[#8899] rounded-2xl p-3 mt-5'>
                <h2 className='font-extrabold text-sm md:text-[20px]'>You might like</h2>

                <div className='mt-5 flex flex-col gap-3'>
                    <div className='flex items-center justify-between mt-2'>
                        <div className='flex items-center gap-2'>
                            <Image src={"/images/cat_nft.jpg"} className='rounded-full' width={50} height={50} alt='.' />
                            <div className='flex flex-col'>
                                <span className='md:text-sm font-semibold'>JayGayli</span>
                                <span className='text-xs text-gray-500'>@Jay_Oniel</span>
                            </div>
                        </div>
                        <button className='text-xs text-[#000] rounded-full p-1 px-4 bg-[#fff] border cursor-pointer font-bold'>Follow</button>
                    </div>

                    <div className='flex items-center justify-between mt-2'>
                        <div className='flex items-center gap-2'>
                            <Image src={"/images/grilie.jpg"} className='rounded-full' width={50} height={50} alt='.' />

                            <div className='flex flex-col'>
                                <span className='text-sm font-semibold'>Clasical</span>
                                <span className='text-xs text-gray-500'>@ClasicAhy</span>
                            </div>
                        </div>
                        <button className='text-xs text-[#000] rounded-full p-1 px-4 bg-[#fff] border cursor-pointer font-bold'>Follow</button>
                    </div>

                    <div className='flex items-center justify-between mt-2'>
                        <div className='flex items-center gap-2'>
                            <Image src={"/images/monkey.jpg"} className='rounded-full' width={50} height={50} alt='.' />

                            <div className='flex flex-col'>
                                <span className='text-sm font-semibold'>Atunde</span>
                                <span className='text-xs text-gray-500'>@Atunde_xl</span>
                            </div>
                        </div>
                        <button className='text-xs text-[#000] rounded-full p-1 px-4 bg-[#fff] border cursor-pointer font-bold'>Follow</button>
                    </div>
                </div>


                <div className='flex items-start justify-start mt-10'>
                    <button className='text-xs text-[#1DA1F2] cursor-pointer font-bold'>Show more</button>
                </div>

            </div>




            <div className='border border-[#8899] rounded-2xl p-3 mt-5'>
                <h2 className='font-extrabold text-sm md:text-[20px]'>Trending Properties</h2>


                <div className='mt-5 flex flex-col gap-2'>

                    <div className='mt-2'>
                        <div className='flex items-center justify-between'>
                            <span className='text-xs text-gray-500'>Duplex . Trending</span>

                            <div className='flex items-center gap-2'>
                                <MoreHorizontal className='w-5 h-5 text-gray-500' />
                            </div>
                        </div>


                        <div>
                            <h2 className='font-extrabold text-sm'>Lekki Duplex for 40m</h2>
                        </div>


                    </div>


                    <div className='mt-2'>
                        <div className='flex items-center justify-between'>
                            <span className='text-xs text-gray-500'>Bungalow . Trending</span>

                            <div className='flex items-center gap-2'>
                                <MoreHorizontal className='w-5 h-5 text-gray-500' />
                            </div>
                        </div>


                        <div>
                            <h2 className='font-extrabold text-sm'>Two room self con</h2>
                        </div>


                    </div>


                    <div className='mt-2'>
                        <div className='flex items-center justify-between'>
                            <span className='text-xs text-gray-500'>Hectars of Land . Trending</span>

                            <div className='flex items-center gap-2'>
                                <MoreHorizontal className='w-5 h-5 text-gray-500' />
                            </div>
                        </div>


                        <div>
                            <h2 className='font-extrabold text-sm'>10Hectars of lands</h2>
                        </div>


                    </div>

                </div>

                   <div className='flex items-start justify-start mt-7'>
                    <button className='text-xs text-[#1DA1F2] cursor-pointer font-bold'>Show more</button>
                </div>

            </div>

        </div>
    )
}

export default SearchBar