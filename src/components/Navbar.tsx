'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const pathname = usePathname()

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] w-[calc(100%-32px)] max-w-[1052px]">
      <nav className="flex items-center justify-between h-[54px] sm:h-[66px] px-3.5 sm:px-6 bg-[rgba(8,14,40,0.65)] backdrop-blur-[30px] border border-[rgba(100,150,255,0.15)] rounded-full shadow-[0_10px_50px_rgba(0,0,0,0.5),0_0_0_1px_rgba(100,150,255,0.08),inset_0_1px_0_rgba(255,255,255,0.05)]">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2 sm:gap-3 no-underline shrink-0 focus-visible:ring-2 focus-visible:ring-blue2 focus-visible:outline-none rounded-full px-1 py-0.5 group"
        >
          <Image
            src="/logo.jpg"
            alt="แปลเกมสู่ฝัน"
            width={38}
            height={38}
            className="rounded-full border border-[rgba(100,150,255,0.3)] object-cover w-7 h-7 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-105"
          />
          <span className="text-[15px] sm:text-[16px] font-bold text-star2 tracking-wide group-hover:text-white transition-colors">
            แปลเกมสู่ฝัน
          </span>
        </Link>

        {/* Donate Button */}
        <Link
          href="/donate"
          className={cn(
            "px-4 sm:px-6 py-[7px] sm:py-[9px] rounded-full text-[12px] sm:text-[13px] md:text-[14px] font-bold text-white no-underline whitespace-nowrap bg-gradient-to-r from-blue to-[#4A7FFF] border transition-all duration-300 shrink-0 focus-visible:ring-2 focus-visible:ring-blue2 focus-visible:outline-none",
            pathname === '/donate'
              ? "border-star text-white shadow-[0_0_22px_rgba(43,95,255,0.75)] scale-[1.03]"
              : "border-[rgba(100,150,255,0.35)] shadow-[0_4px_15px_rgba(43,95,255,0.25)] hover:shadow-[0_6px_25px_rgba(43,95,255,0.45)] hover:scale-[1.03]"
          )}
        >
          ☆ สนับสนุนนักม็อด
        </Link>
      </nav>
    </div>
  )
}

