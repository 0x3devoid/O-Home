import React from 'react'
import { UserCircleIcon, BookmarkIcon, DotIcon, MessageCircle, HeartIcon, BarChart2, MoreHorizontal } from 'lucide-react'


const Posts = () => {
    return (
        <div className='border-b border-[#808080] w-full'>
            <div className='w-full flex justify-between items-start gap-3 mt-5 mb-3'>
                <div className='flex-shrink-0 ml-3'>
                    <UserCircleIcon className='w-5 h-5 md:w-8 md:h-8 text-gray-500' />
                </div>

                <div className='flex-1'>
                    <div className='w-full flex items-start justify-between'>

                        <div className='flex items-start justify-start gap-1 mb-2'>
                            <h3 className='font-extrabold text-sm md:text-lg'>Devoid</h3>
                            <h3 className='text-[#808080] text-sm md:text-lg'>@Dev_Bot</h3>
                            <h3 className='text-[#808080] flex text-sm md:text-lg'> <DotIcon className='w-5 h-5' /> 4h</h3>
                        </div>



                        <div className='cursor-pointer text-[#808080] rounded-full hover:rounded-full hover:bg-[#dd6794] hover:text-[#68213c] p-2 mt-[-7px] transition-colors duration-100'>
                            <MoreHorizontal className='w-4 h-4 md:w-6 md:h-6' />
                        </div>

                    </div>

                    <div className='mt-2'>

                        <p>🏡 FOR SALE: Luxury Home in the Heart of Lekki, Lagos!</p>
                        <p>


                            Experience upscale living in one of Lagos' most sought-after neighborhoods! This stunning 4-bedroom fully detached duplex is the perfect blend of elegance, comfort, and security.



                        </p>


                        <p>✨ Features Include:</p>

                        <ul className="feature-list">
                            <li>Spacious en-suite bedrooms</li>
                            <li>Modern fitted kitchen with pantry</li>
                            <li>Family lounge + BQ</li>
                            <li>Ample parking space</li>
                            <li>24/7 security & treated water</li>
                        </ul>

                        <style jsx>{`
  .feature-list {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin-top: .7rem;
  }
  .feature-list li {
    margin-bottom: 0.65rem;
    line-height: 1.6;
    font-size: 10px;
  }
`}</style>







                        <p>
                            Located in a serene, gated estate

                        </p>
                        <p>
                            📍 Location: Lekki, Lagos

                        </p>
                        <p>
                            💰 Price: Competitive and negotiable

                        </p><p>
                            📞 Contact: ....

                        </p><p>
                            📆 Schedule a tour today and make this dream home yours!

                        </p>
                    </div>

                    <div className='flex justify-center items-center m-auto w-full md:w-[500px] h-[250px] md:h-[300px] rounded-2xl border border-[#808080] mt-5'>

                    </div>

                    <div className='flex items-center justify-between mt-2 space-x-2 w-full md:w-[500px] m-auto'>
                        <button className='text-[#808080] cursor-pointer rounded-full hover:rounded-full hover:bg-[#76ff93] hover:text-[#258339] p-2 transition-colors duration-100 flex'><MessageCircle className='w-5 h-5' /> <span className='text-[10px] md:text-[12px] mt-[5px]'>526</span> </button>
                        <button className='text-[#808080] cursor-pointer rounded-full hover:rounded-full hover:bg-[#dd6794] hover:text-[#68213c] p-2 transition-colors duration-100 flex'><HeartIcon className='w-5 h-5' /><span className='text-[10px] md:text-[12px] mt-[5px]'>200</span></button>
                        <button className='text-[#808080] cursor-pointer rounded-full hover:rounded-full hover:bg-[#926de9] hover:text-[#2c1a57] p-2 transition-colors duration-100 flex'><BarChart2 className='w-6 h-6' /><span className='text-[10px] md:text-[12px] mt-[10px]'>1.1k</span></button>
                        <button className='text-[#808080] cursor-pointer rounded-full hover:rounded-full hover:bg-[#235f23] hover:text-[#258339] p-2 transition-colors duration-100 flex'><BookmarkIcon className='w-5 h-5' /><span className='text-[10px] md:text-[12px] mt-[5px]'>154</span></button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Posts
