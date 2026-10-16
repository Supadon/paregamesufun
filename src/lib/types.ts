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
  link?: string
  url?: string
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
  sheetCell?: string
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
  instructionsMac?: InstructionStep[]
  updatedAt?: string
}

export interface InstructionStep {
  text: string
  image?: string
  aspectRatio?: '1:1' | '16:9' | 'auto'
}

export type Sims4Category = 'expansion' | 'gamepack' | 'stuffpack' | 'mod'
export type Sims4Status = 'done' | 'wip' | 'planned'

export interface Sims4Pack {
  id: string
  name: string
  thName?: string
  category: Sims4Category
  status: Sims4Status
  isReleased?: boolean
  progress?: number
  coverImage?: string
  icon?: string
  version?: string
  author?: string
  description?: string
  downloadUrl?: string
  badgeText?: string
  releaseOrder?: number
}

export interface SocialLinks {
  facebook?: string
  youtube?: string
  nexusmods?: string
  discord?: string
  website?: string
}

export interface SiteSettings {
  socialLinks: SocialLinks
}

