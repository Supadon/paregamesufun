export type GameStatus = 'done' | 'wip'

export interface DownloadLink {
  label: string
  url: string
  type: 'primary' | 'secondary'
}

export interface TeamMember {
  name: string
  role: string
  avatar?: string
}

export interface GameModule {
  name: string
  progress: number
}

export interface GameProgress {
  translate: number
  proofread: number
  test: number
  isMultiModule?: boolean
  modules?: GameModule[]
  sheetUrl?: string
}

export interface Game {
  id: number
  slug: string
  title: string
  genre: string
  emoji: string
  status: GameStatus
  progress: GameProgress
  version: string
  client: string
  translationVersion: string
  shortDescription: string
  description: string
  overview: string
  translationScope: string[]
  videoUrl?: string
  coverImage?: string
  posterImage?: string
  fileSize?: string
  team: TeamMember[]
  downloads: DownloadLink[]
  instructions?: InstructionStep[]
  updatedAt?: string
}

export interface InstructionStep {
  text: string
  image?: string
}

