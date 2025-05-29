"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from './navbar'
import { CopyIcon } from "lucide-react"
import { useWallet } from './context/WalletContext';
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { ethers, JsonRpcProvider, Contract, BrowserProvider } from 'ethers';
import { ERC20_ABI } from './config/constants/abi'
import CountdownTimer from "./countdown"
import axios from "./api/axios";
import { useSearchParams } from 'next/navigation';


const OverTenPoint = 2778
const OverFiftyPoint = 5556
const OverHundredPoint = 8333;
const DexPoint = 5556;
const holdPipNftPoint = 8333;
const holdNftPoint = 13888;


const ERC721_ABI = [
  "function balanceOf(address owner) view returns (uint256)"
];

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


function formatNumber(value: number): string {
  if (value >= 1000) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  } else {
    return value.toFixed(2);
  }
}


const LoadingSpinner: React.FC = () => (
  <div className="flex justify-center py-8">
    <div className="animate-spin h-8 w-8 border-8 border-[#1EEDD8] rounded-full border-t-transparent"></div>
    <p className="m-1 ">Scanning...</p>
  </div>
);


export default function Home() {
  const { isConnected, address } = useWallet();
  const { walletProvider } = useWeb3ModalProvider();
  const searchParams = useSearchParams();


  const [point, setPoint] = useState(0);
  const [loading, setLoading] = useState(true);

  const [userVolume, setUserVolume] = useState(0)
  const [capyVolume, setCapyVolume] = useState(0)

  const [tenTnx, setTenTnx] = useState(false)
  const [fiftyTnx, setfiftyTnx] = useState(false)
  const [hundredTnx, sethundredTnx] = useState(false)
  const [hyperSwap, sethyperSwap] = useState(false)
  const [liquidLaunch, setliquidLaunch] = useState(false)
  const [tenThn, settenThn] = useState(false)

  const [fiftyThn, setfiftyThn] = useState(false)

  const [referral, setRefAddress] = useState("")



  useEffect(() => {
    // Get the ref parameter from the URL when component mounts
    const ref = searchParams.get('ref');

    if (ref) {
      setRefAddress(String(ref));

    }
  }, [searchParams]);
  useEffect(() => {
    fetchMata()
  })

  async function fetchMata(): Promise<void> {
    const res = await axios.get("/data");
    if (res.status === 200) {
      const data = res.data;
      setUserVolume(data.totalUsers)
      setCapyVolume(data.totalPoints)
    }

  }


  useEffect(() => {
    fetchData();
  }, [isConnected, address, walletProvider])

  async function fetchData(): Promise<void> {
    if (isConnected && address) {
      try {
        setLoading(true)
        let totalNewPoints = 0;

        totalNewPoints += await getAllUserTransactionCounts(address)
        totalNewPoints += await LiquidLauchHolder(address)
        totalNewPoints += await BuddyHolder(address)
        totalNewPoints += await isHypioNFTHolder(address)
        totalNewPoints += await isPipNFTHolder(address)
        totalNewPoints += await userDatabase(address, totalNewPoints);
        setPoint(prevPoint => prevPoint + totalNewPoints);
      } catch (error) {
        console.error("Error fetching all data:", error);
      } finally {
        setLoading(false)
      }
    }
  }

  async function userDatabase(address: string, totalPoint: number): Promise<number> {

    if (totalPoint <= 0) {
      return 0
    }
    try {
      const data = {
        wallet: address,
        refAddress: referral,
        point: totalPoint
      }
      const res = await axios.post("/user", data);

      if (res.status === 200) {
        const resData = res.data;
        const referalPoint = resData.refPoint;
        const total = resData.point
        console.log(total)
        return referalPoint;

      } else if (res.status === 201) {
        const resData = res.data;
        const referalPoint = resData.refPoint;
        return referalPoint;
      }

    } catch (err) {
      console.log(err);


    }

    return 0

  }

  async function getAllUserTransactionCounts(address: string): Promise<number> {
    let newPoint: number = 0;
    try {
      const provider = new JsonRpcProvider("https://rpc.hyperliquid.xyz/evm")
      const txCount = await provider?.getTransactionCount(address);
      if (txCount >= 100) {
        newPoint += OverHundredPoint + OverFiftyPoint + OverTenPoint;
        setfiftyTnx(true)
        sethundredTnx(true)
        setTenTnx(true);
      } else if (txCount >= 50) {
        newPoint += OverFiftyPoint + OverTenPoint;
        setfiftyTnx(true)
        setTenTnx(true);
      } else if (txCount >= 10) {
        newPoint += OverTenPoint;
        setTenTnx(true);
      }

      return newPoint; // Return the points instead of setting state

    } catch (error) {
      console.error("Error fetching getAllUserTransactionCounts:", error);
      return 0; // Return 0 on error
    }
  }

  async function LiquidLauchHolder(walletAddress: string): Promise<number> {
    if (!walletProvider) {
      return 0;
    }
    const provider = new BrowserProvider(walletProvider);
    const tokenContract = new Contract("0x1Ecd15865D7F8019D546f76d095d9c93cc34eDFa", ERC20_ABI, provider);

    try {
      const balance = await tokenContract.balanceOf(walletAddress);
      console.log(balance)

      const normalized = ethers.formatUnits(balance, 18);
      if (parseFloat(normalized) > 0) {
        setliquidLaunch(true)
        return DexPoint; // Return the points instead of setting state
      }
      return 0;

    } catch (err) {
      console.error(`Error fetching `, err);
      return 0;
    }
  }

  async function BuddyHolder(walletAddress: string): Promise<number> {
    if (!walletProvider) {
      return 0;
    }
    const provider = new BrowserProvider(walletProvider);
    const tokenContract = new Contract("0x47bb061C0204Af921F43DC73C7D7768d2672DdEE", ERC20_ABI, provider);

    try {
      const balance = await tokenContract.balanceOf(walletAddress);
      console.log(balance)
      const normalized = ethers.formatUnits(balance, 18);
      if (parseFloat(normalized) > 0) {
        sethyperSwap(true)
        return DexPoint; // Return the points instead of setting state
      }
      return 0;

    } catch (err) {
      console.error(`Error fetching `, err);
      return 0;
    }
  }


  async function isHypioNFTHolder(
    walletAddress: string,
  ): Promise<number> {

    if (!walletProvider) {
      return 0
    }
    const provider = new BrowserProvider(walletProvider);
    const nftContractAddress = "0x63eb9d77D083cA10C304E28d5191321977fd0Bfb"
    const nftContract = new ethers.Contract(nftContractAddress, ERC721_ABI, provider);

    try {
      const balance = await nftContract.balanceOf(walletAddress);
      if (balance > 0) {
        settenThn(true)

        return holdNftPoint;

      }
      return 0
    } catch (err) {
      console.error("Error checking NFT holder status:", err);
      return 0;
    }
  }

  async function isPipNFTHolder(
    walletAddress: string,
  ): Promise<number> {

    if (!walletProvider) {
      return 0
    }
    const provider = new BrowserProvider(walletProvider);
    const nftContractAddress = "0xbc4a26ba78ce05E8bCbF069Bbb87FB3E1dAC8DF8"
    const nftContract = new ethers.Contract(nftContractAddress, ERC721_ABI, provider);

    try {
      const balance = await nftContract.balanceOf(walletAddress);
      if (balance > 0) {
        setfiftyThn(true)
        return holdPipNftPoint
      }
      return 0;
    } catch (err) {
      console.error("Error checking NFT holder status:", err);
      return 0;
    }
  }







  return (
    <>
      <Navbar />

      <main>

        <div className="mt-10 py-5 lg:flex justify-between  w-full">

          <div className="hidden rounded-2xl bg-[#a3f5ed] p-2 lg:flex justify-center relative w-full h-[250px] mr-[-30px]">
            <Image
              src="/images/swim.jpg"
              alt="Capy logo"
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
              alt="capy logo"
              fill
              className="object-contain"
              priority
            />
          </div>

        </div>


        {isConnected ? <>

          {loading ? <>

            <LoadingSpinner />

          </> : <>

            {point > 0 ? <>

              <div className="content mt-10">
                <div className="flex justify-between w-full gap-3 lg:flex-nowrap flex-wrap">
                  <div className="w-full">
                    <h2 className="text-xl font-extrabold">Wallet  Connected!!!!</h2>
                    <p className="mt-3 text-[10px]">
                      Great news! We found your account eligible, and you’re eligible to claim your reward🎉🎉🎉.
                    </p>
                  </div>

                  <div className="w-full">
                    <p className="text-sm">Refer a Friend to earn more point</p>
                    <div className="mt-3 w-[object-fit]">
                      <div className="border border-[#19EF9D] rounded-3xl p-1 px-3 flex justify-between gap-1 cursor-pointer">
                        <code className="text-[12px] lg:text-sm">capyhl.fun/?ref={address?.substring(0, 5) + `...` + address?.substring(37, address.length)}</code>
                        <button
                          onClick={() => navigator.clipboard.writeText(`http://www.capyhl.fun/?ref=${address}`)}
                          className="ml-2 bg-gray-500 hover:bg-gray-700 text-white text-[10px] lg:text-sm py-1 px-2 rounded"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="py-5 flex justify-between lg:flex-nowrap flex-wrap gap-3">
                <div className="p-4 bg-[#ffffff] bg-opacity-5 w-full rounded-2xl" >

                  <h3 className="">Total $Capy To Claim :</h3>

                  <h1 className="mt-10 font-extrabold text-2xl">{formatNumber(point)}</h1>


                  <p className="mt-10 text-[8px]">You'll need to sign 1 chunks of transactions.</p>

                </div>
                <div className="p-4 bg-[#ffffff] bg-opacity-5 w-full rounded-2xl" >
                  <h3>Eligibility:</h3>

                  <div className="text-[10px] mt-2">
                    <ol className="list-decimal list-inside">
                      {tenTnx ? <li >  Conduct more than 10 transactions.
                      </li> : <li className="text-gray-600">  Conduct more than 10 transactions.
                      </li>}

                      {fiftyTnx ? <li >Conduct more than 50 transactions.</li> : <li className="text-gray-600">Conduct more than 50 transactions.</li>}

                      {hundredTnx ? <li >Conduct more than 100 transactions.</li> : <li className="text-gray-600">Conduct more than 100 transactions.</li>}


                      {hyperSwap ?
                        <li >Alright Buddy (BUDDY) token holders</li>
                        :
                        <li className="text-gray-600" >Alright Buddy (BUDDY) token holders</li>

                      }
                      {liquidLaunch ? <li >LiquidLaunch (LIQD) token holders</li> : <li className="text-gray-600" >LiquidLaunch (LIQD) token holders</li>}
                      {tenThn ? <li >Wealthy Hypio Babies (HYPIO) Nft Holders</li> : <li className="text-gray-600">Wealthy Hypio Babies (HYPIO) Nft Holders</li>}
                      {fiftyThn ? <li>PiP & Friends (PIP) Nft Holders</li> : <li className="text-gray-600">PiP & Friends (PIP) Nft Holders</li>}

                    </ol>
                  </div>

                </div>
              </div>

            </> : <>

              <div className="content mt-10">
                <div className="flex justify-between w-full gap-3 lg:flex-nowrap flex-wrap">
                  <div className="w-full">
                    <h2 className="text-xl font-extrabold">Wallet  Connected!!!!</h2>
                    <p className="mt-3 text-[10px]">
                      Sorry!!! You are not Eligible.
                    </p>
                  </div>

                  <div className="w-full">
                    <p className="text-sm">Refer a Friend to earn more point</p>
                    <div className="mt-3 w-[object-fit]">
                      <div className="border border-[#19EF9D] rounded-3xl p-1 px-3 flex justify-between gap-1 cursor-pointer">
                        <code className="text-[12px] lg:text-sm">capyhl.fun/?ref={address?.substring(0, 5) + `...` + address?.substring(37, address.length)}</code>
                        <button
                          onClick={() => navigator.clipboard.writeText(`http://www.capyhl.fun/?ref=${address}`)}
                          className="ml-2 bg-gray-500 hover:bg-gray-700 text-white text-[10px] lg:text-sm py-1 px-2 rounded"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>


                </div>

              </div>

              <div className="py-5 flex justify-between lg:flex-nowrap flex-wrap gap-3">
                <div className="p-4 bg-[#ffffff] bg-opacity-5 w-full rounded-2xl" >

                  <h3 className="">Total $Capy To Claim :</h3>

                  <h1 className="mt-10 font-extrabold text-2xl">{formatNumber(point)}</h1>


                  <p className="mt-10 text-[8px]">You are not eligible.</p>

                </div>
                <div className="p-4 bg-[#ffffff] bg-opacity-5 w-full rounded-2xl" >
                  <h3>Eligibility:</h3>

                  <div className="text-[10px] mt-2">
                    <ol className="list-decimal list-inside">
                      <li className="text-gray-600">  Conduct more than 10 transactions.
                      </li>

                      <li className="text-gray-600">Conduct more than 50 transactions.</li>
                      <li className="text-gray-600">Conduct more than 100 transactions.</li>
                      <li className="text-gray-600">Alright Buddy (BUDDY) token holders</li>
                      <li className="text-gray-600">LiquidLaunch (LIQD) token holders</li>
                      <li className="text-gray-600">Wealthy Hypio Babies (HYPIO) Nft Holders</li>
                      <li className="text-gray-600">PiP & Friends (PIP) Nft Holders</li>

                    </ol>
                  </div>

                </div>
              </div>

            </>}

          </>}


          <CountdownTimer />
        </> : <div className="flex justify-center mt-10">
          <ConnectWalletButton />
        </div>}








        <div className="m-auto bg-[#0000004D] bg-opacity-30 rounded-2xl p-4 lg:w-[500px] w-[300px] mt-10">

          <p className="text-[10px] text-center">
            Keep up with our socail media to get the latest updates on how you can join upcoming launches and campaigne in the Capy ecosystem. For mpre information on our eligiblity and TGE, follow us on all on social media.
          </p>

          <div className="flex justify-center mt-2">
            <Image
              src="/images/discord.png"
              alt="Next.js logo"
              width={20}
              height={20}


            />
            <Image
              src="/images/youtube.png"
              alt="Next.js logo"
              width={20}
              height={20}

            /> <Image
              src="/images/instagram.png"
              alt="Next.js logo"
              width={20}
              height={20}

            />
          </div>


        </div>


      </main>


      <footer className="mt-20">

        <div className="mb-5">
          <h2 className="text-2xl font-extrabold">$Capy</h2>

          <p className="mt-2 text-[10px] lg:text-sm">
            Leveraging the power of decentralized finance (DeFi) to provide innovative liquidity opportunities for HyperEvm community.
          </p>
        </div>

        <hr />

        <div className="flex justify-between mt-5">
          <p className="text-[8px]">Capy,  All Rights Reserved | Copyright © 2025</p>

          <div className="flex justify-center">
            <Image
              src="/images/discord.png"
              alt="Next.js logo"
              width={20}
              height={20}

            />
            <Image
              src="/images/youtube.png"
              alt="Next.js logo"
              width={20}
              height={20}

            /> <Image
              src="/images/instagram.png"
              alt="Next.js logo"
              width={20}
              height={20}

            />
          </div>
        </div>
      </footer>

    </>
  );
}
