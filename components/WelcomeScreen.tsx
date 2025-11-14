"use client"
import React from 'react';
import { GoogleIcon } from './Icons';
import Link from 'next/link';
import axios from '@/api/axios';
import { notifyError, notifySuccess, notifyWarning } from "../utils/notify"


interface WelcomeScreenProps {
  onStartSignUp: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartSignUp }) => {

  const handleGoggleAuth = async () => {

    try {

     const response = await axios.get("/auth/google");
     if(response.status === 200){

     }

    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
      notifyError(`Login error: ${error.response?.data?.message || error.message}`);
    }

  }
  return (
    <div className="flex flex-col md:flex-row h-screen bg-white">
      <div className="relative md:w-1/2 w-full h-1/3 md:h-full">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/videos/hero-video.mp4" type="video/mp4" />
          <source src="/videos/hero-video.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:bg-gradient-to-r md:from-black/60"></div>
      </div>

      <div className="flex-1 rounded-t-3xl md:rounded-none -mt-8 md:mt-0 z-10 p-8 flex flex-col text-center justify-center bg-white md:w-1/2">
        <div className="max-w-sm mx-auto w-full">
          <h1 className="text-4xl font-bold text-gray-800 leading-tight">
            Discover Your Dream Home here
          </h1>
          <p className="text-gray-500 mt-4">
            The foundational trust layer for real estate.
          </p>

          <div className="mt-12 space-y-4">
            <button onClick={handleGoggleAuth} className="w-full cursor-pointer flex items-center justify-center gap-3 py-3 px-6 border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-100 transition-colors">
              <GoogleIcon />
              Continue with Google
            </button>
            <button
              onClick={onStartSignUp}
              className="w-full  cursor-pointer py-4 px-6 bg-violet-600 text-white rounded-full font-semibold hover:bg-violet-700 transition-colors shadow-lg shadow-violet-500/20"
            >
              Create account
            </button>
            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-sm">or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <Link href="/login">
              <button

                className="w-full cursor-pointer py-4 px-6 border border-violet-400 text-black rounded-full font-semibold bg-violet-300 transition-colors shadow-lg shadow-violet-500/20"
              >
                Login
              </button>
            </Link>

          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
