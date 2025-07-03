import React from 'react'
import Navbar from './navbar'
import NotificationBar from './notifications'
import Home from './home'


export const metadata = {
  title: "Home | H",
};


const page = () => {
  return (
    <div className="flex h-screen control-bigger-screen">
            {/* Navbar - Fixed width on mobile, responsive on desktop */}
            <div className="w-10 md:w-40 flex-shrink-0">
                <Navbar />
            </div>

            {/* Home - Takes remaining space */}
            <div className="flex-1 min-w-0">
                <Home />
            </div>

            {/* NotificationBar - Hidden on mobile, fixed width on desktop */}
            <div className="hidden lg:block lg:w-80 flex-shrink-0">
                <NotificationBar />
            </div>
        </div>

  )
}

export default page
