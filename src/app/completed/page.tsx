import type { Metadata } from 'next'
import GameCard from '@/components/GameCard'
import { getGames } from '@/app/actions/games'

export const metadata: Metadata = {
  title: 'เสร็จแล้ว — แปลเกมสู่ฝัน',
  description: 'รวมเกมที่แปลเสร็จแล้วทั้งหมด พร้อมดาวน์โหลดฟรี',
}

export default async function CompletedPage() {
  const allGames = await getGames()
  const completedGames = allGames.filter((g) => g.status === 'done')

  return (
    <div className="pt-20">
      {/* Section Header */}
      <div className="max-w-[1100px] mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="text-sm font-semibold text-text1 flex items-center gap-2">
          <div className="w-[5px] h-[5px] rounded-full bg-blue2 shadow-[0_0_6px_var(--blue)]" />
          เกมที่แปลเสร็จแล้ว
        </div>
        <span className="text-xs text-text3 bg-[rgba(255,255,255,0.04)] px-3 py-1 rounded-full">{completedGames.length} เกม</span>
      </div>

      {/* Cards Grid - 5 columns */}
      <div className="max-w-[1100px] mx-auto px-6 pb-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {completedGames.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  )
}
