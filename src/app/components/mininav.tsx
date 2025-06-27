import React from 'react'

const MiniNav = () => {
  return (
    <div className='flex justify-between items-center'>

        <div className='text-center font-bold  hover:bg-[#423F3E] cursor-pointer p-2 w-full'>
            <p className='md:text-[16px] '>For you</p>
            <p className='md:text-[16px] border-b-4 w-[60px] border-blue-500   rounded-3xl  m-auto'></p>
        </div>
        <div className='text-center hover:bg-[#423F3E] cursor-pointer p-2 w-full'>
            <p className='md:text-[16px]'>Following</p>
        </div>
        <div className='text-center hover:bg-[#423F3E] cursor-pointer p-2 w-full'>
            <p className='md:text-[16px]'>Properties</p>
        </div>
      
    </div>
  )
}

export default MiniNav
