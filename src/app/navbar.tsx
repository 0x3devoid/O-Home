import React from 'react'
// import ConnectWalletButton from './utils/ConnectWalletButton'
import { useWallet } from './context/WalletContext';


const ConnectWalletButton: React.FC = () => {
    const { isConnected, connectWallet } = useWallet();

    return (
        <button
            onClick={connectWallet}
            className="border border-[#1EEDD8] rounded-2xl p-2 px-7 text-sm flex "
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
            </svg>
            {isConnected ? "Connected" : "Connect Wallet"}
        </button>
    );
};

const Navbar = () => {
    return (
        <div className="flex justify-between">
            <div>
                <video
                    src="/images/dance.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    style={{ width: '30px', height: '30px' }}
                />

            </div>

            <ConnectWalletButton />

        </div>
    )
}

export default Navbar
