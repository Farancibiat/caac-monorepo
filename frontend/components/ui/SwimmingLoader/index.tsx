'use client'

import React from 'react'
import Image from 'next/image'
import './styles.css'

interface SwimmingLoaderProps {
  size?: number
  className?: string
}

const SwimmingLoader: React.FC<SwimmingLoaderProps> = ({ 
  size = 120, 
  className = '' 
}) => {
  // Cálculos simples y claros
  const containerSize = size * 2
  const center = size
  const maskRadius = size * 0.45
  const waveRadius = size * 0.3
  const textTop = size + (size * 0.4)
  const maskId = `logo-mask-${size}`
  
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative">
        <div className="relative inline-block">
          {/* Ondas de agua */}
          <svg 
            width={containerSize} 
            height={containerSize} 
            className="absolute inset-0"
            viewBox={`0 0 ${containerSize} ${containerSize}`}
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <mask id={maskId}>
                <rect width="100%" height="100%" fill="white" />
                <circle cx={center} cy={center} r={maskRadius} fill="black" />
              </mask>
            </defs>
            
            <g mask={`url(#${maskId})`}>
              <circle
                cx={center}
                cy={center}
                r={waveRadius}
                fill="none"
                stroke="rgba(129, 206, 200, 0.6)"
                strokeWidth="3"
                className="animate-water-ripple-1"
                style={{ transformOrigin: `${center}px ${center}px` }}
              />
              <circle
                cx={center}
                cy={center}
                r={waveRadius}
                fill="none"
                stroke="rgba(129, 206, 200, 0.4)"
                strokeWidth="2"
                className="animate-water-ripple-2"
                style={{ transformOrigin: `${center}px ${center}px` }}
              />
              <circle
                cx={center}
                cy={center}
                r={waveRadius}
                fill="none"
                stroke="rgba(129, 206, 200, 0.2)"
                strokeWidth="1"
                className="animate-water-ripple-3"
                style={{ transformOrigin: `${center}px ${center}px` }}
              />
            </g>
          </svg>
          
          {/* Logo */}
          <div 
            className="relative z-10 flex items-center justify-center"
            style={{ width: containerSize, height: containerSize }}
          >
            <div className="animate-breathing">
              <Image
                src="/assets/logo.png"
                alt="Loading..."
                width={size}
                height={size}
                className="drop-shadow-lg"
                priority
              />
            </div>
          </div>
          
          {/* Texto de carga */}
          <div 
            className="absolute z-20 flex items-center justify-center space-x-1"
            style={{ 
              left: '50%', 
              top: `${textTop}px`, 
              transform: 'translateX(-50%)' 
            }}
          >
            <span className="text-teal-600 font-medium animate-loading-text">
              Cargando
            </span>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-teal-600 rounded-full animate-sequential-dot-1"></div>
              <div className="w-1 h-1 bg-teal-600 rounded-full animate-sequential-dot-2"></div>
              <div className="w-1 h-1 bg-teal-600 rounded-full animate-sequential-dot-3"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default SwimmingLoader;