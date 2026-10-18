'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-32px)] max-w-[1052px]">
      <nav className="liquid-glass-nav flex items-center justify-between h-[54px] sm:h-[66px] px-3.5 sm:px-6 rounded-full">
        {/* Brand */}
        <Link
          href="/"
          className="relative z-10 flex items-center gap-2 sm:gap-3 no-underline shrink-0 focus-visible:ring-2 focus-visible:ring-blue2 focus-visible:outline-none rounded-full px-1 py-0.5 group"
        >
          <div className="relative rounded-full p-[1.5px] bg-gradient-to-b from-white/50 via-blue2/40 to-blue/20 shadow-[0_0_14px_rgba(74,127,255,0.35)]">
            <Image
              src="/logo.jpg"
              alt="แปลเกมสู่ฝัน"
              width={38}
              height={38}
              className="rounded-full object-cover w-7 h-7 sm:w-9 sm:h-9 transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <span className="text-[15px] sm:text-[16px] font-bold text-star2 tracking-wide drop-shadow-[0_1px_6px_rgba(0,0,0,0.5)] group-hover:text-white transition-colors">
            แปลเกมสู่ฝัน
          </span>
        </Link>

        {/* Donate Button */}
        <Link
          href="/donate"
          className={cn(
            "liquid-glass-cta relative z-10 px-4 sm:px-6 py-[7px] sm:py-[9px] rounded-full text-[12px] sm:text-[13px] md:text-[14px] font-bold text-white no-underline whitespace-nowrap shrink-0 focus-visible:ring-2 focus-visible:ring-blue2 focus-visible:outline-none",
            pathname === '/donate'
              ? "scale-[1.03] ring-1 ring-white/50"
              : "hover:scale-[1.03] hover:-translate-y-[1px]"
          )}
        >
          <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]">☆ สนับสนุนนักม็อด</span>
        </Link>
      </nav>
    </div>
  )
}

