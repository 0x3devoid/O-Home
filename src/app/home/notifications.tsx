'use client'
import React from 'react'

const NotificationBar = () => {
  return (
  <div className='h-full mobile-no-scrollbar md:border-l md:border-[#8899]'>
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
            <div className='p-4 space-y-4'>
                <h2 className='text-xl font-bold'>Notifications</h2>

                <p className=' text-sm'>
                    This is where you can see your notifications. You will receive updates about new messages, friend requests, and other important alerts.
                </p>

                {/* Add more content to demonstrate scrolling */}
                <div className='space-y-3'>
                    {Array.from({ length: 15 }, (_, i) => (
                        <div key={i} className='p-3 bg-gray-50 rounded-lg border-l-4 border-blue-500'>
                            <div className='font-medium text-sm text-gray-600'>New Message</div>
                            <div className='text-xs text-gray-600 mt-1'>
                                You have received a new message about Property #{i + 1}
                            </div>
                            <div className='text-xs text-gray-400 mt-2'>
                                {Math.floor(Math.random() * 60)} minutes ago
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NotificationBar
