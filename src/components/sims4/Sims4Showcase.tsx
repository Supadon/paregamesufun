'use client'

import { useState, useMemo } from 'react'
import { Sims4Pack, Sims4Category } from '@/lib/types'
import Sims4PackCard from './Sims4PackCard'
import { 
  Sparkles, Layers, Package, Sparkle, Wrench, 
  X, Download, ArrowRight, Heart, Search, LayoutGrid, List,
  CheckCircle2, Clock, Check, RotateCcw
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
        label: 'ม็อดภายนอก',
        count: packs.filter(p => p.category === 'mod').length,
        icon: Wrench,
        colorClass: 'text-amber-300',
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

  // Split filtered packs into released and unreleased for distinct sectioning
  const { releasedPacks, unreleasedPacks } = useMemo(() => {
    const released: Sims4Pack[] = []
    const unreleased: Sims4Pack[] = []

    filteredPacks.forEach((p) => {
      if (p.isReleased !== false) {
        released.push(p)
      } else {
        unreleased.push(p)
      }
    })

    return { releasedPacks: released, unreleasedPacks: unreleased }
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl bg-bg1/60 border border-white/10 backdrop-blur-md shadow-xl">
        <div className="space-y-1">
          <span className="text-[11px] text-text3 font-medium flex items-center gap-1.5">
            <Sparkles size={13} className="text-emerald-400" />
            รวมภาคเสริมทั้งหมด
          </span>
          <div className="text-xl sm:text-2xl font-black text-white">
            {stats.total} <span className="text-xs font-normal text-text3">รายการ</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
            <CheckCircle2 size={13} className="text-emerald-400" />
            ปล่อยดาวน์โหลดแล้ว
          </span>
          <div className="text-xl sm:text-2xl font-black text-emerald-300">
            {stats.released} <span className="text-xs font-normal text-text3">รายการ</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-amber-300 font-medium flex items-center gap-1.5">
            <Clock size={13} className="text-amber-400" />
            ยังไม่ปล่อย (กำลังพัฒนา)
          </span>
          <div className="text-xl sm:text-2xl font-black text-amber-300">
            {stats.unreleased} <span className="text-xs font-normal text-amber-400/70">รายการ</span>
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-blue3 font-medium flex items-center gap-1.5">
            <Heart size={13} className="text-blue3" />
            รูปแบบการแจก
          </span>
          <div className="text-xl sm:text-2xl font-black text-blue3">
            ฟรี 100%
          </div>
        </div>
      </div>

      {/* 2. Interactive Search & Control Command Hub (Sticky) */}
      <div className="sticky top-20 z-30 bg-bg0/95 backdrop-blur-2xl p-4 sm:p-5 rounded-3xl border border-white/15 shadow-2xl space-y-4">
        
        {/* Top Row: Search Input + Release Status Filter + View Mode Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-xl">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาภาคเสริม... (เช่น Seasons, Lovestruck, Werewolves, Spa Day)"
              className="w-full bg-bg2/70 text-text1 placeholder:text-text3 text-xs sm:text-sm pl-10 pr-9 py-2.5 rounded-full border border-white/10 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition-all shadow-inner"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text3 hover:text-white p-1 rounded-full transition-colors"
                title="ล้างคำค้นหา"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Right Tools: Release Status Filter & View Mode Toggle */}
          <div className="flex items-center justify-between sm:justify-end gap-2 shrink-0">
            {/* Release Status Pills */}
            <div className="inline-flex items-center gap-1 p-1 rounded-full bg-bg1/90 border border-white/10 text-[11px] font-bold">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-full transition-all ${
                  statusFilter === 'all'
                    ? 'bg-blue text-white shadow-sm'
                    : 'text-text3 hover:text-white'
                }`}
              >
                ทั้งหมด ({stats.total})
              </button>
              <button
                onClick={() => setStatusFilter('released')}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                  statusFilter === 'released'
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-text3 hover:text-emerald-300'
                }`}
              >
                <Check size={11} />
                ปล่อยแล้ว ({stats.released})
              </button>
              <button
                onClick={() => setStatusFilter('unreleased')}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                  statusFilter === 'unreleased'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-text3 hover:text-amber-300'
                }`}
              >
                <Clock size={11} />
                กำลังแปล ยังไม่ปล่อย ({stats.unreleased})
              </button>
            </div>

            {/* View Mode Toggle (Grid vs List) */}
            <div className="inline-flex items-center p-1 rounded-full bg-bg1/90 border border-white/10 shrink-0">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-full transition-all ${
                  viewMode === 'grid'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-text3 hover:text-white'
                }`}
                title="แสดงแบบการ์ด (Grid View)"
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-full transition-all ${
                  viewMode === 'list'
                    ? 'bg-white/15 text-white shadow-sm'
                    : 'text-text3 hover:text-white'
                }`}
                title="แสดงแบบตารางสรุป (List View)"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Row: Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          {categoryTabs.map((tab) => {
            const Icon = tab.icon
            const isActive = selectedCategory === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setSelectedCategory(tab.id)}
                className={`shrink-0 inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs font-bold transition-all border ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/50 shadow-[0_0_15px_rgba(16,185,129,0.25)] scale-[1.02]'
                    : 'bg-bg1/70 hover:bg-bg1 text-text3 hover:text-white border-white/10'
                }`}
              >
                <Icon size={13} className={isActive ? 'text-emerald-400' : 'opacity-60'} />
                <span>{tab.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  isActive ? 'bg-emerald-500/30 text-white' : 'bg-white/5 text-text3'
                }`}>
                  {tab.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Filter Feedback Strip (if active filters) */}
        {isFilteredView && (
          <div className="flex items-center justify-between gap-2 pt-1 border-t border-white/5 text-xs text-text3">
            <div className="flex items-center gap-2">
              <span>ผลการกรอง: พบ <strong className="text-white">{filteredPacks.length}</strong> รายการ</span>
              {searchQuery && (
                <span className="bg-white/5 px-2 py-0.5 rounded-md text-[11px] text-text2">
                  คำค้น: &quot;{searchQuery}&quot;
                </span>
              )}
            </div>
            <button
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold transition-colors"
            >
              <RotateCcw size={12} />
              ล้างตัวกรองทั้งหมด
            </button>
          </div>
        )}
      </div>

      {/* 3. Empty State */}
      {filteredPacks.length === 0 && (
        <div className="rounded-3xl border border-white/10 bg-bg1/50 p-12 text-center space-y-4 max-w-lg mx-auto shadow-xl">
          <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-text3">
            <Search size={24} />
          </div>
          <div>
            <h3 className="font-display text-lg font-bold text-white">ไม่พบภาคเสริมที่ค้นหา</h3>
            <p className="text-xs text-text2 mt-1">
              ลองค้นหาด้วยชื่อภาษาอังกฤษ หรือกดปุ่มด้านล่างเพื่อรีเซ็ตตัวกรองทั้งหมด
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-blue hover:bg-blue-light transition-all shadow-md"
          >
            <RotateCcw size={13} />
            ล้างตัวกรองและดูทั้งหมด
          </button>
        </div>
      )}

      {/* 4. Display Area: GRID VIEW */}
      {viewMode === 'grid' && filteredPacks.length > 0 && (
        <div className="space-y-8">
          {/* Section A: Released Packs */}
          {releasedPacks.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                  <h3 className="font-display font-black text-white text-base sm:text-lg tracking-wide">
                    ภาคเสริมที่ปล่อยให้เล่นแล้ว
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-bold">
                    {releasedPacks.length} ภาค
                  </span>
                </div>
                <span className="text-[11px] text-text3 hidden sm:inline-flex items-center gap-1.5">
                  <Check size={12} className="text-emerald-400" />
                  รวมอยู่ในไฟล์แปลภาษาไทยตัวหลัก ดาวน์โหลดและติดตั้งได้ทันที
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {releasedPacks.map((pack) => (
                  <Sims4PackCard key={pack.id} pack={pack} onSelect={setActiveModalPack} />
                ))}
              </div>
            </div>
          )}

          {/* Section B: Unreleased / In Progress Packs with Divider Header Banner */}
          {unreleasedPacks.length > 0 && (
            <div className="space-y-4 pt-4">
              {/* Themed Divider & Section Header */}
              <div className="relative rounded-2xl border border-amber-500/30 bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-transparent p-4 sm:p-5 backdrop-blur-md overflow-hidden shadow-lg">
                <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-amber-500/15 blur-2xl pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse" />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display font-black text-amber-200 text-base sm:text-lg tracking-wide">
                          กำลังแปล / ยังไม่ปล่อยดาวน์โหลด
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold">
                          {unreleasedPacks.length} ภาคใหม่
                        </span>
                      </div>
                      <p className="text-[11.5px] text-amber-300/80 mt-0.5 font-medium">
                        อยู่ระหว่างการแปลและทดสอบ ยังไม่รวมในไฟล์ตัวหลัก จะปล่อยให้อัปเดตเร็ว ๆ นี้
                      </p>
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                      <Clock size={12} className="text-amber-400" />
                      กำลังพัฒนา (WIP)
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-5">
                {unreleasedPacks.map((pack) => (
                  <Sims4PackCard key={pack.id} pack={pack} onSelect={setActiveModalPack} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 5. Display Area: COMPACT LIST / TABLE VIEW */}
      {viewMode === 'list' && filteredPacks.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-bg1/70 backdrop-blur-md overflow-hidden shadow-xl">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-12 gap-4 px-5 py-3 border-b border-white/10 text-[11px] font-bold text-text3 uppercase tracking-wider bg-white/5">
            <div className="col-span-5">ชื่อภาคเสริม (Pack Name)</div>
            <div className="col-span-2">หมวดหมู่</div>
            <div className="col-span-3">สถานะการปล่อย</div>
            <div className="col-span-2 text-right">การดาวน์โหลด</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-white/5">
            {/* Released Section Sub-Header */}
            {releasedPacks.length > 0 && (
              <>
                {unreleasedPacks.length > 0 && (
                  <div className="px-5 py-2.5 bg-emerald-500/10 border-y border-emerald-500/20 text-xs font-bold text-emerald-300 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CheckCircle2 size={13} className="text-emerald-400" />
                      ภาคเสริมที่ปล่อยให้เล่นแล้ว ({releasedPacks.length} ภาค)
                    </span>
                    <span className="text-[10px] text-text3 font-medium">รวมในไฟล์แปลหลัก</span>
                  </div>
                )}
                {releasedPacks.map((pack) => {
                  const isInteractive = pack.category === 'mod' || !!pack.downloadUrl
                  const isReleased = pack.isReleased !== false

                  return (
                    <div
                      key={pack.id}
                      onClick={isInteractive ? () => setActiveModalPack(pack) : undefined}
                      className={`p-4 sm:px-5 sm:py-3.5 transition-colors flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-2 sm:gap-4 ${
                        isInteractive ? 'hover:bg-white/[0.04] cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <div className="sm:col-span-5">
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          <span>{pack.name}</span>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-text2 uppercase">
                          {pack.category === 'expansion'
                            ? 'ภาคเสริมใหญ่'
                            : pack.category === 'gamepack'
                            ? 'ชุดเกมเสริม'
                            : pack.category === 'stuffpack'
                            ? 'ชุดไอเท็มเสริม'
                            : 'ม็อดภายนอก'}
                        </span>
                      </div>

                      <div className="sm:col-span-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-emerald-500/15 text-emerald-300 border-emerald-500/30">
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
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-blue hover:bg-blue-light transition-all shadow-sm"
                            >
                              <Download size={12} />
                              ดาวน์โหลด
                            </a>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveModalPack(pack)
                              }}
                              className="text-xs font-bold text-text3 hover:text-white transition-colors"
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

            {/* Unreleased Section Divider & Rows */}
            {unreleasedPacks.length > 0 && (
              <>
                <div className="px-5 py-3 bg-amber-500/15 border-y border-amber-500/30 text-xs font-bold text-amber-300 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                    กำลังแปล / ยังไม่ปล่อยดาวน์โหลด ({unreleasedPacks.length} ภาค)
                  </span>
                  <span className="text-[10px] text-amber-400/80 font-medium">★ อยู่ระหว่างการแปล จะปล่อยให้อัปเดตเร็ว ๆ นี้</span>
                </div>
                {unreleasedPacks.map((pack) => {
                  const isInteractive = pack.category === 'mod' || !!pack.downloadUrl

                  return (
                    <div
                      key={pack.id}
                      onClick={isInteractive ? () => setActiveModalPack(pack) : undefined}
                      className={`p-4 sm:px-5 sm:py-3.5 transition-colors flex flex-col sm:grid sm:grid-cols-12 sm:items-center gap-2 sm:gap-4 ${
                        isInteractive ? 'hover:bg-white/[0.04] cursor-pointer' : 'cursor-default'
                      }`}
                    >
                      <div className="sm:col-span-5">
                        <div className="font-bold text-sm text-white flex items-center gap-2">
                          <span>{pack.name}</span>
                        </div>
                      </div>

                      <div className="sm:col-span-2">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/5 border border-white/10 text-text2 uppercase">
                          {pack.category === 'expansion'
                            ? 'ภาคเสริมใหญ่'
                            : pack.category === 'gamepack'
                            ? 'ชุดเกมเสริม'
                            : pack.category === 'stuffpack'
                            ? 'ชุดไอเท็มเสริม'
                            : 'ม็อดภายนอก'}
                        </span>
                      </div>

                      <div className="sm:col-span-3">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border bg-amber-500/15 text-amber-300 border-amber-500/30">
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
                              className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold text-white bg-blue hover:bg-blue-light transition-all shadow-sm"
                            >
                              <Download size={12} />
                              ดาวน์โหลด
                            </a>
                          ) : (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                setActiveModalPack(pack)
                              }}
                              className="text-xs font-bold text-text3 hover:text-white transition-colors"
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
      <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-bg2/90 via-bg1/90 to-bg2/90 p-5 sm:p-6 text-center space-y-1.5 shadow-lg">
        <div className="inline-flex items-center gap-2 text-xs font-black tracking-widest text-emerald-400 uppercase">
          <Heart size={14} className="fill-emerald-400 text-emerald-400 animate-pulse" />
          อัปเดตและพัฒนาอย่างต่อเนื่อง
        </div>
        <p className="text-xs text-text2 max-w-xl mx-auto leading-relaxed">
          ทุกภาคที่ปล่อยแล้วจะรวมอยู่ในไฟล์แปลภาษาไทยตัวหลัก ดาวน์โหลดและติดตั้งตามคู่มือด้านล่างได้ทันทีครับ
        </p>
      </div>

      {/* 7. Modal Popup for Interactive / External Mods */}
      {activeModalPack && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => setActiveModalPack(null)}
        >
          <div 
            className="relative w-full max-w-lg bg-bg1 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden space-y-5 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setActiveModalPack(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/15 text-text3 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white uppercase border border-white/10">
                  {activeModalPack.category === 'expansion'
                    ? 'ภาคเสริมใหญ่ (Expansion)'
                    : activeModalPack.category === 'gamepack'
                    ? 'ชุดเกมเสริม (Game Pack)'
                    : activeModalPack.category === 'stuffpack'
                    ? 'ชุดไอเท็มเสริม (Stuff Pack)'
                    : 'ม็อดภายนอก (Script Mod)'}
                </span>
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                  (activeModalPack.isReleased ?? (activeModalPack.status === 'done'))
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
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
            <div className="space-y-4 text-xs text-text2 leading-relaxed bg-bg2/40 p-4 rounded-2xl border border-white/5">
              {activeModalPack.description ? (
                <div>
                  <div className="font-bold text-white mb-1">รายละเอียดม็อด:</div>
                  <p className="whitespace-pre-line">{activeModalPack.description}</p>
                </div>
              ) : (
                <p>แปลข้อความเมนู บทสนทนา ปฏิสัมพันธ์ และคำอธิบายไอเท็มครบถ้วน</p>
              )}

              <div className="pt-2 border-t border-white/5 text-[11px] flex items-center justify-between">
                <div>
                  <span className="text-text3">ผู้สร้าง/ต้นฉบับ:</span>{' '}
                  <span className="text-white font-semibold">{activeModalPack.author || 'EA / Maxis'}</span>
                </div>
                <div>
                  <span className="text-text3">หมวดหมู่:</span>{' '}
                  <span className="text-emerald-400 font-semibold uppercase">{activeModalPack.category}</span>
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setActiveModalPack(null)}
                className="px-5 py-2.5 rounded-full text-xs font-bold text-text2 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
              >
                ปิดหน้าต่าง
              </button>
              {activeModalPack.downloadUrl ? (
                <a
                  href={activeModalPack.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue via-blue2 to-blue3 hover:scale-105 transition-all shadow-lg"
                >
                  <Download size={14} />
                  ดาวน์โหลดม็อดนี้
                </a>
              ) : (
                <a
                  href="#base-download"
                  onClick={() => setActiveModalPack(null)}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-blue hover:bg-blue-light transition-all shadow-lg"
                >
                  ดาวน์โหลดพร้อมตัวหลัก
                  <ArrowRight size={14} />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
