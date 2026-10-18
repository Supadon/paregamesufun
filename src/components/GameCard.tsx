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

        {/* Bottom Liquid Glass Info Dock — refracts poster colors while preserving crisp readability */}
        <div className="relative z-10 mt-auto p-2 sm:p-2.5">
          {/* Soft ambient gradient behind the dock so upper transition is seamless */}
          <div className="absolute inset-x-0 bottom-0 h-[140%] bg-gradient-to-t from-bg0/90 via-bg0/45 to-transparent pointer-events-none" />

          <div className="relative rounded-xl p-2.5 sm:p-3 flex flex-col gap-1.5 bg-[linear-gradient(165deg,rgba(18,29,84,0.62)_0%,rgba(6,11,34,0.82)_100%)] backdrop-blur-md backdrop-saturate-[185%] border border-white/15 shadow-[0_8px_24px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.28),inset_0_-1px_0_rgba(111,160,255,0.14)] transition-all duration-300 group-hover:border-white/25 group-hover:bg-[linear-gradient(165deg,rgba(24,38,104,0.68)_0%,rgba(8,14,42,0.86)_100%)]">
            <span
              className="text-[10px] font-extrabold uppercase tracking-[0.12em] truncate drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
              style={{ color: accent }}
            >
              {game.genre}
            </span>

            <h3 className="font-display text-[14.5px] sm:text-[15.5px] font-black text-white leading-snug line-clamp-2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]">
              {game.title}
            </h3>

            <div className="flex items-center justify-between gap-2 pt-1.5 border-t border-white/12">
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] ${
                  isDone
                    ? 'bg-blue/30 text-star2 border-blue3/45'
                    : 'bg-[rgba(168,196,255,0.16)] text-star border-[rgba(168,196,255,0.38)]'
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${isDone ? 'bg-blue3 shadow-[0_0_6px_#6FA0FF]' : 'bg-star animate-pulse shadow-[0_0_6px_#A8C4FF]'}`}
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
