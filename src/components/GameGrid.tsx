'use client'

import { useState } from 'react'
import { Game } from '@/lib/types'
import GameCard from './GameCard'

interface GameGridProps {
  games: Game[]
  title?: string
}

export default function GameGrid({ games, title = 'ม็อดแปลภาษาไทยทั้งหมด' }: GameGridProps) {
  const [filter, setFilter] = useState<'all' | 'done' | 'wip'>('all')

  const doneCount = games.filter((g) => g.status === 'done').length
  const wipCount = games.filter((g) => g.status === 'wip').length

  const filteredGames = games.filter((game) => {
    if (filter === 'done') return game.status === 'done'
    if (filter === 'wip') return game.status === 'wip'
    return true
  })

  return (
    <section id="games" className="relative z-10 max-w-[1140px] mx-auto px-4 sm:px-6 pt-6 pb-20 scroll-mt-24">
      {/* Section Header (Inspired by Reference Image 2) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 pb-4 border-b border-white/5">
        <div>
          <h2 className="font-display text-2xl sm:text-3xl font-black text-white tracking-[-0.015em] flex items-center gap-2">
            <span>{title}</span>
            <span className="text-xs font-bold text-text3 bg-white/5 px-2.5 py-0.5 rounded-full border border-white/5">
              {filteredGames.length}
            </span>
          </h2>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 bg-bg1/70 backdrop-blur-md p-1 rounded-full border border-white/10 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-blue to-cyan-500 text-white shadow-[0_0_12px_rgba(43,95,255,0.4)]'
                : 'text-text3 hover:text-white hover:bg-white/5'
            }`}
          >
            ทั้งหมด ({games.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('done')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
              filter === 'done'
                ? 'bg-gradient-to-r from-blue to-cyan-500 text-white shadow-[0_0_12px_rgba(43,95,255,0.4)]'
                : 'text-text3 hover:text-white hover:bg-white/5'
            }`}
          >
            เสร็จแล้ว ({doneCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('wip')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-black transition-all ${
              filter === 'wip'
                ? 'bg-gradient-to-r from-blue to-cyan-500 text-white shadow-[0_0_12px_rgba(43,95,255,0.4)]'
                : 'text-text3 hover:text-white hover:bg-white/5'
            }`}
          >
            กำลังแปล ({wipCount})
          </button>
        </div>
      </div>

      {/* Cards Grid - 4 columns on large screens */}
      {filteredGames.length === 0 ? (
        <div className="py-16 text-center text-text3 text-sm border border-dashed border-white/10 rounded-2xl">
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
