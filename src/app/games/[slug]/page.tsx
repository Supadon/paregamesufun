import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getGames, getGameBySlug, getSims4Packs, getTeamPool } from '@/app/actions/games'
import ProgressBar from '@/components/ProgressBar'
import DownloadSection from '@/components/DownloadSection'
import TeamSection from '@/components/TeamSection'
import Sims4PageLayout from '@/components/sims4/Sims4PageLayout'
import sims4PacksData from '@/data/sims4-packs.json'
import { Sims4Pack } from '@/lib/types'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import ThemedCard from '@/components/ThemedCard'

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
  colIndex = colIndex - 1

  const rowIndex = parseInt(rowStr, 10) - 1

  return { row: rowIndex, col: colIndex }
}

// Fetch specific cell from Google Sheet CSV
async function fetchGoogleSheetPercentage(url: string, cell?: string): Promise<number | null> {
  const csvUrl = getGoogleSheetCsvUrl(url)
  if (!csvUrl) return null

  try {
    const res = await fetch(csvUrl, {
      next: { revalidate: 60 }
    })
    if (!res.ok) return null
    const csvText = await res.text()
    const lines = csvText.split('\n')
    if (lines.length === 0) return null
    
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
  const rawGame = await getGameBySlug(slug)

  if (!rawGame) {
    notFound()
  }

  // Enrich team members with latest team pool avatars and links
  const teamPool = await getTeamPool()
  const enrichedTeam = (rawGame.team || []).map((m) => {
    const poolMember = teamPool.find((p) => p.name.toLowerCase() === m.name.toLowerCase())
    return {
      ...m,
      avatar: m.avatar || poolMember?.avatar || '',
      link: m.link || poolMember?.link || poolMember?.url || '',
      url: m.url || m.link || poolMember?.url || poolMember?.link || '',
    }
  })
  const game = { ...rawGame, team: enrichedTeam }

  // 💎 The Sims 4: Full-Width Dedicated Experience
  if (game.slug === 'the-sims-4') {
    const packs = await getSims4Packs()
    return <Sims4PageLayout game={game} packs={packs.length > 0 ? packs : (sims4PacksData as Sims4Pack[])} />
  }

  // Standard Game: 2-Column Sidebar Layout
  let liveProgress = { ...game.progress }
  let isGoogleSheetSync = false
  if (game.progress?.sheetUrl) {
    const sheetPercent = await fetchGoogleSheetPercentage(game.progress.sheetUrl, game.progress.sheetCell)
    if (sheetPercent !== null) {
      liveProgress.translate = sheetPercent
      isGoogleSheetSync = true
    }
  }

  let overallProgress = 0
  if (liveProgress.isMultiModule && liveProgress.modules && liveProgress.modules.length > 0) {
    const total = liveProgress.modules.reduce((sum, m) => sum + m.progress, 0)
    overallProgress = Math.round(total / liveProgress.modules.length)
  } else if (isGoogleSheetSync) {
    overallProgress = liveProgress.translate
  } else {
    overallProgress = Math.round((liveProgress.translate + (liveProgress.proofread || 0) + (liveProgress.test || 0)) / 3)
  }

  return (
    <div className="w-full min-h-screen text-text1 pb-16 relative">
      {/* Cinematic Cover Background */}
      {game.coverImage ? (
        <div className="absolute top-0 left-0 right-0 h-[520px] overflow-hidden pointer-events-none z-0">
          <img
            src={game.coverImage}
            alt={game.title}
            className="w-full h-full object-cover object-[center_30%] opacity-65 scale-[1.01]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-bg0/80 via-transparent to-bg0/80" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg0/30 via-bg0/20 to-bg0" />
        </div>
      ) : (
        /* Themed fallback banner for games without a cover image */
        <div className="absolute top-0 left-0 right-0 h-[520px] overflow-hidden pointer-events-none z-0">
          <div className="themed-card__art absolute inset-0 opacity-80" />
          <span className="absolute right-[8%] top-[15%] text-[260px] leading-none opacity-[0.12] blur-[1px] select-none">
            {game.emoji}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-bg0/70 via-transparent to-bg0/40" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg0/20 via-bg0/10 to-bg0" />
        </div>
      )}

      {/* Main Container */}
      <div className="max-w-[1100px] mx-auto px-6 pt-28 pb-12 relative z-10">
        {/* Breadcrumbs */}
        <div className="mb-6 flex items-center gap-2 text-text3 text-[12px] font-bold">
          <Link href="/" className="hover:text-blue3 transition-colors flex items-center gap-1">
            <ArrowLeft size={12} />
            หน้าแรก
          </Link>
          <span>/</span>
          <span className="text-blue3 font-extrabold">{game.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* LEFT COLUMN: Sidebar (lg:col-span-4) */}
          <div className="lg:col-span-4 space-y-6 max-w-[320px] mx-auto lg:mx-0 w-full">
            <ThemedCard accent="#4A7FFF" className="group w-full aspect-[2/3] rounded-2xl border border-white/10 shadow-2xl overflow-hidden bg-bg1/40 backdrop-blur-md flex items-center justify-center">
              {(game.posterImage || game.coverImage) ? (
                <img
                  src={game.posterImage || game.coverImage}
                  alt={game.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="themed-card__art absolute inset-0 flex items-center justify-center">
                  <span className="relative z-10 text-[84px] drop-shadow-[0_6px_24px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                    {game.emoji}
                  </span>
                </div>
              )}
            </ThemedCard>

            <DownloadSection downloads={game.downloads} />
            <TeamSection team={game.team} />
          </div>

          {/* RIGHT COLUMN: Content (lg:col-span-8) */}
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

            {/* Overview */}
            <div className="bg-bg1/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
              <div className="text-[10px] font-bold text-blue3 tracking-[1.5px] uppercase mb-3 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue" />
                เกี่ยวกับเกม (Overview)
              </div>
              <p className="text-[14px] text-text2 leading-[1.8] font-normal max-w-[70ch]">{game.overview}</p>
            </div>

            {/* Specifications */}
            <div className="bg-bg1/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
              <div className="text-[10px] font-bold text-blue3 tracking-[1.5px] uppercase mb-4 flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue" />
                ข้อมูลทางเทคนิค (Specifications)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-bg2/60 border border-border2/80 rounded-lg p-[14px_16px] flex flex-col justify-between hover:border-blue2/20 transition-colors">
                  <div className="text-[9px] text-text3 uppercase tracking-[1px] mb-1 font-bold">SUPPORTED GAME</div>
                  <div className="text-[14px] text-white font-black leading-tight">{game.version}</div>
                </div>
                <div className="bg-bg2/60 border border-border2/80 rounded-lg p-[14px_16px] flex flex-col justify-between hover:border-blue2/20 transition-colors">
                  <div className="text-[9px] text-text3 uppercase tracking-[1px] mb-1 font-bold">PLATFORM</div>
                  <div className="text-[14px] text-white font-black leading-tight">{game.client}</div>
                </div>
                <div className="bg-bg2/60 border border-border2/80 rounded-lg p-[14px_16px] flex flex-col justify-between hover:border-blue2/20 transition-colors">
                  <div className="text-[9px] text-text3 uppercase tracking-[1px] mb-1 font-bold">TRANSLATION v</div>
                  <div className="text-[14px] text-white font-black leading-tight">v{game.translationVersion}</div>
                </div>
                <div className="bg-bg2/60 border border-border2/80 rounded-lg p-[14px_16px] flex flex-col justify-between hover:border-blue2/20 transition-colors">
                  <div className="text-[9px] text-text3 uppercase tracking-[1px] mb-1 font-bold">FILE SIZE</div>
                  <div className="text-[14px] text-white font-black leading-tight">{game.fileSize || 'N/A'}</div>
                </div>
              </div>
            </div>

            {/* Progress / ความคืบหน้า */}
            <div className="bg-bg1/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between gap-4 mb-4">
                <div className="text-[10px] font-bold text-blue3 tracking-[1.5px] uppercase flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue" />
                  ความคืบหน้า
                </div>
                {isGoogleSheetSync && (
                  <span className="inline-flex items-center gap-1.5 text-[9px] bg-blue/10 border border-blue2/20 text-blue3 px-2.5 py-0.5 rounded-full font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    LIVE SYNCED
                  </span>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                        overallProgress >= 100
                          ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                          : 'bg-blue/15 text-blue3 border-blue2/30'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          overallProgress >= 100 ? 'bg-emerald-400' : 'bg-blue3 animate-pulse'
                        }`}
                      />
                      {overallProgress >= 100
                        ? 'แปลภาษาไทยเสร็จสิ้นสมบูรณ์'
                        : 'กำลังดำเนินการแปลภาษาไทย'}
                    </span>
                  </div>

                  <div className="text-right flex items-baseline gap-1">
                    <span className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight">
                      {overallProgress}
                    </span>
                    <span className="text-base font-bold text-blue3">%</span>
                  </div>
                </div>

                {/* Horizontal Progress Bar */}
                <div className="w-full h-3 rounded-full bg-bg2/80 border border-white/10 p-0.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out shadow-sm ${
                      overallProgress >= 100
                        ? 'bg-gradient-to-r from-blue via-emerald-400 to-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                        : 'bg-gradient-to-r from-blue via-blue2 to-blue3 shadow-[0_0_12px_rgba(43,95,255,0.4)]'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(0, overallProgress))}%` }}
                  />
                </div>

                {game.progress?.sheetUrl && (
                  <div className="pt-2 flex justify-end">
                    <a
                      href={game.progress.sheetUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-blue3 hover:text-white transition-colors font-semibold"
                    >
                      เปิดดู Google Sheet ตารางแปลภาษา
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
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

            {/* Details */}
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

            {/* Installation Guide */}
            {game.instructions && game.instructions.length > 0 && (
              <div className="bg-bg1/40 backdrop-blur-md border border-white/5 rounded-2xl p-6 shadow-xl">
                <div className="text-[10px] font-bold text-blue3 tracking-[1.5px] uppercase mb-5 flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue" />
                  วิธีการลงม็อด (Installation Guide)
                </div>
                
                <div className="relative pl-2 sm:pl-4 space-y-6">
                  {game.instructions.length > 1 && (
                    <div className="absolute left-[20px] sm:left-[28px] top-4 bottom-4 w-[1px] bg-gradient-to-b from-blue/40 via-blue2/10 to-transparent border-l border-dashed border-white/5 pointer-events-none" />
                  )}
                  
                  {game.instructions.map((step, idx) => (
                    <div key={idx} className="relative flex gap-4 sm:gap-5 items-start">
                      <div className="z-10 shrink-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-bg2 border border-blue2/25 flex items-center justify-center text-xs sm:text-sm font-bold text-blue3 shadow-lg">
                        {idx + 1}
                      </div>
                      
                      <div className="flex-1 space-y-3 pt-0.5 sm:pt-1">
                        {step.text && (
                          <p className="text-[13px] text-text2 leading-relaxed font-normal whitespace-pre-line">{step.text}</p>
                        )}
                        {step.image && (
                          <div className={`relative rounded-2xl overflow-hidden border border-white/10 bg-bg2/40 shadow-xl group/stepimg ${
                            step.aspectRatio === '1:1'
                              ? 'max-w-[420px] aspect-square'
                              : step.aspectRatio === 'auto'
                              ? 'max-w-[620px] max-h-[520px] flex items-center justify-center'
                              : 'max-w-[620px] aspect-video'
                          }`}>
                            <img
                              src={step.image}
                              alt={`ขั้นตอนที่ ${idx + 1}`}
                              className={`w-full h-full ${
                                step.aspectRatio === 'auto' ? 'object-contain max-h-[520px]' : 'object-cover'
                              } transition-transform duration-300 group-hover/stepimg:scale-102`}
                            />
                            <a
                              href={step.image}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/75 hover:bg-black/90 backdrop-blur-md text-[11px] text-white font-medium opacity-0 group-hover/stepimg:opacity-100 transition-opacity flex items-center gap-1.5 shadow-lg border border-white/10"
                              title="คลิกเพื่อดูรูปภาพขนาดเต็ม"
                            >
                              <ExternalLink size={12} />
                              ดูรูปขนาดเต็ม
                            </a>
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
