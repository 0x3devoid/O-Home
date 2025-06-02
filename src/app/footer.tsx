import { Twitter, MessageCircle, Github, Send } from "lucide-react";

export default function CapyFooter() {
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
    <div className=" text-white flex items-center justify-center">
      <div className="max-w-4xl w-full">
        <footer className="mt-20">
          <div className="mb-5">
            <h2 className="text-2xl font-extrabold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              $Capy
            </h2>

            <p className="mt-2 text-[12px] lg:text-sm text-gray-300">
              Leveraging the power of decentralized finance (DeFi) to provide innovative liquidity opportunities for HyperEvm community.
            </p>
          </div>

          <hr className="border-gray-700" />

          <div className="flex justify-between items-center mt-5">
            <p className="text-[8px] text-gray-400">
              Capy, All Rights Reserved | Copyright © 2025
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

        </footer>
      </div>
    </div>
  );
}