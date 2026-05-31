'use server'

import fs from 'fs'
import path from 'path'
import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
import { Game } from '@/lib/types'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
import { games as initialGames } from '@/lib/games-data'

const JSON_FILE_PATH = path.join(process.cwd(), 'src/lib/games-db.json')

// Auth helper: Validate session cookie or throw error
async function verifyAuthOrThrow() {
  const cookieStore = await cookies()
  if (cookieStore.get('admin_session')?.value !== 'authenticated') {
    throw new Error('Unauthorized: กรุณาเข้าสู่ระบบก่อนดำเนินการ')
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

// Helper: Read local games from JSON file
function getLocalGames(): Game[] {
  try {
    if (!fs.existsSync(JSON_FILE_PATH)) {
      // Ensure directory exists
      fs.mkdirSync(path.dirname(JSON_FILE_PATH), { recursive: true })
      fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(initialGames, null, 2), 'utf-8')
      return initialGames
    }
    const data = fs.readFileSync(JSON_FILE_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading local games:', error)
    return initialGames
  }
}

// Helper: Write local games to JSON file
function writeLocalGames(games: Game[]) {
  try {
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(games, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing local games:', error)
  }
}

// Mapper: Database rows (snake_case) to Frontend model (camelCase)
function mapDbToGame(dbRow: any): Game {
  return {
    id: Number(dbRow.id),
    slug: dbRow.slug,
    title: dbRow.title,
    genre: dbRow.genre,
    emoji: dbRow.emoji,
    status: dbRow.status,
    progress: dbRow.progress,
    version: dbRow.version,
    client: dbRow.client,
    translationVersion: dbRow.translation_version || dbRow.translationVersion,
    shortDescription: dbRow.short_description || dbRow.shortDescription,
    description: dbRow.description,
    overview: dbRow.overview,
    translationScope: dbRow.translation_scope || dbRow.translationScope || [],
    videoUrl: dbRow.video_url || dbRow.videoUrl || '',
    coverImage: dbRow.cover_image || dbRow.coverImage || '',
    posterImage: dbRow.poster_image || dbRow.posterImage || '',
    fileSize: dbRow.file_size || dbRow.fileSize || '',
    team: dbRow.team || [],
    downloads: dbRow.downloads || [],
    instructions: dbRow.instructions || [],
    updatedAt: dbRow.updated_at || dbRow.updatedAt || '',
  }
}

// Mapper: Frontend model (camelCase) to Database row (snake_case)
function mapGameToDb(game: Partial<Game>): any {
  const dbRow: any = {}
  if (game.id !== undefined) dbRow.id = game.id
  if (game.slug !== undefined) dbRow.slug = game.slug
  if (game.title !== undefined) dbRow.title = game.title
  if (game.genre !== undefined) dbRow.genre = game.genre
  if (game.emoji !== undefined) dbRow.emoji = game.emoji
  if (game.status !== undefined) dbRow.status = game.status
  if (game.progress !== undefined) dbRow.progress = game.progress
  if (game.version !== undefined) dbRow.version = game.version
  if (game.client !== undefined) dbRow.client = game.client
  if (game.translationVersion !== undefined) dbRow.translation_version = game.translationVersion
  if (game.shortDescription !== undefined) dbRow.short_description = game.shortDescription
  if (game.description !== undefined) dbRow.description = game.description
  if (game.overview !== undefined) dbRow.overview = game.overview
  if (game.translationScope !== undefined) dbRow.translation_scope = game.translationScope
  if (game.videoUrl !== undefined) dbRow.video_url = game.videoUrl
  if (game.coverImage !== undefined) dbRow.cover_image = game.coverImage
  if (game.posterImage !== undefined) dbRow.poster_image = game.posterImage
  if (game.fileSize !== undefined) dbRow.file_size = game.fileSize
  if (game.team !== undefined) dbRow.team = game.team
  if (game.downloads !== undefined) dbRow.downloads = game.downloads
  if (game.instructions !== undefined) dbRow.instructions = game.instructions
  if (game.updatedAt !== undefined) dbRow.updated_at = game.updatedAt
  return dbRow
}

// Action: Fetch all games
export async function getGames(): Promise<Game[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .order('id', { ascending: true })

      if (error) throw error
      return (data || []).map(mapDbToGame)
    } catch (err) {
      console.error('Supabase getGames error, falling back to local:', err)
      return getLocalGames()
    }
  }
  return getLocalGames()
}

// Action: Fetch a single game by slug
export async function getGameBySlug(slug: string): Promise<Game | null> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('games')
        .select('*')
        .eq('slug', slug)
        .maybeSingle()

      if (error) throw error
      return data ? mapDbToGame(data) : null
    } catch (err) {
      console.error(`Supabase getGameBySlug(${slug}) error, falling back to local:`, err)
    }
  }
  const localGames = getLocalGames()
  return localGames.find((g) => g.slug === slug) || null
}

// Action: Create a new game
export async function createGame(gameData: Omit<Game, 'id'>): Promise<{ success: boolean; data?: Game; error?: string }> {
  await verifyAuthOrThrow()
  if (isSupabaseConfigured()) {
    try {
      const dbRow = mapGameToDb(gameData)
      const { data, error } = await supabase
        .from('games')
        .insert([dbRow])
        .select()
        .single()

      if (error) throw error
      
      revalidatePath('/')
      revalidatePath('/completed')
      revalidatePath('/in-progress')
      revalidatePath(`/games/${gameData.slug}`)
      return { success: true, data: mapDbToGame(data) }
    } catch (err: any) {
      console.error('Supabase createGame error:', err)
      return { success: false, error: err.message || 'Unknown database error' }
    }
  }

  // Fallback mode
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

// Action: Update a game by ID
export async function updateGame(id: number, gameData: Partial<Game>): Promise<{ success: boolean; data?: Game; error?: string }> {
  await verifyAuthOrThrow()
  if (isSupabaseConfigured()) {
    try {
      const dbRow = mapGameToDb(gameData)
      const { data, error } = await supabase
        .from('games')
        .update(dbRow)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      
      const updatedGame = mapDbToGame(data)
      revalidatePath('/')
      revalidatePath('/completed')
      revalidatePath('/in-progress')
      revalidatePath(`/games/${updatedGame.slug}`)
      return { success: true, data: updatedGame }
    } catch (err: any) {
      console.error('Supabase updateGame error:', err)
      return { success: false, error: err.message || 'Unknown database error' }
    }
  }

  // Fallback mode
  try {
    const localGames = getLocalGames()
    const idx = localGames.findIndex((g) => g.id === id)
    if (idx === -1) {
      return { success: false, error: 'Game not found in local database' }
    }

    const updatedGame: Game = {
      ...localGames[idx],
      ...gameData,
      id, // Preserve ID
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

// Action: Delete a game by ID
export async function deleteGame(id: number): Promise<{ success: boolean; error?: string }> {
  await verifyAuthOrThrow()
  if (isSupabaseConfigured()) {
    try {
      // Find game first to get its slug for path revalidation
      const { data: gameToDelete } = await supabase
        .from('games')
        .select('slug')
        .eq('id', id)
        .maybeSingle()

      const { error } = await supabase
        .from('games')
        .delete()
        .eq('id', id)

      if (error) throw error

      revalidatePath('/')
      revalidatePath('/completed')
      revalidatePath('/in-progress')
      if (gameToDelete) {
        revalidatePath(`/games/${gameToDelete.slug}`)
      }
      return { success: true }
    } catch (err: any) {
      console.error('Supabase deleteGame error:', err)
      return { success: false, error: err.message || 'Unknown database error' }
    }
  }

  // Fallback mode
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

// Action: Handle local file uploads in local JSON mode
export async function uploadLocalFile(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  await verifyAuthOrThrow()
  try {
    const file = formData.get('file') as File
    if (!file) {
      return { success: false, error: 'No file provided' }
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Ensure public/uploads directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    // Generate unique name
    const ext = path.extname(file.name)
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`
    const filePath = path.join(uploadDir, uniqueName)

    fs.writeFileSync(filePath, buffer)
    return { success: true, url: `/uploads/${uniqueName}` }
  } catch (err: any) {
    console.error('Local upload error:', err)
    return { success: false, error: err.message || 'Failed to save file locally' }
  }
}

const TEAM_POOL_PATH = path.join(process.cwd(), 'src/lib/team-pool.json')

interface TeamPoolMember {
  name: string
  avatar: string
}

// Helper: Read local team members pool
function getLocalTeamPool(): TeamPoolMember[] {
  try {
    if (!fs.existsSync(TEAM_POOL_PATH)) {
      const initialPool = [
        {
          name: 'แปลเกมสู่ฝัน',
          avatar: 'https://flvgoyaloxrvxrovtapf.supabase.co/storage/v1/object/public/game-assets/1779715288723-az8rruz.jpg'
        },
        {
          name: 'SimmerTH',
          avatar: ''
        },
        {
          name: 'NoØnetranslator',
          avatar: ''
        }
      ]
      fs.mkdirSync(path.dirname(TEAM_POOL_PATH), { recursive: true })
      fs.writeFileSync(TEAM_POOL_PATH, JSON.stringify(initialPool, null, 2), 'utf-8')
      return initialPool
    }
    const data = fs.readFileSync(TEAM_POOL_PATH, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error reading team pool:', error)
    return []
  }
}

// Helper: Write local team members pool
function writeLocalTeamPool(pool: TeamPoolMember[]) {
  try {
    fs.writeFileSync(TEAM_POOL_PATH, JSON.stringify(pool, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing team pool:', error)
  }
}

// Action: Fetch all team pool members
export async function getTeamPool(): Promise<TeamPoolMember[]> {
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('name, avatar')
        .order('name', { ascending: true })

      if (error) throw error
      return data || []
    } catch (err) {
      console.error('Supabase getTeamPool error, falling back to local:', err)
      return getLocalTeamPool()
    }
  }
  return getLocalTeamPool()
}

// Action: Add a team member to the pool
export async function addTeamMemberToPool(member: TeamPoolMember): Promise<{ success: boolean; data?: TeamPoolMember; error?: string }> {
  await verifyAuthOrThrow()
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .upsert({ name: member.name, avatar: member.avatar }, { onConflict: 'name' })
        .select()
        .single()

      if (error) throw error
      return { success: true, data: { name: data.name, avatar: data.avatar } }
    } catch (err: any) {
      console.error('Supabase addTeamMemberToPool error:', err)
    }
  }

  try {
    const pool = getLocalTeamPool()
    const idx = pool.findIndex((m) => m.name.toLowerCase() === member.name.toLowerCase())
    if (idx !== -1) {
      pool[idx].avatar = member.avatar
    } else {
      pool.push(member)
    }
    writeLocalTeamPool(pool)
    return { success: true, data: member }
  } catch (err: any) {
    console.error('Local addTeamMemberToPool error:', err)
    return { success: false, error: err.message || 'Failed to save to local team pool' }
  }
}

// Action: Delete a team member from the pool
export async function deleteTeamMemberFromPool(name: string): Promise<{ success: boolean; error?: string }> {
  await verifyAuthOrThrow()
  if (isSupabaseConfigured()) {
    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('name', name)

      if (error) throw error
      return { success: true }
    } catch (err: any) {
      console.error('Supabase deleteTeamMemberFromPool error:', err)
    }
  }

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
