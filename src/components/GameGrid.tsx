'use client'

import { useState } from 'react'
import { Game } from '@/lib/types'
import GameCard from './GameCard'

interface GameGridProps {
  games: Game[]
  title?: string
}

type FilterKey = 'all' | 'done' | 'wip'

export default function GameGrid({ games, title = 'ม็อดแปลภาษาไทยทั้งหมด' }: GameGridProps) {
  const [filter, setFilter] = useState<FilterKey>('all')

  const doneCount = games.filter((g) => g.status === 'done').length
  const wipCount = games.filter((g) => g.status === 'wip').length

  const filteredGames = games.filter((game) => {
    if (filter === 'done') return game.status === 'done'
    if (filter === 'wip') return game.status === 'wip'
    return true
  })

  const tabs: { key: FilterKey; label: string; count: number }[] = [
    { key: 'all', label: 'ทั้งหมด', count: games.length },
    { key: 'done', label: 'เสร็จแล้ว', count: doneCount },
    { key: 'wip', label: 'กำลังแปล', count: wipCount },
  ]

  return (
    <section id="games" className="relative z-10 max-w-[1140px] mx-auto px-4 sm:px-6 pt-6 pb-20 scroll-mt-24">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/10">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-[-0.015em] flex items-center gap-2.5">
            <span>{title}</span>
            <span className="liquid-glass-pill text-xs font-bold text-star2 px-3 py-0.5 rounded-full">
              {filteredGames.length}
            </span>
          </h2>
        </div>

        {/* Category Filter Pills */}
        <div className="liquid-glass-nav flex items-center gap-1.5 p-1.5 rounded-full self-start sm:self-auto">
          {tabs.map((tab) => {
            const isActive = filter === tab.key
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilter(tab.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'liquid-glass-cta text-white font-black shadow-[0_4px_16px_rgba(43,95,255,0.45)] scale-[1.02]'
                    : 'text-text2 hover:text-white hover:bg-white/5'
                }`}
              >
                {tab.label} <span className={isActive ? 'text-white/80' : 'text-text3'}>({tab.count})</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Cards Grid - 4 columns on large screens */}
      {filteredGames.length === 0 ? (
        <div className="liquid-glass-panel py-16 text-center text-text2 text-sm rounded-2xl">
          ไม่พบการ์ดเกมในหมวดหมู่นี้
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredGames.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </div>
      )}
    </section>
  )
}
