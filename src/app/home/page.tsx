import React from 'react'
import Navbar from './navbar'
import NotificationBar from './notifications'
import Home from './home'

const page = () => {
  return (
    <div className="flex h-screen">
            {/* Navbar - Fixed width on mobile, responsive on desktop */}
            <div className="w-16 md:w-64 flex-shrink-0">
                <Navbar />
            </div>

            {/* Home - Takes remaining space */}
            <div className="flex-1 min-w-0">
                <Home />
            </div>

            {/* NotificationBar - Hidden on mobile, fixed width on desktop */}
            <div className="hidden md:block md:w-80 flex-shrink-0">
                <NotificationBar />
            </div>
        </div>

  )
}

export default page
