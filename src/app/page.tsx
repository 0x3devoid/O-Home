import Image from "next/image";
import Navbar from './navbar'
import { WalletIcon } from "lucide-react"


export default function Home() {
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

          <div className="p-8 bg-gray-300 bg-opacity-20 w-full rounded-2xl" >
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





        <div className="flex justify-center mt-10">
          <button className='border border-[#1EEDD8] rounded-2xl p-2 px-7 text-sm'>Connect Wallet</button>
        </div>



      </main>


      <footer className="mt-20">

        <div className="mb-5">
          <h2 className="text-2xl font-extrabold">$Capy</h2>

          <p className="mt-2 text-[10px] lg:text-sm">
            Leveraging the power of decentralized finance (DeFi) to provide innovative liquidity opportunities for Base community.
          </p>
        </div>

        <hr/>

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
