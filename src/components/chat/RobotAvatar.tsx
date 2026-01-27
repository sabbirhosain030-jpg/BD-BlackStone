'use client';

import React from 'react';

interface RobotAvatarProps {
    animated?: boolean;
    size?: number;
}

export default function RobotAvatar({ animated = true, size = 48 }: RobotAvatarProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={animated ? 'robot-avatar animated' : 'robot-avatar'}
            style={{ overflow: 'visible' }}
        >
            <style jsx>{`
                @keyframes wink {
                    0%, 45%, 55%, 100% { transform: scaleY(1); }
                    50% { transform: scaleY(0.1); }
                }
                @keyframes bounceFace {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-3px); }
                }
                .eye-wink { 
                    transform-origin: center; 
                    animation: wink 4s infinite 2s; 
                }
                .robot-face {
                    animation: bounceFace 3s ease-in-out infinite;
                    transform-origin: center;
                }
            `}</style>

            {/* Vibrant Premium Gradient */}
            <defs>
                <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF00CC" /> {/* Hot Pink */}
                    <stop offset="50%" stopColor="#333399" /> {/* Deep Purple */}
                    <stop offset="100%" stopColor="#00FFFF" /> {/* Cyan */}
                </linearGradient>
                <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Group for Face Animation */}
            <g className="robot-face">
                {/* Robot Head - COVERS FULL CIRCLE (r=48) */}
                <circle
                    cx="50"
                    cy="50"
                    r="48"
                    fill="url(#robotGradient)"
                    stroke="white"
                    strokeWidth="2"
                />

                {/* Ears / Headphones */}
                <rect x="0" y="40" width="10" height="20" rx="2" fill="#333" />
                <rect x="90" y="40" width="10" height="20" rx="2" fill="#333" />

                {/* Antenna */}
                <line x1="50" y1="2" x2="50" y2="15" stroke="#333" strokeWidth="3" />
                <circle cx="50" cy="2" r="4" fill="#FF0000" className="antenna-tip">
                    <animate attributeName="opacity" values="1;0.4;1" dur="1.5s" repeatCount="indefinite" />
                </circle>

                {/* Eyes Container */}
                <g className="eyes">
                    {/* Left Eye (Static) */}
                    <circle cx="35" cy="45" r="8" fill="white" />
                    <circle cx="35" cy="45" r="3" fill="#333" />

                    {/* Right Eye (Winking) */}
                    <g className="eye-wink">
                        <circle cx="65" cy="45" r="8" fill="white" />
                        <circle cx="65" cy="45" r="3" fill="#333" />
                    </g>
                </g>

                {/* Smile - Big & Friendly */}
                <path
                    d="M 30 65 Q 50 80 70 65"
                    stroke="white"
                    strokeWidth="4"
                    strokeLinecap="round"
                    fill="none"
                />
            </g>
        </svg>
    );
}
