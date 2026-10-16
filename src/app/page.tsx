import HeroBanner from '@/components/HeroBanner'
import FeaturedShowcase from '@/components/FeaturedShowcase'
import GameGrid from '@/components/GameGrid'
import CosmicAtmosphere from '@/components/CosmicAtmosphere'
import { getGames, getSiteSettings } from '@/app/actions/games'

export default async function HomePage() {
  const [games, settings] = await Promise.all([
    getGames(),
    getSiteSettings(),
  ])

  // Sort games by updatedAt descending (most recent first)
  const sortedGames = [...games].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
    return dateB - dateA
  })

  return (
    <div className="relative min-h-screen text-text1 overflow-x-hidden">
      {/* Background Atmosphere & Decorative Glowing Colors */}
      <CosmicAtmosphere />

      {/* Main Content Sections */}
      <div className="relative z-10">
        <HeroBanner settings={settings} />
        {/* ปิดส่วนของ ม็อดเกมยอดนิยม ไว้ชั่วคราว (สามารถนำกลับมาเปิดใช้ได้ในอนาคต): */}
        {/* <FeaturedShowcase games={sortedGames} /> */}
        <GameGrid games={sortedGames} title="ม็อดแปลภาษาไทยทั้งหมด" />
      </div>
    </div>
  )
}
