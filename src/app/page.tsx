import HeroBanner from '@/components/HeroBanner'
import GameGrid from '@/components/GameGrid'
import { getGames } from '@/app/actions/games'

export default async function HomePage() {
  const games = await getGames()

  // Sort games by updatedAt descending (most recent first)
  const sortedGames = [...games].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
    return dateB - dateA
  })

  // Take only the top 4 latest games
  const latestGames = sortedGames.slice(0, 4)

  return (
    <>
      <HeroBanner />
      <GameGrid games={latestGames} title="ผลงานล่าสุด" />
    </>
  )
}
