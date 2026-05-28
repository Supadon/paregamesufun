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
      className="group relative block rounded-[20px] overflow-hidden no-underline aspect-[2/3] bg-bg1 border border-border2 transition-all duration-300 hover:border-blue2 hover:-translate-y-[4px] hover:shadow-[0_12px_40px_rgba(0,0,0,0.65),0_0_30px_rgba(43,95,255,0.35),0_0_12px_rgba(0,210,255,0.25),0_0_0_1.5px_rgba(43,95,255,0.3)]"
    >
      {/* Background gradient as cover */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg2 to-bg3" />
      {(game.posterImage || game.coverImage) && (
        <img
          src={game.posterImage || game.coverImage}
          alt={game.title}
          className="absolute inset-0 w-full h-full object-cover opacity-100 transition-all duration-500 group-hover:scale-105"
        />
      )}

      {/* Emoji as cover art (Fallback) */}
      {!game.posterImage && !game.coverImage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[64px] sm:text-[72px] transition-transform duration-300 group-hover:scale-110 drop-shadow-[0_4px_20px_rgba(0,0,0,0.4)]">
            {game.emoji}
          </span>
        </div>
      )}

      {/* Glossy shine reflection sweep on hover */}
      <div className="absolute inset-0 w-[50%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 -translate-x-[150%] group-hover:translate-x-[250%] transition-transform duration-1000 ease-out pointer-events-none z-20" />

      {/* Hover overlay - slides up from bottom, revealing titles and status */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-[rgba(4,7,26,0.82)] backdrop-blur-[6px] opacity-0 translate-y-[10px] transition-all duration-300 ease-out group-hover:opacity-100 group-hover:translate-y-0 z-10">
        
        {/* Title & Genre inside hover overlay */}
        <div className="text-center px-4 mb-4">
          <div className="text-[15px] font-black text-white leading-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]">
            {game.title}
          </div>
          <div className="text-[11px] text-text2 mt-1 font-semibold">
            {game.genre}
          </div>
        </div>

        {/* Status icon */}
        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2.5 ${
          isDone
            ? 'bg-[rgba(43,95,255,0.2)] border border-[rgba(43,95,255,0.4)]'
            : 'bg-[rgba(168,196,255,0.12)] border border-[rgba(168,196,255,0.3)]'
        }`}>
          {isDone ? (
            <svg className="w-5 h-5 text-blue3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-4.5 h-4.5 text-star animate-spin" style={{ animationDuration: '3s' }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          )}
        </div>

        {/* Status text */}
        <div className={`text-[13px] font-bold tracking-wide ${isDone ? 'text-blue3' : 'text-star'}`}>
          {isDone ? '✦ แปลเสร็จแล้ว' : '⟳ กำลังแปล'}
        </div>
        <div className="text-[10px] text-text3 font-semibold mt-0.5">
          {isDone ? 'COMPLETED' : 'IN PROGRESS'}
        </div>

        {/* View button */}
        <div className="mt-4 px-4.5 py-1.5 rounded-full text-[10px] font-bold text-star2 bg-[rgba(43,95,255,0.2)] border border-[rgba(43,95,255,0.3)] hover:bg-blue hover:text-white transition-colors duration-200">
          ดูรายละเอียด →
        </div>
      </div>
    </Link>
  )
}
