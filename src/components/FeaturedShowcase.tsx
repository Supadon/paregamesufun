'use client'

import Link from 'next/link'
import { Game } from '@/lib/types'
import { Sparkles, ArrowRight, Star, Flame, Award, Gamepad2 } from 'lucide-react'

interface FeaturedShowcaseProps {
  games: Game[]
}

export default function FeaturedShowcase({ games }: FeaturedShowcaseProps) {
  // Select top 3 flagship games:
  const sims4 = games.find((g) => g.slug === 'the-sims-4') || games[0]
  const game911 = games.find((g) => g.slug === '911-operator') || games[1]
  const inzoi = games.find((g) => g.slug === 'inzoi') || games.find((g) => g.slug === 'until-dawn') || games[2]

  if (!sims4 || !game911 || !inzoi) return null

  const spotlights = [
    {
      game: sims4,
      tier: 'THE MASTERPIECE',
      tierTh: 'ผลงานยอดนิยมตลอดกาล',
      icon: Award,
      badgeColor: 'text-amber-300 border-amber-400/40 bg-amber-500/15',
      glowColor: 'shadow-[0_15px_45px_rgba(0,0,0,0.7),0_0_35px_rgba(43,95,255,0.25)] hover:shadow-[0_20px_55px_rgba(0,0,0,0.85),0_0_45px_rgba(0,210,255,0.4)]',
      borderColor: 'border-cyan-400/40 hover:border-cyan-300',
      accentGradient: 'from-blue via-cyan-400 to-indigo-500',
      tagText: 'EA App • Steam',
      highlightBadge: 'แปลไทย 55% + ส่วนเสริมครบ',
      isGrand: true,
    },
    {
      game: game911,
      tier: 'COMMUNITY CHOICE',
      tierTh: 'ขวัญใจผู้เล่นชาวไทย',
      icon: Star,
      badgeColor: 'text-sky-300 border-sky-400/40 bg-sky-500/15',
      glowColor: 'shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(56,189,248,0.18)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.8),0_0_35px_rgba(56,189,248,0.35)]',
      borderColor: 'border-sky-400/30 hover:border-sky-300',
      accentGradient: 'from-sky-500 to-blue',
      tagText: 'Steam • PC',
      highlightBadge: 'แปลสมบูรณ์ 100%',
      isGrand: false,
    },
    {
      game: inzoi,
      tier: 'NEXT-GEN RISING',
      tierTh: 'ม็อดมาแรงแห่งยุค',
      icon: Flame,
      badgeColor: 'text-purple-300 border-purple-400/40 bg-purple-500/15',
      glowColor: 'shadow-[0_10px_35px_rgba(0,0,0,0.6),0_0_25px_rgba(168,85,247,0.18)] hover:shadow-[0_15px_45px_rgba(0,0,0,0.8),0_0_35px_rgba(168,85,247,0.35)]',
      borderColor: 'border-purple-400/30 hover:border-purple-300',
      accentGradient: 'from-purple-500 to-pink-500',
      tagText: 'UE5 • Steam',
      highlightBadge: 'CurseForge Verified',
      isGrand: false,
    },
  ]

  return (
    <section className="relative z-10 max-w-[1140px] mx-auto px-4 sm:px-6 pt-6 pb-12 sm:pb-16">
      {/* Section Header: Unique "แปลเกมสู่ฝัน" Starlight Identity */}
      <div className="text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-dim/60 border border-blue2/30 shadow-[0_0_15px_rgba(43,95,255,0.25)] mb-2.5">
          <Sparkles size={11} className="text-cyan-400 animate-pulse" />
          <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.22em] text-cyan-300">
            STELLAR SPOTLIGHT · ม็อดแปลไทยดาวเด่น
          </span>
        </div>

        <h2 className="font-display text-[clamp(1.75rem,4.5vw,2.5rem)] font-black text-white tracking-[-0.015em] drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          ม็อดเกมยอดนิยม
        </h2>

        {/* Custom Cosmic Line with Starlight Node */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <div className="w-12 sm:w-16 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-blue" />
          <span className="w-2 h-2 rotate-45 bg-cyan-400 shadow-[0_0_8px_#00D2FF]" />
          <div className="w-12 sm:w-16 h-[2px] bg-gradient-to-l from-transparent via-cyan-400 to-blue" />
        </div>
      </div>

      {/* 3 Bespoke Spotlight Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-6 lg:gap-8 items-stretch">
        {spotlights.map((item, idx) => {
          const { game, tier, tierTh, icon: IconComponent, badgeColor, glowColor, borderColor, accentGradient, tagText, highlightBadge, isGrand } = item
          const cover = game.coverImage || game.posterImage || '/logo.jpg'

          return (
            <Link
              key={idx}
              href={`/games/${game.slug}`}
              className={`group relative rounded-2xl overflow-hidden bg-bg1/80 backdrop-blur-xl border ${borderColor} ${glowColor} transition-all duration-500 hover:-translate-y-2 flex flex-col no-underline ${
                isGrand ? 'md:-translate-y-2 md:scale-[1.03] z-20' : 'z-10'
              }`}
            >
              {/* Sci-Fi HUD Corner Accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-400/60 rounded-tl pointer-events-none z-30 transition-all duration-300 group-hover:w-5 group-hover:h-5 group-hover:border-cyan-300" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-400/60 rounded-tr pointer-events-none z-30 transition-all duration-300 group-hover:w-5 group-hover:h-5 group-hover:border-cyan-300" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-400/60 rounded-bl pointer-events-none z-30 transition-all duration-300 group-hover:w-5 group-hover:h-5 group-hover:border-cyan-300" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-400/60 rounded-br pointer-events-none z-30 transition-all duration-300 group-hover:w-5 group-hover:h-5 group-hover:border-cyan-300" />

              {/* Cover Banner Area */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-bg2">
                <img
                  src={cover}
                  alt={game.title}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                {/* Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg1 via-black/35 to-black/60" />

                {/* Starlight Tier Badge (Top-Left) */}
                <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full backdrop-blur-md border ${badgeColor} shadow-md`}>
                  <IconComponent size={12} />
                  <span className="text-[10px] font-black uppercase tracking-wider">{tier}</span>
                </div>

                {/* Live Status Highlight (Top-Right) */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-extrabold text-white shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                  <span>{highlightBadge}</span>
                </div>
              </div>

              {/* Info Content Body */}
              <div className="p-4 sm:p-5 flex flex-col flex-1 relative z-10">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-400 truncate">
                    {game.genre}
                  </span>
                  <span className="text-[10px] font-mono text-text3 shrink-0">
                    {tagText}
                  </span>
                </div>

                <h3 className="font-display text-base sm:text-lg font-black text-white group-hover:text-cyan-300 transition-colors leading-snug line-clamp-1 mb-1.5">
                  {game.title}
                </h3>

                <p className="text-[11px] text-text3 line-clamp-2 leading-relaxed mb-4 flex-1">
                  {game.shortDescription || game.description}
                </p>

                {/* Bottom Action Footer */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs font-bold">
                  <span className="text-[11px] text-text3/90">
                    {tierTh}
                  </span>
                  
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black transition-all ${
                    isGrand
                      ? 'bg-gradient-to-r from-blue via-cyan-400 to-indigo-500 text-white shadow-[0_0_15px_rgba(0,210,255,0.4)] group-hover:scale-105'
                      : 'bg-white/5 border border-white/10 text-white group-hover:border-cyan-400/50 group-hover:bg-cyan-400/10'
                  }`}>
                    <span>ดูข้อมูลม็อด</span>
                    <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
