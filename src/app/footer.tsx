import React from 'react'

const footer = () => {
    return (
        <div className='mt-[50px] mb-5 text-center text-gray-500 text-sm'>

            <div className='mb-3 flex justify-center gap-3'>

                <p className='cursor-pointer hover:underline'>About</p> |
                <p className='cursor-pointer hover:underline'>Privacy</p> |
                <p className='cursor-pointer hover:underline'>Security</p> |
                <p className='cursor-pointer hover:underline'>Status</p> |
                <p className='cursor-pointer hover:underline'>Terms</p> 

            </div>

            <p>© 2025 EdQorta. Sypher3Labs Inc.</p>

            

        </div>
    )
}

export default footer
