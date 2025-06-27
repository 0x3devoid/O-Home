'use client'
import React from 'react'
import PostForm from '../components/postform'
import MiniNav from '../components/mininav'

const Home = () => {
    return (
        <div className='h-full mobile-no-scrollbar '>
            <style jsx>{`
                .mobile-no-scrollbar {
                    overflow-y: auto;
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none; /* Internet Explorer 10+ */
                }
                .mobile-no-scrollbar::-webkit-scrollbar {
                    display: none; /* Safari and Chrome */
                }
                @media (min-width: 768px) {
                    .mobile-no-scrollbar {
                        scrollbar-width: auto;
                        -ms-overflow-style: auto;
                    }
                    .mobile-no-scrollbar::-webkit-scrollbar {
                        display: block;
                    }
                }
            `}</style>

            <MiniNav />

            <PostForm />

            <div className='p-2 space-y-4'>






                <h1 className='text-sm font-bold'>
                    Welcome to the Home Page
                </h1>

                <p className=''>
                    O-Homes is your trusted platform for leasing, renting, and buying apartments—making the process easier, faster, and more reliable.
                </p>

                {/* Add more content to demonstrate scrolling */}
                <div className='space-y-6'>
                    {Array.from({ length: 20 }, (_, i) => (
                        <div key={i} className='p-2 border rounded-lg'>
                            <h3 className='font-semibold mb-2'>Property Listing {i + 1}</h3>
                            <p className=''>
                                Beautiful {Math.floor(Math.random() * 4) + 1}-bedroom apartment in prime location.
                                Features modern amenities, spacious living areas, and excellent connectivity.
                            </p>
                            <div className='mt-2 text-sm font-bold text-blue-600'>
                                ${(Math.floor(Math.random() * 2000) + 800).toLocaleString()}/month
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home
