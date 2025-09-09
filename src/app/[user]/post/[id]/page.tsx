import React from 'react'
import Navbar from '../../../home/navbar'
import Post from './post'
import SearchBar from '@/app/profile/search'


export const metadata = {
  title: "Posts | EdQorta",
};


const page = () => {
  return (
    <div className="flex h-screen control-bigger-screen">
            {/* Navbar - Fixed width on mobile, responsive on desktop */}
            <div className="md:w-40 ">
                <Navbar />
            </div>

            {/* Home - Takes remaining space */}
            <div className="flex-1 min-w-0">
                <Post />
            </div>

            {/* NotificationBar - Hidden on mobile, fixed width on desktop */}
            <div className="hidden lg:block lg:w-80 flex-shrink-0">
                <SearchBar />
            </div>
        </div>

  )
}

export default page
