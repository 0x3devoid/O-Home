import React from 'react'
import Image from 'next/image'

const Comment = () => {
  return (
    <div>
      <h2 className='text-xl font-bold mb-4'>Post your reply</h2>
      <div className='flex gap-3'>
        <Image
          src="/images/cat_nft.jpg"
          alt="user"
          width={40}
          height={40}
          className="rounded-full"
        />
        <textarea
          placeholder="Write a comment..."
          className="w-full bg-transparent border-b border-gray-600 focus:outline-none resize-none text-white p-2"
          rows={3}
        />
      </div>
      <div className='flex justify-end mt-3'>
        <button className='bg-[#1d9bf0] hover:bg-[#1a8cd8] text-white font-bold py-2 px-4 rounded-full'>
          Reply
        </button>
      </div>
    </div>
  )
}

export default Comment
