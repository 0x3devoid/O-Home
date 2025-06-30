'use client'
import React, { useState } from 'react'
import Image from "next/image";
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';
import { showSuccessToast } from '../utils/notify';
import { Toaster } from 'react-hot-toast';

const page = () => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [next, setnext] = useState(false)


    function handleSignUp() {
        window.location.href = '/';
    }

    const handleNext = () => {
        if (!email) return;
        setnext(true)

    }

    const handleForm = (e: React.FormEvent) => {
        e.preventDefault();

        showSuccessToast("Login successful!");

        window.location.href = '/home';

    }



    return (
      <>
      
        <div className='md:flex justify-between items-center gap-5 md:w-[700px] m-auto mt-[100px] md:mt-10'>
    
        <div className='hidden md:flex justify-center'>
            <Image src="/images/logo.png" alt="." width={150} height={150} />
        </div>
    
         <div className='flex md:hidden justify-center'>
            <Image src="/images/logo.png" alt="." width={50} height={50} />
        </div>

            <div>

                {!next &&

                <>
            <h1 className='mt-10 text-start text-lg font-extrabold'>Sign in to H</h1>

                    <div className='w-full flex justify-center gap-3 rounded-3xl p-2 px-5 bg-[#fff] text-[#000] mt-5 cursor-pointer text-sm font-thin
          '>
                        <FcGoogle size={20} />
                        Sign in with Google

                    </div>
                    <div className='w-full flex justify-center gap-3 rounded-3xl p-2 px-5 bg-[#fff] text-[#000] mt-3 cursor-pointer text-sm font-thin'>
                        <FaApple size={20} />
                        Sign in with Apple


                    </div>


                    <div className='flex justify-center mt-5'>
                        <span className=''></span>  <h3>OR</h3>     <span></span>
                    </div>
                    <div>

                        <input type="text" placeholder='Email or Username' onChange={((e) => setEmail(e.target.value))} className='w-full rounded p-2 px-2 border border-gray-600 text-[#fff] bg-transparent mt-5 cursor-pointer text-sm font-thin' required />

                        <button className='w-full rounded-3xl p-2 px-5 bg-[#fff] text-[#000] mt-5 cursor-pointer text-sm font-bold' typeof='button' onClick={handleNext} >
                            Next
                        </button>

                    </div>

                </>


            }


            {next &&
                <div>
                    <h1 className='mt-10 text-start text-lg font-extrabold'>Enter your password</h1>

                    <form onSubmit={handleForm}>
                        <input placeholder={email} onChange={((e) => setPassword(e.target.value))} className='w-full rounded p-2 px-2 border border-gray-600 text-[#fff] bg-transparent mt-5 text-sm font-thin' required disabled />

                        <input type="password" placeholder='Password' className='w-full rounded p-2 px-2 border border-gray-600 text-[#fff] bg-transparent mt-5 cursor-pointer text-sm font-thin' required />

                        <p className='text-start text-[10px] text-[#6f6de0]'>Forgot password?</p>

                        <button className='w-full rounded-3xl p-2 px-5 bg-[#fff] text-[#000] mt-10 cursor-pointer text-sm font-bold' >
                            Log In
                        </button>
                    </form>

                </div>}




            <p className='text-gray-500 text-[14px] mt-10 text-start'>
                Don't have an account? <span className='text-[#6f6de0] cursor-pointer' onClick={handleSignUp}>Sign Up</span>
            </p>
                </div>
        </div>

    <Toaster/>

      </>
    )
}

export default page
