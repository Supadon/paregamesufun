import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getGames, getGameBySlug } from '@/app/actions/games'
import ProgressBar from '@/components/ProgressBar'
import DownloadSection from '@/components/DownloadSection'
import TeamSection from '@/components/TeamSection'
import { ArrowLeft, Languages, ExternalLink, RefreshCw, Check } from 'lucide-react'

// Convert standard or published Google Sheet URL to CSV URL
function getGoogleSheetCsvUrl(url: string): string | null {
  if (url.includes('/d/e/')) {
    const match = url.match(/\/spreadsheets\/d\/e\/([a-zA-Z0-9-_]+)/)
    if (match) {
      return `https://docs.google.com/spreadsheets/d/e/${match[1]}/pub?output=csv`
    }
  } else {
    const match = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
    if (match) {
      return `https://docs.google.com/spreadsheets/d/${match[1]}/export?format=csv`
    }
  }
  return null
}

// Convert cell address like "C2" or "D10" to 0-based row and column indices
function parseCellAddress(cell: string): { row: number; col: number } | null {
  const match = cell.trim().toUpperCase().match(/^([A-Z]+)([0-9]+)$/)
  if (!match) return null

  const colStr = match[1]
  const rowStr = match[2]

  let colIndex = 0
  for (let i = 0; i < colStr.length; i++) {
    colIndex = colIndex * 26 + (colStr.charCodeAt(i) - 64)
  }
  colIndex = colIndex - 1 // 0-based

  const rowIndex = parseInt(rowStr, 10) - 1 // 0-based

  return { row: rowIndex, col: colIndex }
}

// Fetch specific cell (default C1) from Google Sheet CSV
async function fetchGoogleSheetPercentage(url: string, cell?: string): Promise<number | null> {
  const csvUrl = getGoogleSheetCsvUrl(url)
  if (!csvUrl) return null

  try {
    const res = await fetch(csvUrl, {
      next: { revalidate: 60 } // cache for 60 seconds
    })
    if (!res.ok) return null
    const csvText = await res.text()
    
    // Parse rows
    const lines = csvText.split('\n')
    if (lines.length === 0) return null
    
    // Parse target coordinates (fallback to C1 -> row 0, col 2)
    const target = cell ? (parseCellAddress(cell) || { row: 0, col: 2 }) : { row: 0, col: 2 }
    if (lines.length <= target.row) return null
    
    const columns = lines[target.row].split(',')
    if (columns.length <= target.col) return null
    
    const cellValue = columns[target.col]?.replace(/["'\r\n]/g, '').trim()
    if (!cellValue) return null
    
    let parsed = parseFloat(cellValue)
    if (isNaN(parsed)) return null
    
    if (cellValue.includes('%')) {
      return Math.round(parsed)
    } else if (parsed > 0 && parsed <= 1) {
      return Math.round(parsed * 100)
    } else {
      return Math.round(parsed)
    }
  } catch (err) {
    console.error('Error fetching google sheet percentage:', err)
    return null
  }
}

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const games = await getGames()
  return games.map((game) => ({
    slug: game.slug,
  }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const game = await getGameBySlug(slug)
  if (!game) return {}
  return {
    title: `${game.title} — แปลเกมสู่ฝัน`,
    description: game.shortDescription,
  }
}

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = await params
  const game = await getGameBySlug(slug)

  if (!game) {
    notFound()
  }

  // Fetch live Google Sheet percentage if configured
  let liveProgress = { ...game.progress }
  let isGoogleSheetSync = false
  if (game.progress.sheetUrl) {
    const sheetPercent = await fetchGoogleSheetPercentage(game.progress.sheetUrl, game.progress.sheetCell)
    if (sheetPercent !== null) {
      liveProgress.translate = sheetPercent
      isGoogleSheetSync = true
    }
  }

  // Calculate overall progress percentage
  let overallProgress = 0
  if (game.slug === 'the-sims-4') {
    const baseGameModule = liveProgress.modules?.find(
      (m) => m.name === 'Base Game' || m.name.toLowerCase().includes('base')
    )
    overallProgress = baseGameModule ? baseGameModule.progress : 39
  } else if (liveProgress.isMultiModule && liveProgress.modules && liveProgress.modules.length > 0) {
    const total = liveProgress.modules.reduce((sum, m) => sum + m.progress, 0)
    overallProgress = Math.round(total / liveProgress.modules.length)
  } else if (isGoogleSheetSync) {
    overallProgress = liveProgress.translate
  } else {
    overallProgress = Math.round((liveProgress.translate + (liveProgress.proofread || 0) + (liveProgress.test || 0)) / 3)
  }

  return (
    <div className="w-full min-h-screen text-text1 pb-16 relative">
      {/* 1. Subtle Widescreen Cinematic Cover Background (Fades out, no blocking height) */}
      {game.coverImage && (
        <div className="absolute top-0 left-0 right-0 h-[480px] overflow-hidden pointer-events-none z-0">
          <img
            src={game.coverImage}
            alt={game.title}
            className="w-full h-full object-cover opacity-25 scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-bg0/0 via-bg0/60 to-bg0" />
        </div>
      )}

      {/* Main Layout Container */}
      <div className="max-w-[1100px] mx-auto px-6 pt-28 pb-12 relative z-10">
        
        {/* Breadcrumbs / Back Link */}
        <div className="mb-6 flex items-center gap-2 text-text3 text-[12px] font-bold">
          <Link href="/" className="hover:text-blue3 transition-colors flex items-center gap-1 focus-visible:ring-2 focus-visible:ring-blue2 focus-visible:outline-none rounded-md px-1">
            <ArrowLeft size={12} />
            หน้าแรก
          </Link>
          <span>/</span>
          {game.status === 'done' ? (
            <Link href="/completed" className="hover:text-blue3 transition-colors text-text2 focus-visible:ring-2 focus-visible:ring-blue2 focus-visible:outline-none rounded-md px-1">
              เสร็จสมบูรณ์
            </Link>
          ) : (
            <Link href="/in-progress" className="hover:text-blue3 transition-colors text-text2 focus-visible:ring-2 focus-visible:ring-blue2 focus-visible:outline-none rounded-md px-1">
              กำลังพัฒนา
            </Link>
          )}
          <span>/</span>
          <span className="text-blue3 font-extrabold">{game.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Sidebar (lg:col-span-4) - contains Poster, Downloads, Team */}
          <div className="lg:col-span-4 space-y-6 max-w-[320px] mx-auto lg:mx-0 w-full">
            
            {/* Poster Art Card */}
            <div className="w-full aspect-[2/3] rounded-2xl border border-white/10 shadow-2xl relative overflow-hidden bg-bg1/40 backdrop-blur-md flex items-center justify-center">
              {(game.posterImage || game.coverImage) ? (
                <img
                  src={game.posterImage || game.coverImage}
                  alt={game.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <span className="text-[72px] drop-shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
                  {game.emoji}
                </span>
              )}
            </div>

            {/* Downloads / ปุ่มดาวน์โหลด (Highly visible under poster) */}
            <DownloadSection downloads={game.downloads} />

            {/* Team / ทีมงาน */}
            <TeamSection team={game.team} />
          </div>

          {/* RIGHT COLUMN: Content (lg:col-span-8) - contains Title, Overview, Specs, Progress, Video, Guide */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header info */}
            <div>
              <h1 className="font-display text-[clamp(2rem,5vw,2.75rem)] font-black text-white leading-[1.2] mb-3 drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-[-0.015em]">
                {game.title}
              </h1>

              {/* Genre & Platform Tags */}
              <div className="flex gap-2 flex-wrap mb-4">
                {game.genre.split('/').map((g) => (
                  <span
                    key={g}
                    className="bg-white/5 border border-white/10 rounded px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] text-text2"
                  >
                    {g.trim()}
                  </span>
                ))}
                <span className="bg-blue-dim/40 border border-blue2/20 rounded px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.5px] text-blue3">
                  THAI LOCALIZATION
                </span>
              </div>

              {/* Status Chips */}
              <div className="flex gap-[6px] flex-wrap">
                <span
                  className={`inline-flex items-center gap-[5px] px-3 py-1 rounded-full text-[11px] font-bold ${
                    game.status === 'done'
                      ? 'bg-blue-dim text-blue3 border border-[rgba(43,95,255,0.22)]'
                      : 'bg-[rgba(168,196,255,0.1)] text-star2 border border-[rgba(168,196,255,0.2)]'
                  }`}
                >
                  {game.status === 'done' ? '✦ เสร็จแล้ว' : '⟳ กำลังพัฒนา'}
                </span>
                <span className="inline-flex items-center gap-[5px] px-3 py-1 rounded-full text-[11px] font-bold bg-[rgba(168,196,255,0.1)] text-star2 border border-[rgba(168,196,255,0.2)]">
                  v{game.translationVersion}
                </span>
                <span className="inline-flex items-center gap-[5px] px-3 py-1 rounded-full text-[11px] font-bold bg-[rgba(255,255,255,0.04)] text-text3 border border-border2">
                  {game.client}
                </span>
                {game.fileSize && (
                  <span className="inline-flex items-center gap-[5px] px-3 py-1 rounded-full text-[11px] font-bold bg-[rgba(255,255,255,0.04)] text-text3 border border-border2">
                    📦 {game.fileSize}
                  </span>
                )}
                {game.updatedAt && (
                  <span className="inline-flex items-center gap-[5px] px-3 py-1 rounded-full text-[11px] font-bold bg-[rgba(255,255,255,0.04)] text-text3 border border-border2">
                    📅 อัปเดต {game.updatedAt}
                  </span>
                )}
              </div>
            </div>

            {/* Overview / เกี่ยวกับเกม */}
            <div className="bg-bg1/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
              <div className="text-[10px] font-bold text-blue3 tracking-[1.5px] uppercase mb-3 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue" />
                เกี่ยวกับเกม (Overview)
              </div>
              <p className="text-[14px] text-text2 leading-[1.8] font-normal max-w-[70ch]">{game.overview}</p>
            </div>

            {/* Technical Specifications / ข้อมูลทางเทคนิค (4-column horizontal card grid like reference site) */}
            <div className="bg-bg1/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
              <div className="text-[10px] font-bold text-blue3 tracking-[1.5px] uppercase mb-4 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue" />
                ข้อมูลทางเทคนิค (Specifications)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-bg2/60 border border-border2/80 rounded-lg p-[14px_16px] flex flex-col justify-between hover:border-blue2/20 transition-colors">
                  <div className="text-[9px] text-text3 uppercase tracking-[1px] mb-1 font-bold">
                    SUPPORTED GAME
                  </div>
                  <div className="text-[14px] text-white font-black leading-tight">{game.version}</div>
                  <div className="text-[9px] text-blue3 font-medium mt-1">Game Version</div>
                </div>
                <div className="bg-bg2/60 border border-border2/80 rounded-lg p-[14px_16px] flex flex-col justify-between hover:border-blue2/20 transition-colors">
                  <div className="text-[9px] text-text3 uppercase tracking-[1px] mb-1 font-bold">
                    PLATFORM
                  </div>
                  <div className="text-[14px] text-white font-black leading-tight">{game.client}</div>
                  <div className="text-[9px] text-blue3 font-medium mt-1">Platform</div>
                </div>
                <div className="bg-bg2/60 border border-border2/80 rounded-lg p-[14px_16px] flex flex-col justify-between hover:border-blue2/20 transition-colors">
                  <div className="text-[9px] text-text3 uppercase tracking-[1px] mb-1 font-bold">
                    TRANSLATION v
                  </div>
                  <div className="text-[14px] text-white font-black leading-tight">v{game.translationVersion}</div>
                  <div className="text-[9px] text-blue3 font-medium mt-1">Mod Version</div>
                </div>
                <div className="bg-bg2/60 border border-border2/80 rounded-lg p-[14px_16px] flex flex-col justify-between hover:border-blue2/20 transition-colors">
                  <div className="text-[9px] text-text3 uppercase tracking-[1px] mb-1 font-bold">
                    FILE SIZE
                  </div>
                  <div className="text-[14px] text-white font-black leading-tight">{game.fileSize || 'N/A'}</div>
                  <div className="text-[9px] text-blue3 font-medium mt-1">Mod Size</div>
                </div>
              </div>
            </div>

            {/* Redesigned Full-Width Development Progress Dashboard */}
            <div className="bg-bg1/45 border border-border2 rounded-2xl p-6 md:p-8 shadow-xl relative overflow-hidden backdrop-blur-md">
              {/* Glowing neon background highlight */}
              <div
                className="absolute inset-0 z-0 opacity-[0.05] pointer-events-none"
                style={{
                  background: 'radial-gradient(circle at 50% 0%, var(--blue) 0%, transparent 70%)',
                }}
              />
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue2/20 to-transparent" />

              {/* Header */}
              <div className="relative z-10 text-[10px] font-bold text-text3 tracking-[1.5px] uppercase mb-6 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue3 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue"></span>
                  </span>
                  <span className="text-[12px] font-extrabold text-blue3 tracking-[1.5px] uppercase">ความคืบหน้าการแปลภาษาไทย</span>
                </div>
              </div>

              {/* Layout Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
                
                {/* Left Area: Circular SVG Progress Ring Gauge (lg:col-span-4) */}
                <div className="lg:col-span-4 flex flex-col items-center justify-center text-center p-4 bg-bg2/25 border border-white/5 rounded-2xl">
                  {/* Circular SVG representation */}
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* Glow ring behind */}
                    <div className="absolute inset-4 rounded-full bg-blue/10 filter blur-xl pointer-events-none" />
                    
                    <svg className="w-full h-full transform -rotate-90">
                      {/* Background Circle */}
                      <circle
                        cx="80"
                        cy="80"
                        r="68"
                        className="stroke-white/5"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      {/* Colored Active Circle */}
                      <circle
                        cx="80"
                        cy="80"
                        r="68"
                        className="stroke-blue transition-all duration-1000 ease-out"
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={427}
                        strokeDashoffset={427 - (427 * overallProgress) / 100}
                        strokeLinecap="round"
                        style={{
                          filter: 'drop-shadow(0 0 8px rgba(43, 95, 255, 0.5))',
                        }}
                      />
                    </svg>
                    
                    {/* Center Percentage */}
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-[38px] font-black text-white leading-none tracking-tight">
                        {overallProgress}%
                      </span>
                      <span className="text-[9px] text-text3 font-bold tracking-[1px] uppercase mt-1">
                        {game.slug === 'the-sims-4' ? 'Base Game' : (liveProgress.isMultiModule ? 'เฉลี่ยทุกภาค' : 'ความคืบหน้าหลัก')}
                      </span>
                    </div>
                  </div>

                  {/* Status Statement */}
                  <div className="mt-4">
                    <div className="text-[13px] font-bold text-text1">
                      {overallProgress >= 100 
                        ? '✦ แปลภาษาไทยเสร็จสิ้นสมบูรณ์' 
                        : overallProgress >= 50 
                          ? '⟳ กำลังดำเนินการแปลครึ่งหลัง' 
                          : '⟳ เริ่มโครงการแปลระยะแรก'}
                    </div>
                    <div className="text-[10px] text-text3 mt-1.5">
                      {game.slug === 'the-sims-4'
                        ? 'ความคืบหน้าการแปลตัวเกมหลัก (Base Game)'
                        : liveProgress.isMultiModule 
                          ? `แปลเสร็จแล้ว ${liveProgress.modules?.filter(m => m.progress >= 100).length || 0} จาก ${liveProgress.modules?.length || 0} ภาค`
                          : isGoogleSheetSync
                            ? 'ซิงก์พิกัดความคืบหน้าตรงจาก Google Sheets'
                            : `เฉลี่ยจากกระบวนการผลิตงานแปล 3 ขั้นตอน`
                      }
                    </div>
                  </div>
                </div>

                {/* Right Area: Detailed Breakdown (lg:col-span-8) */}
                <div className="lg:col-span-8 h-full flex flex-col justify-center">
                  
                  {isGoogleSheetSync ? (
                    // Google Sheets Mode
                    <div className="space-y-4 bg-bg2/20 border border-blue/15 rounded-2xl p-5 md:p-6 flex flex-col justify-between h-full hover:border-blue2/30 transition-all duration-300">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-blue3">
                          <Languages size={18} />
                          <h3 className="text-sm font-bold uppercase tracking-[0.5px]">เชื่อมโยงชีตแปลภาษาหลัก</h3>
                        </div>
                        <p className="text-[12px] text-text2 leading-relaxed">
                          โปรเจกต์นี้ได้รับการเชื่อมต่อข้อมูลกับ Google Sheets ของทีมแปลไทยโดยตรง ทำให้ความคืบหน้าในการแปลหลัก (Translation Progress) จะถูกอัปเดตเป็นเปอร์เซ็นต์แบบเรียลไทม์ทันทีเมื่อมีการอัปเดตงานแปลภายในชีต
                        </p>
                        <div className="flex flex-wrap gap-4 pt-2 text-[11px] text-text3 font-semibold">
                          <div className="flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400" />
                            สถานะเชื่อมต่อ: เรียบร้อย
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue" />
                            อ่านพิกัด: เซลล์ C1 (เปอร์เซ็นต์รวม)
                          </div>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-white/5 flex justify-end">
                        <a
                          href={game.progress.sheetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-blue3 font-bold bg-blue/10 border border-blue2/20 px-4 py-2 rounded-xl hover:bg-blue hover:text-white transition-all shadow-md group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue2"
                        >
                          เปิดดู Google Sheet ตารางแปลภาษา
                          <ExternalLink size={12} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </a>
                      </div>
                    </div>
                  ) : liveProgress.isMultiModule && liveProgress.modules && liveProgress.modules.length > 0 ? (
                    // Multi-Module (DLCs) Grid Mode
                    <div className="space-y-3">
                      <div className="text-[11px] font-bold text-text3 uppercase tracking-[1px] mb-2 flex justify-between items-center pr-1">
                        <span>แบ่งตามภาค / ส่วนเสริม (DLCs)</span>
                        <span className="text-[10px] font-semibold text-text3/70">เลื่อนเมาส์เพื่อดูส่วนเสริมทั้งหมด</span>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1.5 scrollbar-thin">
                        {liveProgress.modules
                          .filter((mod) => !(game.slug === 'the-sims-4' && (mod.name === 'Base Game' || mod.name.toLowerCase().includes('base'))))
                          .map((mod, idx) => {
                            const isDone = mod.progress >= 100
                            return (
                            <div key={idx} className="bg-bg2/30 border border-white/5 rounded-xl p-3.5 hover:border-blue2/20 hover:bg-bg2/40 transition-all duration-300 group/card">
                              <div className="flex justify-between items-center text-[12px] mb-2">
                                <span className="text-text1 font-bold truncate pr-2" title={mod.name}>
                                  {mod.name}
                                </span>
                                <span className={`font-black ${isDone ? 'text-blue3' : 'text-star'}`}>{mod.progress}%</span>
                              </div>
                              <div className="w-full h-1 rounded-full bg-white/5 overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${isDone ? 'bg-gradient-to-r from-blue to-blue3' : 'bg-gradient-to-r from-star to-star2'}`} 
                                  style={{ width: `${mod.progress}%` }} 
                                />
                              </div>
                              <div className="text-[9px] text-text3 mt-1.5 font-bold flex justify-between">
                                <span>{isDone ? '✦ เสร็จสมบูรณ์' : '⟳ กำลังแปลและพัฒนา'}</span>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ) : (
                    // Standard Game 3-Stage Mode
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      {/* Stage 1: Translation */}
                      <div className="bg-bg2/25 border border-white/5 rounded-xl p-5 flex flex-col justify-between items-center text-center hover:border-blue2/25 hover:bg-bg2/40 transition-all duration-300 shadow-md min-h-[200px]">
                        <div className="w-full flex flex-col items-center">
                          <div className="text-[10px] text-text3 uppercase font-extrabold tracking-[1px] mb-1">STAGE 01</div>
                          <div className="text-[32px] font-black text-blue3 leading-none drop-shadow-[0_2px_8px_rgba(43,95,255,0.2)]">{liveProgress.translate}%</div>
                          <div className="text-[17px] font-black text-text1 mt-3.5 leading-snug">
                            แปลเนื้อหาหลัก
                          </div>
                        </div>
                        <div className="w-full mt-5 space-y-2.5">
                          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-blue to-blue3 rounded-full transition-all duration-500" 
                              style={{ width: `${liveProgress.translate}%` }} 
                            />
                          </div>
                          <div className="text-[11px] text-text2 font-bold leading-normal">
                            {liveProgress.translate >= 100 
                              ? '✦ แปลเนื้อหาทั้งหมดเสร็จสิ้น' 
                              : liveProgress.translate > 0 
                                ? '⟳ กำลังแปลซับไตเติลและ UI' 
                                : 'ยังไม่ดำเนินการแปล'}
                          </div>
                        </div>
                      </div>

                      {/* Stage 2: Proofreading */}
                      <div className="bg-bg2/25 border border-white/5 rounded-xl p-5 flex flex-col justify-between items-center text-center hover:border-blue2/25 hover:bg-bg2/40 transition-all duration-300 shadow-md min-h-[200px]">
                        <div className="w-full flex flex-col items-center">
                          <div className="text-[10px] text-text3 uppercase font-extrabold tracking-[1px] mb-1">STAGE 02</div>
                          <div className="text-[32px] font-black text-star leading-none drop-shadow-[0_2px_8px_rgba(234,179,8,0.15)]">{liveProgress.proofread || 0}%</div>
                          <div className="text-[17px] font-black text-text1 mt-3.5 leading-snug">
                            ตรวจทานเรียบเรียง
                          </div>
                        </div>
                        <div className="w-full mt-5 space-y-2.5">
                          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-star to-star2 rounded-full transition-all duration-500" 
                              style={{ width: `${liveProgress.proofread || 0}%` }} 
                            />
                          </div>
                          <div className="text-[11px] text-text2 font-bold leading-normal">
                            {(liveProgress.proofread || 0) >= 100 
                              ? '✦ ตรวจทานความถูกต้องเสร็จสิ้น' 
                              : (liveProgress.proofread || 0) > 0 
                                ? '⟳ กำลังเกลาสำนวนและคำทับศัพท์' 
                                : 'รอเริ่มขั้นตอนการตรวจทาน'}
                          </div>
                        </div>
                      </div>

                      {/* Stage 3: Testing */}
                      <div className="bg-bg2/25 border border-white/5 rounded-xl p-5 flex flex-col justify-between items-center text-center hover:border-blue2/25 hover:bg-bg2/40 transition-all duration-300 shadow-md min-h-[200px]">
                        <div className="w-full flex flex-col items-center">
                          <div className="text-[10px] text-text3 uppercase font-extrabold tracking-[1px] mb-1">STAGE 03</div>
                          <div className="text-[32px] font-black text-text1 leading-none">{liveProgress.test || 0}%</div>
                          <div className="text-[17px] font-black text-text1 mt-3.5 leading-snug">
                            ทดสอบระบบในเกม
                          </div>
                        </div>
                        <div className="w-full mt-5 space-y-2.5">
                          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-text3 to-text2 rounded-full transition-all duration-500" 
                              style={{ width: `${liveProgress.test || 0}%` }} 
                            />
                          </div>
                          <div className="text-[11px] text-text2 font-bold leading-normal">
                            {game.status === 'done' || (liveProgress.test || 0) >= 100
                              ? '✦ แก้ไขบั๊กและฟอนต์เรียบร้อย' 
                              : (liveProgress.test || 0) > 0 
                                ? '⟳ ไล่ตรวจบั๊กและข้อความทับซ้อน' 
                                : 'รอเริ่มการทดสอบในเกม'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </div>

            {/* Video Section */}
            {game.videoUrl && (
              <div className="bg-bg1/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
                <div className="text-[10px] font-bold text-blue3 tracking-[1.5px] uppercase mb-3 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-blue3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.344-5.891a1.5 1.5 0 000-2.538L6.3 2.84z"/>
                  </svg>
                  วิดีโอตัวอย่างการแปล
                </div>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-border2 bg-bg2 shadow-inner">
                  <iframe
                    src={game.videoUrl}
                    title={`${game.title} — ตัวอย่างการแปลไทย`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
              </div>
            )}

            {/* Details of Translation / รายละเอียดการแปล */}
            <div className="bg-bg1/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
              <div className="text-[10px] font-bold text-blue3 tracking-[1.5px] uppercase mb-3 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue" />
                รายละเอียดการแปล
              </div>
              {game.shortDescription && (
                <p className="text-sm font-semibold text-blue3 leading-relaxed mb-2.5 max-w-[70ch]">
                  {game.shortDescription}
                </p>
              )}
              <p className="text-xs text-text2 leading-[1.8] font-normal max-w-[70ch]">{game.description}</p>
            </div>



            {/* Installation Guide / วิธีการลงม็อด */}
            {game.instructions && game.instructions.length > 0 && (
              <div className="bg-bg1/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
                <div className="text-[10px] font-bold text-blue3 tracking-[1.5px] uppercase mb-5 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue" />
                  วิธีการลงม็อด (Installation Guide)
                </div>
                
                <div className="relative pl-2 sm:pl-4 space-y-6">
                  {/* Timeline vertical connector line */}
                  {game.instructions.length > 1 && (
                    <div className="absolute left-[20px] sm:left-[28px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-blue/40 via-blue2/10 to-transparent border-l border-dashed border-white/5 pointer-events-none" />
                  )}
                  
                  {game.instructions.map((step, idx) => (
                    <div key={idx} className="relative flex gap-4 sm:gap-5 items-start">
                      {/* Step badge */}
                      <div className="z-10 shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-bg2 border border-blue2/25 flex items-center justify-center text-xs sm:text-sm font-bold text-blue3 shadow-[0_0_15px_rgba(43,95,255,0.15)]">
                        {idx + 1}
                      </div>
                      
                      {/* Step content */}
                      <div className="flex-1 space-y-3 pt-0.5 sm:pt-1">
                        <p className="text-[13px] text-text2 leading-relaxed font-normal whitespace-pre-line">{step.text}</p>
                        
                        {step.image && (
                          <div className="relative rounded-xl overflow-hidden border border-white/5 bg-bg2/40 max-w-[560px] shadow-lg group/img">
                            <img
                              src={step.image}
                              alt={`ขั้นตอนที่ ${idx + 1}`}
                              className="w-full h-auto object-cover max-h-[300px] transition-transform duration-500 group-hover/img:scale-[1.015]"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}
