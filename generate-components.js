const fs = require('fs');
const path = require('path');

const targetRoot = path.resolve('..', 'paregamesufun-new');

function writeFile(relPath, content) {
  const fullPath = path.join(targetRoot, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log('Created:', relPath);
}

// -------------------------------------------------------------
// 1. src/components/Navbar.tsx
// -------------------------------------------------------------
writeFile('src/components/Navbar.tsx', `
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Heart, Shield, Menu, X, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'ALL CATALOG' },
    { href: '/games/the-sims-4', label: 'THE SIMS 4' },
    { href: '/completed', label: 'COMPLETED' },
    { href: '/in-progress', label: 'IN PROGRESS' },
    { href: '/donate', label: 'SUPPORT' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#FAFAFC]/90 backdrop-blur-md border-b border-[#E5E7EB] transition-all">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 h-20 flex items-center justify-between">
        
        {/* Brand Mark (Bold Grotesque Typography) */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center font-black text-xs tracking-tighter">
            GF
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black text-base sm:text-lg tracking-[-0.04em] text-black group-hover:opacity-75 transition-opacity">
              PAREGAMESUFUN
            </span>
            <span className="text-[9px] font-bold tracking-widest text-[#64748B] uppercase">
              STUDIO LOCALIZATION
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-bold tracking-wider">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={\`transition-colors uppercase \${
                  isActive ? 'text-black font-extrabold border-b-2 border-black pb-1' : 'text-[#64748B] hover:text-black'
                }\`}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/donate"
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold bg-black text-white hover:bg-neutral-800 transition-all shadow-sm"
          >
            <Heart size={13} className="text-white fill-white" />
            <span>DONATE</span>
          </Link>

          <Link
            href="/admin"
            title="Admin Login"
            className="p-2 text-[#64748B] hover:text-black rounded-full hover:bg-[#E5E7EB]/50 transition-colors"
          >
            <Shield size={16} />
          </Link>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 md:hidden text-black rounded-lg hover:bg-[#E5E7EB]"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-[#E5E7EB] bg-white px-6 py-6 space-y-4 animate-fadeIn">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm font-bold text-black hover:text-neutral-600 py-1"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2">
            <Link
              href="/donate"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-xs font-bold bg-black text-white"
            >
              <Heart size={14} />
              <span>SUPPORT US</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
`);

// -------------------------------------------------------------
// 2. src/components/HeroSpotlight.tsx
// -------------------------------------------------------------
writeFile('src/components/HeroSpotlight.tsx', `
'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react'

export default function HeroSpotlight() {
  return (
    <section className="relative w-full rounded-3xl bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden p-8 sm:p-14 mb-14 shadow-sm">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
        
        {/* Left Editorial Copy */}
        <div className="lg:col-span-6 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-white border border-[#E5E7EB] text-black shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            SPOTLIGHT TRANSLATION
          </div>

          <div className="space-y-2">
            <h1 className="font-display text-4xl sm:text-6xl font-black text-black tracking-[-0.03em] uppercase leading-[1.05]">
              THE SIMS 4
            </h1>
            <p className="text-base sm:text-lg font-bold text-[#64748B]">
              THAI LOCALIZATION COLLECTION 2026
            </p>
          </div>

          <p className="text-sm text-[#64748B] leading-relaxed max-w-lg font-normal">
            ม็อดภาษาไทยสมบูรณ์แบบสำหรับตัวเกมหลัก (Base Game), ภาคเสริมทุกรูปแบบ (Expansion, Game, Stuff Packs) และม็อดระบบยอดนิยม แปลและทดสอบเพื่อผู้เล่นชาวไทยทุกคน
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/games/the-sims-4"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-xs sm:text-sm font-black text-white bg-black hover:bg-neutral-800 transition-all"
            >
              <span>EXPLORE FULL CATALOG</span>
              <ArrowRight size={15} />
            </Link>

            <Link
              href="/completed"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full text-xs sm:text-sm font-bold text-black bg-white border border-[#E5E7EB] hover:bg-neutral-50 transition-all"
            >
              <span>VIEW ALL GAMES</span>
            </Link>
          </div>
        </div>

        {/* Right Studio Showcase Render */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-full max-w-[440px] aspect-[4/3] sm:aspect-[16/11] rounded-2xl bg-white border border-[#E5E7EB] shadow-lg p-6 flex flex-col justify-between overflow-hidden group">
            <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
              <span>CATALOG NO. 003</span>
              <span className="text-black font-extrabold">STATUS: 100% READY</span>
            </div>

            <div className="relative w-full h-[220px] flex items-center justify-center my-auto">
              <img
                src="/uploads/sims_cover_art.png"
                alt="The Sims 4 Thai Edition"
                className="max-h-full max-w-full object-contain drop-shadow-xl group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] pt-3 border-t border-[#F3F4F6]">
              <span className="font-bold text-black uppercase">THE SIMS 4 + 40 DLC PACKS</span>
              <span className="text-[#64748B]">FREE TO PLAY</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
`);

// -------------------------------------------------------------
// 3. src/components/StudioCard.tsx
// -------------------------------------------------------------
writeFile('src/components/StudioCard.tsx', `
'use client'

import Link from 'next/link'
import { Game } from '@/lib/types'
import { ArrowUpRight } from 'lucide-react'

interface StudioCardProps {
  game: Game
}

export default function StudioCard({ game }: StudioCardProps) {
  const isSims = game.slug === 'the-sims-4'

  return (
    <Link
      href={\`/games/\${game.slug}\`}
      className="group flex flex-col bg-white border border-[#E5E7EB] hover:border-black rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg"
    >
      {/* Studio Media Box */}
      <div className="relative w-full aspect-[4/5] bg-[#F4F4F6] overflow-hidden flex items-center justify-center p-4">
        {game.posterImage || game.coverImage ? (
          <img
            src={game.posterImage || game.coverImage}
            alt={game.title}
            className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <span className="text-5xl select-none">{game.emoji}</span>
        )}

        {/* Minimal Status Tag (Top Left) */}
        <div className="absolute top-3 left-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-md border border-[#E5E7EB] text-black shadow-xs">
            <span className={\`w-1.5 h-1.5 rounded-full \${game.status === 'done' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}\`} />
            {game.status === 'done' ? 'COMPLETED' : 'IN PROGRESS'}
          </div>
        </div>

        {/* Minimal Year / Client (Top Right) */}
        <div className="absolute top-3 right-3 text-[10px] font-bold text-[#64748B] bg-white/90 backdrop-blur-md px-2 py-0.5 rounded border border-[#E5E7EB]">
          {game.version || 'v1.0'}
        </div>
      </div>

      {/* Editorial Card Footer */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-display font-black text-sm text-black uppercase tracking-tight group-hover:underline line-clamp-1">
              {game.title}
            </h3>
            <ArrowUpRight size={14} className="text-[#94A3B8] group-hover:text-black shrink-0 transition-colors" />
          </div>

          <p className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5">
            {game.shortDescription || game.description}
          </p>
        </div>

        <div className="pt-2.5 border-t border-[#F3F4F6] flex items-center justify-between text-[10px] font-bold text-[#64748B] uppercase">
          <span>{game.genre.split('/')[0]}</span>
          <span className="text-black">{isSims ? '40+ PACKS' : 'MOD READY'}</span>
        </div>
      </div>
    </Link>
  )
}
`);

// -------------------------------------------------------------
// 4. src/components/StudioGrid.tsx
// -------------------------------------------------------------
writeFile('src/components/StudioGrid.tsx', `
'use client'

import { useState, useMemo } from 'react'
import { Game, Sims4Pack } from '@/lib/types'
import StudioCard from './StudioCard'
import Sims4PackCard from './sims4/Sims4PackCard'
import { Search, X, SlidersHorizontal } from 'lucide-react'

interface StudioGridProps {
  games: Game[]
  sims4Packs: Sims4Pack[]
}

export default function StudioGrid({ games, sims4Packs }: StudioGridProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'games' | 'sims4' | 'expansion' | 'gamepack' | 'stuffpack' | 'mod'>('all')
  const [activeStatus, setActiveStatus] = useState<'all' | 'done' | 'wip'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Filtered Standalone Games
  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      if (activeCategory === 'sims4' || activeCategory === 'expansion' || activeCategory === 'gamepack' || activeCategory === 'stuffpack' || activeCategory === 'mod') {
        return false
      }
      if (activeStatus !== 'all' && game.status !== activeStatus) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return game.title.toLowerCase().includes(q) || game.description.toLowerCase().includes(q)
      }
      return true
    })
  }, [games, activeCategory, activeStatus, searchQuery])

  // Filtered Sims 4 Packs
  const filteredSims4Packs = useMemo(() => {
    return sims4Packs.filter((pack) => {
      if (activeCategory === 'games') return false
      if (activeCategory === 'expansion' && pack.category !== 'expansion') return false
      if (activeCategory === 'gamepack' && pack.category !== 'gamepack') return false
      if (activeCategory === 'stuffpack' && pack.category !== 'stuffpack') return false
      if (activeCategory === 'mod' && pack.category !== 'mod') return false

      if (activeStatus !== 'all' && pack.status !== activeStatus) return false
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        return pack.name.toLowerCase().includes(q) || (pack.thName && pack.thName.toLowerCase().includes(q))
      }
      return true
    })
  }, [sims4Packs, activeCategory, activeStatus, searchQuery])

  const totalCount = (activeCategory === 'games' ? filteredGames.length : activeCategory.startsWith('expansion') || activeCategory.startsWith('game') || activeCategory.startsWith('stuff') || activeCategory.startsWith('mod') ? filteredSims4Packs.length : filteredGames.length + filteredSims4Packs.length)

  return (
    <section className="space-y-8">
      
      {/* Category Pills & Search Controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Category Filter Pills (Minimalist Black / Gray) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs font-bold">
            {[
              { id: 'all', label: 'ALL CATALOG' },
              { id: 'sims4', label: 'THE SIMS 4 (ALL)' },
              { id: 'expansion', label: 'EXPANSION PACKS' },
              { id: 'gamepack', label: 'GAME PACKS' },
              { id: 'stuffpack', label: 'STUFF PACKS' },
              { id: 'mod', label: 'SCRIPT MODS' },
              { id: 'games', label: 'STANDALONE GAMES' },
            ].map((tab) => {
              const isActive = activeCategory === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as any)}
                  className={\`shrink-0 px-4 py-2 rounded-full transition-all uppercase tracking-wider \${
                    isActive
                      ? 'bg-black text-white font-extrabold shadow-sm'
                      : 'bg-[#F3F4F6] text-[#64748B] hover:text-black hover:bg-[#E5E7EB]'
                  }\`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[260px]">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search catalog or mods..."
              className="w-full bg-white border border-[#E5E7EB] rounded-full pl-9 pr-8 py-2 text-xs text-black placeholder:text-[#94A3B8] focus:outline-none focus:border-black transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-black"
              >
                <X size={12} />
              </button>
            )}
          </div>

        </div>

        {/* Status Sub-Filters */}
        <div className="flex items-center justify-between text-xs border-b border-[#E5E7EB] pb-3">
          <div className="flex items-center gap-4 text-[#64748B] font-bold">
            <span>FILTER BY STATUS:</span>
            {[
              { id: 'all', label: 'ALL' },
              { id: 'done', label: 'COMPLETED' },
              { id: 'wip', label: 'IN PROGRESS' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setActiveStatus(st.id as any)}
                className={\`hover:text-black transition-colors \${
                  activeStatus === st.id ? 'text-black font-extrabold underline underline-offset-4' : ''
                }\`}
              >
                {st.label}
              </button>
            ))}
          </div>

          <div className="text-[11px] font-bold text-[#94A3B8] uppercase">
            SHOWING {totalCount} ITEMS
          </div>
        </div>
      </div>

      {/* 4-Column Studio Catalog Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6">
        {/* Render Games */}
        {filteredGames.map((game) => (
          <StudioCard key={game.id} game={game} />
        ))}

        {/* Render Sims 4 Packs */}
        {filteredSims4Packs.map((pack) => (
          <Sims4PackCard key={pack.id} pack={pack} />
        ))}
      </div>

      {totalCount === 0 && (
        <div className="text-center py-20 bg-white rounded-2xl border border-[#E5E7EB] space-y-2">
          <p className="font-bold text-black text-sm">NO ITEMS FOUND</p>
          <p className="text-xs text-[#64748B]">Try adjusting your search or filters.</p>
        </div>
      )}

    </section>
  )
}
`);

// -------------------------------------------------------------
// 5. src/components/sims4/Sims4PackCard.tsx
// -------------------------------------------------------------
writeFile('src/components/sims4/Sims4PackCard.tsx', `
'use client'

import { useState } from 'react'
import { Sims4Pack } from '@/lib/types'
import { Check, Clock, Sparkles, ArrowUpRight, Download, X } from 'lucide-react'

interface Sims4PackCardProps {
  pack: Sims4Pack
}

export default function Sims4PackCard({ pack }: Sims4PackCardProps) {
  const [modalOpen, setModalOpen] = useState(false)

  const statusPill = {
    done: { label: '100% READY', dot: 'bg-emerald-500', text: 'text-emerald-700' },
    wip: { label: pack.progress ? \`\${pack.progress}% WIP\` : 'IN PROGRESS', dot: 'bg-amber-500 animate-pulse', text: 'text-amber-700' },
    planned: { label: 'PLANNED', dot: 'bg-slate-400', text: 'text-slate-600' },
  }[pack.status]

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="group flex flex-col bg-white border border-[#E5E7EB] hover:border-black rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg cursor-pointer"
      >
        {/* Media Container */}
        <div className="relative w-full aspect-[4/5] bg-[#F4F4F6] overflow-hidden flex flex-col justify-between p-3.5">
          {pack.coverImage ? (
            <img
              src={pack.coverImage}
              alt={pack.name}
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex flex-col justify-between select-none py-2 text-center">
              <div className="text-[10px] font-black tracking-widest text-[#64748B] uppercase">
                THE SIMS 4
              </div>
              <div className="my-auto px-2">
                <h4 className="font-display font-black text-sm text-black uppercase leading-tight">
                  {pack.name}
                </h4>
                {pack.thName && (
                  <p className="text-[10px] font-bold text-[#64748B] mt-1 line-clamp-1">{pack.thName}</p>
                )}
              </div>
              <div className="text-[9px] font-bold text-[#94A3B8] uppercase">
                {pack.category}
              </div>
            </div>
          )}

          {/* Minimal Status Tag */}
          <div className="absolute top-3 left-3 z-10">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-white/90 backdrop-blur-md border border-[#E5E7EB] text-black shadow-xs">
              <span className={\`w-1.5 h-1.5 rounded-full \${statusPill.dot}\`} />
              {statusPill.label}
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
          <div>
            <div className="flex items-start justify-between gap-1.5">
              <h4 className="font-display font-black text-xs sm:text-sm text-black uppercase tracking-tight line-clamp-1 group-hover:underline">
                {pack.name}
              </h4>
              <ArrowUpRight size={13} className="text-[#94A3B8] group-hover:text-black shrink-0 transition-colors" />
            </div>
            {pack.thName && (
              <p className="text-[11px] text-[#64748B] line-clamp-1 mt-0.5 font-medium">
                {pack.thName}
              </p>
            )}
          </div>

          <div className="pt-2 border-t border-[#F3F4F6] flex items-center justify-between text-[10px] font-bold text-[#94A3B8] uppercase">
            <span>{pack.author ? \`BY \${pack.author.toUpperCase()}\` : pack.category}</span>
            <span className="text-black">{pack.version || 'v1.0'}</span>
          </div>
        </div>
      </div>

      {/* Modal Quick View */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative w-full max-w-lg bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-[#F3F4F6] text-[#64748B] hover:text-black"
            >
              <X size={18} />
            </button>

            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#F3F4F6] text-black">
                {pack.category}
              </div>
              <h3 className="font-display font-black text-2xl text-black uppercase">
                {pack.name}
              </h3>
              {pack.thName && (
                <p className="text-sm font-bold text-[#64748B]">{pack.thName}</p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs text-[#475569] space-y-3 leading-relaxed">
              <p>{pack.description || 'ม็อดแปลภาษาไทยสมบูรณ์แบบพร้อมใช้งาน'}</p>
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E5E7EB] text-[11px] font-bold">
                <div>VERSION: <span className="text-black">{pack.version || 'v1.0'}</span></div>
                <div>STATUS: <span className="text-black">{statusPill.label}</span></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-5 py-2.5 rounded-full text-xs font-bold bg-[#F3F4F6] hover:bg-[#E5E7EB] text-black"
              >
                CLOSE
              </button>
              <a
                href="/games/the-sims-4#downloads"
                onClick={() => setModalOpen(false)}
                className="px-6 py-2.5 rounded-full text-xs font-black bg-black text-white hover:bg-neutral-800 flex items-center gap-1.5"
              >
                <Download size={14} />
                DOWNLOAD MOD
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
`);

// -------------------------------------------------------------
// 6. src/components/Footer.tsx
// -------------------------------------------------------------
writeFile('src/components/Footer.tsx', `
import Link from 'next/link'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="border-t border-[#E5E7EB] bg-white py-16 text-black">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 space-y-12">
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 justify-between">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <h2 className="font-display font-black text-2xl sm:text-3xl tracking-[-0.04em] uppercase">
              PAREGAMESUFUN
            </h2>
            <p className="text-xs text-[#64748B] max-w-sm leading-relaxed">
              แปลเกมสู่ฝัน — ทีมงานแปลภาษาไทยสำหรับวิดีโอเกมและม็อดเสริมคุณภาพสูง มุ่งมั่นส่งมอบผลงานแปลระดับพรีเมียมให้เกมเมอร์ชาวไทยเล่นฟรี 100%
            </p>
          </div>

          {/* Links Col 1 */}
          <div className="md:col-span-2 space-y-3 text-xs font-bold">
            <div className="text-[#94A3B8] uppercase tracking-wider text-[10px]">CATALOG</div>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-[#64748B]">ALL GAMES</Link></li>
              <li><Link href="/games/the-sims-4" className="hover:text-[#64748B]">THE SIMS 4</Link></li>
              <li><Link href="/completed" className="hover:text-[#64748B]">COMPLETED</Link></li>
              <li><Link href="/in-progress" className="hover:text-[#64748B]">IN PROGRESS</Link></li>
            </ul>
          </div>

          {/* Links Col 2 */}
          <div className="md:col-span-2 space-y-3 text-xs font-bold">
            <div className="text-[#94A3B8] uppercase tracking-wider text-[10px]">COMMUNITY</div>
            <ul className="space-y-2">
              <li><Link href="/donate" className="hover:text-[#64748B]">DONATE & SUPPORT</Link></li>
              <li><Link href="/admin" className="hover:text-[#64748B]">ADMIN PANEL</Link></li>
            </ul>
          </div>

          {/* Support Col */}
          <div className="md:col-span-3 space-y-3 text-xs font-bold">
            <div className="text-[#94A3B8] uppercase tracking-wider text-[10px]">SUPPORT THE STUDIO</div>
            <p className="text-[#64748B] font-normal leading-relaxed text-xs">
              ร่วมเป็นกำลังใจและสนับสนุนค่ากาแฟทีมงานแปลเกม เพื่อให้เราผลิตผลงานแปลไทยคุณภาพต่อไป
            </p>
            <Link
              href="/donate"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold bg-black text-white hover:bg-neutral-800"
            >
              <Heart size={13} className="fill-white" />
              <span>DONATE NOW</span>
            </Link>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#F3F4F6] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#94A3B8] font-bold">
          <span>&copy; {new Date().getFullYear()} PAREGAMESUFUN. ALL RIGHTS RESERVED.</span>
          <span>CRAFTED WITH PRECISION &amp; PASSION</span>
        </div>

      </div>
    </footer>
  )
}
`);

console.log('Main components created!');
