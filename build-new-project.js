const fs = require('fs');
const path = require('path');

const targetRoot = path.resolve('..', 'paregamesufun-new');

function writeFile(relPath, content) {
  const fullPath = path.join(targetRoot, relPath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content.trim() + '\n', 'utf8');
  console.log('Created:', relPath);
}

// 1. types.ts
writeFile('src/lib/types.ts', `
export type GameStatus = 'done' | 'wip' | 'planned'

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
  sheetCell?: string
}

export interface InstructionStep {
  text: string
  image?: string
}

export interface Game {
  id: number
  slug: string
  title: string
  genre: string
  emoji: string
  status: 'done' | 'wip'
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

export type Sims4Category = 'expansion' | 'gamepack' | 'stuffpack' | 'mod'
export type Sims4Status = 'done' | 'wip' | 'planned'

export interface Sims4Pack {
  id: string
  name: string
  thName?: string
  category: Sims4Category
  status: Sims4Status
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
`);

// 2. utils.ts
writeFile('src/lib/utils.ts', `
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`);

// 3. games-data.ts
writeFile('src/lib/games-data.ts', `
import { Game } from './types'
import gamesData from '@/data/games.json'

export const games: Game[] = gamesData as Game[]

export async function getGames(): Promise<Game[]> {
  return games
}

export async function getGameBySlug(slug: string): Promise<Game | undefined> {
  return games.find((game) => game.slug === slug)
}

export async function getGamesByStatus(status: 'done' | 'wip'): Promise<Game[]> {
  return games.filter((game) => game.status === status)
}
`);

// 4. globals.css (Minimalist Luxury Studio Styling)
writeFile('src/app/globals.css', `
@import "tailwindcss";

@layer base {
  :root {
    --bg-canvas: #FAFAFC;
    --bg-surface: #FFFFFF;
    --bg-subtle: #F3F4F6;
    --border-subtle: #E5E7EB;
    --border-strong: #111827;
    --text-main: #0A0A0C;
    --text-muted: #64748B;
    --text-dim: #94A3B8;
  }

  body {
    background-color: var(--bg-canvas);
    color: var(--text-main);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    letter-spacing: -0.01em;
  }
}

/* Custom Minimalist Scrollbar */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: #FAFAFC;
}
::-webkit-scrollbar-thumb {
  background: #D1D5DB;
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: #9CA3AF;
}
`);

console.log('Base lib and styles created!');
