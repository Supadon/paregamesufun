'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { Game, Sims4Pack, SiteSettings } from '@/lib/types'
import fs from 'fs'
import path from 'path'
import defaultGames from '@/data/games.json'
import defaultTeamPool from '@/data/team-pool.json'
import defaultSims4Packs from '@/data/sims4-packs.json'
import defaultSettings from '@/data/settings.json'

const GAMES_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'games.json')
const TEAM_POOL_PATH = path.join(process.cwd(), 'src', 'data', 'team-pool.json')
const SIMS4_PACKS_PATH = path.join(process.cwd(), 'src', 'data', 'sims4-packs.json')
const SETTINGS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'settings.json')

// Helper: Check authentication
async function verifyAuthOrThrow() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')
  if (!session || session.value !== 'authenticated') {
    throw new Error('Unauthorized: Admin session required')
  }
}

// Action: Check if admin session cookie exists and is valid
export async function checkAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get('admin_session')?.value === 'authenticated'
}

// Action: Verify password and set httpOnly session cookie
export async function verifyAdminPassword(password: string): Promise<{ success: boolean; error?: string }> {
  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'gamesufun2026'
  if (password === ADMIN_PASSWORD) {
    const cookieStore = await cookies()
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })
    return { success: true }
  }
  return { success: false, error: 'รหัสผ่านไม่ถูกต้อง' }
}

// Action: Delete admin session cookie
export async function logoutAdmin(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
}

// ==========================================
// 🎮 1. GENERAL GAMES DATA ACTIONS
// ==========================================

function getLocalGames(): Game[] {
  try {
    if (!fs.existsSync(GAMES_FILE_PATH)) {
      fs.mkdirSync(path.dirname(GAMES_FILE_PATH), { recursive: true })
      fs.writeFileSync(GAMES_FILE_PATH, JSON.stringify(defaultGames, null, 2), 'utf-8')
      return defaultGames as Game[]
    }
    const data = fs.readFileSync(GAMES_FILE_PATH, 'utf-8')
    return JSON.parse(data) as Game[]
  } catch (error) {
    console.error('Error reading local games:', error)
    return defaultGames as Game[]
  }
}

function writeLocalGames(games: Game[]) {
  try {
    fs.mkdirSync(path.dirname(GAMES_FILE_PATH), { recursive: true })
    fs.writeFileSync(GAMES_FILE_PATH, JSON.stringify(games, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing local games:', error)
  }
}

export async function getGames(): Promise<Game[]> {
  return getLocalGames()
}

export async function getGameBySlug(slug: string): Promise<Game | null> {
  const localGames = getLocalGames()
  return localGames.find((g) => g.slug === slug) || null
}

export async function createGame(gameData: Omit<Game, 'id'>): Promise<{ success: boolean; data?: Game; error?: string }> {
  await verifyAuthOrThrow()
  try {
    const localGames = getLocalGames()
    const nextId = localGames.length > 0 ? Math.max(...localGames.map((g) => g.id)) + 1 : 1
    const newGame: Game = {
      id: nextId,
      ...gameData,
    }
    localGames.push(newGame)
    writeLocalGames(localGames)

    revalidatePath('/')
    revalidatePath('/completed')
    revalidatePath('/in-progress')
    revalidatePath(`/games/${gameData.slug}`)
    return { success: true, data: newGame }
  } catch (err: any) {
    console.error('Local createGame error:', err)
    return { success: false, error: err.message || 'Failed to write to local database' }
  }
}

export async function updateGame(id: number, gameData: Partial<Game>): Promise<{ success: boolean; data?: Game; error?: string }> {
  await verifyAuthOrThrow()
  try {
    const localGames = getLocalGames()
    const idx = localGames.findIndex((g) => g.id === id)
    if (idx === -1) {
      return { success: false, error: 'Game not found in local database' }
    }

    const updatedGame: Game = {
      ...localGames[idx],
      ...gameData,
      id,
    }
    localGames[idx] = updatedGame
    writeLocalGames(localGames)

    revalidatePath('/')
    revalidatePath('/completed')
    revalidatePath('/in-progress')
    revalidatePath(`/games/${updatedGame.slug}`)
    return { success: true, data: updatedGame }
  } catch (err: any) {
    console.error('Local updateGame error:', err)
    return { success: false, error: err.message || 'Failed to update local database' }
  }
}

export async function deleteGame(id: number): Promise<{ success: boolean; error?: string }> {
  await verifyAuthOrThrow()
  try {
    const localGames = getLocalGames()
    const gameToDelete = localGames.find((g) => g.id === id)
    const filteredGames = localGames.filter((g) => g.id !== id)
    writeLocalGames(filteredGames)

    revalidatePath('/')
    revalidatePath('/completed')
    revalidatePath('/in-progress')
    if (gameToDelete) {
      revalidatePath(`/games/${gameToDelete.slug}`)
    }
    return { success: true }
  } catch (err: any) {
    console.error('Local deleteGame error:', err)
    return { success: false, error: err.message || 'Failed to delete from local database' }
  }
}

// ==========================================
// 💎 2. THE SIMS 4 PACKS & MODS ACTIONS
// ==========================================

function getLocalSims4Packs(): Sims4Pack[] {
  try {
    if (!fs.existsSync(SIMS4_PACKS_PATH)) {
      fs.mkdirSync(path.dirname(SIMS4_PACKS_PATH), { recursive: true })
      fs.writeFileSync(SIMS4_PACKS_PATH, JSON.stringify(defaultSims4Packs, null, 2), 'utf-8')
      return defaultSims4Packs as Sims4Pack[]
    }
    const data = fs.readFileSync(SIMS4_PACKS_PATH, 'utf-8')
    return JSON.parse(data) as Sims4Pack[]
  } catch (error) {
    console.error('Error reading sims4 packs:', error)
    return defaultSims4Packs as Sims4Pack[]
  }
}

function writeLocalSims4Packs(packs: Sims4Pack[]) {
  try {
    fs.mkdirSync(path.dirname(SIMS4_PACKS_PATH), { recursive: true })
    fs.writeFileSync(SIMS4_PACKS_PATH, JSON.stringify(packs, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing sims4 packs:', error)
  }
}

export async function getSims4Packs(): Promise<Sims4Pack[]> {
  return getLocalSims4Packs()
}

export async function createSims4Pack(packData: Sims4Pack): Promise<{ success: boolean; data?: Sims4Pack; error?: string }> {
  await verifyAuthOrThrow()
  try {
    const packs = getLocalSims4Packs()
    // Check if ID exists, if so generate a unique ID
    let safeId = packData.id?.trim() || `pack-${Date.now()}`
    if (packs.some(p => p.id === safeId)) {
      safeId = `${safeId}-${Date.now()}`
    }

    const newPack: Sims4Pack = {
      ...packData,
      id: safeId,
    }
    packs.push(newPack)
    writeLocalSims4Packs(packs)

    revalidatePath('/games/the-sims-4')
    revalidatePath('/the-sims-4')
    return { success: true, data: newPack }
  } catch (err: any) {
    console.error('Local createSims4Pack error:', err)
    return { success: false, error: err.message || 'Failed to create sims 4 pack' }
  }
}

export async function updateSims4Pack(id: string, packData: Partial<Sims4Pack>): Promise<{ success: boolean; data?: Sims4Pack; error?: string }> {
  await verifyAuthOrThrow()
  try {
    const packs = getLocalSims4Packs()
    const idx = packs.findIndex((p) => p.id === id)
    if (idx === -1) {
      return { success: false, error: 'Pack not found' }
    }

    const updatedPack: Sims4Pack = {
      ...packs[idx],
      ...packData,
      id, // Preserve ID
    }
    packs[idx] = updatedPack
    writeLocalSims4Packs(packs)

    revalidatePath('/games/the-sims-4')
    revalidatePath('/the-sims-4')
    return { success: true, data: updatedPack }
  } catch (err: any) {
    console.error('Local updateSims4Pack error:', err)
    return { success: false, error: err.message || 'Failed to update sims 4 pack' }
  }
}

export async function deleteSims4Pack(id: string): Promise<{ success: boolean; error?: string }> {
  await verifyAuthOrThrow()
  try {
    const packs = getLocalSims4Packs()
    const filtered = packs.filter((p) => p.id !== id)
    writeLocalSims4Packs(filtered)

    revalidatePath('/games/the-sims-4')
    revalidatePath('/the-sims-4')
    return { success: true }
  } catch (err: any) {
    console.error('Local deleteSims4Pack error:', err)
    return { success: false, error: err.message || 'Failed to delete sims 4 pack' }
  }
}

// ==========================================
// 📁 3. FILE UPLOADS
// ==========================================

export async function uploadLocalFile(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  await verifyAuthOrThrow()
  try {
    const file = formData.get('file') as File
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    const ext = path.extname(file.name)
    const safeBaseName = path.basename(file.name, ext).replace(/[^a-zA-Z0-9_-]/g, '_')
    const uniqueName = `${Date.now()}-${safeBaseName || 'file'}${ext}`
    const filePath = path.join(uploadDir, uniqueName)

    fs.writeFileSync(filePath, buffer)
    return { success: true, url: `/uploads/${uniqueName}` }
  } catch (err: any) {
    console.error('Local upload error:', err)
    return { success: false, error: err.message || 'Failed to save file locally' }
  }
}

// ==========================================
// 👥 4. TEAM POOL ACTIONS
// ==========================================

export interface TeamPoolMember {
  name: string
  avatar: string
  link?: string
  url?: string
}

function getLocalTeamPool(): TeamPoolMember[] {
  try {
    if (!fs.existsSync(TEAM_POOL_PATH)) {
      fs.mkdirSync(path.dirname(TEAM_POOL_PATH), { recursive: true })
      fs.writeFileSync(TEAM_POOL_PATH, JSON.stringify(defaultTeamPool, null, 2), 'utf-8')
      return defaultTeamPool as TeamPoolMember[]
    }
    const data = fs.readFileSync(TEAM_POOL_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading team pool:', error)
    return defaultTeamPool as TeamPoolMember[]
  }
}

function writeLocalTeamPool(pool: TeamPoolMember[]) {
  try {
    fs.mkdirSync(path.dirname(TEAM_POOL_PATH), { recursive: true })
    fs.writeFileSync(TEAM_POOL_PATH, JSON.stringify(pool, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing team pool:', error)
  }
}

export async function getTeamPool(): Promise<TeamPoolMember[]> {
  return getLocalTeamPool()
}

export async function addTeamMemberToPool(member: TeamPoolMember): Promise<{ success: boolean; data?: TeamPoolMember; error?: string }> {
  await verifyAuthOrThrow()
  try {
    const pool = getLocalTeamPool()
    const idx = pool.findIndex((m) => m.name.toLowerCase() === member.name.toLowerCase())
    const memberData: TeamPoolMember = {
      name: member.name.trim(),
      avatar: member.avatar?.trim() || '',
      link: member.link?.trim() || member.url?.trim() || '',
      url: member.link?.trim() || member.url?.trim() || '',
    }
    if (idx !== -1) {
      pool[idx] = memberData
    } else {
      pool.push(memberData)
    }
    writeLocalTeamPool(pool)
    return { success: true, data: memberData }
  } catch (err: any) {
    console.error('Local addTeamMemberToPool error:', err)
    return { success: false, error: err.message || 'Failed to save to local team pool' }
  }
}

export async function updateTeamMemberInPool(oldName: string, member: TeamPoolMember): Promise<{ success: boolean; data?: TeamPoolMember; error?: string }> {
  await verifyAuthOrThrow()
  try {
    const pool = getLocalTeamPool()
    const targetIdx = pool.findIndex((m) => m.name.toLowerCase() === oldName.toLowerCase())
    if (targetIdx === -1) {
      return { success: false, error: `ไม่พบรายชื่อ "${oldName}" ในคลัง` }
    }

    // If changing name, check if duplicate with another member
    if (oldName.toLowerCase() !== member.name.toLowerCase()) {
      const duplicateIdx = pool.findIndex((m) => m.name.toLowerCase() === member.name.toLowerCase())
      if (duplicateIdx !== -1 && duplicateIdx !== targetIdx) {
        return { success: false, error: `มีรายชื่อ "${member.name}" ในคลังอยู่แล้ว` }
      }
    }

    const updatedData: TeamPoolMember = {
      name: member.name.trim(),
      avatar: member.avatar?.trim() || '',
      link: member.link?.trim() || member.url?.trim() || '',
      url: member.link?.trim() || member.url?.trim() || '',
    }

    pool[targetIdx] = updatedData
    writeLocalTeamPool(pool)

    // Propagate changes to any game where this member is referenced
    try {
      const games = getLocalGames()
      let gamesModified = false
      for (const game of games) {
        if (game.team && Array.isArray(game.team)) {
          for (const m of game.team) {
            if (m.name.toLowerCase() === oldName.toLowerCase()) {
              m.name = updatedData.name
              if (updatedData.avatar) m.avatar = updatedData.avatar
              if (updatedData.link) m.link = updatedData.link
              gamesModified = true
            }
          }
        }
      }
      if (gamesModified) {
        writeLocalGames(games)
      }
    } catch (e) {
      console.warn('Could not propagate team member update to games:', e)
    }

    return { success: true, data: updatedData }
  } catch (err: any) {
    console.error('Local updateTeamMemberInPool error:', err)
    return { success: false, error: err.message || 'Failed to update team pool member' }
  }
}

export async function deleteTeamMemberFromPool(name: string): Promise<{ success: boolean; error?: string }> {
  await verifyAuthOrThrow()
  try {
    const pool = getLocalTeamPool()
    const filtered = pool.filter((m) => m.name.toLowerCase() !== name.toLowerCase())
    writeLocalTeamPool(filtered)
    return { success: true }
  } catch (err: any) {
    console.error('Local deleteTeamMemberFromPool error:', err)
    return { success: false, error: err.message || 'Failed to delete from local team pool' }
  }
}

// ==========================================
// 🌐 5. SITE SETTINGS & SOCIAL CHANNELS
// ==========================================

function getLocalSettings(): SiteSettings {
  try {
    if (!fs.existsSync(SETTINGS_FILE_PATH)) {
      fs.mkdirSync(path.dirname(SETTINGS_FILE_PATH), { recursive: true })
      fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(defaultSettings, null, 2), 'utf-8')
      return defaultSettings as SiteSettings
    }
    const data = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8')
    return JSON.parse(data) as SiteSettings
  } catch (error) {
    console.error('Error reading settings:', error)
    return defaultSettings as SiteSettings
  }
}

function writeLocalSettings(settings: SiteSettings) {
  try {
    fs.mkdirSync(path.dirname(SETTINGS_FILE_PATH), { recursive: true })
    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(settings, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing settings:', error)
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return getLocalSettings()
}

export async function updateSiteSettings(settings: SiteSettings): Promise<{ success: boolean; data?: SiteSettings; error?: string }> {
  await verifyAuthOrThrow()
  try {
    writeLocalSettings(settings)
    revalidatePath('/')
    revalidatePath('/admin')
    return { success: true, data: settings }
  } catch (err: any) {
    console.error('Error updating site settings:', err)
    return { success: false, error: err.message || 'Failed to update site settings' }
  }
}

