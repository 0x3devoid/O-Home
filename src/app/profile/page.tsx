import React from 'react'
import Navbar from '../home/navbar'
import Profile from './profile'
import SearchBar from './search'


export const metadata = {
  title: "Profile | EdQorta",
};


const page = () => {
  return (
    <div className="flex h-screen control-bigger-screen">
            <div className="md:w-40 flex-shrink-0">
                <Navbar />
            </div>

            <div className="flex-1 min-w-0">
                <Profile />
            </div>

            <div className="hidden lg:block lg:w-80 flex-shrink-0">
                <SearchBar />
            </div>
        </div>

  )
}

export default page
