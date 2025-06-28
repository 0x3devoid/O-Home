'use client'
import React from 'react'
import PostForm from '../components/postform'
import MiniNav from '../components/mininav'
import Posts from '../components/posts'
const Home = () => {
    return (
        <div className='h-full mobile-no-scrollbar '>
            <style jsx>{`
                        .mobile-no-scrollbar {
                            overflow-y: auto;
                            scrollbar-width: none; /* Firefox (mobile) */
                            -ms-overflow-style: none; /* IE10+ (mobile) */
                        }

                        .mobile-no-scrollbar::-webkit-scrollbar {
                            display: none; /* Chrome/Safari (mobile) */
                        }

                        @media (min-width: 768px) {
                            .mobile-no-scrollbar {
                            scrollbar-width: thin; /* Firefox (desktop) */
                            scrollbar-color: gray transparent; /* thumb, track */
                            -ms-overflow-style: auto;
                            }

                            .mobile-no-scrollbar::-webkit-scrollbar {
                            width: 8px;
                            }

                            .mobile-no-scrollbar::-webkit-scrollbar-track {
                            background: transparent;
                            }

                            .mobile-no-scrollbar::-webkit-scrollbar-thumb {
                            background-color: gray;
                            border-radius: 4px;
                            }
                        }
            `}</style>


            <MiniNav />

            <PostForm />

            <div className='space-y-4'>

                {/* Add more content to demonstrate scrolling */}
                <div className='space-y-6'>
                    {Array.from({ length: 20 }, (_, i) => (
                        <Posts />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Home
