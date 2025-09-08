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

    <div className='md:flex justify-between items-center gap-5 md:w-[700px] m-auto mt-[100px] md:mt-10 p-2'>

    <div className='hidden md:flex justify-center'>
        <Image src="/images/edqorta.png" alt="." width={250} height={70} />
    </div>

     <div className='flex md:hidden justify-center'>
        <Image src="/images/edqorta.png" alt="." width={150} height={50} />
    </div>

      <div>
        <h2 className='mt-10 text-start text-lg font-extrabold'>Create an account</h2>

      <button className='w-full flex justify-center gap-3 rounded-3xl p-2 px-5 bg-[#fff] text-[#000] mt-5 cursor-pointer  font-bold
      '>
        <FcGoogle size={20} />
        Sign up with Google

      </button>
      <button className='w-full flex justify-center gap-3 rounded-3xl p-2 px-5 bg-[#fff] text-[#000] mt-3 cursor-pointer  font-bold'>
        <FaApple size={20} />
        Sign up with Apple


      </button>


      <div className='flex justify-center mt-5'>
        <span className=''></span>  <h3>OR</h3>     <span></span>
      </div>


      <button className='w-full rounded-3xl p-2 px-5 bg-[#fff] text-[#000] mt-5 cursor-pointer  font-bold' onClick={handleSignUp}>
        Create Account
      </button>

      <div className='mt-3'>

        <p className='text-gray-500 text-[10px]'>
          By signing up, you agree to the <span className=' text-[#6f6de0]'>Terms of Service</span> and <span className=' text-[#6f6de0]'>Privacy Policy</span>, <br/> including <span className=' text-[#6f6de0]'>Cookie Use</span>.
        </p>

      </div>



      <h3 className='mt-10 text-sm'>Already have an account?</h3>

      <button className='w-full rounded-3xl p-2 px-5 bg-[#fff] text-[#6f6de0] mt-3 cursor-pointer  font-bold' onClick={handleSignIn}>
        Sign in
      </button>
      </div>
    </div>
  )
}

export default Home
