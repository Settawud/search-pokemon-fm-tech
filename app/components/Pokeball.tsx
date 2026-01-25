"use client";

import { motion } from "framer-motion";

// 3D Pokeball with wobble animation
export function Pokeball({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <motion.div
            className={className}
            animate={{
                rotate: [0, -8, 8, -5, 5, -2, 2, 0],
            }}
            transition={{
                duration: 1.2,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut"
            }}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                {/* Definitions for gradients */}
                <defs>
                    {/* Red top gradient */}
                    <linearGradient id="redGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FF6B6B" />
                        <stop offset="50%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#B91C1C" />
                    </linearGradient>

                    {/* White bottom gradient */}
                    <linearGradient id="whiteGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="50%" stopColor="#F8FAFC" />
                        <stop offset="100%" stopColor="#E2E8F0" />
                    </linearGradient>

                    {/* Button gradient */}
                    <radialGradient id="buttonGradient" cx="40%" cy="40%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="50%" stopColor="#F1F5F9" />
                        <stop offset="100%" stopColor="#CBD5E1" />
                    </radialGradient>

                    {/* Shadow for 3D effect */}
                    <filter id="innerShadow" x="-50%" y="-50%" width="200%" height="200%">
                        <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000" floodOpacity="0.3" />
                    </filter>
                </defs>

                {/* Main ball shadow */}
                <ellipse cx="50" cy="92" rx="30" ry="6" fill="rgba(0,0,0,0.2)" />

                {/* Top half - Red with gradient */}
                <path
                    d="M 50 5 A 45 45 0 0 1 95 50 L 62 50 A 12 12 0 0 0 38 50 L 5 50 A 45 45 0 0 1 50 5"
                    fill="url(#redGradient)"
                    stroke="#991B1B"
                    strokeWidth="2"
                />

                {/* Top highlight */}
                <ellipse cx="35" cy="25" rx="18" ry="10" fill="rgba(255,255,255,0.3)" />

                {/* Bottom half - White with gradient */}
                <path
                    d="M 50 95 A 45 45 0 0 1 5 50 L 38 50 A 12 12 0 0 0 62 50 L 95 50 A 45 45 0 0 1 50 95"
                    fill="url(#whiteGradient)"
                    stroke="#94A3B8"
                    strokeWidth="2"
                />

                {/* Center band - dark */}
                <rect x="5" y="47" width="90" height="6" fill="#1E293B" rx="1" />

                {/* Center button - outer ring */}
                <circle
                    cx="50"
                    cy="50"
                    r="14"
                    fill="#1E293B"
                    stroke="#0F172A"
                    strokeWidth="2"
                />

                {/* Center button - inner white */}
                <circle
                    cx="50"
                    cy="50"
                    r="10"
                    fill="url(#buttonGradient)"
                    stroke="#94A3B8"
                    strokeWidth="1"
                />

                {/* Button highlight */}
                <circle cx="47" cy="47" r="4" fill="rgba(255,255,255,0.8)" />

                {/* Button inner shadow */}
                <circle cx="52" cy="52" r="3" fill="rgba(0,0,0,0.1)" />
            </svg>
        </motion.div>
    );
}

// Pokeball with subtle float animation
export function PokeballFloat({ className = "w-8 h-8" }: { className?: string }) {
    return (
        <motion.div
            className={className}
            animate={{
                y: [0, -4, 0],
                rotate: [0, 2, -2, 0]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }}
        >
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-xl">
                <defs>
                    <linearGradient id="redGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FF6B6B" />
                        <stop offset="50%" stopColor="#EF4444" />
                        <stop offset="100%" stopColor="#B91C1C" />
                    </linearGradient>
                    <linearGradient id="whiteGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="50%" stopColor="#F8FAFC" />
                        <stop offset="100%" stopColor="#E2E8F0" />
                    </linearGradient>
                    <radialGradient id="btnGrad2" cx="40%" cy="40%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="50%" stopColor="#F1F5F9" />
                        <stop offset="100%" stopColor="#CBD5E1" />
                    </radialGradient>
                </defs>

                <ellipse cx="50" cy="92" rx="30" ry="6" fill="rgba(0,0,0,0.2)" />

                <path
                    d="M 50 5 A 45 45 0 0 1 95 50 L 62 50 A 12 12 0 0 0 38 50 L 5 50 A 45 45 0 0 1 50 5"
                    fill="url(#redGrad2)"
                    stroke="#991B1B"
                    strokeWidth="2"
                />

                <ellipse cx="35" cy="25" rx="18" ry="10" fill="rgba(255,255,255,0.3)" />

                <path
                    d="M 50 95 A 45 45 0 0 1 5 50 L 38 50 A 12 12 0 0 0 62 50 L 95 50 A 45 45 0 0 1 50 95"
                    fill="url(#whiteGrad2)"
                    stroke="#94A3B8"
                    strokeWidth="2"
                />

                <rect x="5" y="47" width="90" height="6" fill="#1E293B" rx="1" />

                <circle cx="50" cy="50" r="14" fill="#1E293B" stroke="#0F172A" strokeWidth="2" />
                <circle cx="50" cy="50" r="10" fill="url(#btnGrad2)" stroke="#94A3B8" strokeWidth="1" />
                <circle cx="47" cy="47" r="4" fill="rgba(255,255,255,0.8)" />
                <circle cx="52" cy="52" r="3" fill="rgba(0,0,0,0.1)" />
            </svg>
        </motion.div>
    );
}
