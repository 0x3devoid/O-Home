import React from 'react'
import Navbar from './navbar'
import NotificationBar from './notifications'
import Home from './home'

const page = () => {
  return (
    <div className="grid grid-cols-4 md:grid-cols-8 h-screen">
      {/* Navbar */}
      <div className="col-span-1 md:col-span-1">
        <Navbar />
      </div>

      {/* Home */}
      <div className="col-span-3 md:col-span-4 ">
        <Home />
      </div>

      {/* NotificationBar */}
      <div className="hidden md:block md:col-span-3 ">
        <NotificationBar />
      </div>
    </div>

  )
}

export default page
