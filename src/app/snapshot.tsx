"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from './navbar'
import { CopyIcon, Send, Twitter } from "lucide-react"
import { useWallet } from './context/WalletContext';
import { useWeb3ModalProvider, useWeb3ModalAccount } from "@web3modal/ethers/react";
import { ethers, JsonRpcProvider, Contract } from 'ethers';
import { ERC20_ABI } from './config/constants/abi'
import CountdownTimer from "./claimcounter"
import axios from "./api/axios";
import { useSearchParams } from 'next/navigation';
import CapyFooter from './footer'


const ConnectWalletButton: React.FC = () => {
    const { isConnected, connectWallet } = useWallet();

    return (
        <button
            onClick={connectWallet}
            className="border border-[#1EEDD8] rounded-2xl p-2 px-7 text-sm flex"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
            </svg>
            {isConnected ? "Connected" : "Connect Wallet"}
        </button>
    );

};


function formatNumber(value: number): string {
    if (value === null) return '0'
    if (value >= 1000) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(value);
    } else {
        return value.toFixed(1);
    }
}


const LoadingSpinner: React.FC = () => (
    <div className="flex justify-center py-8">
        <div className="animate-spin h-8 w-8 border-8 border-[#1EEDD8] rounded-full border-t-transparent"></div>
        <p className="m-1 ">Capy Scanning...</p>
    </div>
);


export default function Snapshot() {
    const searchParams = useSearchParams();

    // const { isConnected, address } = useWallet();
    const { address, isConnected } = useWeb3ModalAccount()
    const { walletProvider } = useWeb3ModalProvider();


    const [point, setPoint] = useState(0);
    const [loading, setLoading] = useState(true);

    const [leaderboard, setLeaderboard] = useState([]);
    const [Lloading, setLLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [userVolume, setUserVolume] = useState(0)
    const [capyVolume, setCapyVolume] = useState(0)

 

    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 10;

    const startIndex = currentPage * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, leaderboard.length);
    const currentData = leaderboard.slice(startIndex, endIndex);


    useEffect(() => {
        fetchMata()
    })



    useEffect(() => {
        fetchLeaderboard();
    }, []);

    const fetchLeaderboard = async () => {
        try {
            setLLoading(true);
            const response = await axios.get('leaderBoard');
            const data = await response.data;

            if (response.status === 200) {
                setLeaderboard(data.leaderboard || []);
            }
        } catch (err) {
            console.error('Leaderboard fetch error:', err);
        } finally {
            setLLoading(false);
        }
    };

    async function fetchMata(): Promise<void> {
        try {
            const res = await axios.get("/data");
            if (res.status === 200) {
                const data = res.data;
                setUserVolume(data.totalUsers)
                setCapyVolume(data.totalPoints)
            }
        } catch (error: any) {
            console.log(error)
        }

    }


    useEffect(() => {
        // Reset points when wallet changes
        setPoint(0);
        fetchData();
    }, [isConnected, address, walletProvider])

    async function fetchData(): Promise<void> {
        if (!isConnected || !address || !walletProvider) {
            setPoint(0); // Reset points when disconnected
            return;
        }
        try {
            setLoading(true);


            const total = await userDatabase(address);

            setPoint(total);

        } catch (error: any) {
            console.error("Error fetching data:", error);
            // Handle specific network errors
            if (error.code === 'NETWORK_ERROR') {
                console.error('Network connection issue');
            }
            setError('Network connection issue, Please Make Sure Your are connected to HyperEvm chain.')

        } finally {
            setLoading(false);
        }
    }

    async function userDatabase(address: string): Promise<number> {
        try {


            const res = await axios.get(`/user/points/${address}`);

            if (res.status === 200) {
                const resData = res.data;
                const total = resData.points;

                return total;
            }
        } catch (err) {
            console.log(err);
        }

        return 0;
    }



    const getRankIcon = (index: any) => {
        switch (index) {
            case 0:
                return <span className="text-xl lg:text-2xl">🥇</span>;
            case 1:
                return <span className="text-xl lg:text-2xl">🥈</span>;
            case 2:
                return <span className="text-xl lg:text-2xl">🥉</span>;
            default:
                return <span className="text-lg font-bold text-gray-600">#{index + 1}</span>;
        }
    };

    const getRankStyle = (index: any) => {
        switch (index) {
            case 0:
                return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white shadow-lg transform scale-105';
            case 1:
                return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white shadow-md';
            case 2:
                return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white shadow-md';
            default:
                return 'bg-white hover:bg-gray-50 border border-gray-200';
        }
    };


    function truncateWallet(wallet: any) {
        if (!wallet) return '';
        return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
    }




    return (
        <>
            <Navbar />

            <main>

                <div className="mt-10 py-5 lg:flex justify-between  w-full">

                    <div className="hidden rounded-2xl bg-[#a3f5ed] p-2 lg:flex justify-center relative w-full h-[250px] mr-[-30px]">
                        <Image
                            src="/images/swim.jpg"
                            alt="Capy"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                    <div className="p-8 bg-[#ffffff] bg-opacity-5 w-full rounded-2xl" >
                        <h2 className="text-2xl font-extrabold lg:ml-4">Unlock Your CAPY Rewards!</h2>

                        <p className="text-[12px] mt-2  lg:ml-4">
                            Access your eligibility and claim your share of CAPY tokens. Invite active users and maximize your rewards. Don't miss out—start now and see what awaits you!
                        </p>

                        <div className="flex justify-between mt-10 mb-5 lg:mb-0  lg:ml-4">
                            <div>
                                <p className="text-[10px]">Total Capy Accumulated</p>
                                <h3 className="text-2xl font-extrabold">{formatNumber(capyVolume)}</h3>
                            </div>

                            <div>
                                <p className="text-[10px]">Users Volume</p>
                                <h3 className="text-2xl font-extrabold">{formatNumber(userVolume)}</h3>
                            </div>

                        </div>

                    </div>

                    <div className="lg:hidden rounded-2xl bg-[#a3f5ed] p-2 flex justify-center relative w-full h-[200px] mt-[-30px]">
                        <Image
                            src="/images/swim.jpg"
                            alt="capy"
                            fill
                            className="object-contain"
                            priority
                        />
                    </div>

                </div>


                {isConnected && address ? (
                    <>
                        {error ? (
                            // Error State
                            <div className="content mt-10">
                                <div className="flex justify-center">
                                    <div className="p-6 bg-red-500 bg-opacity-10 border border-red-500 rounded-2xl max-w-md text-center">
                                        <h2 className="text-xl font-extrabold text-red-400 mb-4">Error Occurred</h2>
                                        <p className="text-sm text-red-300 mb-4">{error}</p>
                                        <button
                                            onClick={async () => {
                                                await fetchData(); // Retry fetching data
                                                setError(null);
                                            }}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                                        >
                                            Try Again
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : loading ? (
                            // Loading State
                            <LoadingSpinner />
                        ) : (
                            // Success State
                            <>
                                {point > 0 ? (
                                    // Eligible User UI
                                    <>
                                        <div className="content mt-10">
                                            <div className="flex justify-between w-full gap-3 lg:flex-nowrap flex-wrap">
                                                <div className="w-full">
                                                    <h2 className="text-xl font-extrabold">SNAPSHOT TAKEN!</h2>
                                                    <p className="mt-3 text-[12px]">
                                                        Great news Capy pal! Capy found your account eligible🎉🎉🎉.
                                                    </p>
                                                </div>

                                               
                                            </div>

                                        </div>

                                        <div className="py-5 flex justify-between lg:flex-nowrap flex-wrap gap-3">
                                            <div className="p-4 bg-[#ffffff] bg-opacity-5 w-full rounded-2xl">
                                                <h3 className="">Total $Capy To Claim :</h3>
                                                <h1 className="mt-10 font-extrabold text-2xl">{formatNumber(point)}</h1>
                                                <p className="mt-10 text-[8px]">You'll need to sign 1 chunks of transactions.</p>
                                            </div>

                                          
                                        </div>

                                        {/* CLAIM COUNT DOWN */}

                                        <CountdownTimer/>



                                    </>
                                ) : (
                                    // Not Eligible User UI
                                    <>
                                        <div className="content mt-10">
                                            <div className="flex justify-between w-full gap-3 lg:flex-nowrap flex-wrap">
                                                <div className="w-full">
                                                    <h2 className="text-xl font-extrabold">SNAPSHOT TAKEN!</h2>
                                                    <p className="mt-3 text-[10px]">
                                                        Oops! Capy only invites friends to the party, you're not eligible
                                                    </p>
                                                </div>

                                                
                                            </div>
                                        </div>
                                        <div className="py-5 flex justify-between lg:flex-nowrap flex-wrap gap-3">
                                            <div className="p-4 bg-[#ffffff] bg-opacity-5 w-full rounded-2xl">
                                                <h3 className="">Total $Capy To Claim :</h3>
                                                <h1 className="mt-10 font-extrabold text-2xl">0.0</h1>
                                                <p className="mt-10 text-[12px]">You're not eligible.</p>
                                            </div>

                                           
                                        </div>


                                    </>
                                )}
                            </>
                        )}

                    </>
                ) : (
                    // Not Connected State
                    <div className="flex justify-center mt-10">
                        <ConnectWalletButton />
                    </div>
                )}




                {Lloading ? (
                    <div className="py-5 mt-10">
                        <h2 className="text-xl lg:text-2xl font-bold text-start mb-8 text-gray-800">🏆 Leader Board</h2>
                        <div className="flex justify-center items-center py-12">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-700"></div>
                            <span className="ml-3 text-gray-600">Loading leaderboard...</span>
                        </div>
                    </div>
                ) : (
                    <div className="py-5 max-w-4xl mx-auto px-4 mt-10">
                        <h2 className="text-xl lg:text-2xl font-bold text-start mb-8 text-gray-800">
                            🏆 Leader Board
                        </h2>

                        {leaderboard.length === 0 ? (
                            <div className="text-center py-12 text-gray-500">
                                <div className="text-3xl mb-4">📊</div>
                                <p className="text-lg">No users found yet</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {currentData.map((user: any, index) => {
                                    const globalIndex = startIndex + index;
                                    return (
                                        <div
                                            key={user?.wallet}
                                            className={`
                      flex items-center justify-between p-2 rounded-lg transition-all duration-300
                      ${getRankStyle(globalIndex)}
                    `}
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div className="flex-shrink-0 w-12 text-center">
                                                    {getRankIcon(globalIndex)}
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[10px] lg:text-sm font-medium text-gray-500 uppercase tracking-wide">
                                                        Wallet
                                                    </div>
                                                    <div className={`font-mono text-[10px] lg:text-sm ${globalIndex < 3 ? 'text-white' : 'text-gray-900'}`}>
                                                        {truncateWallet(user.wallet)}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <div className="text-[10px] lg:text-sm font-medium text-gray-500 uppercase tracking-wide">
                                                    {globalIndex < 3 ? (
                                                        <span className="text-gray-200">$CAPY</span>
                                                    ) : (
                                                        'CAPY'
                                                    )}
                                                </div>
                                                <div className={`text-xl lg:text-2xl font-bold ${globalIndex < 3 ? 'text-white' : 'text-gray-900'}`}>
                                                    {formatNumber(user?.totalPoints)}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        {leaderboard.length > 0 && (
                            <div className="text-center mt-5 space-x-4">
                                <button
                                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                                    disabled
                                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold text-[10px] py-1 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                >
                                    ◀ Prev
                                </button>
                                <button
                                    onClick={() => setCurrentPage((prev) => (prev + 1) * itemsPerPage < leaderboard.length ? prev + 1 : prev)}
                                    disabled={(currentPage + 1) * itemsPerPage >= leaderboard.length}
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold text-[10px] py-1 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50"
                                >
                                    Next ▶
                                </button>
                            </div>
                        )}
                    </div>
                )}






                <div className="m-auto bg-[#0000004D] bg-opacity-30 rounded-2xl p-4 lg:w-[500px] w-[300px] mt-10">

                    <p className="text-[10px] lg:text-sm text-center">
                        Stay in the loop with the Capy!  Follow our socials for updates on $CAPY drops and how you can join upcoming launches and campaigns.
                    </p>

                    <div className="flex justify-center items-center gap-6 mt-6">
                        <a
                            href="https://t.me/capyhl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                        >
                            <Send size={15} className="group-hover:animate-pulse" />
                            <span className="font-medium text-[10px] lg:text-sm">Telegram</span>
                        </a>

                        <a
                            href="https://x.com/Capyhl"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-white rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg group"
                        >
                            <Twitter size={15} className="group-hover:animate-pulse" />
                            <span className="font-medium text-[10px] lg:text-sm">Twitter</span>
                        </a>
                    </div>

                </div>


            </main>

            <CapyFooter />



        </>
    );
}
