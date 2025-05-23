"use client"
import { useState } from "react";
import Image from "next/image";
import Navbar from './navbar'
import { CopyIcon } from "lucide-react"


export default function Home() {
  const [connected, setIsconnected] = useState(false)
  return (
    <>
      <Navbar />

      <main className="">



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
            <h2 className="text-2xl font-extrabold lg:ml-4">Connect Wallet</h2>

            <p className="text-[12px] mt-2  lg:ml-4">
              Win a Reward! Connect your wallet to check your eligibility, refer active user and claim your reward! Don't miss out on this opportunity - link your wallet now and see if you've qualified for a reward.
            </p>

            <div className="flex justify-between mt-10 mb-5 lg:mb-0  lg:ml-4">
              <div>
                <p className="text-[10px]">Total Account Claimed</p>
                <h3 className="text-2xl font-extrabold">7,564,456</h3>
              </div>

              <div>
                <p className="text-[10px]">Total Rebates</p>
                <h3 className="text-2xl font-extrabold">357($65.4k)</h3>
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


        {connected ? <>
          <div className="content mt-10">
            <div className="flex justify-between w-full gap-3 lg:flex-nowrap flex-wrap">
              <div className="w-full">
                <h2 className="text-xl font-extrabold">Wallet  Connected!!!!</h2>
                <p className="mt-3 text-[10px]">
                  Great news! We found your account eligible, and you’re eligible to claim your reward🎉🎉🎉.
                </p>
              </div>

              <div className="w-full">
                <p className="text-sm">Referral a Friend to earn more point</p>
                <div className="border border-[#19EF9D] rounded-3xl p-2 flex justify-between mt-3">
                  <p className="text-[12px]">Capyuser/BellAsh2025.67261</p>

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

              <h1 className="mt-10 font-extrabold text-2xl">35,740</h1>


              <p className="mt-10 text-[8px]">You'll need to sign 1 chunks of transactions.</p>

            </div>
            <div className="p-4 bg-[#ffffff] bg-opacity-5 w-full rounded-2xl" >
              <h3>Eligibility:</h3>

              <div className="text-[10px] mt-2">
                <ol className="list-decimal list-inside">
                  <li>  Conduct at least 2 distinct monthly transactions.
                  </li>

                  <li>Conduct at least 6 distinct monthly transactions.</li>
                  <li>Conduct at least 9 distinct monthly transactions.</li>
                  <li>Conduct more than 100 transactions.</li>
                  <li className="text-gray-600">Conduct Transaction exceeding $10,000</li>
                  <li className="text-gray-600">Conduct Transaction exceeding $50,000</li>
                  <li className="text-gray-600">Conduct Transaction exceeding $100,000</li>

                </ol>
              </div>

            </div>
          </div>

          <div className="text-center py-5">
            <p>Countdown</p>
            <div className="flex justify-center ">
              <p className='border border-[#1EEDD8] rounded-2xl p-4 px-7 text-[10px]'>14Days: 06Hours: 10Mins: 78Secs </p>
            </div>
          </div>
        </> : <div className="flex justify-center mt-10">
          <button className='border border-[#1EEDD8] rounded-2xl p-2 px-7 text-sm' onClick={(() => setIsconnected(true))}>Connect Wallet</button>
        </div>}









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
