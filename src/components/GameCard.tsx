import Link from 'next/link'
import { Game } from '@/lib/types'
import ThemedCard, { PosterImage } from './ThemedCard'

interface GameCardProps {
  game: Game
}

export default function GameCard({ game }: GameCardProps) {
  const isDone = game.status === 'done'
  const accent = isDone ? '#4A7FFF' : '#A8C4FF'
  const poster = game.posterImage || game.coverImage

  // Themed fallback artwork — used when a game has no poster (or it fails to load)
  const fallbackArt = (
    <div className="themed-card__art absolute inset-0 flex items-center justify-center">
      <span className="relative z-10 -mt-10 text-[72px] sm:text-[84px] drop-shadow-[0_6px_24px_rgba(0,0,0,0.6)] transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
        {game.emoji}
      </span>
    </div>
  )

  return (
    <ThemedCard
      accent={accent}
      className="group aspect-[2/3] rounded-xl overflow-hidden bg-bg1 border border-border2"
    >
      <Link
        href={`/games/${game.slug}`}
        className="absolute inset-0 z-0 flex flex-col no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue2 rounded-xl"
      >
        {/* Poster — always vivid, no dimming overlay on the artwork itself */}
        <div className="absolute inset-0 overflow-hidden">
          <PosterImage
            src={poster}
            alt={game.title}
            fallback={fallbackArt}
            className="absolute inset-0 w-full h-full object-cover saturate-[1.08] contrast-[1.04] transition-transform duration-700 ease-out group-hover:scale-[1.07]"
          />
        </div>

        {/* Bottom info panel — always visible so every card is readable at a glance */}
        <div className="relative z-10 mt-auto">
          <div className="absolute inset-x-0 bottom-0 h-[150%] bg-gradient-to-t from-black/95 via-black/70 to-transparent pointer-events-none" />

          <div className="relative p-3.5 pt-8 flex flex-col gap-1.5">
            <span
              className="text-[10px] font-extrabold uppercase tracking-[0.12em] truncate"
              style={{ color: accent }}
            >
              {game.genre}
            </span>

            <h3 className="font-display text-[15px] sm:text-base font-black text-white leading-snug line-clamp-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              {game.title}
            </h3>

            <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/10">
              <span
                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-extrabold border whitespace-nowrap ${
                  isDone
                    ? 'bg-blue/25 text-star2 border-blue2/50'
                    : 'bg-[rgba(168,196,255,0.14)] text-star border-[rgba(168,196,255,0.35)]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isDone ? 'bg-blue3' : 'bg-star animate-pulse'}`}
                />
                {isDone ? 'เสร็จสิ้น' : 'กำลังแปล'}
              </span>

              <span className="text-[10.5px] font-bold text-text2 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5 whitespace-nowrap">
                ดูรายละเอียด →
              </span>
            </div>
          </div>
        </div>
      </Link>
    </ThemedCard>
  )
}
