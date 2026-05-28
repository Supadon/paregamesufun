'use client'

import { useEffect, useRef } from 'react'

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

export default function HeroBanner() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Deep radial glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 50% at 50% 40%, rgba(43,95,255,0.14) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 20% 65%, rgba(140,80,255,0.05) 0%, transparent 50%),
            radial-gradient(ellipse 40% 30% at 80% 60%, rgba(43,95,255,0.06) 0%, transparent 50%)
          `,
        }}
      />

      {/* Circuit lines */}
      <CircuitLines />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100,150,255,0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,150,255,0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />

      {/* === Decorative floating icons === */}

      {/* Gamepad - bottom left */}
      <FloatingIcon className="left-[5%] bottom-[18%] hidden md:block" delay={0} duration={7}>
        <GamepadIcon />
      </FloatingIcon>

      {/* Translate icon - top right */}
      <FloatingIcon className="right-[6%] top-[14%] hidden md:block" delay={1} duration={8}>
        <TranslateIcon />
      </FloatingIcon>

      {/* Code icon - bottom right */}
      <FloatingIcon className="right-[8%] bottom-[16%] hidden md:block" delay={0.5} duration={6.5}>
        <CodeIcon />
      </FloatingIcon>

      {/* Chat bubble - top left */}
      <FloatingIcon className="left-[8%] top-[18%] hidden md:block" delay={2} duration={7.5}>
        <ChatIcon />
      </FloatingIcon>

      {/* Chat bubble 2 - mid left */}
      <FloatingIcon className="left-[18%] top-[50%] hidden lg:block" delay={1.5} duration={9}>
        <ChatIcon />
      </FloatingIcon>

      {/* Pixel hearts */}
      <FloatingIcon className="right-[20%] top-[22%] hidden lg:block" delay={3} duration={5}>
        <PixelHeart />
      </FloatingIcon>
      <FloatingIcon className="left-[12%] bottom-[38%] hidden lg:block" delay={2.5} duration={6}>
        <PixelHeart />
      </FloatingIcon>

      {/* Diamonds */}
      <FloatingIcon className="right-[30%] top-[16%] hidden md:block" delay={1} duration={8}>
        <Diamond />
      </FloatingIcon>
      <FloatingIcon className="left-[25%] bottom-[22%] hidden md:block" delay={3.5} duration={7}>
        <Diamond />
      </FloatingIcon>
      <FloatingIcon className="right-[15%] bottom-[40%] hidden lg:block" delay={2} duration={9}>
        <Diamond />
      </FloatingIcon>

      {/* Dot grids */}
      <FloatingIcon className="left-[3%] top-[38%] hidden lg:block" delay={0} duration={10}>
        <DotGrid rows={3} cols={4} />
      </FloatingIcon>
      <FloatingIcon className="right-[3%] top-[45%] hidden lg:block" delay={1} duration={10}>
        <DotGrid rows={4} cols={3} />
      </FloatingIcon>

      {/* === Main Content === */}
      <div className="relative z-10 text-center px-6 max-w-[700px] mx-auto">
        {/* Logo with enhanced glow */}
        <div className="mb-7 flex justify-center">
          <div className="relative">
            <div className="absolute -inset-4 bg-blue/15 rounded-[32px] blur-2xl" />
            <div className="relative w-[110px] h-[110px] rounded-[26px] overflow-hidden border-2 border-[rgba(100,150,255,0.25)] shadow-[0_0_50px_rgba(43,95,255,0.3),0_0_100px_rgba(43,95,255,0.1)]">
              <img src="/logo.jpg" alt="แปลเกมสู่ฝัน" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        <h1 className="text-3xl sm:text-[42px] font-bold text-text1 mb-2 leading-normal">
          <span className="inline-block px-1.5 py-2 text-transparent bg-clip-text bg-gradient-to-r from-blue2 to-star2">
            แปลเกมสู่ฝัน
          </span>
        </h1>

        <p className="text-sm sm:text-base text-text2 leading-relaxed mb-2 max-w-[520px] mx-auto">
          นักแปลเกม PC อิสระชาวไทย แปลเกมภาษาอังกฤษให้เป็นไทย
          เพื่อให้ทุกคนได้สัมผัสเกมที่ตัวเองรักโดยไม่มีกำแพงภาษา
        </p>
       
        {/* Chips */}
        {/* <div className="flex gap-2.5 flex-wrap justify-center mb-6">
          <span className="inline-flex items-center gap-[5px] px-4 py-2 rounded-full text-[13px] font-medium bg-blue-dim text-blue3 border border-[rgba(43,95,255,0.22)]">
            ✦ แปลฟรี 100%
          </span>
          <span className="inline-flex items-center gap-[5px] px-4 py-2 rounded-full text-[13px] font-medium bg-[rgba(168,196,255,0.1)] text-star2 border border-[rgba(168,196,255,0.2)]">
            ★ เกม PC เป็นหลัก
          </span>
          <span className="inline-flex items-center gap-[5px] px-4 py-2 rounded-full text-[13px] font-medium bg-blue-dim text-blue3 border border-[rgba(43,95,255,0.22)]">
            ⟳ อัปเดตสม่ำเสมอ
          </span>
        </div> */}

        {/* <div className="flex items-center justify-center gap-8 mt-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue3">6+</div>
            <div className="text-[10px] text-text3 uppercase tracking-wider mt-0.5">เกมที่แปล</div>
          </div>
          <div className="w-px h-8 bg-border-c" />
          <div className="text-center">
            <div className="text-2xl font-bold text-blue3">100%</div>
            <div className="text-[10px] text-text3 uppercase tracking-wider mt-0.5">ฟรี</div>
          </div>
          <div className="w-px h-8 bg-border-c" />
          <div className="text-center">
            <div className="text-2xl font-bold text-blue3">3+</div>
            <div className="text-[10px] text-text3 uppercase tracking-wider mt-0.5">ทีมงาน</div>
          </div>
        </div> */}
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-[11px] text-text3 font-medium">เลื่อนลง</span>
        <svg className="w-4 h-4 text-text3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  )
}
