'use client'
import React, { useState } from 'react'
import PostForm from '../components/postform'
import Posts from '../components/posts'

const tabs = ['For you', 'Following', 'Properties',];


const Home = () => {
    const [activeTab, setActiveTab] = useState('For you');
    const renderContent = () => {
        switch (activeTab) {
            case 'For you':
                return <div className='space-y-6'>
                    {Array.from({ length: 20 }, (_, i) => (
                        <Posts />
                    ))}
                </div>;
            case 'Following':
                return <div className='text-center'>Trending properties now...</div>;
            case 'Properties':
                return <div className='text-center'>Available rentals here...</div>;
          
            default:
                return null;
        }
    };

    return (
        <div className='h-full mobile-no-scrollbar'>


            <div className="flex justify-between items-center mt-10 lg:mt-2 border-b-[0.1px] border-[#31313199]">
                {tabs.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`text-center font-bold cursor-pointer p-1 w-full hover:bg-[#53535399] `}
                    >
                        <p className="md:text-[16px]">{tab}</p>
                        {activeTab === tab && (
                            <p className="md:text-[16px] border-b-4 w-[60px] border-blue-500 rounded-3xl m-auto"></p>
                        )}
                    </button>
                ))}
            </div>

            <PostForm />

            <div className='space-y-4'>
                {renderContent()}
            </div>
        </div>
    )
}

export default Home
