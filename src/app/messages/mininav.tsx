import React from 'react'

const MiniNav = () => {
  return (
   <>
   
    <div className='flex justify-between items-center mt-5 border-b border-[#8899] '>

        <button className='text-center font-bold  hover:bg-[#8899] cursor-pointer p-2 w-full'>
            <p className='md:text-[16px] '>All</p>
            <p className='md:text-[16px] border-b-4 w-[60px] border-blue-500   rounded-3xl  m-auto'></p>
        </button>
        
        <button className='text-center hover:bg-[#8899] cursor-pointer p-2 w-full'>
            <p className='md:text-[16px]'>Tags</p>
        </button>
    
      
    </div>


   </>
  )
}

export default MiniNav
