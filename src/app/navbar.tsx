import React from 'react'
// import ConnectWalletButton from './utils/ConnectWalletButton'

const Navbar = () => {
    return (
        <div className="flex justify-between">
            <div>
                <h2>LOGO</h2>
            </div>

            <div >
                <button className='border border-[#1EEDD8] rounded-2xl p-2 px-7 text-sm'>Connect Wallet</button>
            </div>

            {/* <ConnectWalletButton/> */}
        </div>
    )
}

export default Navbar
