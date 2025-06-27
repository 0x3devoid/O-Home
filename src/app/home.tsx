'use client'
import React from 'react'
import Image from "next/image";
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';


const Home = () => {

  const handleSignIn = () => {
    window.location.href = '/login';
  }

   const handleSignUp = () => {
    window.location.href = '/register';
  }

  return (

    <div className='w-[300px] m-auto text-center mt-[100px] md:mt-0'>

    <div className='flex justify-center'>
        <Image src="/images/logo.png" alt="." width={50} height={50} />
    </div>

      <h2 className='mt-10 text-start text-lg font-extrabold'>Create an account</h2>

      <div className='w-full flex justify-center gap-3 rounded-3xl p-2 px-5 bg-[#fff] text-[#000] mt-5 cursor-pointer text-sm font-thin
      '>
        <FcGoogle size={20} />
        Sign up with Google

      </div>
      <div className='w-full flex justify-center gap-3 rounded-3xl p-2 px-5 bg-[#fff] text-[#000] mt-3 cursor-pointer text-sm font-thin'>
        <FaApple size={20} />
        Sign up with Apple


      </div>


      <div className='flex justify-center mt-5'>
        <span className=''></span>  <h3>OR</h3>     <span></span>
      </div>


      <div className='w-full rounded-3xl p-2 px-5 bg-[#fff] text-[#000] mt-5 cursor-pointer text-sm font-thin' onClick={handleSignUp}>
        Create Account
      </div>

      <div className='mt-3'>

        <p className='text-gray-500 text-[8px]'>
          By signing up, you agree to the <span className=' text-[#6f6de0]'>Terms of Service</span> and <span className=' text-[#6f6de0]'>Privacy Policy</span>, including <span className=' text-[#6f6de0]'>Cookie Use</span>.
        </p>

      </div>



      <h3 className='mt-10'>Already have an account?</h3>

      <button className='w-full rounded-3xl p-2 px-5 bg-[#fff] text-[#8CCDEB] mt-3 cursor-pointer text-sm font-thin' onClick={handleSignIn}>
        Sign in
      </button>
    </div>
  )
}

export default Home
