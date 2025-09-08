import React, { useState } from 'react'

const tabs = ['Posts', 'Likes', 'Highlights', 'Follows']

const MiniNav = () => {
    const [activeTab, setActiveTab] = useState('Posts');

    const renderContent = () => {
        switch (activeTab) {
            case 'Posts':
                return <div> <h1 className='md:text-[20px] font-extrabold text-center'>@DEVOID HAS'NT POSTED</h1></div>

            case 'Likes':
                return <div> <h1 className='md:text-[20px] font-extrabold text-center'>@DEVOID HAS'NT LIKED ANY POST</h1></div>
            case 'Highlights':
                return <div> <h1 className='md:text-[20px] font-extrabold text-center'>NO HIGHLIGHTS</h1></div>
            case 'Follows':
                return <div> <h1 className='md:text-[20px] font-extrabold text-center'>NO FOLLOWERS</h1></div>
            default:
                return null;

        }
    }
    return (
        <>

            <div className='flex justify-between items-center mt-5 border-b border-[#8899] '>

                {tabs.map((tab) => {
                    return <>
                        <button onClick={(() => setActiveTab(tab))} key={tab} className='text-center font-bold  hover:bg-[#8899] cursor-pointer p-1 w-full'>
                            <p className='md:text-[16px] '> {tab}</p>
                            {activeTab === tab && <p className='md:text-[16px] border-b-4 w-[60px] border-blue-500   rounded-3xl  m-auto'></p>}

                        </button>
                    </>
                })}


            </div>


            <div className='flex justify-center items-center mt-10 px-2'>
                {renderContent()}
            </div>
        </>
    )
}

export default MiniNav
