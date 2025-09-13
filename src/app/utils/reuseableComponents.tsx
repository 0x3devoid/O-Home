import React from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type CompoPath = {
  path: string
}

const ReuseableComponents: React.FC<CompoPath> = ({ path }) => {
  return (
    <div className='flex items-center gap-[50px] p-2'>
      <Link href='/home'>
        <ArrowLeft className='w-5 h-5 cursor-pointer' />
      </Link>
      <p className='text-lg font-bold'>{path}</p>
    </div>
  )
}

export default ReuseableComponents

