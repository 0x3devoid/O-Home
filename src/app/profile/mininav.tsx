import React from 'react'

const MiniNav = () => {
  return (
   <>
   
    <div className='flex justify-between items-center mt-5 border-b border-[#8899] '>

        <button className='text-center font-bold  hover:bg-[#423F3E] cursor-pointer p-2 w-full'>
            <p className='md:text-[16px] '>Posts</p>
            <p className='md:text-[16px] border-b-4 w-[60px] border-blue-500   rounded-3xl  m-auto'></p>
        </button>
        
        <button className='text-center hover:bg-[#423F3E] cursor-pointer p-2 w-full'>
            <p className='md:text-[16px]'>Likes</p>
        </button>
        <button className='text-center hover:bg-[#423F3E] cursor-pointer p-2 w-full'>
            <p className='md:text-[16px]'>Highlights</p>
        </button>

          <button className='text-center hover:bg-[#423F3E] cursor-pointer p-2 w-full'>
            <p className='md:text-[16px]'>Follows</p>
        </button>
      
    </div>


    <div className='flex justify-center items-center mt-10 px-2'>
        <h1 className='md:text-[30px] font-extrabold text-center'>@DEVOID HAS'NT POSTED</h1>
    </div>
   </>
  )
}

export default MiniNav
