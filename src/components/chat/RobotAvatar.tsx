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
        >
            {/* Gradient Definitions */}
            <defs>
                <linearGradient id="robotGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" />
                    <stop offset="100%" stopColor="#764ba2" />
                </linearGradient>

                <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#667eea" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#764ba2" stopOpacity="0.6" />
                </linearGradient>

                <filter id="glow">
                    <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                    <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>

            {/* Glow Ring (outer) */}
            <circle
                cx="50"
                cy="50"
                r="42"
                fill="none"
                stroke="url(#glowGradient)"
                strokeWidth="2"
                className="glow-ring"
                opacity="0.4"
            />

            {/* Robot Head */}
            <circle
                cx="50"
                cy="50"
                r="35"
                fill="url(#robotGradient)"
            />

            {/* Antenna Base */}
            <line
                x1="50"
                y1="15"
                x2="50"
                y2="20"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
            />

            {/* Antenna Tip with pulse */}
            <circle
                cx="50"
                cy="12"
                r="3"
                fill="#fff"
                className="antenna-tip"
                filter="url(#glow)"
            />

            {/* Eyes Container */}
            <g className="eyes">
                {/* Left Eye */}
                <ellipse
                    cx="38"
                    cy="45"
                    rx="5"
                    ry="6"
                    fill="#fff"
                    className="eye-left"
                />
                <circle
                    cx="38"
                    cy="45"
                    r="2"
                    fill="#667eea"
                    className="pupil-left"
                />

                {/* Right Eye */}
                <ellipse
                    cx="62"
                    cy="45"
                    rx="5"
                    ry="6"
                    fill="#fff"
                    className="eye-right"
                />
                <circle
                    cx="62"
                    cy="45"
                    r="2"
                    fill="#667eea"
                    className="pupil-right"
                />
            </g>

            {/* Smile */}
            <path
                d="M 38 62 Q 50 68 62 62"
                stroke="#fff"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
            />

            {/* Cheek Lights (optional decorative elements) */}
            <circle cx="30" cy="55" r="2" fill="#fff" opacity="0.6" />
            <circle cx="70" cy="55" r="2" fill="#fff" opacity="0.6" />
        </svg>
    );
}
