import React from 'react'
import Image from "next/image";
import { Twitter, MessageCircle, Github, Send } from "lucide-react";


const Footer = () => {
    const socialLinks = [
        {
            name: "Twitter",
            icon: <Twitter className="w-4 h-4" />,
            href: "https://x.com/Capyhl",
            color: "hover:text-blue-400"
        },
        {
            name: "Telegram",
            icon: <Send className="w-4 h-4" />,
            href: "https://t.me/capyhl",
            color: "hover:text-blue-500"
        },

    ];
    return (
        <div className='bg-[#171717] text-[#7CD0EF] text-[12px] lg:text-sm'>

            <div className='flex justify-between gap-2'>
                <div>
                    <Image src="/images/logo.png" width={50} height={50} alt='bug-logo' />
                </div>

                <div>
                    <ul>
                        <li>Home</li>
                        <li>Account</li>
                        <li>Mine</li>
                    </ul>
                </div>

                <div>
                    <ul>
                        <li>Mint Buggy Nft</li>
                        <li>Tokenomics</li>
                        <li>Updates</li>
                    </ul>
                </div>

            </div>


            <div className='flex justify-between'>
                <p className='text-[10px]'>
                    © 2025 BUG Project. All bugs reserved 🐛
                    <p>Built by Degens, for Degens.</p>
                </p>

                <div className="flex justify-center space-x-4">
                    {socialLinks.map((social) => (
                        <a
                            key={social.name}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`
                    flex items-center justify-center w-8 h-8
                    bg-gray-800/50 border border-gray-700 rounded-full 
                    transition-all duration-300 ease-in-out
                    hover:bg-gray-700/50 hover:border-gray-600 
                    hover:scale-110 hover:shadow-lg
                    ${social.color}
                    group
                  `}
                            aria-label={social.name}
                        >
                            <div className="transition-transform duration-300 group-hover:scale-110">
                                {social.icon}
                            </div>
                        </a>
                    ))}
                </div>
            </div>

        </div>
    )
}

export default Footer
