'use client'

import { useEffect, useRef } from 'react'
import { SiteSettings } from '@/lib/types'

// Official Brand Icons for Social Channels
function FacebookIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`${className} fill-[#1877F2] shrink-0`} viewBox="0 0 24 24">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  )
}

function NexusModsIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <img 
      src="/nexusmods-logo.png" 
      alt="Nexus Mods" 
      className={`${className} object-contain shrink-0`} 
    />
  )
}

function DiscordIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={`${className} fill-[#5865F2] shrink-0`} viewBox="0 0 24 24">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  )
}

// Floating decorative element component
function FloatingIcon({
  children,
  className,
  delay = 0,
  duration = 6,
}: {
  children: React.ReactNode
  className: string
  delay?: number
  duration?: number
}) {
  return (
    <div
      className={`absolute pointer-events-none select-none ${className}`}
      style={{
        animation: `heroFloat ${duration}s ease-in-out ${delay}s infinite`,
      }}
    >
      {children}
    </div>
  )
}

// Circuit line SVG pattern
function CircuitLines() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.06]"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="circuitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4A7FFF" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#6FA0FF" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Horizontal lines */}
      <line x1="0" y1="20%" x2="25%" y2="20%" stroke="url(#circuitGrad)" strokeWidth="1" />
      <line x1="22%" y1="20%" x2="22%" y2="35%" stroke="url(#circuitGrad)" strokeWidth="1" />
      <line x1="22%" y1="35%" x2="10%" y2="35%" stroke="url(#circuitGrad)" strokeWidth="1" />

      <line x1="100%" y1="25%" x2="75%" y2="25%" stroke="url(#circuitGrad)" strokeWidth="1" />
      <line x1="78%" y1="25%" x2="78%" y2="40%" stroke="url(#circuitGrad)" strokeWidth="1" />
      <line x1="78%" y1="40%" x2="90%" y2="40%" stroke="url(#circuitGrad)" strokeWidth="1" />

      <line x1="0" y1="70%" x2="18%" y2="70%" stroke="url(#circuitGrad)" strokeWidth="1" />
      <line x1="15%" y1="70%" x2="15%" y2="60%" stroke="url(#circuitGrad)" strokeWidth="1" />

      <line x1="100%" y1="75%" x2="82%" y2="75%" stroke="url(#circuitGrad)" strokeWidth="1" />
      <line x1="85%" y1="75%" x2="85%" y2="65%" stroke="url(#circuitGrad)" strokeWidth="1" />

      {/* Dots at junctions */}
      <circle cx="22%" cy="20%" r="3" fill="#4A7FFF" opacity="0.5" />
      <circle cx="10%" cy="35%" r="2" fill="#4A7FFF" opacity="0.4" />
      <circle cx="78%" cy="25%" r="3" fill="#4A7FFF" opacity="0.5" />
      <circle cx="90%" cy="40%" r="2" fill="#4A7FFF" opacity="0.4" />
      <circle cx="15%" cy="70%" r="3" fill="#4A7FFF" opacity="0.5" />
      <circle cx="85%" cy="75%" r="3" fill="#4A7FFF" opacity="0.5" />
    </svg>
  )
}

// Gamepad SVG Icon
function GamepadIcon() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.12]">
      <rect x="15" y="35" width="90" height="55" rx="22" stroke="#4A7FFF" strokeWidth="1.5" />
      <rect x="35" y="50" width="12" height="3" rx="1.5" fill="#4A7FFF" />
      <rect x="39" y="46" width="3" height="12" rx="1.5" fill="#4A7FFF" />
      <circle cx="78" cy="48" r="4" stroke="#4A7FFF" strokeWidth="1.5" />
      <circle cx="88" cy="55" r="4" stroke="#4A7FFF" strokeWidth="1.5" />
      <circle cx="68" cy="55" r="4" stroke="#4A7FFF" strokeWidth="1.5" />
      <circle cx="78" cy="62" r="4" stroke="#4A7FFF" strokeWidth="1.5" />
      <rect x="50" y="58" width="20" height="6" rx="3" stroke="#4A7FFF" strokeWidth="1" />
      <path d="M20 70 L10 90" stroke="#4A7FFF" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M100 70 L110 90" stroke="#4A7FFF" strokeWidth="1.5" strokeLinecap="round" />
      <rect x="3" y="87" width="16" height="12" rx="6" stroke="#4A7FFF" strokeWidth="1.5" />
      <rect x="101" y="87" width="16" height="12" rx="6" stroke="#4A7FFF" strokeWidth="1.5" />
    </svg>
  )
}

// Translation Icon (文/A)
function TranslateIcon() {
  return (
    <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.12]">
      {/* Speech bubble 1 */}
      <rect x="5" y="5" width="45" height="38" rx="10" stroke="#6FA0FF" strokeWidth="1.5" />
      <path d="M20 43 L15 55 L28 43" stroke="#6FA0FF" strokeWidth="1.5" strokeLinejoin="round" />
      <text x="15" y="32" fill="#6FA0FF" fontSize="22" fontWeight="bold" fontFamily="serif">文</text>
      {/* Speech bubble 2 */}
      <rect x="50" y="45" width="45" height="38" rx="10" stroke="#4A7FFF" strokeWidth="1.5" />
      <path d="M80 83 L85 95 L72 83" stroke="#4A7FFF" strokeWidth="1.5" strokeLinejoin="round" />
      <text x="63" y="72" fill="#4A7FFF" fontSize="22" fontWeight="bold" fontFamily="sans-serif">A</text>
      {/* Arrow */}
      <path d="M42 30 L58 58" stroke="#4A7FFF" strokeWidth="1" strokeDasharray="3 3" />
      <path d="M55 53 L58 58 L52 57" stroke="#4A7FFF" strokeWidth="1" />
    </svg>
  )
}

// Code Brackets Icon
function CodeIcon() {
  return (
    <svg width="90" height="70" viewBox="0 0 90 70" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.12]">
      <rect x="5" y="5" width="80" height="60" rx="8" stroke="#4A7FFF" strokeWidth="1.5" />
      <rect x="5" y="5" width="80" height="14" rx="8" stroke="#4A7FFF" strokeWidth="1.5" fill="rgba(43,95,255,0.05)" />
      <circle cx="16" cy="12" r="2.5" fill="#FF6B6B" opacity="0.6" />
      <circle cx="24" cy="12" r="2.5" fill="#FFD93D" opacity="0.6" />
      <circle cx="32" cy="12" r="2.5" fill="#6BCB77" opacity="0.6" />
      <text x="22" y="42" fill="#4A7FFF" fontSize="14" fontFamily="monospace" opacity="0.8">&lt;/&gt;</text>
      <rect x="18" y="50" width="30" height="2" rx="1" fill="#4A7FFF" opacity="0.3" />
      <rect x="18" y="55" width="20" height="2" rx="1" fill="#4A7FFF" opacity="0.2" />
    </svg>
  )
}

// Chat bubble icon
function ChatIcon() {
  return (
    <svg width="60" height="55" viewBox="0 0 60 55" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.1]">
      <rect x="3" y="3" width="54" height="36" rx="10" stroke="#6FA0FF" strokeWidth="1.5" />
      <path d="M15 39 L10 52 L25 39" stroke="#6FA0FF" strokeWidth="1.5" strokeLinejoin="round" />
      <rect x="14" y="15" width="20" height="2.5" rx="1.25" fill="#6FA0FF" opacity="0.5" />
      <rect x="14" y="21" width="32" height="2.5" rx="1.25" fill="#6FA0FF" opacity="0.4" />
      <rect x="14" y="27" width="14" height="2.5" rx="1.25" fill="#6FA0FF" opacity="0.3" />
    </svg>
  )
}

// Pixel Heart
function PixelHeart() {
  return (
    <svg width="32" height="28" viewBox="0 0 32 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.1]">
      <path
        d="M4 2h4v2h2v2h4V4h2V2h4V0h4v2h2v2h2v4h-2v4h-2v2h-2v2h-2v2h-2v2h-2v2h-2v2h-2v-2h-2v-2h-2v-2H6v-2H4v-2H2v-2H0V8h2V4h2V2z"
        fill="#4A7FFF"
        opacity="0.7"
      />
    </svg>
  )
}

// Diamond shape
function Diamond() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-[0.08]">
      <rect x="10" y="0" width="14" height="14" rx="2" transform="rotate(45 10 0)" fill="#4A7FFF" />
    </svg>
  )
}

// Dot grid
function DotGrid({ size = 4, gap = 12, rows = 4, cols = 5 }: { size?: number; gap?: number; rows?: number; cols?: number }) {
  return (
    <svg
      width={cols * (size + gap)}
      height={rows * (size + gap)}
      className="opacity-[0.06]"
    >
      {Array.from({ length: rows }).map((_, r) =>
        Array.from({ length: cols }).map((_, c) => (
          <rect
            key={`${r}-${c}`}
            x={c * (size + gap)}
            y={r * (size + gap)}
            width={size}
            height={size}
            rx={1}
            fill="#4A7FFF"
          />
        ))
      )}
    </svg>
  )
}

export default function HeroBanner({ settings }: { settings?: SiteSettings }) {
  const social = settings?.socialLinks || {
    facebook: 'https://www.facebook.com/profile.php?id=61559423189253',
    nexusmods: 'https://www.nexusmods.com',
    discord: 'https://discord.gg',
  }

  return (
    <section className="relative pt-24 sm:pt-28 pb-8 flex flex-col items-center justify-center overflow-hidden">
      {/* Circuit lines */}
      <CircuitLines />

      {/* Decorative subtle floating icons */}
      <FloatingIcon className="left-[4%] top-[25%] hidden lg:block" delay={0} duration={8}>
        <GamepadIcon />
      </FloatingIcon>
      <FloatingIcon className="right-[5%] top-[20%] hidden lg:block" delay={1} duration={9}>
        <TranslateIcon />
      </FloatingIcon>
      <FloatingIcon className="left-[12%] bottom-[10%] hidden md:block" delay={2} duration={7}>
        <ChatIcon />
      </FloatingIcon>
      <FloatingIcon className="right-[14%] bottom-[12%] hidden md:block" delay={3} duration={6}>
        <PixelHeart />
      </FloatingIcon>

      {/* Main Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-[680px] mx-auto">
        {/* Logo encased in a Liquid Glass Prism */}
        <div className="mb-3.5 flex justify-center">
          <div className="relative group">
            <div className="absolute -inset-2.5 bg-gradient-to-r from-blue via-cyan-400 to-indigo-500 rounded-3xl blur-xl opacity-55 group-hover:opacity-85 transition-opacity duration-500" />
            <div className="liquid-glass-panel relative p-1.5 rounded-2xl shadow-[0_12px_32px_rgba(43,95,255,0.35),inset_0_1.5px_0_rgba(255,255,255,0.45)]">
              <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-[12px] overflow-hidden border border-white/20">
                <img src="/logo.jpg" alt="แปลเกมสู่ฝัน" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
            </div>
          </div>
        </div>

        <h1 className="font-display text-[clamp(1.75rem,4.5vw,2.5rem)] font-black text-white mb-2 leading-[1.2] tracking-[-0.02em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          แปลเกมสู่ฝัน
        </h1>

        <p className="text-xs sm:text-sm text-text2 leading-relaxed mb-5 max-w-[480px] mx-auto font-normal">
          แปลเกมที่ตัวเองชอบ เป็นงานอดิเรกค้าบ
        </p>

        {/* Social & Community Channel Links — Tactile Liquid Glass Capsules */}
        <div className="flex gap-2.5 sm:gap-3 flex-wrap justify-center items-center pt-1">
          {social.facebook && (
            <a
              href={social.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass-pill inline-flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full text-xs sm:text-[13px] font-bold text-text1 hover:border-[#1877F2]/70 hover:shadow-[0_8px_24px_rgba(24,119,242,0.38),inset_0_1.5px_0_rgba(255,255,255,0.48)] hover:-translate-y-0.5 group/btn"
              title="ติดตามเพจ Facebook"
            >
              <FacebookIcon className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/btn:scale-110" />
              <span className="relative z-10 group-hover/btn:text-white transition-colors">Facebook</span>
            </a>
          )}

          {social.nexusmods && (
            <a
              href={social.nexusmods}
              target="_blank"
              rel="noopener noreferrer"
              className="liquid-glass-pill inline-flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full text-xs sm:text-[13px] font-bold text-text1 hover:border-[#DA8E35]/70 hover:shadow-[0_8px_24px_rgba(218,142,53,0.38),inset_0_1.5px_0_rgba(255,255,255,0.48)] hover:-translate-y-0.5 group/btn"
              title="Nexus Mods โปรไฟล์ม็อด"
            >
              <NexusModsIcon className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover/btn:scale-110" />
              <span className="relative z-10 group-hover/btn:text-white transition-colors">Nexus Mods</span>
            </a>
          )}

          {/* Discord (รอเปิดใช้งาน - เทาและกดไม่ได้) */}
          <div
            className="liquid-glass-pill inline-flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full text-xs sm:text-[13px] font-bold text-text3/80 opacity-55 cursor-not-allowed select-none"
            title="Discord (เร็ว ๆ นี้)"
          >
            <DiscordIcon className="w-5 h-5 grayscale opacity-60 relative z-10" />
            <span className="text-text3 relative z-10">Discord</span>
          </div>
        </div>
      </div>
    </section>
  )
}
