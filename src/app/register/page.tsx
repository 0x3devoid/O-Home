'use client'
import React, { useState } from 'react'
import Image from "next/image";
import { showSuccessToast } from '../utils/notify';
import { Toaster } from 'react-hot-toast';


// export const metadata = {
//   title: "Registration | H",
// };



const page = () => {

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };
    const handleForm = (e: React.FormEvent) => {
        e.preventDefault();
        showSuccessToast("Account created successfully!");
        window.location.href = '/home';
    }

    return (
        <>

            <div className='md:flex justify-between items-center gap-5 md:w-[700px] w-[350px]  m-auto mt-[100px] md:mt-10 p-2'>

                <div className='hidden md:flex justify-center'>
                    <Image src="/images/edqorta.png" alt="." width={250} height={70} />
                </div>

                <div className='flex md:hidden justify-center'>
                    <Image src="/images/edqorta.png" alt="." width={150} height={50} />
                </div>


                <div>
                    <h1 className='mt-10 text-start text-lg font-extrabold'>Create your account</h1>

                    <form onSubmit={handleForm} className="md:w-[400px]">
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full rounded p-2 px-2 border border-gray-600 text-[#fff] bg-transparent mt-3 cursor-pointer text-sm font-thin"
                            required
                        />
                       
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full rounded p-2 px-2 border border-gray-600 text-[#fff] bg-transparent mt-3 cursor-pointer text-sm font-thin"
                            required
                        />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full rounded p-2 px-2 border border-gray-600 text-[#fff] bg-transparent mt-3 cursor-pointer text-sm font-thin"
                            required
                        />
                        <input
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full rounded p-2 px-2 border border-gray-600 text-[#fff] bg-transparent mt-3 cursor-pointer text-sm font-thin"
                            required
                        />
                        <button
                            type="submit"
                            className="w-full rounded-3xl p-2 px-5 bg-[#fff] text-[#000] mt-5 cursor-pointer text-sm font-bold"
                        >
                            Next
                        </button>
                    </form>
                </div>

            </div>

            <Toaster />

        </>
    )
}

export default page
