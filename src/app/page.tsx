"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import Navbar from './navbar'
import { CopyIcon } from "lucide-react"
import { useWallet } from './context/WalletContext';
import { useWeb3ModalProvider } from "@web3modal/ethers/react";
import { ethers, formatEther, JsonRpcProvider, Wallet, Contract, toBigInt } from 'ethers';
import { RouterAddress, RouterAbi } from './config/constants/abi'
// import { BigNumber } from "ethers/lib.commonjs/bignumber";


const OverTenPoint = 500
const OverFiftyPoint = 1000
const OverHundredPoint = 1500;
const DexPoint = 1000;
const exceedTenK = 1500;
const exceedFiftyK = 1500;

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

  const [point, setPoint] = useState(0);
  const [loading, setLoading] = useState(true);

  const [tenTnx, setTenTnx] = useState(false)
  const [fiftyTnx, setfiftyTnx] = useState(false)
  const [hundredTnx, sethundredTnx] = useState(false)
  const [hyperSwap, sethyperSwap] = useState(false)
  const [liquidLaunch, setliquidLaunch] = useState(false)
  const [tenThn, settenThn] = useState(false)

  const [fiftyThn, setfiftyThn] = useState(false)


  useEffect(() => {


    fetchData();

  }, [isConnected, address, walletProvider])

  async function fetchData(): Promise<void> {
    if (isConnected && address) {
      try {
        setLoading(true)
        await getAllUserTransactionCounts(address)
        // await getUserHyperSwapVolume(address)
      } catch (error) {
        console.error("Error fetching all data:", error);
      } finally {
        setLoading(false)

      }
    }

  }

  async function getAllUserTransactionCounts(address: string) {
    let newPoint: number = 0;
    try {
      const provider = new JsonRpcProvider("https://rpc.hyperliquid.xyz/evm")
      const txCount = await provider?.getTransactionCount(address);
      if (txCount >= 100) {
        newPoint += OverHundredPoint;
        sethundredTnx(true)
      } else if (txCount >= 50) {
        newPoint += OverFiftyPoint;
        setfiftyTnx(true)
      } else if (txCount >= 10) {
        newPoint += OverTenPoint;
        setTenTnx(true);

      }
      const finalPoint = point + newPoint
      setPoint(finalPoint);

    } catch (error) {
      console.error("Error fetching getAllUserTransactionCounts:", error);

    }

  }
  async function getAllUserTransactionVolume(address: string): Promise<number> {

    let total = toBigInt(0);

    const provider = new JsonRpcProvider("https://rpc.hyperliquid.xyz/evm")

    const startBlock = 0
    const endBlock = await provider.getBlockNumber()


    // for (let blockNumber = startBlock; blockNumber <= endBlock; blockNumber++) {
    //   const block = await provider.getTransactionReceipt();
    //   for (const tx of block.transactions) {
    //     if (tx.to?.toLowerCase() === address || tx.from.toLowerCase() === address) {
    //       total = total + (tx.value);
    //     }
    //   }
    // }

    console.log(`Total Volume (sent + received): ${ethers.formatEther(total)} HLP`);
    return 0;


  }
  async function getUserHyperSwapVolume(address: string): Promise<number> {
  try {
    const provider = new JsonRpcProvider("https://rpc.hyperliquid.xyz/evm");
    const contract = new Contract(RouterAddress, RouterAbi, provider);

    const latestBlock = await provider.getBlockNumber();
    const chunkSize = 1000;
    let totalVolume = BigInt(0);

    for (let startBlock = 90000; startBlock <= latestBlock; startBlock += chunkSize + 1) {
      let endBlock = Math.min(startBlock + chunkSize, latestBlock);

      const filter = contract.filters.Swap(address);
      const logs = await contract.queryFilter(filter, startBlock, endBlock);

      for (const log of logs) {
        const parsed = contract.interface.parseLog(log);
        if (parsed) {
          const { amount0In, amount1In, amount0Out, amount1Out } = parsed.args;
          totalVolume += amount0In + amount1In + amount0Out + amount1Out;
        }
      }
    }

    console.log(`Total swap volume: ${formatEther(totalVolume)} ETH-like units`);
    return parseFloat(formatEther(totalVolume));
  } catch (error) {
    console.error("Error calculating volume:", error);
    return 0;
  }
}
  async function getUserLiquidLaunchVolume(address: string): Promise<number> {
    return 0;


  }




  return (
    <>
      <Navbar />

      <main>



        <div className="mt-10 py-5 lg:flex justify-between  w-full">

          <div className="hidden rounded-2xl bg-[#1EEDD8] p-2 lg:flex justify-center w-full mr-[-30px]">
            <Image
              className="dark:invert"
              src="/images/wallet.png"
              alt="Next.js logo"
              width={180}
              height={38}
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
                <h3 className="text-2xl font-extrabold">7,564,456</h3>
              </div>

              <div>
                <p className="text-[10px]">Users Volume</p>
                <h3 className="text-2xl font-extrabold">19,638</h3>
              </div>

            </div>

          </div>

          <div className="lg:hidden rounded-2xl bg-[#1EEDD8] p-2 flex justify-center w-full mt-[-30px]">
            <Image
              className="dark:invert"
              src="/images/wallet.png"
              alt="Next.js logo"
              width={180}
              height={38}
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
                    <div className="border border-[#19EF9D] rounded-3xl p-2 flex justify-between mt-3">
                      <p className="text-[10px] mt-1">Capyuser/{address?.substring(0, 5) + `...` + address?.substring(37, address.length)}</p>

                      <div className="rounded-3xl bg-[#006216] p-1 px-3 flex justify-center gap-1 cursor-pointer">
                        <p className="text-[10px]">Copy</p>
                        <CopyIcon width={10} height={10} />
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
                        <li >Conduct Over $5,000 Volume on HyperSwap</li>
                        :
                        <li className="text-gray-600" >Conduct Over $5,000 Volume on HyperSwap</li>

                      }
                      {liquidLaunch ? <li >Conduct Over $5,000 Volume on LiquidLaunch</li> : <li className="text-gray-600" >Conduct Over $5,000 Volume on LiquidLaunch</li>}
                      {tenThn ? <li >Conduct Transaction exceeding $10,000</li> : <li className="text-gray-600">Conduct Transaction exceeding $10,000</li>}
                      {fiftyThn ? <li>Conduct Transaction exceeding $50,000</li> : <li className="text-gray-600">Conduct Transaction exceeding $50,000</li>}

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
                    <div className="border border-[#19EF9D] rounded-3xl p-2 flex justify-between mt-3">
                      <p className="text-[10px] mt-1">Capyuser/{address?.substring(0, 5) + `...` + address?.substring(37, address.length)}</p>

                      <div className="rounded-3xl bg-[#006216] p-1 px-3 flex justify-center gap-1 cursor-pointer">
                        <p className="text-[10px]">Copy</p>
                        <CopyIcon width={10} height={10} />
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
                      <li className="text-gray-600">Conduct Over $5,000 Volume on HyperSwap</li>
                      <li className="text-gray-600">Conduct Over $5,000 Volume on LiquidLaunch</li>
                      <li className="text-gray-600">Conduct Transaction exceeding $10,000</li>
                      <li className="text-gray-600">Conduct Transaction exceeding $50,000</li>

                    </ol>
                  </div>

                </div>
              </div>

            </>}

          </>}


          <div className="text-center py-5">
            <p>Countdown</p>
            <div className="flex justify-center ">
              <p className='border border-[#1EEDD8] rounded-2xl p-4 px-7 text-[10px]'>14Days: 06Hours: 10Mins: 78Secs </p>
            </div>
          </div>
        </> : <div className="flex justify-center mt-10">
          <ConnectWalletButton />
        </div>}








        <div className="m-auto bg-[#0000004D] bg-opacity-30 rounded-2xl p-4 lg:w-[500px] w-[300px] mt-10">

          <p className="text-[10px] text-center">
            Keep up with our socail media to get the latest updates on how you can join upcoming launches and campaigne in the Capy ecosystem. For mpre information on our eligiblity and TGE, follow us on all on social media.
          </p>

          <div className="flex justify-center mt-2">
            <Image
              className="dark:invert"
              src="/images/discord.png"
              alt="Next.js logo"
              width={20}
              height={20}


            />
            <Image
              className="dark:invert"
              src="/images/youtube.png"
              alt="Next.js logo"
              width={20}
              height={20}

            /> <Image
              className="dark:invert"
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
              className="dark:invert"
              src="/images/discord.png"
              alt="Next.js logo"
              width={20}
              height={20}

            />
            <Image
              className="dark:invert"
              src="/images/youtube.png"
              alt="Next.js logo"
              width={20}
              height={20}

            /> <Image
              className="dark:invert"
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
