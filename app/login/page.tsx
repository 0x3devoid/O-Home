'use client';
import React, { useState, useRef, useEffect } from 'react';
import axios from '@/api/axios';
import { notifyError, notifySuccess, notifyWarning } from "../../utils/notify"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useStore } from "@/lib/store"


const EyeIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeSlashIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

const ArrowLeftIcon = () => (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

interface VerifyContactStepProps {
    email: string;
    onVerified: (code: string) => void;
    onBack: () => void;
    isSubmitting: boolean;
}

const VerifyContactStep: React.FC<VerifyContactStepProps> = ({ email, onVerified, onBack, isSubmitting }) => {
    const [code, setCode] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const hasSubmittedRef = useRef(false);
    const CODE_LENGTH = 6;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        if (value.length <= CODE_LENGTH) {
            setCode(value);
            // Reset submission flag when user changes the code
            if (hasSubmittedRef.current) {
                hasSubmittedRef.current = false;
            }
        }
    };

    const handleContainerClick = () => {
        inputRef.current?.focus();
    };

    const handleResendCode = async () => {
        try {
            await axios.post('/auth/otp/resend', { email });
            notifySuccess('Verification code resent successfully!');
        } catch (error: any) {
            notifyError(`Failed to resend code: ${error.response?.data?.message || error.message}`);
        }
    };

    useEffect(() => {
        if (code.length === CODE_LENGTH && !hasSubmittedRef.current && !isSubmitting) {
            hasSubmittedRef.current = true;
            setTimeout(() => {
                onVerified(code);
            }, 300);
        }
    }, [code, onVerified, isSubmitting]);

    return (
        <div className="flex flex-col h-full animate-fadeIn">
            <button
                onClick={onBack}
                className="p-2 mb-4 cursor-pointer rounded-xl hover:bg-gray-100 transition-colors text-gray-600 w-fit"
            >
                <ArrowLeftIcon />
            </button>

            <div className="flex-grow">
                <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Verify your Email</h2>
                <p className="text-gray-500 mb-8">
                    We sent a {CODE_LENGTH}-digit code to{' '}
                    <span className="font-semibold text-gray-800">{email}</span>
                </p>

                <label className="block text-sm font-semibold text-gray-700 mb-4">Verification Code</label>
                <div className="flex justify-center gap-3 cursor-text" onClick={handleContainerClick}>
                    {Array.from({ length: CODE_LENGTH }).map((_, index) => (
                        <div
                            key={index}
                            className={`w-14 h-16 flex items-center justify-center text-2xl font-bold rounded-2xl transition-all duration-300 ${code.length > index
                                ? 'bg-violet-600 text-white border-2 border-violet-600 scale-105 shadow-lg'
                                : code.length === index
                                    ? 'border-2 border-violet-500 bg-violet-50 scale-105'
                                    : 'border-2 border-gray-200 bg-white'
                                }`}
                        >
                            {code[index] || ''}
                        </div>
                    ))}
                </div>
                <input
                    ref={inputRef}
                    type="tel"
                    value={code}
                    onChange={handleInputChange}
                    maxLength={CODE_LENGTH}
                    className="absolute opacity-0 w-0 h-0"
                    disabled={isSubmitting}
                    autoFocus
                />

                {isSubmitting && (
                    <div className="mt-4 text-center text-violet-600 font-semibold animate-fadeIn">
                        Verifying...
                    </div>
                )}

                <button
                    type="button"
                    onClick={handleResendCode}
                    className="w-full cursor-pointer mt-8 text-center text-violet-600 font-semibold hover:text-violet-700 transition-colors disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    Resend code
                </button>
            </div>
        </div>
    );
};

const Login = () => {
    const router = useRouter();
    const { setCurrentUser } = useStore();
    const [emailInput, setEmailInput] = useState('');
    const [passwordInput, setPasswordInput] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [loading, setIsLoading] = useState(false);
    const [showOtpVerification, setShowOtpVerification] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput);
        if (!isEmailValid) {
            notifyWarning("Invalid email address");
            return;
        }

        setIsLoading(true);

        try {
            const data = {
                email: emailInput,
                password: passwordInput
            };
            const response = await axios.post('/auth/signin', data);

            if (response.status === 200) {
                notifySuccess(response.data.message || 'Login successful!');
                console.log(response.data)
                const userData =  response.data;
                const token = response.data.accessToken;

                setCurrentUser(userData, token);
                router.push('/home')
            } else if (response.status === 201) {
                // User hasn't verified OTP
                notifyWarning('Please verify your email address to continue');
                setShowOtpVerification(true);
            }

        } catch (error: any) {
            console.error('Login error:', error.response?.data || error.message);
            notifyError(`Login error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleOtpVerified = async (code: string) => {
        if (loading) return;

        setIsLoading(true);

        try {
            const payload = {
                email: emailInput,
                otp: String(code)
            };

            console.log('Verifying OTP for email:', payload.email);
            const response = await axios.post('/auth/otp/verify', payload);

            if (response.status === 200) {
                notifySuccess('Email verified successfully! Please login again.');
                setShowOtpVerification(false)
                setPasswordInput('');
            }
        } catch (error: any) {
            console.error('Verification error:', error.response?.data?.message || error.message);
            notifyError(`Verification error: ${error.response?.data?.message || error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBackToLogin = () => {
        setShowOtpVerification(false);
    };

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
                <div className="w-full max-w-md bg-white rounded-3xl p-8">
                    <main className="min-h-fit flex flex-col">
                        {!showOtpVerification ? (
                            <>
                                <div className="flex flex-col h-full animate-fadeIn">
                                    <div className="flex-grow">
                                        <h2 className="text-3xl font-extrabold text-gray-800 mb-2">Login</h2>

                                        <div className='mt-10'>
                                            <label htmlFor="email" className="block text-sm text-start font-bold text-gray-700 mb-2">
                                                Email
                                            </label>
                                            <div className="flex items-center p-4 border-2 border-gray-200 rounded-2xl focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100 transition-all bg-white">
                                                <input
                                                    id="email"
                                                    type="email"
                                                    value={emailInput}
                                                    onChange={(e) => setEmailInput(e.target.value)}
                                                    placeholder="you@example.com"
                                                    className="w-full outline-none bg-transparent text-gray-800 text-lg"
                                                    autoFocus
                                                    required
                                                    disabled={loading}
                                                />
                                            </div>
                                        </div>

                                        <label htmlFor="password" className="block mt-5 text-sm text-start font-bold text-gray-700 mb-2">
                                            Password
                                        </label>

                                        <div className="relative">
                                            <input
                                                id="password"
                                                type={isPasswordVisible ? 'text' : 'password'}
                                                value={passwordInput}
                                                onChange={(e) => setPasswordInput(e.target.value)}
                                                placeholder="Enter at least 8 characters"
                                                className="w-full p-4 pr-12 border-2 border-gray-200 rounded-2xl focus:border-violet-500 focus:ring-4 focus:ring-violet-100 outline-none transition-all bg-white text-gray-800 text-lg"
                                                required
                                                disabled={loading}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                                                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                {isPasswordVisible ? <EyeSlashIcon /> : <EyeIcon />}
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading}
                                        className={`w-full cursor-pointer py-4 px-6 mt-5 bg-violet-600 rounded-2xl font-semibold transition-all duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-violet-700 hover:shadow-lg active:scale-98 ${loading ? "text-[#333] font-bold" : "text-white"}`}
                                    >
                                        {loading ? "Signing In..." : "Login"}
                                    </button>
                                </div>

                                <div className="flex items-center mt-5">
                                    <div className="flex-grow border-t border-gray-200"></div>
                                    <span className="flex-shrink mx-4 text-gray-400 text-sm">You dont have an account yet?</span>
                                    <div className="flex-grow border-t border-gray-200"></div>
                                </div>

                                <Link href="/">
                                    <button className="w-full mt-5 cursor-pointer flex items-center justify-center gap-3 py-3 px-6 border border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-100 transition-colors">
                                        Create Account
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <VerifyContactStep
                                email={emailInput}
                                onVerified={handleOtpVerified}
                                onBack={handleBackToLogin}
                                isSubmitting={loading}
                            />
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
};



export default Login;