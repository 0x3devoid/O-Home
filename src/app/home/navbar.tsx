"use client"
import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { Home, Search, MessageSquare, User, Settings, Bell, Menu, X, Bookmark } from 'lucide-react'

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [touchStart, setTouchStart] = useState(null)
    const [touchEnd, setTouchEnd] = useState(null)
    const menuRef = useRef(null)
    const overlayRef = useRef(null)

    // Minimum swipe distance (in px)
    const minSwipeDistance = 50

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
    }

    const closeMenu = () => {
        setIsMenuOpen(false)
    }

    // Handle touch events for swipe gestures
    const onTouchStart = (e: any) => {
        setTouchEnd(null)
        setTouchStart(e.targetTouches[0].clientX)
    }

    const onTouchMove = (e: any) => {
        setTouchEnd(e.targetTouches[0].clientX)
    }

    const onTouchEnd = () => {
        if (!touchStart || !touchEnd) return

        const distance = touchStart - touchEnd
        const isLeftSwipe = distance > minSwipeDistance
        const isRightSwipe = distance < -minSwipeDistance

        // Close menu on left swipe (swipe left to close)
        if (isLeftSwipe && isMenuOpen) {
            closeMenu()
        }
        // Open menu on right swipe (swipe right to open)
        else if (isRightSwipe && !isMenuOpen) {
            setIsMenuOpen(true)
        }
    }


    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }

        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isMenuOpen])

    const navigationItems = [
        { href: '/home', icon: Home, label: 'Home' },
        { href: '/explore', icon: Search, label: 'Explore' },
        { href: '/notifications', icon: Bell, label: 'Notifications' },
        { href: '/messages', icon: MessageSquare, label: 'Messages' },
        { href: '/bookmarks', icon: Bookmark, label: 'Bookmarks' },
        { href: '/profile', icon: User, label: 'Profile' },
        { href: '/settings', icon: Settings, label: 'Settings' },
    ]

    return (
        <>
            {/* Desktop Navigation */}
            <div className='hidden md:block h-full mobile-no-scrollbar-nav border-r border-[#8899]'>
                <div className='w-full flex flex-col justify-center items-center md:justify-end md:items-end gap-2 md:gap-4 p-2 md:p-4'>
                    <a href='/home' className='cursor-pointer mb-3'>
                        <div className='flex justify-center'>
                            <Image src="/images/edqorta.png" alt="." width={100} height={35} />
                        </div>
                    </a>

                    {navigationItems.map((item) => {
                        const IconComponent = item.icon
                        return (
                            <a
                                key={item.href}
                                href={item.href}
                                className='cursor-pointer rounded-full hover:rounded-full hover:bg-[#8899] p-2 transition-colors duration-100'
                            >
                                <IconComponent className='w-4 h-4 md:w-6 md:h-6' />
                                
                            </a>
                        )
                    })}
                </div>
            </div>

            {/* Mobile Navigation */}
            <div className='md:hidden'>
                {/* Mobile Header with Hamburger */}
                <div className='fixed top-0 left-0 right-0 z-50  px-4 py-3 flex items-center justify-between bg-black'>


                    <button
                        onClick={toggleMenu}
                        className='p-1 rounded-full hover:bg-[#8899] transition-colors duration-100'
                        aria-label="Toggle menu"
                    >
                        <Menu className='w-4 h-4' />
                    </button>


                    <Image src="/images/edqorta.png" alt="." width={100} height={35} />


                    <div>
                        
                    </div>
                </div>

                {/* Overlay */}
                {isMenuOpen && (
                    <div
                        ref={overlayRef}
                        className='fixed inset-0 bg-black bg-opacity-70 z-40'
                        onClick={closeMenu}
                        onTouchStart={onTouchStart}
                        onTouchMove={onTouchMove}
                        onTouchEnd={onTouchEnd}
                    />
                )}

                {/* Slide-out Menu */}
                <div
                    ref={menuRef}
                    className={`fixed top-0 left-0 h-full w-80 bg-[#000] border-r-[0.1px] border-[#31313199] z-50 transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                        }`}
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    {/* Menu Header */}
                    <div className='flex items-center justify-between p-4 '>
                        <a href='/profile' className='cursor-pointer'>
                            <Image src={"/images/cat_nft.jpg"} className='rounded-full' width={30} height={30} alt='.' />

                        </a>
                        <button
                            onClick={closeMenu}
                            className='p-1 rounded-full hover:bg-[#8899] transition-colors duration-100'
                            aria-label="Close menu"
                        >
                            <X className='w-4 h-4' />
                        </button>
                    </div>

                    <div className='p-4'>
                        <h1 className='text-white font-extrabold text-lg'>Owoyemi Idris Olamilekan.</h1>
                        <h3 className='text-gray-500 text-[12px]'>
                            0x3Devoid
                        </h3>

                        <div className='flex items-center gap-2 mt-2'>
                            <span className='text-xs text-gray-500'><span className='text-white font-extrabold'>2,740</span> Followers</span>
                            <span className='text-xs text-gray-500'> <span className='text-white font-extrabold'>540</span> Following</span>
                        </div>



                    </div>

                    {/* Menu Items */}
                    <div className='p-4'>
                        <nav className='space-y-2'>
                            {navigationItems.map((item) => {
                                const IconComponent = item.icon
                                return (
                                    <a
                                        key={item.href}
                                        href={item.href}
                                        onClick={closeMenu}
                                        className='flex items-center gap-3 p-2 rounded-lg hover:bg-[#8899] transition-colors duration-100'
                                    >
                                        <IconComponent className='w-4 h-4' />
                                        <span className='text-sm font-extrabold'>{item.label}</span>
                                    </a>
                                )
                            })}
                        </nav>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Navbar