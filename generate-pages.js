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
// 1. src/components/DownloadSection.tsx
// -------------------------------------------------------------
writeFile('src/components/DownloadSection.tsx', `
'use client'

import { DownloadLink } from '@/lib/types'
import { Download, ExternalLink } from 'lucide-react'

interface DownloadSectionProps {
  downloads: DownloadLink[]
}

export default function DownloadSection({ downloads }: DownloadSectionProps) {
  if (!downloads || downloads.length === 0) return null

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-black text-sm uppercase tracking-wider text-black">
          DOWNLOAD FILES
        </h3>
        <span className="text-[10px] font-bold text-emerald-600 uppercase bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
          FREE ACCESS
        </span>
      </div>

      <div className="space-y-3">
        {downloads.map((dl, idx) => (
          <a
            key={idx}
            href={dl.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 px-6 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-between transition-all bg-black text-white hover:bg-neutral-800 shadow-sm group"
          >
            <span className="flex items-center gap-2">
              <Download size={14} />
              {dl.label}
            </span>
            <ExternalLink size={14} className="text-[#94A3B8] group-hover:text-white transition-colors" />
          </a>
        ))}
      </div>

      <p className="text-[11px] text-[#94A3B8] text-center font-medium">
        ปลอดภัย 100% ไม่มีโฆษณาแอบแฝง • แปลโดยทีมงานแปลเกมสู่ฝัน
      </p>
    </div>
  )
}
`);

// -------------------------------------------------------------
// 2. src/components/TeamSection.tsx
// -------------------------------------------------------------
writeFile('src/components/TeamSection.tsx', `
import { TeamMember } from '@/lib/types'

interface TeamSectionProps {
  team: TeamMember[]
}

export default function TeamSection({ team }: TeamSectionProps) {
  if (!team || team.length === 0) return null

  return (
    <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 space-y-4 shadow-sm">
      <div className="text-[10px] font-black tracking-widest text-[#64748B] uppercase">
        TRANSLATION CREDITS
      </div>

      <div className="space-y-3">
        {team.map((member, idx) => (
          <div key={idx} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F3F4F6] border border-[#E5E7EB] overflow-hidden flex items-center justify-center font-bold text-xs text-black">
              {member.avatar ? (
                <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
              ) : (
                member.name.charAt(0)
              )}
            </div>
            <div>
              <div className="text-xs font-black text-black">{member.name}</div>
              <div className="text-[10px] font-medium text-[#64748B]">{member.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
`);

// -------------------------------------------------------------
// 3. src/components/CollectionShelf.tsx
// -------------------------------------------------------------
writeFile('src/components/CollectionShelf.tsx', `
'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'

interface CollectionShelfProps {
  title: string
  subtitle?: string
  tag?: string
  featuredImage: string
  featuredTitle: string
  featuredDesc: string
  featuredLink: string
  items: {
    title: string
    sub: string
    tag: string
    image?: string
    link: string
  }[]
}

export default function CollectionShelf({
  title,
  subtitle,
  tag,
  featuredImage,
  featuredTitle,
  featuredDesc,
  featuredLink,
  items,
}: CollectionShelfProps) {
  return (
    <section className="space-y-6 pt-6">
      {/* Section Header */}
      <div className="flex items-end justify-between border-b border-[#E5E7EB] pb-3">
        <div>
          {tag && (
            <div className="text-[10px] font-black tracking-widest text-[#64748B] uppercase mb-1">
              {tag}
            </div>
          )}
          <h2 className="font-display font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="text-xs text-[#64748B] hidden sm:block max-w-xs text-right font-medium">
            {subtitle}
          </p>
        )}
      </div>

      {/* Shelf Grid (Big Studio Feature Left + List Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Large Feature Banner */}
        <Link
          href={featuredLink}
          className="lg:col-span-6 relative aspect-[16/10] rounded-3xl bg-[#F3F4F6] border border-[#E5E7EB] hover:border-black overflow-hidden p-8 flex flex-col justify-between group transition-all"
        >
          <div className="text-[10px] font-black uppercase tracking-wider text-black bg-white px-3 py-1 rounded-full border border-[#E5E7EB] w-fit shadow-xs">
            FEATURED SPOTLIGHT
          </div>

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40 group-hover:scale-105 transition-transform duration-700">
            <img src={featuredImage} alt={featuredTitle} className="max-h-[80%] max-w-[80%] object-contain" />
          </div>

          <div className="relative z-10 bg-white/90 backdrop-blur-md p-4 rounded-2xl border border-[#E5E7EB] space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-lg text-black uppercase">{featuredTitle}</h3>
              <ArrowUpRight size={16} />
            </div>
            <p className="text-xs text-[#64748B] line-clamp-1">{featuredDesc}</p>
          </div>
        </Link>

        {/* Side Items Grid (2x2 or List) */}
        <div className="lg:col-span-6 grid grid-cols-2 gap-4">
          {items.map((item, idx) => (
            <Link
              key={idx}
              href={item.link}
              className="group p-4 bg-white border border-[#E5E7EB] hover:border-black rounded-2xl flex flex-col justify-between transition-all"
            >
              <div className="aspect-[4/3] rounded-xl bg-[#F9FAFB] border border-[#E5E7EB] mb-3 overflow-hidden flex items-center justify-center p-2">
                {item.image ? (
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform" />
                ) : (
                  <span className="text-xs font-black text-[#94A3B8] uppercase">{item.tag}</span>
                )}
              </div>
              <div>
                <div className="text-[9px] font-black text-[#64748B] uppercase">{item.tag}</div>
                <h4 className="font-display font-black text-xs sm:text-sm text-black uppercase line-clamp-1 group-hover:underline">
                  {item.title}
                </h4>
                <p className="text-[10px] text-[#94A3B8] line-clamp-1">{item.sub}</p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  )
}
`);

// -------------------------------------------------------------
// 4. src/components/sims4/Sims4StudioHub.tsx
// -------------------------------------------------------------
writeFile('src/components/sims4/Sims4StudioHub.tsx', `
'use client'

import { useState, useMemo } from 'react'
import { Sims4Pack } from '@/lib/types'
import Sims4PackCard from './Sims4PackCard'
import { Search, Layers, Package, Sparkle, Wrench, X, ArrowDown } from 'lucide-react'

interface Sims4StudioHubProps {
  packs: Sims4Pack[]
}

export default function Sims4StudioHub({ packs }: Sims4StudioHubProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredPacks = useMemo(() => {
    if (!searchQuery.trim()) return packs
    const q = searchQuery.toLowerCase().trim()
    return packs.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        (p.thName && p.thName.toLowerCase().includes(q)) ||
        (p.author && p.author.toLowerCase().includes(q))
      )
    })
  }, [packs, searchQuery])

  const expansionPacks = useMemo(() => filteredPacks.filter((p) => p.category === 'expansion'), [filteredPacks])
  const gamePacks = useMemo(() => filteredPacks.filter((p) => p.category === 'gamepack'), [filteredPacks])
  const stuffPacks = useMemo(() => filteredPacks.filter((p) => p.category === 'stuffpack'), [filteredPacks])
  const scriptMods = useMemo(() => filteredPacks.filter((p) => p.category === 'mod'), [filteredPacks])

  return (
    <div className="space-y-16">
      
      {/* Sticky Jump Navigation & Search */}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md py-3 px-6 rounded-2xl border border-[#E5E7EB] shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none text-xs font-bold">
          <a href="#expansions" className="px-4 py-2 rounded-full bg-black text-white hover:bg-neutral-800 uppercase tracking-wider shrink-0">
            EXPANSION PACKS ({expansionPacks.length})
          </a>
          <a href="#gamepacks" className="px-4 py-2 rounded-full bg-[#F3F4F6] text-black hover:bg-[#E5E7EB] uppercase tracking-wider shrink-0">
            GAME PACKS ({gamePacks.length})
          </a>
          <a href="#stuffpacks" className="px-4 py-2 rounded-full bg-[#F3F4F6] text-black hover:bg-[#E5E7EB] uppercase tracking-wider shrink-0">
            STUFF PACKS ({stuffPacks.length})
          </a>
          <a href="#scriptmods" className="px-4 py-2 rounded-full bg-[#F3F4F6] text-black hover:bg-[#E5E7EB] uppercase tracking-wider shrink-0">
            SCRIPT MODS ({scriptMods.length})
          </a>
        </div>

        <div className="relative min-w-[260px]">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search DLC pack or mod..."
            className="w-full bg-[#F9FAFB] border border-[#E5E7EB] rounded-full pl-9 pr-8 py-2 text-xs text-black placeholder:text-[#94A3B8] focus:outline-none focus:border-black"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8]">
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* 1. Expansion Packs Shelf */}
      <section id="expansions" className="space-y-6 scroll-mt-36">
        <div className="flex items-end justify-between border-b border-[#E5E7EB] pb-3">
          <div>
            <div className="text-[10px] font-black tracking-widest text-[#64748B] uppercase">COLLECTION 01</div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
              💎 EXPANSION PACKS (ภาคเสริมใหญ่)
            </h2>
          </div>
          <span className="text-xs font-bold text-[#94A3B8] uppercase">{expansionPacks.length} PACKS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {expansionPacks.map((pack) => (
            <Sims4PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </section>

      {/* 2. Game Packs Shelf */}
      <section id="gamepacks" className="space-y-6 scroll-mt-36">
        <div className="flex items-end justify-between border-b border-[#E5E7EB] pb-3">
          <div>
            <div className="text-[10px] font-black tracking-widest text-[#64748B] uppercase">COLLECTION 02</div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
              🎮 GAME PACKS (ชุดเกมเสริม)
            </h2>
          </div>
          <span className="text-xs font-bold text-[#94A3B8] uppercase">{gamePacks.length} PACKS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {gamePacks.map((pack) => (
            <Sims4PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </section>

      {/* 3. Stuff Packs Shelf */}
      <section id="stuffpacks" className="space-y-6 scroll-mt-36">
        <div className="flex items-end justify-between border-b border-[#E5E7EB] pb-3">
          <div>
            <div className="text-[10px] font-black tracking-widest text-[#64748B] uppercase">COLLECTION 03</div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
              📦 STUFF PACKS (ชุดไอเท็มเสริม)
            </h2>
          </div>
          <span className="text-xs font-bold text-[#94A3B8] uppercase">{stuffPacks.length} PACKS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {stuffPacks.map((pack) => (
            <Sims4PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </section>

      {/* 4. Script Mods Shelf */}
      <section id="scriptmods" className="space-y-6 scroll-mt-36">
        <div className="flex items-end justify-between border-b border-[#E5E7EB] pb-3">
          <div>
            <div className="text-[10px] font-black tracking-widest text-[#64748B] uppercase">COLLECTION 04</div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-black uppercase tracking-tight">
              ⚡ SCRIPT & SYSTEM MODS (ม็อดระบบภายนอก)
            </h2>
          </div>
          <span className="text-xs font-bold text-[#94A3B8] uppercase">{scriptMods.length} MODS</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {scriptMods.map((pack) => (
            <Sims4PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      </section>

    </div>
  )
}
`);

// -------------------------------------------------------------
// 5. src/app/layout.tsx
// -------------------------------------------------------------
writeFile('src/app/layout.tsx', `
import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'แปลเกมสู่ฝัน — PAREGAMESUFUN | Studio Thai Localization',
  description: 'ศูนย์รวมผลงานแปลภาษาไทยสำหรับวิดีโอเกมและม็อดเสริมคุณภาพสูง แปลฟรี 100%',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="th" className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-[#FAFAFC] text-[#0A0A0C]">
        <Navbar />
        <main className="flex-1 pt-20">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}
`);

// -------------------------------------------------------------
// 6. src/app/page.tsx
// -------------------------------------------------------------
writeFile('src/app/page.tsx', `
import HeroSpotlight from '@/components/HeroSpotlight'
import StudioGrid from '@/components/StudioGrid'
import CollectionShelf from '@/components/CollectionShelf'
import { getGames } from '@/lib/games-data'
import sims4PacksData from '@/data/sims4-packs.json'
import { Sims4Pack } from '@/lib/types'

export default async function HomePage() {
  const games = await getGames()

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-10 space-y-16">
      
      {/* 1. Hero Editorial Spotlight */}
      <HeroSpotlight />

      {/* 2. Full 4-Column Studio Catalog */}
      <StudioGrid
        games={games}
        sims4Packs={sims4PacksData as Sims4Pack[]}
      />

      {/* 3. Lookbook Spotlight Shelf (Inspired by Reference 2) */}
      <CollectionShelf
        title="CURATED TRANSLATIONS"
        subtitle="ผลงานแปลที่ได้รับการคัดสรรพิเศษเพื่อประสบการณ์การเล่นที่สมบูรณ์แบบ"
        tag="EDITORIAL HIGHLIGHTS"
        featuredImage="/uploads/sims_poster_art.png"
        featuredTitle="THE SIMS 4 EXPANSION BUNDLE"
        featuredDesc="รวมม็อดแปลไทยภาคเสริมยอดนิยม Seasons, Cottage Living, Life & Death และ Get Famous"
        featuredLink="/games/the-sims-4"
        items={[
          {
            title: "THE OPERATOR",
            sub: "แปลภาษาไทยบทสืบสวนและระบบเทอร์มินัล 100%",
            tag: "DETECTIVE / IMMERSIVE",
            image: "/uploads/sims_cover_art.png",
            link: "/games/the-operator"
          },
          {
            title: "911 OPERATOR",
            sub: "แปลสายด่วนฉุกเฉินและบทสนทนาเหตุด่วน",
            tag: "SIMULATION / MANAGEMENT",
            image: "/uploads/sims_poster_art.png",
            link: "/games/911-operator"
          },
          {
            title: "MC COMMAND CENTER",
            sub: "ม็อดควบคุมประชากรและโลกซิมส์",
            tag: "SCRIPT MOD",
            image: "/uploads/sims_cover_art.png",
            link: "/games/the-sims-4#scriptmods"
          },
          {
            title: "UI CHEATS EXTENSION",
            sub: "ม็อดคลิกขวาโกงค่าสถานะผ่าน UI",
            tag: "SYSTEM MOD",
            image: "/uploads/sims_poster_art.png",
            link: "/games/the-sims-4#scriptmods"
          }
        ]}
      />

    </div>
  )
}
`);

// -------------------------------------------------------------
// 7. src/app/games/[slug]/page.tsx
// -------------------------------------------------------------
writeFile('src/app/games/[slug]/page.tsx', `
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { getGames, getGameBySlug } from '@/lib/games-data'
import DownloadSection from '@/components/DownloadSection'
import TeamSection from '@/components/TeamSection'
import Sims4StudioHub from '@/components/sims4/Sims4StudioHub'
import sims4PacksData from '@/data/sims4-packs.json'
import { Sims4Pack } from '@/lib/types'
import { ArrowLeft, BookOpen, Layers, CheckCircle2, Download } from 'lucide-react'

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
    title: \`\${game.title} — PAREGAMESUFUN\`,
    description: game.shortDescription,
  }
}

export default async function GameDetailPage({ params }: PageProps) {
  const { slug } = await params
  const game = await getGameBySlug(slug)

  if (!game) {
    notFound()
  }

  const isSims4 = game.slug === 'the-sims-4'

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-10 space-y-16">
      
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-xs font-bold text-[#64748B]">
        <Link href="/" className="hover:text-black flex items-center gap-1">
          <ArrowLeft size={13} />
          ALL CATALOG
        </Link>
        <span>/</span>
        <span className="text-black uppercase">{game.title}</span>
      </div>

      {/* Hero Studio Banner */}
      <div className="rounded-3xl bg-[#F3F4F6] border border-[#E5E7EB] p-8 sm:p-12 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-4 max-w-[300px] mx-auto lg:mx-0 w-full">
            <div className="aspect-[4/5] rounded-2xl bg-white border border-[#E5E7EB] shadow-md overflow-hidden p-3">
              <img
                src={game.posterImage || game.coverImage || '/uploads/sims_cover_art.png'}
                alt={game.title}
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-black text-white">
                {game.status === 'done' ? '100% COMPLETED' : 'IN PROGRESS'}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-white border border-[#E5E7EB] text-black">
                {game.version}
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-white border border-[#E5E7EB] text-[#64748B]">
                {game.client}
              </span>
            </div>

            <h1 className="font-display font-black text-3xl sm:text-5xl text-black uppercase tracking-tight leading-tight">
              {game.title}
            </h1>

            <p className="text-sm text-[#64748B] leading-relaxed max-w-2xl font-normal">
              {game.description}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <a
                href="#downloads"
                className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-xs font-black bg-black text-white hover:bg-neutral-800 transition-all shadow-sm"
              >
                <Download size={14} />
                DOWNLOAD THAI MOD
              </a>
              {isSims4 && (
                <a
                  href="#expansions"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold bg-white border border-[#E5E7EB] text-black hover:bg-neutral-50 transition-all"
                >
                  <Layers size={14} />
                  VIEW ALL 40+ PACKS
                </a>
              )}
            </div>
          </div>

        </div>
      </div>

      {/* If The Sims 4 -> Render Full Studio Shelves */}
      {isSims4 && (
        <Sims4StudioHub packs={sims4PacksData as Sims4Pack[]} />
      )}

      {/* Technical Specifications & Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left: Overview & Instructions */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 space-y-3 shadow-sm">
            <h3 className="font-display font-black text-sm uppercase tracking-wider text-black">
              ABOUT THE TRANSLATION
            </h3>
            <p className="text-xs sm:text-sm text-[#475569] leading-relaxed">
              {game.overview}
            </p>
          </div>

          {/* Installation Steps */}
          <div className="bg-white border border-[#E5E7EB] rounded-3xl p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-black">
              <BookOpen size={16} />
              INSTALLATION INSTRUCTIONS
            </div>

            <div className="space-y-4 text-xs text-[#475569] leading-relaxed">
              <div className="flex gap-3 items-start bg-[#F9FAFB] p-4 rounded-2xl border border-[#E5E7EB]">
                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">1</span>
                <div>
                  <strong className="text-black">ดาวน์โหลดไฟล์ม็อดภาษาไทย:</strong>
                  <p className="mt-0.5 text-[#64748B]">กดปุ่มดาวน์โหลดไฟล์จากแผงดาวน์โหลดด้านข้าง</p>
                </div>
              </div>

              <div className="flex gap-3 items-start bg-[#F9FAFB] p-4 rounded-2xl border border-[#E5E7EB]">
                <span className="w-6 h-6 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs shrink-0">2</span>
                <div>
                  <strong className="text-black">นำไฟล์ไปวางในโฟลเดอร์เกม:</strong>
                  <p className="mt-0.5 text-[#64748B]">แตกไฟล์แล้วนำไฟล์ม็อดไปวางตามตำแหน่งโฟลเดอร์ที่ระบุในคำแนะนำ</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Downloads & Team */}
        <div id="downloads" className="lg:col-span-4 space-y-6 scroll-mt-28">
          <DownloadSection downloads={game.downloads} />
          <TeamSection team={game.team} />
        </div>

      </div>

    </div>
  )
}
`);

// -------------------------------------------------------------
// 8. src/app/completed/page.tsx
// -------------------------------------------------------------
writeFile('src/app/completed/page.tsx', `
import { getGamesByStatus } from '@/lib/games-data'
import StudioCard from '@/components/StudioCard'

export default async function CompletedPage() {
  const games = await getGamesByStatus('done')

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-10 space-y-8">
      <div className="border-b border-[#E5E7EB] pb-4">
        <div className="text-[10px] font-black tracking-widest text-[#64748B] uppercase">CATALOG</div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-tight">
          COMPLETED TRANSLATIONS (แปลเสร็จสมบูรณ์ 100%)
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          รายชื่อเกมและม็อดภาษาไทยที่แปลเสร็จสมบูรณ์ พร้อมดาวน์โหลดเล่นฟรีทันที
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <StudioCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}
`);

// -------------------------------------------------------------
// 9. src/app/in-progress/page.tsx
// -------------------------------------------------------------
writeFile('src/app/in-progress/page.tsx', `
import { getGamesByStatus } from '@/lib/games-data'
import StudioCard from '@/components/StudioCard'

export default async function InProgressPage() {
  const games = await getGamesByStatus('wip')

  return (
    <div className="max-w-[1440px] mx-auto px-6 sm:px-10 py-10 space-y-8">
      <div className="border-b border-[#E5E7EB] pb-4">
        <div className="text-[10px] font-black tracking-widest text-[#64748B] uppercase">ROADMAP</div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-black uppercase tracking-tight">
          IN PROGRESS (กำลังดำเนินการแปล)
        </h1>
        <p className="text-xs text-[#64748B] mt-1">
          โปรเจกต์งานแปลที่ทีมงานกำลังพัฒนาและทดสอบอย่างต่อเนื่อง
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {games.map((game) => (
          <StudioCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}
`);

// -------------------------------------------------------------
// 10. src/app/donate/page.tsx
// -------------------------------------------------------------
writeFile('src/app/donate/page.tsx', `
import { Heart, Coffee, ShieldCheck, ArrowRight } from 'lucide-react'

export default function DonatePage() {
  return (
    <div className="max-w-[900px] mx-auto px-6 sm:px-10 py-14 space-y-12">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase bg-[#F3F4F6] text-black">
          <Heart size={12} className="fill-black" />
          SUPPORT THE STUDIO
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-black uppercase tracking-tight">
          สนับสนุนทีมงานแปลเกมสู่ฝัน
        </h1>
        <p className="text-xs sm:text-sm text-[#64748B] max-w-lg mx-auto leading-relaxed">
          ทุกการสนับสนุนของคุณคือกำลังใจสำคัญที่ช่วยให้เรามีพลังในการพัฒนาและผลิตงานแปลภาษาไทยคุณภาพสูงให้ทุกคนได้เล่นฟรีต่อไป
        </p>
      </div>

      {/* Donation Methods */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* Bank Transfer */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 space-y-4 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-[#F3F4F6] flex items-center justify-center mx-auto text-black">
            <Coffee size={20} />
          </div>
          <div>
            <h3 className="font-display font-black text-base uppercase text-black">PromptPay / บัญชีธนาคาร</h3>
            <p className="text-xs text-[#64748B] mt-1">สนับสนุนตรงเข้าทีมงานแปลโดยตรง</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs space-y-1 font-mono">
            <div className="text-[#94A3B8]">PROMPTPAY / WALLET</div>
            <div className="font-black text-sm text-black">08X-XXX-XXXX</div>
          </div>
        </div>

        {/* Patreon / Membership */}
        <div className="bg-white border border-[#E5E7EB] rounded-3xl p-8 space-y-4 shadow-sm text-center">
          <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center mx-auto">
            <Heart size={20} className="fill-white" />
          </div>
          <div>
            <h3 className="font-display font-black text-base uppercase text-black">Membership &amp; Patrons</h3>
            <p className="text-xs text-[#64748B] mt-1">ร่วมเป็นผู้สนับสนุนรายเดือน</p>
          </div>
          <div className="p-4 rounded-2xl bg-[#F9FAFB] border border-[#E5E7EB] text-xs space-y-1">
            <div className="text-[#94A3B8]">EXCLUSIVE ACCESS</div>
            <div className="font-black text-sm text-black">EARLY TEST BUILDS</div>
          </div>
        </div>

      </div>
    </div>
  )
}
`);

// -------------------------------------------------------------
// 11. src/app/icon.tsx
// -------------------------------------------------------------
writeFile('src/app/icon.tsx', `
import { ImageResponse } from 'next/og'

export const size = { width: 48, height: 48 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 22,
          background: '#000000',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          borderRadius: '50%',
          fontWeight: 900,
          letterSpacing: '-1px',
        }}
      >
        GF
      </div>
    ),
    { ...size }
  )
}
`);

console.log('All luxury studio components and pages generated successfully!');
