import React from 'react'

const HLogo = ({ size = 32, className = "", color = "currentColor" }) => {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      className={className}
      style={{ color }}
    >
      <defs>
        <linearGradient id="hGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{stopColor: 'rgba(255,255,255,0.2)', stopOpacity: 1}} />
          <stop offset="100%" style={{stopColor: 'rgba(0,0,0,0.2)', stopOpacity: 1}} />
        </linearGradient>
      </defs>
      
      <g transform="translate(50, 50)">
        {/* Left vertical bar */}
        <rect x="-22" y="-28" width="10" height="56" fill="currentColor" rx="3"/>
        
        {/* Right vertical bar */}
        <rect x="12" y="-28" width="10" height="56" fill="currentColor" rx="3"/>
        
        {/* Horizontal connecting bar */}
        <rect x="-22" y="-5" width="44" height="10" fill="currentColor" rx="3"/>
        
        {/* Modern accent dots */}
        <circle cx="-17" cy="-23" r="2.5" fill="currentColor"/>
        <circle cx="17" cy="-23" r="2.5" fill="currentColor"/>
        <circle cx="-17" cy="23" r="2.5" fill="currentColor"/>
        <circle cx="17" cy="23" r="2.5" fill="currentColor"/>
        
        {/* Subtle highlight for depth */}
        <rect x="-22" y="-28" width="10" height="56" fill="url(#hGradient)" rx="3" opacity="0.4"/>
        <rect x="12" y="-28" width="10" height="56" fill="url(#hGradient)" rx="3" opacity="0.4"/>
        <rect x="-22" y="-5" width="44" height="10" fill="url(#hGradient)" rx="3" opacity="0.4"/>
      </g>
    </svg>
  )
}
export default HLogo;