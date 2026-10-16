'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Game } from '@/lib/types'
import TeamSection from '@/components/TeamSection'
import ThemedCard from '@/components/ThemedCard'
import DonateSection from '@/components/DonateSection'
import { 
  ArrowLeft, Sparkles, BookOpen, Users, 
  ZoomIn, X, ChevronLeft, ChevronRight, 
  Gamepad2, CheckCircle2, LayoutGrid, SlidersHorizontal,
  Download, ExternalLink, ShieldCheck, Laptop, Heart
} from 'lucide-react'

// Official Windows Brand Vector
function WindowsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={`${className} shrink-0 fill-current`} viewBox="0 0 24 24">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.949-1.801"/>
    </svg>
  )
}

// Official Apple (Mac) Brand Vector
function AppleIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg className={`${className} shrink-0 fill-current`} viewBox="0 0 24 24">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 1.01-2.85-.9.04-2 .6-2.65 1.35-.58.66-.99 1.72-.94 2.76.99.08 1.96-.51 2.58-1.26"/>
    </svg>
  )
}

// Official Nexus Mods Logo
function NexusModsIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <img 
      src="/nexusmods-logo.png" 
      alt="Nexus Mods" 
      className={`${className} object-contain shrink-0`} 
    />
  )
}

interface InzoiPageLayoutProps {
  game: Game
}

export default function InzoiPageLayout({ game }: InzoiPageLayoutProps) {
  const [platform, setPlatform] = useState<'windows' | 'mac'>('windows')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [activeStepIndex, setActiveStepIndex] = useState(0)
  const [viewMode, setViewMode] = useState<'grid' | 'walkthrough'>('grid')

  const windowsInstructions = game.instructions || []
  const macInstructions = game.instructionsMac || []
  const currentInstructions = platform === 'windows' ? windowsInstructions : macInstructions

  const poster = game.posterImage || game.coverImage || '/logo.jpg'

  // Nexusmods download link for Mac
  const macDownloadLink = game.downloads?.find(d => d.url?.includes('nexusmods'))?.url 
    || game.downloads?.[0]?.url 
    || 'https://www.nexusmods.com'

  const handleNext = () => {
    if (activeStepIndex < currentInstructions.length - 1) {
      setActiveStepIndex(prev => prev + 1)
    }
  }

  const handlePrev = () => {
    if (activeStepIndex > 0) {
      setActiveStepIndex(prev => prev - 1)
    }
  }

  const handlePlatformChange = (p: 'windows' | 'mac') => {
    setPlatform(p)
    setActiveStepIndex(0)
  }

  return (
    <div className="w-full min-h-screen text-text1 pb-24 relative overflow-x-hidden">
      {/* 1. Deep Atmospheric inZOI Radial Ambient Glows */}
      <div className="absolute top-0 left-0 right-0 h-[560px] overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-[80vw] h-[500px] max-w-[1200px] rounded-full bg-gradient-to-b from-purple-600/15 via-cyan-500/10 to-transparent blur-[140px]" />
        <div className="absolute top-28 left-[10%] w-[380px] h-[380px] rounded-full bg-pink-500/10 blur-[120px]" />
        <div className="absolute top-36 right-[12%] w-[420px] h-[420px] rounded-full bg-cyan-400/12 blur-[130px]" />
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 lg:px-8 pt-24 relative z-10 space-y-10 sm:space-y-12">
        
        {/* 2. Breadcrumbs Navigation */}
        <div className="flex items-center gap-2 text-text3 text-[12px] font-bold">
          <Link href="/" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
            <ArrowLeft size={13} />
            หน้าแรก
          </Link>
          <span>/</span>
          <span className="text-purple-300 font-extrabold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rotate-45 bg-purple-400 inline-block shadow-[0_0_8px_#C084FC]" />
            inZOI (ม็อดภาษาไทย)
          </span>
        </div>

        {/* 3. Hero Header Banner */}
        <div className="relative rounded-3xl border border-purple-500/25 bg-gradient-to-b from-bg1/80 via-bg1/60 to-bg2/40 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_40px_rgba(168,85,247,0.12)] backdrop-blur-xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            {/* Poster / Artwork */}
            <div className="lg:col-span-4 max-w-[280px] mx-auto lg:mx-0 w-full">
              <ThemedCard accent="#A855F7" className="w-full aspect-[2/3] rounded-2xl border border-purple-400/30 shadow-[0_12px_40px_rgba(168,85,247,0.25)] overflow-hidden group">
                <img
                  src={poster}
                  alt={game.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </ThemedCard>
            </div>

            {/* Hero Specs & Summary */}
            <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
                <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  <CheckCircle2 size={12} className="text-emerald-400" />
                  แปลเสร็จสมบูรณ์ 100%
                </span>
                <span className="bg-blue-dim border border-blue2/30 text-cyan-300 text-[11px] font-bold px-3 py-1 rounded-full">
                  Unreal Engine 5 • PC
                </span>
                <span className="bg-white/5 border border-white/10 text-text2 text-[11px] font-bold px-3 py-1 rounded-full">
                  เวอร์ชัน: {game.version || 'Early Access'}
                </span>
              </div>

              <div>
                <h1 className="font-display text-[clamp(2.2rem,5vw,3.5rem)] font-black text-white leading-[1.15] drop-shadow-[0_2px_15px_rgba(0,0,0,0.8)] tracking-tight">
                  {game.title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-cyan-300 font-extrabold text-[0.8em]">ภาษาไทย</span>
                </h1>
                <p className="text-sm sm:text-base text-text2 leading-relaxed mt-3 max-w-2xl font-normal">
                  {game.description || game.shortDescription}
                </p>
              </div>

              {/* Fast Action CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <a
                  href="#platform-selector"
                  className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 hover:scale-105 transition-all shadow-[0_6px_25px_rgba(168,85,247,0.35)]"
                >
                  <BookOpen size={16} />
                  เลือกวิธีติดตั้ง (Windows / Mac)
                </a>
                <a
                  href="#team-credits"
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-text2 hover:text-white bg-white/5 border border-white/15 hover:bg-white/10 hover:border-purple-400/40 transition-all"
                >
                  <Users size={16} className="text-purple-300" />
                  ทีมงานผู้แปล
                </a>
                <a
                  href="#donate"
                  className="inline-flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full text-xs sm:text-sm font-bold text-pink-300 hover:text-white bg-pink-500/10 border border-pink-500/30 hover:bg-pink-500/20 hover:border-pink-500/50 transition-all shadow-[0_0_15px_rgba(244,114,182,0.15)]"
                >
                  <Heart size={16} className="fill-pink-400 text-pink-400" />
                  สนับสนุนผู้แปล
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Prominent OS Selection Section (เลือกระบบปฏิบัติการของคุณก่อนอันดับแรก) */}
        <section id="platform-selector" className="scroll-mt-28 space-y-6">
          <div className="text-center space-y-2">
            <span className="text-[11px] font-black uppercase tracking-[0.22em] text-cyan-400 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]">
              SELECT YOUR OPERATING SYSTEM · เลือกแพลตฟอร์มของคุณ
            </span>
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              คุณกำลังเล่น inZOI บนอุปกรณ์ใด?
            </h2>
          </div>

          {/* Big Two-Card Platform Switcher */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto">
            {/* Windows Card */}
            <button
              type="button"
              onClick={() => handlePlatformChange('windows')}
              className={`p-6 rounded-3xl border text-left transition-all duration-300 relative overflow-hidden group ${
                platform === 'windows'
                  ? 'bg-gradient-to-br from-cyan-950/60 via-bg1 to-bg2 border-cyan-400 shadow-[0_0_30px_rgba(6,182,212,0.35)] scale-[1.02]'
                  : 'bg-bg1/60 hover:bg-bg1/90 border-white/10 hover:border-white/25 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                  platform === 'windows'
                    ? 'bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                    : 'bg-white/5 text-text3 group-hover:text-white'
                }`}>
                  <WindowsIcon className="w-6 h-6" />
                </div>
                {platform === 'windows' && (
                  <span className="flex items-center gap-1 text-[11px] font-black text-cyan-300 bg-cyan-400/20 px-2.5 py-1 rounded-full border border-cyan-400/30">
                    <CheckCircle2 size={12} /> กำลังเลือก
                  </span>
                )}
              </div>
              <h3 className="font-display text-lg font-black text-white mb-1">
                Windows PC
              </h3>
              <p className="text-xs text-text2 leading-relaxed">
                ติดตั้งง่ายโดยตรงจากเมนูในเกม (ผ่าน Canvas & Mod Browser) ไม่ต้องโหลดไฟล์แยก
              </p>
            </button>

            {/* Mac Card */}
            <button
              type="button"
              onClick={() => handlePlatformChange('mac')}
              className={`p-6 rounded-3xl border text-left transition-all duration-300 relative overflow-hidden group ${
                platform === 'mac'
                  ? 'bg-gradient-to-br from-purple-950/60 via-bg1 to-bg2 border-purple-400 shadow-[0_0_30px_rgba(168,85,247,0.35)] scale-[1.02]'
                  : 'bg-bg1/60 hover:bg-bg1/90 border-white/10 hover:border-white/25 opacity-75 hover:opacity-100'
              }`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                  platform === 'mac'
                    ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                    : 'bg-white/5 text-text3 group-hover:text-white'
                }`}>
                  <AppleIcon className="w-6 h-6" />
                </div>
                {platform === 'mac' && (
                  <span className="flex items-center gap-1 text-[11px] font-black text-purple-300 bg-purple-400/20 px-2.5 py-1 rounded-full border border-purple-400/30">
                    <CheckCircle2 size={12} /> กำลังเลือก
                  </span>
                )}
              </div>
              <h3 className="font-display text-lg font-black text-white mb-1">
                macOS (Mac)
              </h3>
              <p className="text-xs text-text2 leading-relaxed">
                ดาวน์โหลดไฟล์ม็อดผ่าน Nexus Mods แล้วนำไปติดตั้งในโฟลเดอร์เกม
              </p>
            </button>
          </div>
        </section>

        {/* 5. Platform Specific Callout */}
        {platform === 'windows' ? (
          /* WINDOWS BANNER: In-Game Installation */
          <div className="rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-purple-950/40 p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-md animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(6,182,212,0.25)] text-cyan-300">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <div className="flex-1 space-y-1">
                <h3 className="text-sm sm:text-base font-black text-white flex items-center gap-2">
                  <span>สำหรับ Windows: ไม่ต้องดาวน์โหลดไฟล์แยก! ติดตั้งได้ทันทีจากเมนูในเกม</span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                    Easy Setup
                  </span>
                </h3>
                <p className="text-xs sm:text-sm text-text2 leading-relaxed">
                  เกม inZOI บน Windows รองรับระบบม็อดแปลภาษาไทยภายในตัวเกมโดยตรงผ่าน Canvas & Mod Browser ผู้เล่นเพียงเปิดเกมแล้วทำตามขั้นตอน {windowsInstructions.length} ภาพด้านล่างนี้ได้ทันที
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* MAC BANNER: Nexus Mods Download Box */
          <div className="rounded-2xl border border-[#DA8E35]/40 bg-gradient-to-r from-[#DA8E35]/15 via-bg1 to-purple-950/30 p-6 sm:p-7 shadow-xl relative overflow-hidden backdrop-blur-md space-y-5 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#DA8E35]/20 border border-[#DA8E35]/40 flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(218,142,53,0.3)]">
                  <NexusModsIcon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#DA8E35] bg-[#DA8E35]/15 px-2 py-0.5 rounded-full border border-[#DA8E35]/30">
                      Nexus Mods Official
                    </span>
                    <span className="text-xs font-bold text-text3">สำหรับ macOS</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-white">
                    ดาวน์โหลดม็อดภาษาไทยสำหรับ Mac ผ่าน Nexus Mods
                  </h3>
                  <p className="text-xs sm:text-sm text-text2 max-w-xl leading-relaxed">
                    เนื่องจากตัวเกม inZOI บนระบบ Mac จำเป็นต้องลงแยกจากภายนอก ให้ดาวน์โหลดไฟล์จาก Nexus Mods แล้วนำไปวางตามขั้นตอนด้านล่าง
                  </p>
                </div>
              </div>

              {/* Download Button to Nexus Mods */}
              <div className="shrink-0">
                <a
                  href={macDownloadLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl text-xs sm:text-sm font-black text-white bg-gradient-to-r from-[#DA8E35] to-[#B36F22] hover:scale-105 transition-all shadow-[0_6px_25px_rgba(218,142,53,0.4)] no-underline"
                >
                  <NexusModsIcon className="w-5 h-5 fill-white" />
                  <span>ดาวน์โหลดบน Nexus Mods</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Quick Mac tips */}
            <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-text3 font-medium">
              <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
              <span>ไฟล์ปลอดภัย 100% ตรวจสอบแล้วผ่านระบบ Nexus Mods</span>
            </div>
          </div>
        )}

        {/* 6. Step-by-Step Installation Visual Guide */}
        <section id="install-guide" className="scroll-mt-28 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/15 border border-purple-400/30 text-[10.5px] font-black uppercase tracking-widest text-purple-300 mb-2">
                <Sparkles size={11} className="text-cyan-400" />
                {platform === 'windows' ? 'WINDOWS INSTALLATION GUIDE' : 'MAC INSTALLATION GUIDE'}
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>ภาพวิธีการลงม็อด ({platform === 'windows' ? 'Windows' : 'macOS'})</span>
                <span className="text-xs font-bold text-text3 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/10">
                  {currentInstructions.length} ภาพ
                </span>
              </h2>
            </div>

            {/* View Switcher: Grid vs Walkthrough (Only if there are instructions) */}
            {currentInstructions.length > 0 && (
              <div className="flex items-center gap-1.5 bg-bg1/70 backdrop-blur-md p-1 rounded-full border border-white/10 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
                    viewMode === 'grid'
                      ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                      : 'text-text3 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <LayoutGrid size={13} />
                  ดูทั้งหมด ({currentInstructions.length})
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('walkthrough')}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
                    viewMode === 'walkthrough'
                      ? 'bg-purple-600 text-white shadow-[0_0_12px_rgba(168,85,247,0.4)]'
                      : 'text-text3 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <SlidersHorizontal size={13} />
                  ดูทีละขั้นตอน
                </button>
              </div>
            )}
          </div>

          {/* If No Instructions available yet (e.g. for Mac before user uploads pictures) */}
          {currentInstructions.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-bg1/60 p-10 sm:p-14 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-purple-500/15 border border-purple-400/30 flex items-center justify-center mx-auto text-purple-300">
                <BookOpen size={28} />
              </div>
              <h3 className="font-display text-lg font-black text-white">
                กำลังเตรียมรูปภาพขั้นตอนการติดตั้งสำหรับ {platform === 'mac' ? 'macOS (Mac)' : 'Windows'}
              </h3>
              <p className="text-xs sm:text-sm text-text2 max-w-md mx-auto leading-relaxed">
                {platform === 'mac' 
                  ? 'ทีมงานกำลังอัปเดตภาพขั้นตอนโดยละเอียดเร็ว ๆ นี้'
                  : 'ยังไม่มีรูปภาพขั้นตอน กรุณาเพิ่มรูปภาพผ่านระบบ Admin Panel'}
              </p>
            </div>
          ) : (
            <>
              {/* VIEW MODE 1: Spacious 2-Column Responsive Grid */}
              {viewMode === 'grid' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  {currentInstructions.map((step, idx) => {
                    const stepNum = idx + 1
                    return (
                      <div
                        key={idx}
                        className="group relative rounded-2xl border border-white/10 hover:border-purple-400/50 bg-bg1/70 backdrop-blur-md p-4 sm:p-5 shadow-xl transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.7),0_0_25px_rgba(168,85,247,0.2)] flex flex-col space-y-3.5"
                      >
                        {/* Step Header */}
                        <div className="flex items-center justify-between gap-2 border-b border-white/5 pb-2.5">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-purple-500/20 border border-purple-400/40 text-purple-300 text-xs font-black flex items-center justify-center shrink-0">
                              {stepNum}
                            </span>
                            <span className="text-xs sm:text-sm font-extrabold text-white">
                              ขั้นตอนที่ {stepNum}
                            </span>
                          </div>
                          <span className="text-[11px] font-mono text-text3">
                            {stepNum} / {currentInstructions.length}
                          </span>
                        </div>

                        {/* Step Description text (if any) */}
                        {step.text && (
                          <p className="text-xs sm:text-sm text-text2 leading-relaxed whitespace-pre-line font-medium">
                            {step.text}
                          </p>
                        )}

                        {/* Step Image with Zoom on Click */}
                        {step.image && (
                          <div 
                            onClick={() => setSelectedImage(step.image!)}
                            className="relative w-full aspect-square sm:aspect-[4/3] rounded-xl overflow-hidden bg-black/40 border border-white/10 cursor-pointer group/img transition-all"
                          >
                            <img
                              src={step.image}
                              alt={`ขั้นตอนที่ ${stepNum}`}
                              className="w-full h-full object-contain transition-transform duration-500 group-hover/img:scale-[1.03]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity flex items-end justify-between p-3">
                              <span className="text-xs font-bold text-white flex items-center gap-1.5 bg-black/60 px-2.5 py-1 rounded-full backdrop-blur-sm border border-white/20">
                                <ZoomIn size={13} className="text-cyan-300" />
                                คลิกดูรูปขยายเต็มจอ
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* VIEW MODE 2: Single Step Walkthrough Viewer */}
              {viewMode === 'walkthrough' && (
                <div className="rounded-3xl border border-purple-400/30 bg-bg1/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
                  {/* Stepper Header Navigation */}
                  <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-purple-500/25 border border-purple-400 text-purple-300 text-sm font-black flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
                        {activeStepIndex + 1}
                      </span>
                      <div>
                        <h3 className="text-base sm:text-lg font-black text-white">
                          ขั้นตอนที่ {activeStepIndex + 1} จากทั้งหมด {currentInstructions.length}
                        </h3>
                        {currentInstructions[activeStepIndex]?.text && (
                          <p className="text-xs sm:text-sm text-text2 mt-0.5">
                            {currentInstructions[activeStepIndex]?.text}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Prev / Next buttons */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handlePrev}
                        disabled={activeStepIndex === 0}
                        className="p-2.5 rounded-full bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-white/5 text-white transition-colors"
                        title="ขั้นตอนก่อนหน้า"
                      >
                        <ChevronLeft size={18} />
                      </button>
                      <button
                        onClick={handleNext}
                        disabled={activeStepIndex === currentInstructions.length - 1}
                        className="p-2.5 rounded-full bg-purple-600 hover:bg-purple-500 disabled:opacity-30 disabled:hover:bg-purple-600 text-white transition-colors shadow-[0_0_15px_rgba(168,85,247,0.4)]"
                        title="ขั้นตอนถัดไป"
                      >
                        <ChevronRight size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Main Image in Walkthrough */}
                  {currentInstructions[activeStepIndex]?.image && (
                    <div 
                      onClick={() => setSelectedImage(currentInstructions[activeStepIndex].image!)}
                      className="relative w-full max-w-[800px] mx-auto aspect-square sm:aspect-[16/10] rounded-2xl overflow-hidden bg-black/60 border border-white/10 cursor-pointer shadow-2xl group/zoom"
                    >
                      <img
                        src={currentInstructions[activeStepIndex].image!}
                        alt={`ขั้นตอนที่ ${activeStepIndex + 1}`}
                        className="w-full h-full object-contain transition-transform duration-500 group-hover/zoom:scale-[1.02]"
                      />
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-xs font-bold text-white shadow-lg">
                        <ZoomIn size={13} className="text-cyan-300" />
                        <span>คลิกเพื่อดูภาพขยาย</span>
                      </div>
                    </div>
                  )}

                  {/* Thumbnail Strip */}
                  <div className="pt-2 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                    {currentInstructions.map((step, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveStepIndex(idx)}
                        className={`relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                          activeStepIndex === idx
                            ? 'border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)] scale-105'
                            : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                        }`}
                      >
                        {step.image ? (
                          <img src={step.image} alt={`Step ${idx + 1}`} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full bg-bg2 flex items-center justify-center text-xs font-bold text-text3">
                            {idx + 1}
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 text-[9px] font-black bg-black/80 px-1 rounded text-white">
                          {idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>

        {/* Eye-catching Supporter / Donate Section */}
        <div id="donate" className="scroll-mt-28 pt-4">
          <DonateSection />
        </div>

        {/* 7. Team Credits Section */}
        <div id="team-credits" className="scroll-mt-28 pt-4">
          <TeamSection team={game.team} />
        </div>

      </div>

      {/* 8. High-Resolution Fullscreen Lightbox Modal */}
      {selectedImage && (
        <div 
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-[300] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            title="ปิดภาพขยาย"
          >
            <X size={20} />
          </button>

          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-[95vw] max-h-[90vh] flex items-center justify-center"
          >
            <img
              src={selectedImage}
              alt="ภาพขยายวิธีการลง"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl border border-white/20"
            />
          </div>
        </div>
      )}
    </div>
  )
}
