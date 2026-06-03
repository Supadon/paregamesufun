import Link from 'next/link'
import { Game } from '@/lib/types'

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  const isDone = game.status === 'done'

  return (
    <Link
      href={`/games/${game.slug}`}
      className="group relative flex flex-col rounded-xl overflow-hidden no-underline aspect-[2/3] bg-bg1 border border-border2 transition-all duration-500 hover:border-blue3 hover:-translate-y-[6px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.6),0_0_25px_rgba(43,95,255,0.25)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue2 focus-visible:border-blue3"
    >
      {/* Visual cover area (fills 100% of card) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-gradient-to-br from-bg2 to-bg3 z-0">
        {(game.posterImage || game.coverImage) ? (
          <img
            src={game.posterImage || game.coverImage}
            alt={game.title}
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[64px] sm:text-[72px] transition-transform duration-500 group-hover:scale-110 drop-shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              {game.emoji}
            </span>
          </div>
        )}
        
        {/* Dark gradient fade for text legibility (Visible only on hover) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out z-10" />

        {/* Shine sweep effect */}
        <div className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12 -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out pointer-events-none z-20" />
      </div>

      {/* Info bar at bottom (Slides up and fades in on hover) */}
      <div className="absolute bottom-0 inset-x-0 z-30 p-4 bg-black/40 backdrop-blur-md border-t border-white/10 flex flex-col gap-2 transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-out">
        <div className="flex justify-between items-start gap-2">
          <span className="text-sm font-bold text-white line-clamp-1 group-hover:text-blue3 transition-colors duration-300">
            {game.title}
          </span>
          <span className={`shrink-0 inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-[0.5px] ${
            isDone 
              ? 'bg-blue-dim text-blue3 border border-blue-dim/30' 
              : 'bg-[rgba(168,196,255,0.12)] border border-[rgba(168,196,255,0.3)] text-star'
          }`}>
            {isDone ? 'Done' : 'WIP'}
          </span>
        </div>
        <div className="flex justify-between items-center text-[10.5px] text-text2 font-semibold">
          <span>{game.genre}</span>
          <span className="text-text3 transition-colors duration-300 group-hover:text-white">
            {isDone ? '✦ เสร็จสิ้น' : '⟳ กำลังแปล'}
          </span>
        </div>
      </div>
    </Link>
  )
}
