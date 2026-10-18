'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Game, Sims4Pack } from '@/lib/types'
import DownloadSection from '@/components/DownloadSection'
import TeamSection from '@/components/TeamSection'
import Sims4Showcase from '@/components/sims4/Sims4Showcase'
import ThemedCard from '@/components/ThemedCard'
import DonateSection from '@/components/DonateSection'
import { 
  ArrowLeft, Download, Layers, BookOpen, Copy, Check, 
  Sparkles, ShieldCheck, HelpCircle, FolderOpen, Users, ExternalLink, Heart 
} from 'lucide-react'

interface Sims4PageLayoutProps {
  game: Game
  packs: Sims4Pack[]
}

export default function Sims4PageLayout({ game, packs }: Sims4PageLayoutProps) {
  const [copiedPath, setCopiedPath] = useState(false)
  const modsPath = 'Documents\\Electronic Arts\\The Sims 4\\Mods'

  const handleCopyPath = () => {
    navigator.clipboard.writeText(modsPath)
    setCopiedPath(true)
    setTimeout(() => setCopiedPath(false), 2500)
  }

  return (
    <div className="w-full min-h-screen text-text1 pb-24 relative">
      {/* Full Widescreen Cosmic Atmosphere — smooth, atmospheric banner */}
      <div className="absolute top-0 left-0 right-0 h-[520px] overflow-hidden pointer-events-none z-0">
        {game.coverImage && (
          <img
            src={game.coverImage}
            alt={game.title}
            className="w-full h-full object-cover object-[center_28%] opacity-65"
          />
        )}
        {/* Soft edge vignettes to blend naturally */}
        <div className="absolute inset-0 bg-gradient-to-r from-bg0/80 via-transparent to-bg0/80" />
        {/* Fade into page background */}
        <div className="absolute inset-0 bg-gradient-to-b from-bg0/30 via-bg0/20 to-bg0" />
        <div className="absolute top-20 left-1/4 w-[500px] h-[500px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none" />
        <div className="absolute top-40 right-1/4 w-[450px] h-[450px] rounded-full bg-blue/15 blur-[120px] pointer-events-none" />
      </div>

      <div className="max-w-[1300px] mx-auto px-4 sm:px-8 pt-24 relative z-10 space-y-12">
        
        {/* 1. Breadcrumbs Navigation */}
        <div className="flex items-center gap-2 text-text3 text-[12px] font-bold">
          <Link href="/" className="hover:text-blue3 transition-colors flex items-center gap-1">
            <ArrowLeft size={12} />
            หน้าแรก
          </Link>
          <span>/</span>
          <span className="text-emerald-400 font-extrabold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rotate-45 bg-emerald-400 inline-block shadow-[0_0_6px_#00E575]" />
            {game.title}
          </span>
        </div>

        {/* 2. Majestic Hero Banner */}
        <div className="liquid-glass-panel relative rounded-2xl p-6 sm:p-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Left Column: Poster preview */}
            <div className="lg:col-span-4 max-w-[280px] mx-auto lg:mx-0 w-full">
              <ThemedCard accent="#00E575" className="w-full aspect-[2/3] rounded-2xl border border-emerald-500/30 shadow-[0_12px_40px_rgba(16,185,129,0.2)] overflow-hidden group">
                <img
                  src={game.posterImage || game.coverImage || '/uploads/sims_cover_art.png'}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </ThemedCard>
            </div>

            {/* Right Column: Hero Content & Specs */}
            <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="bg-amber-500/18 border border-amber-400/40 text-amber-200 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]">
                  <Sparkles size={11} />
                  กำลังแปลภาษาไทย (Base Game: 55%)
                </span>
                <span className="liquid-glass-pill text-star2 text-[11px] font-bold px-3 py-1 rounded-full">
                  เวอร์ชันเกม: {game.version}
                </span>
                <span className="liquid-glass-pill text-text2 text-[11px] font-bold px-3 py-1 rounded-full">
                  แพลตฟอร์ม: {game.client}
                </span>
                <span className="liquid-glass-pill text-text2 text-[11px] font-bold px-3 py-1 rounded-full">
                  ขนาดไฟล์: {game.fileSize}
                </span>
              </div>

              <div>
                <h1 className="font-display text-[clamp(2.25rem,5vw,3.5rem)] font-black text-white leading-[1.15] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)] tracking-tight">
                  {game.title}
                </h1>
                <p className="text-sm sm:text-base text-text2 leading-relaxed mt-3 max-w-2xl font-normal">
                  {game.description}
                </p>
              </div>

              {/* Fast Action CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="#base-download"
                  className="liquid-glass-cta inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-white hover:scale-105"
                >
                  <Download size={16} className="relative z-10" />
                  <span className="relative z-10">ดาวน์โหลดม็อดตัวหลัก (55%)</span>
                </a>
                <a
                  href="#packs-catalog"
                  className="liquid-glass-pill inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-text1 hover:text-white hover:border-emerald-400/50 hover:-translate-y-0.5"
                >
                  <Layers size={16} className="text-emerald-400 relative z-10" />
                  <span className="relative z-10">ค้นหาภาคเสริม & ม็อด ({packs.length} รายการ)</span>
                </a>
                <a
                  href="#install-guide"
                  className="liquid-glass-pill inline-flex items-center gap-2 px-4 sm:px-5 py-3 rounded-full text-xs sm:text-sm font-bold text-text2 hover:text-white hover:-translate-y-0.5"
                >
                  <BookOpen size={15} className="relative z-10" />
                  <span className="relative z-10">วิธีติดตั้ง</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Section Jump Bar (Quick-Nav Pills) */}
        <div className="flex items-center justify-center sm:justify-start gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <a
            href="#packs-catalog"
            className="liquid-glass-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full hover:border-emerald-400/50 text-text2 hover:text-white font-bold shrink-0"
          >
            <Layers size={13} className="text-emerald-400" />
            คลังภาคเสริม & ม็อด
          </a>
          <a
            href="#base-download"
            className="liquid-glass-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full hover:border-blue3/50 text-text2 hover:text-white font-bold shrink-0"
          >
            <Download size={13} className="text-blue3" />
            ดาวน์โหลดตัวหลัก
          </a>
          <a
            href="#install-guide"
            className="liquid-glass-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full hover:border-amber-400/50 text-text2 hover:text-white font-bold shrink-0"
          >
            <BookOpen size={13} className="text-amber-300" />
            คู่มือการติดตั้ง
          </a>
          <a
            href="#team-credits"
            className="liquid-glass-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full hover:border-purple-400/50 text-text2 hover:text-white font-bold shrink-0"
          >
            <Users size={13} className="text-purple-300" />
            ทีมงานผู้แปล
          </a>
          <a
            href="#donate"
            className="liquid-glass-pill inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-pink-400/35 hover:border-pink-400/65 text-pink-200 hover:text-white font-bold shrink-0 shadow-[0_0_15px_rgba(244,114,182,0.18),inset_0_1px_0_rgba(255,255,255,0.35)]"
          >
            <Heart size={13} className="fill-current text-pink-400" />
            สนับสนุนผู้แปล
          </a>
        </div>

        {/* 4. Full-Width Visual Showcase (Search, Category Tabs, Status Filter, Grid/List) */}
        <Sims4Showcase initialPacks={packs} />

        {/* 5. Downloads & Technical Installation Section */}
        <div className="space-y-10 pt-4">
          
          {/* Section 5.1: Base Game Download Area */}
          <section id="base-download" className="scroll-mt-28 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="space-y-1">
                <h2 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight flex items-center gap-2">
                  <Download className="text-blue3" />
                  ดาวน์โหลดม็อดแปลภาษาไทยตัวหลัก (Base Game: 55%)
                </h2>
                <p className="text-xs text-text2 max-w-2xl">
                  ไฟล์แปลภาษาไทยสำหรับตัวเกมหลัก The Sims 4 ครอบคลุมเมนูพื้นฐาน อารมณ์ ปณิธาน และระบบในเกม
                </p>
              </div>
              <span className="liquid-glass-pill hidden sm:inline-block text-xs font-bold px-3.5 py-1 rounded-full text-star2">
                ความคืบหน้า 55% · ฟรี 100%
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Main Download Card */}
              <div className="lg:col-span-7 space-y-6">
                <DownloadSection downloads={game.downloads} />
                
                {/* Security & Reliability Box */}
                <div className="liquid-glass-panel rounded-2xl p-5 space-y-3">
                  <div className="relative z-10 text-xs font-bold text-text1 flex items-center gap-2">
                    <ShieldCheck size={16} className="text-emerald-400" />
                    ข้อควรทราบในการใช้งาน
                  </div>
                  <ul className="relative z-10 text-xs text-text2 space-y-1.5 list-disc pl-5 leading-relaxed">
                    <li>ม็อดแปลภาษานี้ใช้งานได้กับทั้งตัวเกมแท้บน <strong>EA App, Steam</strong> และแพลตฟอร์มที่รองรับ</li>
                    <li>ไม่มีการแก้ไขไฟล์แกนระบบของเกม จึงไม่ส่งผลเสียต่อการเซฟหรือประสิทธิภาพของเกม</li>
                    <li>เมื่อเกม The Sims 4 มีการอัปเดตแพตช์ใหญ่ แนะนำให้ติดตามตัวอัปเดตภาษาไทยล่าสุดเพื่อความเข้ากันได้</li>
                  </ul>
                </div>
              </div>

              {/* Right Column: Credits */}
              <div id="team-credits" className="lg:col-span-5 scroll-mt-28">
                <TeamSection team={game.team} />
              </div>
            </div>
          </section>

          {/* Section 5.2: Step-by-Step Installation Guide (Highly User-Friendly!) */}
          <section id="install-guide" className="scroll-mt-28 space-y-6">
            <div className="border-b border-white/10 pb-4">
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white leading-tight flex items-center gap-2">
                <BookOpen className="text-emerald-400" />
                คู่มือการติดตั้งม็อดแปลภาษาไทย (Installation Guide)
              </h2>
              <p className="text-xs text-text2 max-w-2xl mt-1">
                ทำตามขั้นตอน 4 สเต็ปง่าย ๆ ด้านล่างนี้เพื่อเปิดใช้งานภาษาไทยในเกม The Sims 4 ได้ทันที
              </p>
            </div>

            <div className="liquid-glass-panel rounded-2xl p-6 sm:p-8 space-y-8">
              
              {/* Step 1 */}
              <div className="relative z-10 flex gap-4 sm:gap-5 items-start">
                <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-400/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] flex items-center justify-center text-sm font-black text-emerald-300">
                  1
                </div>
                <div className="flex-1 space-y-1.5">
                  <h4 className="text-sm font-bold text-white">ดาวน์โหลดไฟล์ม็อดภาษาไทย</h4>
                  <p className="text-xs text-text2 leading-relaxed">
                    กดปุ่มดาวน์โหลดม็อดตัวหลักด้านบน คุณจะได้รับไฟล์ม็อดนามสกุล <code className="bg-black/50 px-2 py-0.5 rounded text-emerald-300 font-mono text-[11px]">.package</code> (หากเป็นไฟล์ .zip ให้แตกไฟล์ออกมาก่อน)
                  </p>
                </div>
              </div>

              {/* Step 2: With Copyable Folder Path Button! */}
              <div className="relative z-10 flex gap-4 sm:gap-5 items-start">
                <div className="shrink-0 w-8 h-8 rounded-full bg-blue/25 border border-blue3/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] flex items-center justify-center text-sm font-black text-star2">
                  2
                </div>
                <div className="flex-1 space-y-3">
                  <div>
                    <h4 className="text-sm font-bold text-white">นำไฟล์ไปวางในโฟลเดอร์ Mods ของตัวเกม</h4>
                    <p className="text-xs text-text2 leading-relaxed">
                      คัดลอกไฟล์ .package ไปวางไว้ในไดเรกทอรีโฟลเดอร์ม็อดของเกม The Sims 4 ตามพาธนี้:
                    </p>
                  </div>

                  {/* Interactive Copyable Path Box */}
                  <div className="liquid-glass-well flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 p-3 sm:px-4 sm:py-3 rounded-2xl">
                    <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono text-emerald-300">
                      <FolderOpen size={16} className="text-emerald-400 shrink-0" />
                      <span className="select-all">{modsPath}</span>
                    </div>

                    <button
                      onClick={handleCopyPath}
                      className={`inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer ${
                        copiedPath
                          ? 'bg-emerald-500 text-white border border-emerald-300 shadow-[0_0_18px_rgba(16,185,129,0.5),inset_0_1px_0_rgba(255,255,255,0.5)] scale-105'
                          : 'liquid-glass-pill text-white hover:border-emerald-400/50'
                      }`}
                      title="คัดลอกโฟลเดอร์ไปยังคลิปบอร์ด"
                    >
                      {copiedPath ? (
                        <>
                          <Check size={13} />
                          คัดลอกแล้ว!
                        </>
                      ) : (
                        <>
                          <Copy size={13} />
                          คัดลอกพาธ
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-[11px] text-text2">
                    💡 <em>คำแนะนำ:</em> สามารถสร้างโฟลเดอร์ย่อยข้างใน เช่น <code className="text-star2 font-mono">Mods/Thai_Mod/</code> เพื่อความเป็นระเบียบได้
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative z-10 flex gap-4 sm:gap-5 items-start">
                <div className="shrink-0 w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] flex items-center justify-center text-sm font-black text-purple-300">
                  3
                </div>
                <div className="flex-1 space-y-2">
                  <h4 className="text-sm font-bold text-white">เปิดตั้งค่าม็อดในตัวเกม (Game Options)</h4>
                  <p className="text-xs text-text2 leading-relaxed">
                    เปิดเกม The Sims 4 &gt; เข้าเมนู <strong>Options (การตั้งค่า)</strong> &gt; เลือก <strong>Game Options</strong> &gt; ไปที่แท็บ <strong>Other (อื่นๆ)</strong>
                  </p>
                  <div className="liquid-glass-well p-3.5 rounded-2xl text-xs text-text2 space-y-1.5 font-medium">
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-emerald-400 font-bold">☑️</span>
                      <span>ติ๊กถูกที่: <strong>Enable Custom Content and Mods</strong> (เปิดใช้งานเนื้อหาปรับแต่งและม็อด)</span>
                    </div>
                    <div className="flex items-center gap-2 text-white">
                      <span className="text-emerald-400 font-bold">☑️</span>
                      <span>ติ๊กถูกที่: <strong>Script Mods Allowed</strong> (อนุญาตให้ใช้ม็อดสคริปต์)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative z-10 flex gap-4 sm:gap-5 items-start">
                <div className="shrink-0 w-8 h-8 rounded-full bg-amber-500/20 border border-amber-400/45 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] flex items-center justify-center text-sm font-black text-amber-300">
                  4
                </div>
                <div className="flex-1 space-y-1">
                  <h4 className="text-sm font-bold text-white">กดบันทึกแล้วรีสตาร์ทตัวเกม</h4>
                  <p className="text-xs text-text2 leading-relaxed">
                    กด <strong>Apply Changes (ใช้การเปลี่ยนแปลง)</strong> จากนั้นปิดเกมและเข้าใหม่อีกครั้ง ตัวเกมจะเปลี่ยนเป็นภาษาไทยอย่างสมบูรณ์แบบพร้อมเล่นทันที!
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Section 5.3: Eye-catching Supporter / Donate Section */}
          <section id="donate" className="scroll-mt-28">
            <DonateSection />
          </section>

        </div>

      </div>
    </div>
  )
}
