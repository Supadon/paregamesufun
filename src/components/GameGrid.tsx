import { Game } from '@/lib/types'
import GameCard from './GameCard'

interface GameGridProps {
  games: Game[]
  title?: string
}

export default function GameGrid({ games, title = 'ม็อดแปลภาษาไทยทั้งหมด' }: GameGridProps) {
  return (
    <section id="games" className="scroll-mt-24">
      {/* Section Header */}
      <div className="max-w-[1100px] mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="text-sm font-semibold text-text1 flex items-center gap-2">
          <div className="w-[5px] h-[5px] rounded-full bg-blue2 shadow-[0_0_6px_var(--blue)]" />
          {title}
        </div>

        <span className="text-xs text-text3 bg-[rgba(255,255,255,0.04)] px-3 py-1 rounded-full border border-white/5">
          {games.length} เกม
        </span>
      </div>

      {/* Cards Grid - 4 columns */}
      <div className="max-w-[1100px] mx-auto px-6 pb-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </section>
  )
}
