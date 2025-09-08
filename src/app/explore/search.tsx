'use client'
import React from 'react'
import { Search, Settings } from 'lucide-react'
import MiniNav from './mininav'


const SearchTab = () => {
  return (
    <div className='mt-14 lg:mt-4'>
      <div className='flex p-2 gap-5 md:gap-10'>
          <div className='border border-[#8899] rounded-3xl p-2 px-2 flex-1'>
                <div className='flex items-center justify-center'>
                    <Search className='w-4 h-4 text-gray-500 mr-2' />
                    <input
                        type='text'
                        placeholder='Search...'
                        className='w-full bg-[transparent] rounded-lg focus:outline-none outline-none'
                    />
                </div>

            </div>
                <Settings className='w-6 h-6 text-white mr-2 flex-shrink-0 mt-2 cursor-pointer'  />
      </div>

      <MiniNav/>

    </div>
  )
}

export default SearchTab
