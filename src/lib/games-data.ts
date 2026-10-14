import { Game } from './types'
import gamesJson from '@/data/games.json'

export const games: Game[] = gamesJson as Game[]

export function getGameBySlug(slug: string): Game | undefined {
  return games.find((g) => g.slug === slug)
}

export function getGamesByStatus(status: 'done' | 'wip'): Game[] {
  return games.filter((g) => g.status === status)
}
