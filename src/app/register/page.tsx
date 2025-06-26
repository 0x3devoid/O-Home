'use client'
import React, { useState } from 'react'
import Image from "next/image";
import { showSuccessToast } from '../utils/notify';
import { Toaster } from 'react-hot-toast';


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

            <div className='w-[300px] m-auto text-center py-3'>

                <div className='flex justify-center'>
                    <Image src="/images/logo.png" alt="." width={50} height={50} />
                </div>
                <h1 className='mt-10 text-start text-lg font-extrabold'>Create your account</h1>


                <form onSubmit={handleForm}>
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
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
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
                        Create Account
                    </button>
                </form>


            </div>

            <Toaster />

        </>
    )
}

export default page
