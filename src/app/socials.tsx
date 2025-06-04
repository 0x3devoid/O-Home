import React, { useEffect, useState } from 'react'
import axios from './api/axios'

interface SocialsHandlerProps {
    address: string;
}

const SocialsHandler = ({ address }: SocialsHandlerProps) => {
    const [completeX, setCompleteX] = useState(false)
    const [completeTg, setCompleteTg] = useState(false)
    const [loadingX, setLoadingX] = useState(false)
    const [loadingTg, setLoadingTg] = useState(false)
    const [initialLoading, setInitialLoading] = useState(true)
    
    // Countdown states
    const [xCountdown, setXCountdown] = useState(0)
    const [tgCountdown, setTgCountdown] = useState(0)
    const [xCanClaim, setXCanClaim] = useState(false)
    const [tgCanClaim, setTgCanClaim] = useState(false)
    const [xTaskStarted, setXTaskStarted] = useState(false)
    const [tgTaskStarted, setTgTaskStarted] = useState(false)

    useEffect(() => {
        if (address) {
            fetchUsersSocials()
        }
    }, [address])

    // Countdown effect for X
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        if (xCountdown > 0) {
            interval = setInterval(() => {
                setXCountdown(xCountdown - 1)
            }, 1000)
        } else if (xCountdown === 0 && xTaskStarted && !completeX && !xCanClaim && loadingX === false) {
            // Countdown finished, show claim button
            setXCanClaim(true)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [xCountdown, xTaskStarted, completeX, xCanClaim, loadingX])

    // Countdown effect for Telegram
    useEffect(() => {
        let interval: NodeJS.Timeout | null = null
        if (tgCountdown > 0) {
            interval = setInterval(() => {
                setTgCountdown(tgCountdown - 1)
            }, 1000)
        } else if (tgCountdown === 0 && tgTaskStarted && !completeTg && !tgCanClaim && loadingTg === false) {
            // Countdown finished, show claim button
            setTgCanClaim(true)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
    }, [tgCountdown, tgTaskStarted, completeTg, tgCanClaim, loadingTg])

    async function fetchUsersSocials() {
        try {
            setInitialLoading(true)
            const res = await axios.get(`/user/socials/${address}`)
            const data = res.data
            setCompleteX(data.x || false)
            setCompleteTg(data.tg || false)
        } catch (err) {
            setCompleteX(false)
            setCompleteTg(false)
            console.log('Error fetching user socials:', err)
        } finally {
            setInitialLoading(false)
        }
    }

    async function handleXStart() {
        if (completeX || loadingX || xCountdown > 0) return
        
        // Open X/Twitter link in new tab
        window.open('https://x.com/Capyhl', '_blank')
        
        // Mark task as started and begin countdown
        setXTaskStarted(true)
        setXCountdown(10)
    }

    async function handleXClaim() {
        if (!xCanClaim || loadingX) return
        
        try {
            setLoadingX(true)
            
            // Call API to mark as completed
            const res = await axios.post(`/user/socials/x/${address}`)
            
            if (res.data.success) {
                setCompleteX(true)
                setXCanClaim(false)
                setXCountdown(0)
                setXTaskStarted(false)
                // You might want to show a success message here
            } else {
                // Reset if API call failed
                setXCanClaim(false)
                setXCountdown(0)
                setXTaskStarted(false)
            }
        } catch (err) {
            console.log('Error claiming X task:', err)
            // Reset on error
            setXCanClaim(false)
            setXCountdown(0)
            setXTaskStarted(false)
        } finally {
            setLoadingX(false)
        }
    }

    async function handleTgStart() {
        if (completeTg || loadingTg || tgCountdown > 0) return
        
        // Open Telegram link in new tab
        window.open('https://t.me/capyhl', '_blank')
        
        // Mark task as started and begin countdown
        setTgTaskStarted(true)
        setTgCountdown(10)
    }

    async function handleTgClaim() {
        if (!tgCanClaim || loadingTg) return
        
        try {
            setLoadingTg(true)
            
            // Call API to mark as completed
            const res = await axios.post(`/user/socials/tg/${address}`)
            
            if (res.data.success) {
                setCompleteTg(true)
                setTgCanClaim(false)
                setTgCountdown(0)
                setTgTaskStarted(false)
                // You might want to show a success message here
            } else {
                // Reset if API call failed
                setTgCanClaim(false)
                setTgCountdown(0)
                setTgTaskStarted(false)
            }
        } catch (err) {
            console.log('Error claiming Telegram task:', err)
            // Reset on error
            setTgCanClaim(false)
            setTgCountdown(0)
            setTgTaskStarted(false)
        } finally {
            setLoadingTg(false)
        }
    }

    const renderXButton = () => {
        if (completeX) {
            return (
                <div className='flex items-center text-[10px] lg:text-sm bg-green-600 p-1 px-3 rounded'>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Completed
                </div>
            )
        }

        if (loadingX) {
            return (
                <button className='cursor-not-allowed bg-[#333] p-1 text-[10px] lg:text-sm px-3 flex items-center' disabled>
                    <div className="animate-spin h-4 w-4 border-4 border-[#1EEDD8] rounded-full border-t-transparent mr-2"></div>
                    Claiming...
                </button>
            )
        }

        if (xCountdown > 0) {
            return (
                <div className='bg-orange-600 text-[10px] lg:text-sm p-1 px-3 rounded flex items-center'>
                    <div className="animate-pulse h-2 w-2 bg-white rounded-full mr-2"></div>
                    Wait {xCountdown}s
                </div>
            )
        }

        if (xCanClaim) {
            return (
                <button 
                    className='cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold p-1 text-[10px] lg:text-sm px-3 transition-colors animate-pulse' 
                    onClick={handleXClaim}
                >
                    Claim
                </button>
            )
        }

        return (
            <button 
                className='cursor-pointer bg-[#1EEDD8] hover:bg-[#1EEDD8]/80 text-black font-semibold p-1 text-[10px] lg:text-sm px-3 transition-colors' 
                onClick={handleXStart}
            >
                Start Task
            </button>
        )
    }

    const renderTgButton = () => {
        if (completeTg) {
            return (
                <div className='flex items-center text-[10px] lg:text-sm bg-green-600 p-1 px-3 rounded'>
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Completed
                </div>
            )
        }

        if (loadingTg) {
            return (
                <button className='cursor-not-allowed bg-[#333] p-1 text-[10px] lg:text-sm px-3 flex items-center' disabled>
                    <div className="animate-spin h-4 w-4 border-4 border-[#1EEDD8] rounded-full border-t-transparent mr-2"></div>
                    Claiming...
                </button>
            )
        }

        if (tgCountdown > 0) {
            return (
                <div className='bg-orange-600 p-1 text-[10px] lg:text-sm px-3 rounded flex items-center'>
                    <div className="animate-pulse h-2 w-2 bg-white rounded-full mr-2"></div>
                    Wait {tgCountdown}s
                </div>
            )
        }

        if (tgCanClaim) {
            return (
                <button 
                    className='cursor-pointer bg-green-500 hover:bg-green-600 text-white font-semibold p-1 text-[10px] lg:text-sm px-3 transition-colors animate-pulse' 
                    onClick={handleTgClaim}
                >
                    Claim
                </button>
            )
        }

        return (
            <button 
                className='cursor-pointer bg-[#1EEDD8] hover:bg-[#1EEDD8]/80 text-black font-semibold p-1 text-[10px] lg:text-sm px-3 transition-colors' 
                onClick={handleTgStart}
            >
                Start Task
            </button>
        )
    }

    if (initialLoading) {
        return (
            <div className='mt-5 border border-[#333] rounded p-1 py-3'>
                <h3 className='font-extrabold text-xl'>Social Tasks</h3>
                <div className='flex justify-center items-center py-8'>
                    <div className="animate-spin h-6 w-6 border-4 border-[#1EEDD8] rounded-full border-t-transparent"></div>
                </div>
            </div>
        )
    }

    return (
        <div className='mt-5 border border-[#333] rounded p-1 py-3'>
            <h3 className='font-extrabold text-xl'>Social Tasks</h3>

            {/* X/Twitter Task */}
            <div className='mt-5 border border-[#333] rounded flex justify-between items-center p-2'>
                <div className='flex flex-col'>
                    <p className='font-semibold text-[12px] lg:text-sm'>Follow $CapyHL on X</p>
                    {xCountdown > 0 && (
                        <p className='text-[10px] text-gray-400 mt-1'>
                            Complete the task and wait {xCountdown} seconds to claim
                        </p>
                    )}
                    {xCanClaim && !completeX && (
                        <p className='text-[10px] text-green-400 mt-1'>
                            Task completed! Click to claim your reward
                        </p>
                    )}
                </div>
                {renderXButton()}
            </div>

            {/* Telegram Task */}
            <div className='mt-5 border border-[#333] rounded flex justify-between items-center p-2'>
                <div className='flex flex-col'>
                    <p className='font-semibold text-[12px] lg:text-sm'>Follow $CapyHL on Telegram</p>
                    {tgCountdown > 0 && (
                        <p className='text-[10px] text-gray-400 mt-1'>
                            Complete the task and wait {tgCountdown} seconds to claim
                        </p>
                    )}
                    {tgCanClaim && !completeTg && (
                        <p className='text-[10px] text-green-400 mt-1'>
                            Task completed! Click to claim your reward
                        </p>
                    )}
                </div>
                {renderTgButton()}
            </div>
        </div>
    )
}

export default SocialsHandler