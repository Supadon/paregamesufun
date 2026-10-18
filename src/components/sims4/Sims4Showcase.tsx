'use client'

import { useState, useMemo } from 'react'
import { Sims4Pack, Sims4Category } from '@/lib/types'
import Sims4PackCard from './Sims4PackCard'
import { 
  Sparkles, Layers, Package, Sparkle, Wrench, 
  X, Download, ArrowRight, Heart, Search, LayoutGrid, List,
  CheckCircle2, Clock, Check, RotateCcw, ExternalLink
} from 'lucide-react'

interface Sims4ShowcaseProps {
  initialPacks: Sims4Pack[]
}

type ViewMode = 'grid' | 'list'
type ReleaseStatusFilter = 'all' | 'released' | 'unreleased'

export default function Sims4Showcase({ initialPacks }: Sims4ShowcaseProps) {
  const [packs] = useState<Sims4Pack[]>(initialPacks)
  const [selectedCategory, setSelectedCategory] = useState<Sims4Category | 'all'>('all')
  const [statusFilter, setStatusFilter] = useState<ReleaseStatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('grid')
  const [activeModalPack, setActiveModalPack] = useState<Sims4Pack | null>(null)

  // Overall Stats based on isReleased
  const stats = useMemo(() => {
    const total = packs.length
    const released = packs.filter(p => p.isReleased ?? (p.status === 'done')).length
    const unreleased = total - released
    const percent = total > 0 ? Math.round((released / total) * 100) : 0
    return { total, released, unreleased, percent }
  }, [packs])

  // Category Tabs Configuration (only show categories that have items)
  const categoryTabs = useMemo(() => {
    const tabs: { id: Sims4Category | 'all'; label: string; count: number; icon: any; colorClass: string }[] = [
      {
        id: 'all',
        label: 'ทั้งหมด',
        count: packs.length,
        icon: Sparkles,
        colorClass: 'text-emerald-400',
      },
      {
        id: 'expansion',
        label: 'ภาคเสริมใหญ่ (Expansion)',
        count: packs.filter(p => p.category === 'expansion').length,
        icon: Layers,
        colorClass: 'text-emerald-300',
      },
      {
        id: 'gamepack',
        label: 'ชุดเกมเสริม (Game Pack)',
        count: packs.filter(p => p.category === 'gamepack').length,
        icon: Package,
        colorClass: 'text-purple-300',
      },
      {
        id: 'stuffpack',
        label: 'ชุดไอเท็มเสริม (Stuff Pack)',
        count: packs.filter(p => p.category === 'stuffpack').length,
        icon: Sparkle,
        colorClass: 'text-cyan-300',
      },
      {
        id: 'mod',
        label: 'ม็อดสคริปต์ (Script Mods)',
        count: packs.filter(p => p.category === 'mod').length,
        icon: Wrench,
        colorClass: 'text-cyan-300',
      },
    ]
    return tabs.filter(t => t.count > 0 || t.id === 'all')
  }, [packs])

  // Filtered Packs
  const filteredPacks = useMemo(() => {
    return packs.filter((pack) => {
      // 1. Category Filter
      if (selectedCategory !== 'all' && pack.category !== selectedCategory) {
        return false
      }

      // 2. Release Status Filter
      const isReleased = pack.isReleased ?? (pack.status === 'done')
      if (statusFilter === 'released' && !isReleased) {
        return false
      }
      if (statusFilter === 'unreleased' && isReleased) {
        return false
      }

      // 3. Search Query (Matches English Name, description, or author)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchName = pack.name.toLowerCase().includes(query)
        const matchDesc = pack.description ? pack.description.toLowerCase().includes(query) : false
        const matchAuthor = pack.author ? pack.author.toLowerCase().includes(query) : false
        if (!matchName && !matchDesc && !matchAuthor) {
          return false
        }
      }
      return true
    })
  }, [packs, selectedCategory, statusFilter, searchQuery])

  // Split filtered packs into:
  // 1. Official Released DLCs (Base Game, Expansion, Game Pack, Stuff Pack)
  // 2. Script Mods & External Gameplay Mods
  // 3. Official In-Progress / Unreleased DLCs
  const { officialReleasedPacks, scriptMods, unreleasedOfficialPacks } = useMemo(() => {
    const official: Sims4Pack[] = []
    const mods: Sims4Pack[] = []
    const unreleased: Sims4Pack[] = []

    filteredPacks.forEach((p) => {
      if (p.category === 'mod') {
        mods.push(p)
      } else if (p.isReleased !== false) {
        official.push(p)
      } else {
        unreleased.push(p)
      }
    })

    return { 
      officialReleasedPacks: official, 
      scriptMods: mods, 
      unreleasedOfficialPacks: unreleased 
    }
  }, [filteredPacks])

  const isFilteredView = searchQuery.trim() !== '' || statusFilter !== 'all' || selectedCategory !== 'all'

  // Reset all filters
  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setStatusFilter('all')
  }

  return (
    <div id="packs-catalog" className="w-full space-y-8 scroll-mt-28">
      
      {/* 1. Quick Stats Overview Bar */}
      <div className="liquid-glass-panel grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl">
        <div className="liquid-glass-well rounded-xl p-3.5 space-y-1 relative z-10">
          <span className="text-[11px] text-text2 font-medium flex items-center gap-1.5">
            <Sparkles size={13} className="text-emerald-400" />
            รวมภาคเสริมทั้งหมด
          </span>
          <div className="text-xl sm:text-2xl font-black text-white">
            {stats.total} <span className="text-xs font-normal text-text2">รายการ</span>
          </div>
        </div>

        <div className="liquid-glass-well rounded-xl p-3.5 space-y-1 relative z-10">
          <span className="text-[11px] text-emerald-300 font-medium flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-400" />
            ปล่อยดาวน์โหลดแล้ว
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-300">
            {stats.released} <span className="text-xs font-normal text-text2">รายการ</span>
          </div>
        </div>

        <div className="liquid-glass-well rounded-xl p-3.5 space-y-1 relative z-10">
          <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1.5">
            <Clock size={13} className="text-amber-400" />
            ยังไม่ปล่อย (กำลังพัฒนา)
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-300">
            {stats.unreleased} <span className="text-xs font-normal text-amber-300/80">รายการ</span>
          </div>
        </div>

        <div className="liquid-glass-well rounded-xl p-3.5 space-y-1 relative z-10">
          <span className="text-[11px] text-star2 font-medium flex items-center gap-1.5">
            <Heart size={13} className="text-blue3" />
            รูปแบบการแจก
          </span>
          <div className="text-xl sm:text-2xl font-black text-star2">
            ฟรี 100%
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Control Command Hub */}
      <div className="liquid-glass-panel relative p-4 sm:p-5 rounded-3xl space-y-4 shadow-2xl">
        
        {/* Top Row: Search Input + Release Status Filter + View Mode Switcher */}
        <div className="relative z-10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-xl">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text2 pointer-events-none z-10" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาภาคเสริม... (เช่น Seasons, Lovestruck, Werewolves, Spa Day)"
              className="liquid-glass-well w-full text-text1 placeholder:text-text3 text-xs sm:text-sm pl-10 pr-9 py-2.5 rounded-full focus:border-emerald-400/70 focus:outline-none focus:ring-1 focus:ring-emerald-400/60 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text2 hover:text-white p-1 rounded-full transition-colors z-10"
                title="ล้างคำค้นหา"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Tools: Release Status Filter & View Mode Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            {/* Release Status Pills */}
            <div className="liquid-glass-well inline-flex items-center gap-1 p-1 rounded-full text-[11px] font-bold">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-full transition-all cursor-pointer ${
                  statusFilter === 'all'
                    ? 'liquid-glass-cta text-white'
                    : 'text-text2 hover:text-white'
                }`}
              >
                <span className="relative z-10">ทั้งหมด ({stats.total})</span>
              </button>
              <button
                onClick={() => setStatusFilter('released')}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                  statusFilter === 'released'
                    ? 'bg-emerald-500/25 text-emerald-200 border border-emerald-400/50 shadow-[0_0_12px_rgba(16,185,129,0.25),inset_0_1px_0_rgba(255,255,255,0.35)]'
                    : 'text-text2 hover:text-emerald-300'
                }`}
              >
                <Check size={11} />
                ปล่อยแล้ว ({stats.released})
              </button>
              <button
                onClick={() => setStatusFilter('unreleased')}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 cursor-pointer ${
                  statusFilter === 'unreleased'
                    ? 'bg-amber-500/25 text-amber-200 border border-amber-400/50 shadow-[0_0_12px_rgba(245,158,11,0.25),inset_0_1px_0_rgba(255,255,255,0.35)]'
                    : 'text-text2 hover:text-amber-300'
                }`}
              >
                <Clock size={11} />
                กำลังแปล ยังไม่ปล่อย ({stats.unreleased})
              </button>
            </div>

            {/* View Mode Toggle (Grid vs List) */}
            <div className="liquid-glass-well inline-flex items-center p-1 rounded-full shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'liquid-glass-cta text-white'
                    : 'text-text2 hover:text-white'
                }`}
                title="แสดงแบบการ์ด (Grid View)"
              >
                <LayoutGrid size={15} className="relative z-10" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  viewMode === 'list'
                    ? 'liquid-glass-cta text-white'
                    : 'text-text2 hover:text-white'
                }`}
                title="แสดงแบบตารางสรุป (List View)"
              >
                <List size={15} className="relative z-10" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Category Tabs */}
        <div className="relative z-10 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = selectedCategory === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`shrink-0 inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/22 text-emerald-200 border border-emerald-400/60 shadow-[0_0_18px_rgba(16,185,129,0.28),inset_0_1.5px_0_rgba(255,255,255,0.42)] scale-[1.02]'
                    : 'liquid-glass-pill text-text2 hover:text-white'
                }`}
              >
                <Icon size={13} className={isActive ? 'text-emerald-300' : 'opacity-70'} />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-emerald-500/35 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.3)]' : 'bg-white/10 text-text2'
                }`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Filter Feedback Strip (if active filters) */}
        {isFilteredView && (
          <div className="relative z-10 flex items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs text-text2">
            <div className="flex items-center gap-2">
              <span>ผลการกรอง: พบ <strong className="text-white">{filteredPacks.length}</strong> รายการ</span>
              {searchQuery && (
                <span className="liquid-glass-pill px-2.5 py-0.5 rounded-full text-[11px] text-star2">
                  คำค้น: &quot;{searchQuery}&quot;
                </span>
              )}
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-[11px] text-emerald-300 hover:text-emerald-200 font-semibold transition-colors cursor-pointer"
            >
              <RotateCcw size={12} />
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}
      </div>

      {/* 3. Empty State */}
      {filteredPacks.length === 0 && (
        <div className="liquid-glass-panel rounded-2xl p-12 text-center space-y-4 max-w-lg mx-auto">
          <div className="liquid-glass-pill w-14 h-14 rounded-full flex items-center justify-center mx-auto text-text2">
            <Search size={24} />
          </div>
          <div className="relative z-10">
            <h3 className="font-display text-lg font-bold text-white">ไม่พบภาคเสริมที่ค้นหา</h3>
            <p className="text-xs text-text2 mt-1">
              ลองค้นหาด้วยชื่อภาษาอังกฤษ หรือกดปุ่มด้านล่างเพื่อรีเซ็ตตัวกรองทั้งหมด
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="liquid-glass-cta relative z-10 inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white cursor-pointer"
          >
            <RotateCcw size={13} className="relative z-10" />
            <span className="relative z-10">ล้างตัวกรองและดูทั้งหมด</span>
          </button>
        </div>
      )}

      {/* 4. Display Area: GRID VIEW */}
      {viewMode === 'grid' && filteredPacks.length > 0 && (
        <div className="space-y-10">
          {/* Section A: Official Released Packs */}
          {officialReleasedPacks.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                  <h3 className="font-display font-black text-white text-base sm:text-lg tracking-wide">
                    ภาคเสริมที่ปล่อยให้เล่นแล้ว
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/18 text-emerald-200 border border-emerald-400/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] text-xs font-bold">
                    {officialReleasedPacks.length} ภาค
                  </span>
                </div>
                <span className="text-[11px] text-text2 hidden sm:inline-flex items-center gap-1.5">
                  <Check size={12} className="text-emerald-400" />
                  รวมอยู่ในไฟล์แปลภาษาไทยตัวหลัก ดาวน์โหลดและติดตั้งได้ทันที
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {officialReleasedPacks.map((pack) => (
                  <Sims4PackCard key={pack.id} pack={pack} onSelect={setActiveModalPack} />
                ))}
              </div>
            </div>
          )}

          {/* Section B: Script Mods & External Mods */}
          {scriptMods.length > 0 && (
            <div className="space-y-4 pt-2">
              {/* Themed Divider & Section Header */}
              <div className="liquid-glass-panel rounded-2xl border-cyan-400/35 p-4 sm:p-5 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-cyan-500/15 blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-black text-cyan-200 text-base sm:text-lg tracking-wide flex items-center gap-2">
                          <Wrench size={18} className="text-cyan-400" />
                          ม็อดสคริปต์ & ม็อดระบบเกม (Script Mods)
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-200 border border-cyan-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] text-xs font-bold">
                          {scriptMods.length} ม็อด
                        </span>
                      </div>
                      <p className="text-[11.5px] text-cyan-200/85 mt-0.5 font-medium">
                        ม็อดเสริมการเล่นจากผู้พัฒนาภายนอก แปลไทยแยกเฉพาะ มีลิงก์ดาวน์โหลดแยกตามแต่ละม็อด
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="liquid-glass-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-cyan-200 border-cyan-400/35">
                      <ExternalLink size={12} className="text-cyan-300" />
                      คลิกการ์ดเพื่อดูรายละเอียด & ลิงก์ดาวน์โหลด
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {scriptMods.map((pack) => (
                  <Sims4PackCard key={pack.id} pack={pack} onSelect={setActiveModalPack} />
                ))}
              </div>
            </div>
          )}

          {/* Section C: Unreleased / In Progress Packs with Divider Header Banner */}
          {unreleasedOfficialPacks.length > 0 && (
            <div className="space-y-4 pt-2">
              {/* Themed Divider & Section Header */}
              <div className="liquid-glass-panel rounded-2xl border-amber-400/35 p-4 sm:p-5 overflow-hidden">
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-black text-amber-200 text-base sm:text-lg tracking-wide">
                          กำลังแปล / ยังไม่ปล่อยดาวน์โหลด
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-200 border border-amber-400/40 shadow-[inset_0_1px_0_rgba(255,255,255,0.3)] text-xs font-bold">
                          {unreleasedOfficialPacks.length} ภาคใหม่
                        </span>
                      </div>
                      <p className="text-[11.5px] text-amber-200/85 mt-0.5 font-medium">
                        อยู่ระหว่างการแปลและทดสอบ ยังไม่รวมในไฟล์ตัวหลัก จะปล่อยให้อัปเดตเร็ว ๆ นี้
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="liquid-glass-pill inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold text-amber-200 border-amber-400/35">
                      <Clock size={12} className="text-amber-300" />
                      กำลังพัฒนา (WIP)
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {unreleasedOfficialPacks.map((pack) => (
                  <Sims4PackCard key={pack.id} pack={pack} onSelect={setActiveModalPack} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Display Area: COMPACT LIST / TABLE VIEW */}
      {viewMode === 'list' && filteredPacks.length > 0 && (
        <div className="liquid-glass-panel rounded-2xl overflow-hidden">
          {/* Table Header */}
          <div className="relative z-10 hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/10 text-[11px] font-bold text-text2 uppercase tracking-wider bg-white/[0.04]">
            <div className="col-span-5">ชื่อภาคเสริม / ม็อด (Pack Name)</div>
            <div className="col-span-2">หมวดหมู่</div>
            <div className="col-span-3">สถานะการปล่อย</div>
            <div className="col-span-2 text-right">การดาวน์โหลด</div>
          </div>

          {/* Table Rows */}
          <div className="relative z-10 divide-y divide-white/5">
            {/* 1. Official Released Section */}
            {officialReleasedPacks.length > 0 && (
              <>
                <div className="px-5 py-2.5 bg-emerald-500/12 border-y border-emerald-500/25 text-xs font-bold text-emerald-300 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <CheckCircle2 size={13} className="text-emerald-400" />
                    ภาคเสริมที่ปล่อยให้เล่นแล้ว ({officialReleasedPacks.length} ภาค)
                  </span>
                  <span className="text-[10px] text-text2 font-medium">รวมในไฟล์แปลหลัก</span>
                </div>
                {officialReleasedPacks.map((pack) => {
                  const isInteractive = pack.category === 'mod' || !!pack.downloadUrl
                  return (
                    <div
                      key={pack.id}
                      onClick={isInteractive ? () => setActiveModalPack(pack) : undefined}
                      className={`p-4 sm:px-5 sm:py-3.5 transition-colors flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-2 sm:gap-4 ${
                        isInteractive ? 'hover:bg-white/[0.05] cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <div className="sm:col-span-5">
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          <span>{pack.name}</span>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <span className="liquid-glass-pill inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-text2 uppercase">
                          {pack.category === 'expansion'
                            ? 'ภาคเสริมใหญ่'
                            : pack.category === 'gamepack'
                            ? 'ชุดเกมเสริม'
                            : pack.category === 'stuffpack'
                            ? 'ชุดไอเท็มเสริม'
                            : 'ม็อดสคริปต์'}
                        </span>
                      </div>

                      <div className="sm:col-span-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {pack.progress === 100 ? 'ปล่อยแล้ว 100%' : `ปล่อยแล้ว (${pack.progress}%)`}
                        </span>
                      </div>

                      <div className="sm:col-span-2 flex items-center justify-start sm:justify-end gap-2 pt-2 sm:pt-0">
                        {isInteractive ? (
                          pack.downloadUrl ? (
                            <a
                              href={pack.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="liquid-glass-cta inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white"
                            >
                              <Download size={12} className="relative z-10" />
                              <span className="relative z-10">ดาวน์โหลด</span>
                            </a>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveModalPack(pack)
                              }}
                              className="text-xs font-bold text-text2 hover:text-white transition-colors"
                            >
                              ดูข้อมูล →
                            </button>
                          )
                        ) : (
                          <span className="text-[11px] font-bold text-emerald-400">
                            ✓ รวมในตัวหลัก
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </>
            )}

            {/* 2. Script Mods Section */}
            {scriptMods.length > 0 && (
              <>
                <div className="px-5 py-2.5 bg-cyan-500/12 border-y border-cyan-500/25 text-xs font-bold text-cyan-300 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Wrench size={13} className="text-cyan-400" />
                    ม็อดสคริปต์ & ม็อดระบบเกม ({scriptMods.length} ม็อด)
                  </span>
                  <span className="text-[10px] text-cyan-300/90 font-medium">★ ลิงก์ดาวน์โหลดแยกเฉพาะม็อด</span>
                </div>
                {scriptMods.map((pack) => {
                  return (
                    <div
                      key={pack.id}
                      onClick={() => setActiveModalPack(pack)}
                      className="p-4 sm:px-5 sm:py-3.5 transition-colors flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-2 sm:gap-4 hover:bg-white/[0.05] cursor-pointer"
                    >
                      <div className="sm:col-span-5">
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          <span>{pack.name}</span>
                          {pack.author && (
                            <span className="text-[10px] text-text2 font-normal">by {pack.author}</span>
                          )}
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 uppercase">
                          ม็อดสคริปต์
                        </span>
                      </div>

                      <div className="sm:col-span-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border shadow-[inset_0_1px_0_rgba(255,255,255,0.25)] ${
                          (pack.isReleased ?? (pack.status === 'done'))
                            ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                            : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            (pack.isReleased ?? (pack.status === 'done')) ? 'bg-cyan-400' : 'bg-amber-400 animate-pulse'
                          }`} />
                          {pack.progress === 100 ? 'แปลแล้ว 100%' : `แปลแล้ว (${pack.progress || 0}%)`}
                        </span>
                      </div>

                      <div className="sm:col-span-2 flex items-center justify-start sm:justify-end gap-2 pt-2 sm:pt-0">
                        {pack.downloadUrl ? (
                          <a
                            href={pack.downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="liquid-glass-cta inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white hover:scale-105"
                          >
                            <Download size={12} className="relative z-10" />
                            <span className="relative z-10">ดาวน์โหลด</span>
                          </a>
                        ) : (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveModalPack(pack)
                            }}
                            className="text-xs font-bold text-cyan-300 hover:text-white transition-colors"
                          >
                            ดูข้อมูล →
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </>
            )}

            {/* 3. Unreleased Section Divider & Rows */}
            {unreleasedOfficialPacks.length > 0 && (
              <>
                <div className="px-5 py-3 bg-amber-500/15 border-y border-amber-500/30 text-xs font-bold text-amber-300 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    กำลังแปล / ยังไม่ปล่อยดาวน์โหลด ({unreleasedOfficialPacks.length} ภาค)
                  </span>
                  <span className="text-[10px] text-amber-300/90 font-medium">★ อยู่ระหว่างการแปล จะปล่อยให้อัปเดตเร็ว ๆ นี้</span>
                </div>
                {unreleasedOfficialPacks.map((pack) => {
                  const isInteractive = pack.category === 'mod' || !!pack.downloadUrl

                  return (
                    <div
                      key={pack.id}
                      onClick={isInteractive ? () => setActiveModalPack(pack) : undefined}
                      className={`p-4 sm:px-5 sm:py-3.5 transition-colors flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-2 sm:gap-4 ${
                        isInteractive ? 'hover:bg-white/[0.05] cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <div className="sm:col-span-5">
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          <span>{pack.name}</span>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <span className="liquid-glass-pill inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-text2 uppercase">
                          {pack.category === 'expansion'
                            ? 'ภาคเสริมใหญ่'
                            : pack.category === 'gamepack'
                            ? 'ชุดเกมเสริม'
                            : pack.category === 'stuffpack'
                            ? 'ชุดไอเท็มเสริม'
                            : 'ม็อดสคริปต์'}
                        </span>
                      </div>

                      <div className="sm:col-span-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.25)]">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                          ยังไม่ปล่อย ({pack.progress || 0}%)
                        </span>
                      </div>

                      <div className="sm:col-span-2 flex items-center justify-start sm:justify-end gap-2 pt-2 sm:pt-0">
                        {isInteractive ? (
                          pack.downloadUrl ? (
                            <a
                              href={pack.downloadUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="liquid-glass-cta inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white"
                            >
                              <Download size={12} className="relative z-10" />
                              <span className="relative z-10">ดาวน์โหลด</span>
                            </a>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveModalPack(pack)
                              }}
                              className="text-xs font-bold text-text2 hover:text-white transition-colors"
                            >
                              ดูข้อมูล →
                            </button>
                          )
                        ) : (
                          <span className="text-[11px] font-bold text-amber-300/80">
                            เร็ว ๆ นี้
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </>
            )}
          </div>
        </div>
      )}

      {/* 6. Appreciation Note */}
      <div className="liquid-glass-panel rounded-2xl border-emerald-400/25 p-5 sm:p-6 text-center space-y-1.5">
        <div className="relative z-10 inline-flex items-center gap-2 text-xs font-black tracking-widest text-emerald-300 uppercase">
          <Heart size={14} className="fill-emerald-400 text-emerald-400 animate-pulse" />
          อัปเดตและพัฒนาอย่างต่อเนื่อง
        </div>
        <p className="relative z-10 text-xs text-text2 max-w-xl mx-auto leading-relaxed">
          ทุกภาคที่ปล่อยแล้วจะรวมอยู่ในไฟล์แปลภาษาไทยตัวหลัก ดาวน์โหลดและติดตั้งตามคู่มือด้านล่างได้ทันทีครับ
        </p>
      </div>

      {/* 7. Modal Popup for Interactive / External Mods */}
      {activeModalPack && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn"
          onClick={() => setActiveModalPack(null)}
        >
          <div 
            className="liquid-glass-panel relative w-full max-w-lg rounded-2xl p-6 sm:p-8 overflow-hidden space-y-5 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalPack(null)}
              className="liquid-glass-pill absolute top-5 right-5 p-2 rounded-full text-text2 hover:text-white z-10 cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="liquid-glass-pill text-[10px] font-bold px-2.5 py-0.5 rounded-full text-white uppercase">
                  {activeModalPack.category === 'expansion'
                    ? 'ภาคเสริมใหญ่ (Expansion)'
                    : activeModalPack.category === 'gamepack'
                    ? 'ชุดเกมเสริม (Game Pack)'
                    : activeModalPack.category === 'stuffpack'
                    ? 'ชุดไอเท็มเสริม (Stuff Pack)'
                    : 'ม็อดภายนอก (Script Mod)'}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] ${
                  (activeModalPack.isReleased ?? (activeModalPack.status === 'done'))
                    ? 'bg-emerald-500/18 text-emerald-200 border-emerald-400/35'
                    : 'bg-amber-500/18 text-amber-200 border-amber-400/35'
                }`}>
                  {(activeModalPack.isReleased ?? (activeModalPack.status === 'done'))
                    ? `✦ ปล่อยแล้ว (${activeModalPack.progress || 100}%)`
                    : `⟳ ยังไม่ปล่อย (${activeModalPack.progress || 0}%)`}
                </span>
              </div>
              <h3 className="font-display text-xl sm:text-2xl font-black text-white leading-tight">
                {activeModalPack.name}
              </h3>
            </div>

            {/* Modal Body */}
            <div className="liquid-glass-well relative z-10 space-y-4 text-xs text-text2 leading-relaxed p-4 rounded-2xl">
              {activeModalPack.description ? (
                <div>
                  <div className="font-bold text-white mb-1">รายละเอียดม็อด:</div>
                  <p className="whitespace-pre-line">{activeModalPack.description}</p>
                </div>
              ) : (
                <p>แปลข้อความเมนู บทสนทนา ปฏิสัมพันธ์ และคำอธิบายไอเท็มครบถ้วน</p>
              )}

              <div className="pt-2 border-t border-white/10 text-[11px] flex items-center justify-between">
                <div>
                  <span className="text-text2">ผู้สร้าง/ต้นฉบับ:</span>{' '}
                  <span className="text-white font-semibold">{activeModalPack.author || 'EA / Maxis'}</span>
                </div>
                <div>
                  <span className="text-text2">หมวดหมู่:</span>{' '}
                  <span className="text-emerald-300 font-semibold uppercase">{activeModalPack.category}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="relative z-10 flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveModalPack(null)}
                className="liquid-glass-pill px-5 py-2.5 rounded-full text-xs font-bold text-text2 hover:text-white cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
              {activeModalPack.downloadUrl ? (
                <a
                  href={activeModalPack.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="liquid-glass-cta inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold text-white hover:scale-105"
                >
                  <Download size={14} className="relative z-10" />
                  <span className="relative z-10">ดาวน์โหลดม็อดนี้</span>
                </a>
              ) : (
                <a
                  href="#base-download"
                  onClick={() => setActiveModalPack(null)}
                  className="liquid-glass-cta inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold text-white"
                >
                  <span className="relative z-10">ดาวน์โหลดพร้อมตัวหลัก</span>
                  <ArrowRight size={14} className="relative z-10" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
