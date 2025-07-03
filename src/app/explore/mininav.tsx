import React, { useState } from 'react';

const tabs = ['All', 'Trending', 'For Rents', 'For Sell'];

const MiniNav = () => {
  const [activeTab, setActiveTab] = useState('All');

  const renderContent = () => {
    switch (activeTab) {
      case 'All':
        return <div className='text-center'>Showing all listings...</div>;
      case 'Trending':
        return <div className='text-center'>Trending properties now...</div>;
      case 'For Rents':
        return <div className='text-center'>Available rentals here...</div>;
      case 'For Sell':
        return <div className='text-center'>Properties for sale...</div>;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="flex justify-between items-center mt-5 border-b border-[#8899]">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`text-center font-bold cursor-pointer p-2 w-full hover:bg-[#8899] `}
          >
            <p className="md:text-[16px]">{tab}</p>
            {activeTab === tab && (
              <p className="md:text-[16px] border-b-4 w-[60px] border-blue-500 rounded-3xl m-auto"></p>
            )}
          </button>
        ))}
      </div>

      <div className="mt-4 p-2">
        {renderContent()}
      </div>
    </>
  );
};

export default MiniNav;
