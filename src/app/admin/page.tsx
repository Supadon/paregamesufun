'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, Plus, Edit2, Trash2, Check, X, 
  Loader2, Sparkles, Database, FileCode, CheckCircle, Info,
  Users, UserPlus, Trash
} from 'lucide-react'
import { Game, GameStatus, TeamMember, DownloadLink, GameModule, InstructionStep } from '@/lib/types'
import { 
  getGames, createGame, updateGame, deleteGame, uploadLocalFile,
  checkAdminSession, verifyAdminPassword, logoutAdmin,
  getTeamPool, addTeamMemberToPool, deleteTeamMemberFromPool
} from '@/app/actions/games'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'

export default function AdminPage() {
  const router = useRouter()
  const [games, setGames] = useState<Game[]>([])
  const [loading, setLoading] = useState(true)
  const [dbMode, setDbMode] = useState<'supabase' | 'local'>('local')
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const [passwordInput, setPasswordInput] = useState('')
  const [authError, setAuthError] = useState('')
  const [verifying, setVerifying] = useState(false)
  
  // Team pool state
  const [teamPool, setTeamPool] = useState<{ name: string; avatar: string }[]>([])
  const [isPoolModalOpen, setIsPoolModalOpen] = useState(false)
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberAvatar, setNewMemberAvatar] = useState('')
  const [savingMember, setSavingMember] = useState(false)

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingGame, setEditingGame] = useState<Game | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [showCustomGenre, setShowCustomGenre] = useState(false)
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [genre, setGenre] = useState('')
  const [emoji, setEmoji] = useState('')
  const [status, setStatus] = useState<GameStatus>('wip')
  const [translateProgress, setTranslateProgress] = useState(0)
  const [proofreadProgress, setProofreadProgress] = useState(0)
  const [testProgress, setTestProgress] = useState(0)
  const [version, setVersion] = useState('')
  const [client, setClient] = useState('')
  const [translationVersion, setTranslationVersion] = useState('')
  const [fileSize, setFileSize] = useState('')
  const [videoUrl, setVideoUrl] = useState('')
  const [coverImage, setCoverImage] = useState('')
  const [posterImage, setPosterImage] = useState('')
  const [shortDescription, setShortDescription] = useState('')
  const [description, setDescription] = useState('')
  const [overview, setOverview] = useState('')
  const [translationScope, setTranslationScope] = useState('')
  const [team, setTeam] = useState<TeamMember[]>([{ name: '', role: '', avatar: '' }])
  const [downloads, setDownloads] = useState<DownloadLink[]>([{ label: '', url: '', type: 'primary' }])
  const [isMultiModule, setIsMultiModule] = useState(false)
  const [modules, setModules] = useState<GameModule[]>([{ name: '', progress: 0 }])
  const [instructions, setInstructions] = useState<InstructionStep[]>([{ text: '', image: '' }])
  const [sheetUrl, setSheetUrl] = useState('')

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3000)
  }

  // Check auth and load games on mount
  useEffect(() => {
    async function loadData() {
      try {
        const authenticated = await checkAdminSession()
        setIsAuthenticated(authenticated)
        if (authenticated) {
          const data = await getGames()
          setGames(data)
          const configured = isSupabaseConfigured()
          setDbMode(configured ? 'supabase' : 'local')
          
          // Load team pool
          const poolData = await getTeamPool()
          setTeamPool(poolData)
        }
      } catch (err) {
        console.error('Failed to load initial data:', err)
        setIsAuthenticated(false)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordInput) return
    
    setVerifying(true)
    setAuthError('')
    
    try {
      const res = await verifyAdminPassword(passwordInput)
      if (res.success) {
        setIsAuthenticated(true)
        showToast('เข้าสู่ระบบสำเร็จ!', 'success')
        
        // Load games
        setLoading(true)
        const data = await getGames()
        setGames(data)
        const configured = isSupabaseConfigured()
        setDbMode(configured ? 'supabase' : 'local')
        
        // Load team pool
        const poolData = await getTeamPool()
        setTeamPool(poolData)
      } else {
        setAuthError(res.error || 'รหัสผ่านไม่ถูกต้อง')
      }
    } catch (err) {
      setAuthError('เกิดข้อผิดพลาดในการตรวจสอบรหัสผ่าน')
    } finally {
      setVerifying(false)
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await logoutAdmin()
      setIsAuthenticated(false)
      setPasswordInput('')
      showToast('ออกจากระบบเรียบร้อย', 'success')
    } catch (err) {
      showToast('ไม่สามารถออกจากระบบได้', 'error')
    }
  }

  const handleAddMemberToPool = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMemberName.trim()) {
      showToast('กรุณากรอกชื่อผู้จัดทำ', 'error')
      return
    }
    setSavingMember(true)
    try {
      const res = await addTeamMemberToPool({
        name: newMemberName.trim(),
        avatar: newMemberAvatar.trim()
      })
      if (res.success && res.data) {
        // Update pool list
        const existsIdx = teamPool.findIndex(m => m.name.toLowerCase() === res.data!.name.toLowerCase())
        if (existsIdx !== -1) {
          const updated = [...teamPool]
          updated[existsIdx] = res.data!
          setTeamPool(updated)
        } else {
          setTeamPool([...teamPool, res.data!])
        }
        setNewMemberName('')
        setNewMemberAvatar('')
        showToast('บันทึกข้อมูลสมาชิกเข้าคลังเรียบร้อย', 'success')
      } else {
        throw new Error(res.error || 'เกิดข้อผิดพลาดในการบันทึก')
      }
    } catch (err: any) {
      showToast(err.message || 'บันทึกไม่สำเร็จ', 'error')
    } finally {
      setSavingMember(false)
    }
  }

  const handleDeleteMemberFromPool = async (name: string) => {
    if (!confirm(`คุณแน่ใจว่าต้องการลบ "${name}" ออกจากคลังรายชื่อทีมงาน?`)) return
    try {
      const res = await deleteTeamMemberFromPool(name)
      if (res.success) {
        setTeamPool(teamPool.filter(m => m.name !== name))
        showToast('ลบสมาชิกออกจากคลังเรียบร้อย', 'success')
      } else {
        throw new Error(res.error)
      }
    } catch (err: any) {
      showToast(err.message || 'ลบไม่สำเร็จ', 'error')
    }
  }

  const handleMemberAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      showToast('กำลังอัปโหลดรูปโปรไฟล์...', 'success')
      
      let imageUrl = ''
      if (dbMode === 'supabase') {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        const filePath = `${fileName}`

        const { data, error } = await supabase.storage
          .from('game-assets')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          throw new Error(error.message)
        }

        const { data: urlData } = supabase.storage
          .from('game-assets')
          .getPublicUrl(filePath)

        imageUrl = urlData.publicUrl
      } else {
        const formData = new FormData()
        formData.append('file', file)

        const res = await uploadLocalFile(formData)
        if (res.success && res.url) {
          imageUrl = res.url
        } else {
          throw new Error(res.error || 'ไม่สามารถบันทึกไฟล์บนเครื่องได้')
        }
      }

      setNewMemberAvatar(imageUrl)
      showToast('อัปโหลดสำเร็จ!', 'success')
    } catch (err: any) {
      console.error(err)
      showToast(err.message || 'เกิดข้อผิดพลาดในการอัปโหลด', 'error')
    }
  }

  // Auto slug generation
  useEffect(() => {
    if (!editingGame && title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // remove special characters
        .trim()
        .replace(/\s+/g, '-') // replace spaces with hyphens
      setSlug(generatedSlug)
    }
  }, [title, editingGame])

  const openAddModal = () => {
    setEditingGame(null)
    setTitle('')
    setSlug('')
    setGenre('')
    setShowCustomGenre(false)
    setEmoji('')
    setStatus('wip')
    setTranslateProgress(0)
    setProofreadProgress(0)
    setTestProgress(0)
    setVersion('')
    setClient('Steam')
    setTranslationVersion('1.0')
    setFileSize('')
    setVideoUrl('')
    setCoverImage('')
    setPosterImage('')
    setShortDescription('')
    setDescription('')
    setOverview('')
    setTranslationScope('')
    setTeam([{ name: '', role: '', avatar: '' }])
    setDownloads([{ label: 'Download', url: '', type: 'primary' }])
    setIsMultiModule(false)
    setModules([{ name: '', progress: 0 }])
    setInstructions([{ text: '', image: '' }])
    setSheetUrl('')
    setIsModalOpen(true)
  }

  const openEditModal = (game: Game) => {
    setEditingGame(game)
    setTitle(game.title)
    setSlug(game.slug)
    setGenre(game.genre)
    const uniqueGenres = Array.from(new Set(games.map(g => g.genre))).filter(Boolean)
    if (game.genre && !uniqueGenres.includes(game.genre)) {
      setShowCustomGenre(true)
    } else {
      setShowCustomGenre(false)
    }
    setEmoji(game.emoji)
    setStatus(game.status)
    setTranslateProgress(game.progress.translate)
    setProofreadProgress(game.progress.proofread)
    setTestProgress(game.progress.test)
    setVersion(game.version)
    setClient(game.client)
    setTranslationVersion(game.translationVersion)
    setFileSize(game.fileSize || '')
    setVideoUrl(game.videoUrl || '')
    setCoverImage(game.coverImage || '')
    setPosterImage(game.posterImage || '')
    setShortDescription(game.shortDescription)
    setDescription(game.description)
    setOverview(game.overview)
    setTranslationScope(game.translationScope.join(', '))
    setTeam(game.team.length > 0 ? game.team : [{ name: '', role: '', avatar: '' }])
    setDownloads(game.downloads.length > 0 ? game.downloads : [{ label: 'Download', url: '', type: 'primary' }])
    if (game.progress.isMultiModule && game.progress.modules) {
      setIsMultiModule(true)
      setModules(game.progress.modules.length > 0 ? game.progress.modules : [{ name: '', progress: 0 }])
    } else {
      setIsMultiModule(false)
      setModules([{ name: '', progress: 0 }])
    }
    setInstructions(game.instructions && game.instructions.length > 0 ? game.instructions : [{ text: '', image: '' }])
    setSheetUrl(game.progress.sheetUrl || '')
    setIsModalOpen(true)
  }

  const handleAddModule = () => {
    setModules([...modules, { name: '', progress: 0 }])
  }

  const handleRemoveModule = (index: number) => {
    const newModules = [...modules]
    newModules.splice(index, 1)
    setModules(newModules)
  }

  const handleModuleChange = (index: number, field: keyof GameModule, value: string | number) => {
    const newModules = [...modules]
    if (field === 'progress') {
      newModules[index].progress = Number(value)
    } else {
      newModules[index].name = String(value)
    }
    setModules(newModules)
  }

  // Dynamic Array Handlers
  const handleAddTeamMember = () => {
    setTeam([...team, { name: '', role: '', avatar: '' }])
  }

  const handleRemoveTeamMember = (index: number) => {
    const newTeam = [...team]
    newTeam.splice(index, 1)
    setTeam(newTeam)
  }

  const handleTeamMemberChange = (index: number, field: keyof TeamMember, value: string) => {
    const newTeam = [...team]
    newTeam[index][field] = value
    setTeam(newTeam)
  }

  const handleAddDownload = () => {
    setDownloads([...downloads, { label: '', url: '', type: 'secondary' }])
  }

  const handleRemoveDownload = (index: number) => {
    const newDownloads = [...downloads]
    newDownloads.splice(index, 1)
    setDownloads(newDownloads)
  }

  const handleDownloadChange = (index: number, field: keyof DownloadLink, value: string) => {
    const newDownloads = [...downloads]
    if (field === 'type') {
      newDownloads[index].type = value as 'primary' | 'secondary'
    } else {
      newDownloads[index][field] = value
    }
    setDownloads(newDownloads)
  }

  const handleAddInstructionStep = () => {
    setInstructions([...instructions, { text: '', image: '' }])
  }

  const handleRemoveInstructionStep = (index: number) => {
    const newSteps = [...instructions]
    newSteps.splice(index, 1)
    setInstructions(newSteps)
  }

  const handleInstructionStepChange = (index: number, field: keyof InstructionStep, value: string) => {
    const newSteps = [...instructions]
    newSteps[index][field] = value
    setInstructions(newSteps)
  }

  const handleInstructionImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      showToast('กำลังอัปโหลดรูปภาพวิธีการติดตั้ง...', 'success')
      
      let imageUrl = ''
      if (dbMode === 'supabase') {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        const filePath = `${fileName}`

        const { data, error } = await supabase.storage
          .from('game-assets')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          throw new Error(error.message + ' (โปรดตรวจสอบว่าได้สร้าง bucket storage "game-assets" และสิทธิ์ RLS แล้วหรือยัง)')
        }

        const { data: urlData } = supabase.storage
          .from('game-assets')
          .getPublicUrl(filePath)

        imageUrl = urlData.publicUrl
      } else {
        const formData = new FormData()
        formData.append('file', file)

        const res = await uploadLocalFile(formData)
        if (res.success && res.url) {
          imageUrl = res.url
        } else {
          throw new Error(res.error || 'ไม่สามารถบันทึกไฟล์บนเครื่องได้')
        }
      }

      const newSteps = [...instructions]
      newSteps[index].image = imageUrl
      setInstructions(newSteps)
      showToast('อัปโหลดรูปภาพเสร็จสิ้น!', 'success')
    } catch (err: any) {
      console.error(err)
      showToast(err.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ', 'error')
    }
  }

  // Handle File Uploads (Supports Supabase Storage & Local Public Uploads fallback)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'poster' | 'cover') => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      showToast('กำลังอัปโหลดรูปภาพ...', 'success')
      
      let imageUrl = ''
      if (dbMode === 'supabase') {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        const filePath = `${fileName}`

        // Upload directly to Supabase Storage Bucket
        const { data, error } = await supabase.storage
          .from('game-assets')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          throw new Error(error.message + ' (โปรดตรวจสอบว่าได้รัน SQL สำหรับ Storage bucket และเปิดนโยบาย RLS แล้วหรือยัง)')
        }

        const { data: urlData } = supabase.storage
          .from('game-assets')
          .getPublicUrl(filePath)

        imageUrl = urlData.publicUrl
      } else {
        // Local Fallback Upload mode
        const formData = new FormData()
        formData.append('file', file)

        const res = await uploadLocalFile(formData)
        if (res.success && res.url) {
          imageUrl = res.url
        } else {
          throw new Error(res.error || 'ไม่สามารถบันทึกไฟล์บนเครื่องได้')
        }
      }

      if (target === 'poster') {
        setPosterImage(imageUrl)
      } else {
        setCoverImage(imageUrl)
      }
      showToast('อัปโหลดสำเร็จ!', 'success')
    } catch (err: any) {
      console.error(err)
      showToast(err.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ', 'error')
    }
  }

  const handleTeamMemberAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      showToast('กำลังอัปโหลดรูปโปรไฟล์...', 'success')
      
      let imageUrl = ''
      if (dbMode === 'supabase') {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`
        const filePath = `${fileName}`

        const { data, error } = await supabase.storage
          .from('game-assets')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          })

        if (error) {
          throw new Error(error.message + ' (โปรดตรวจสอบว่าได้รัน SQL สำหรับ Storage bucket และเปิดนโยบาย RLS แล้วหรือยัง)')
        }

        const { data: urlData } = supabase.storage
          .from('game-assets')
          .getPublicUrl(filePath)

        imageUrl = urlData.publicUrl
      } else {
        const formData = new FormData()
        formData.append('file', file)

        const res = await uploadLocalFile(formData)
        if (res.success && res.url) {
          imageUrl = res.url
        } else {
          throw new Error(res.error || 'ไม่สามารถบันทึกไฟล์บนเครื่องได้')
        }
      }

      const newTeam = [...team]
      newTeam[index].avatar = imageUrl
      setTeam(newTeam)
      showToast('อัปโหลดรูปโปรไฟล์สำเร็จ!', 'success')
    } catch (err: any) {
      console.error(err)
      showToast(err.message || 'เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ', 'error')
    }
  }

  // Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !slug || !genre) {
      showToast('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน', 'error')
      return
    }

    setSubmitting(true)

    // Clean dynamic inputs
    const cleanedTeam = team.filter((m) => m.name.trim() !== '')
    const cleanedDownloads = downloads.filter((d) => d.label.trim() !== '' && d.url.trim() !== '')
    const parsedScope = translationScope
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '')

    const cleanedModules = modules.filter((m) => m.name.trim() !== '')
    let overallAverage = 0
    if (isMultiModule && cleanedModules.length > 0) {
      const total = cleanedModules.reduce((sum, m) => sum + m.progress, 0)
      overallAverage = Math.round(total / cleanedModules.length)
    }

    const gamePayload = {
      slug,
      title,
      genre,
      emoji: emoji.trim() || '🎮',
      status,
      progress: isMultiModule
        ? {
            isMultiModule: true,
            modules: cleanedModules,
            translate: overallAverage,
            proofread: overallAverage,
            test: overallAverage,
          }
        : {
            isMultiModule: false,
            translate: Number(translateProgress),
            proofread: Number(proofreadProgress),
            test: Number(testProgress),
            sheetUrl: sheetUrl.trim() || undefined,
          },
      version,
      client,
      translationVersion,
      shortDescription,
      description,
      overview,
      translationScope: parsedScope,
      videoUrl: videoUrl.trim(),
      coverImage: coverImage.trim(),
      posterImage: posterImage.trim(),
      fileSize: fileSize.trim(),
      team: cleanedTeam,
      downloads: cleanedDownloads,
      instructions: instructions.filter((step) => step.text.trim() !== ''),
      updatedAt: new Date().toISOString().split('T')[0],
    }

    try {
      if (editingGame) {
        const res = await updateGame(editingGame.id, gamePayload)
        if (res.success && res.data) {
          setGames(games.map((g) => (g.id === editingGame.id ? res.data! : g)))
          showToast('แก้ไขข้อมูลการ์ดเกมเรียบร้อยแล้ว', 'success')
        } else {
          throw new Error(res.error)
        }
      } else {
        const res = await createGame(gamePayload)
        if (res.success && res.data) {
          setGames([...games, res.data])
          showToast('เพิ่มการ์ดเกมใหม่เรียบร้อยแล้ว', 'success')
        } else {
          throw new Error(res.error)
        }
      }
      setIsModalOpen(false)
      router.refresh()
    } catch (err: any) {
      console.error(err)
      showToast(err.message || 'เกิดข้อผิดพลาดในการบันทึกข้อมูล', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  // Delete Action
  const handleDelete = async (id: number) => {
    if (!confirm('คุณแน่ใจหรือไม่ว่าต้องการลบการ์ดเกมนี้? การดำเนินการนี้ไม่สามารถย้อนกลับได้')) return

    try {
      const res = await deleteGame(id)
      if (res.success) {
        setGames(games.filter((g) => g.id !== id))
        showToast('ลบการ์ดเกมเรียบร้อยแล้ว', 'success')
        router.refresh()
      } else {
        throw new Error(res.error)
      }
    } catch (err: any) {
      console.error(err)
      showToast(err.message || 'ไม่สามารถลบการ์ดเกมได้', 'error')
    }
  }

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen text-text1 bg-bg0 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-text3 text-sm">
          <Loader2 className="animate-spin text-blue3" size={32} />
          <span>กำลังตรวจสอบสิทธิ์การเข้าใช้งาน...</span>
        </div>
      </div>
    )
  }

  if (isAuthenticated === false) {
    return (
      <div className="min-h-screen bg-bg0 text-text1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Glow background effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue/10 rounded-full filter blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full filter blur-[120px] pointer-events-none" />
        
        <div className="max-w-[420px] w-full relative z-10">
          <div className="mb-6 text-center">
            <Link href="/" className="inline-flex items-center gap-1.5 text-text2 hover:text-blue3 text-xs transition-colors mb-4 font-bold">
              <ArrowLeft size={12} />
              กลับหน้าหลัก
            </Link>
          </div>
          
          <div className="backdrop-blur-xl bg-bg1/40 border border-white/10 rounded-3xl p-8 shadow-2xl flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-2xl bg-blue/10 border border-blue2/20 flex items-center justify-center text-blue3 mb-5 shadow-[0_0_20px_rgba(43,95,255,0.15)]">
              <Database size={24} />
            </div>
            
            <h2 className="text-2xl font-black text-white leading-tight">Admin Authentication</h2>
            <p className="text-[12px] text-text3 mt-2 leading-relaxed">
              พื้นที่นี้ได้รับการป้องกันไว้เฉพาะผู้ดูแลระบบเท่านั้น กรุณากรอกรหัสผ่านเพื่อเข้าใช้งานแดชบอร์ด
            </p>
            
            <form onSubmit={handleLoginSubmit} className="w-full mt-6 space-y-4">
              <div className="relative">
                <input 
                  type="password" 
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value)
                    if (authError) setAuthError('')
                  }}
                  required
                  placeholder="ป้อนรหัสผ่านผู้ดูแลระบบ"
                  className="w-full px-5 py-3 rounded-2xl bg-bg2/40 border border-white/5 focus:border-blue2 focus:outline-none text-sm text-text1 transition-all text-center placeholder:text-text3/50"
                  disabled={verifying}
                />
              </div>
              
              {authError && (
                <div className="text-[11px] text-rose-400 font-bold bg-rose-500/10 border border-rose-500/20 px-3 py-2 rounded-xl">
                  {authError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={verifying}
                className="w-full py-3 rounded-2xl font-bold text-white bg-gradient-to-r from-blue via-blue2 to-blue3 hover:scale-[1.01] shadow-[0_4px_15px_rgba(43,95,255,0.25)] hover:shadow-[0_6px_25px_rgba(43,95,255,0.45)] transition-all flex items-center justify-center gap-2"
              >
                {verifying ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    กำลังตรวจสอบ...
                  </>
                ) : (
                  <>
                    เข้าสู่ระบบด้วยรหัสผ่าน
                  </>
                )}
              </button>
            </form>
            
            <div className="mt-6 text-[10px] text-text3/60 leading-relaxed max-w-[280px]">
              ตั้งค่ารหัสผ่านได้ในไฟล์ <code>.env.local</code> โดยระบุตัวแปร <code>ADMIN_PASSWORD=...</code>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-text1 pt-28 pb-16 px-6 max-w-[1100px] mx-auto">
      
      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-8 right-8 z-[300] flex items-center gap-2 text-white px-5 py-3 rounded-full shadow-2xl border border-white/10 text-xs font-bold animate-in fade-in slide-in-from-bottom-4 duration-300 ${
          toast.type === 'success' ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-red-500 to-rose-600'
        }`}>
          <Check size={16} />
          {toast.message}
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <Link href="/" className="inline-flex items-center gap-1.5 text-text2 text-xs hover:text-star2 mb-3 transition-colors">
            <ArrowLeft size={12} />
            กลับหน้าหลัก
          </Link>
          <h1 className="text-[28px] md:text-[34px] font-extrabold text-white flex items-center gap-2">
            Admin Dashboard <Sparkles size={22} className="text-blue3" />
          </h1>
          <p className="text-xs text-text2 mt-1">จัดการ ลบ เพิ่ม และแก้ไขข้อมูลการ์ดแปลไทยทั้งหมดในระบบ</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Database indicator */}
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border ${
            dbMode === 'supabase' 
              ? 'bg-[rgba(16,185,129,0.1)] text-[#00E575] border-[rgba(16,185,129,0.2)]'
              : 'bg-[rgba(234,179,8,0.1)] text-star border-[rgba(234,179,8,0.2)]'
          }`}>
            <Database size={13} />
            <span>โหมด: {dbMode === 'supabase' ? 'Supabase (คลาวด์)' : 'JSON File (โลคอล)'}</span>
          </div>

          <button 
            onClick={openAddModal}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue via-blue2 to-blue3 hover:scale-[1.02] shadow-[0_4px_15px_rgba(43,95,255,0.25)] hover:shadow-[0_6px_25px_rgba(43,95,255,0.45)] transition-all"
          >
            <Plus size={14} />
            เพิ่มการ์ดเกมใหม่
          </button>

          <button 
            onClick={() => setIsPoolModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-text2 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-blue2/40 transition-all"
          >
            <Users size={14} className="text-blue3" />
            จัดการคลังทีมงาน
          </button>

          <button 
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-text2 hover:text-white bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
          >
            ออกจากระบบ
          </button>
        </div>
      </div>

      {/* Notice alert */}
      {dbMode === 'local' && (
        <div className="bg-bg1/40 border border-amber-500/20 text-star rounded-xl p-4 mb-6 flex items-start gap-3">
          <Info size={18} className="shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed">
            <strong>หมายเหตุการเชื่อมต่อ Supabase:</strong> ปัจจุบันระบบกำลังทำงานในโหมดบันทึกข้อมูลลงไฟล์จำลอง <code>src/lib/games-db.json</code> ภายในเครื่องของคุณ
            ข้อมูลที่เพิ่มหรือลบจะถูกบันทึกไว้ในเครื่องแบบถาวร เพื่อให้คุณทดสอบระบบได้ทันที และระบบพร้อมเปลี่ยนเป็นดึงข้อมูลจาก Supabase ทันทีที่คุณกรอกคีย์เชื่อมต่อจริงใน <code>.env.local</code> และรันคำสั่ง SQL สร้างตาราง
          </div>
        </div>
      )}

      {/* Content list */}
      <div className="bg-bg1 border border-border2 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text3 text-sm">
            <Loader2 className="animate-spin text-blue3" size={28} />
            <span>กำลังโหลดข้อมูลเกม...</span>
          </div>
        ) : games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text3 text-sm text-center">
            <FileCode size={36} />
            <span>ไม่มีข้อมูลการ์ดเกมในระบบขณะนี้</span>
            <button onClick={openAddModal} className="text-xs text-blue3 underline hover:text-white mt-1">คลิกที่นี่เพื่อเพิ่มเป็นรายการแรก</button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border2 bg-bg2/40 text-text3 text-[10px] font-bold uppercase tracking-wider">
                  <th className="py-4 px-6">เกม</th>
                  <th className="py-4 px-6">หมวดหมู่</th>
                  <th className="py-4 px-6">สถานะการแปล</th>
                  <th className="py-4 px-6">ความคืบหน้า (T/P/Test)</th>
                  <th className="py-4 px-6">เวอร์ชันแปล</th>
                  <th className="py-4 px-6 text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-xs">
                {games.map((game) => (
                  <tr key={game.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 px-6 font-bold text-text1 flex items-center gap-3">
                      <span className="text-xl">{game.emoji}</span>
                      <div>
                        <div className="text-[13px]">{game.title}</div>
                        <div className="text-[10px] text-text3 font-mono">slug: {game.slug}</div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-text2 font-semibold">{game.genre}</td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        game.status === 'done'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-blue-dim text-blue3 border border-blue-dim'
                      }`}>
                        {game.status === 'done' ? '✦ เสร็จสมบูรณ์' : '⟳ กำลังแปล'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-text2 font-semibold">
                      {game.progress.isMultiModule ? (
                        <div className="flex items-center gap-1.5">
                          <span className="text-blue3 font-bold">
                            {(() => {
                              const mods = game.progress.modules || []
                              if (mods.length === 0) return 0
                              return Math.round(mods.reduce((sum, m) => sum + m.progress, 0) / mods.length)
                            })()}%
                          </span>
                          <span className="text-[10px] text-text3 bg-white/5 border border-white/10 px-1.5 py-0.5 rounded font-bold">
                            {game.progress.modules?.length || 0} ภาค
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-blue3 font-bold">{game.progress.translate}%</span> / <span className="text-star font-bold">{game.progress.proofread}%</span> / <span className="text-text3 font-bold">{game.progress.test}%</span>
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6 font-mono text-text3 font-bold">
                      v{game.translationVersion} <span className="text-[9px] font-normal text-text3/70">(เกม: {game.version})</span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center gap-1">
                        <button 
                          onClick={() => openEditModal(game)}
                          className="p-2 rounded-lg hover:bg-white/5 text-text2 hover:text-white transition-colors"
                          title="แก้ไขข้อมูล"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button 
                          onClick={() => handleDelete(game.id)}
                          className="p-2 rounded-lg hover:bg-white/5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-colors"
                          title="ลบเกม"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form Dialog Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[250] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-bg1 border border-border2 rounded-3xl w-full max-w-[850px] max-h-[90vh] overflow-y-auto shadow-2xl relative animate-in zoom-in-95 duration-200">
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-white/5 text-text3 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {editingGame ? '📝 แก้ไขการ์ดเกม' : '✨ เพิ่มการ์ดเกมใหม่'}
                </h3>
                <p className="text-xs text-text3 mt-0.5">ระบุรายละเอียดทั้งหมดเพื่อสร้างข้อมูลการ์ดแปลไทยลงสู่ระบบ</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* 1. Title */}
                <div>
                  <label className="block text-[11px] font-bold text-text3 uppercase mb-1.5">ชื่อเกม <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    placeholder="ตัวอย่าง Cyberpunk 2077"
                    className="w-full px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors"
                  />
                </div>

                {/* 2. Slug */}
                <div>
                  <label className="block text-[11px] font-bold text-text3 uppercase mb-1.5">Slug (ใช้ทำ URL path) <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    required
                    placeholder="ตัวอย่าง cyberpunk-2077"
                    className="w-full px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 font-mono transition-colors"
                  />
                </div>

                {/* 3. Genre */}
                <div>
                  <label className="block text-[11px] font-bold text-text3 uppercase mb-1.5">หมวดหมู่ / แนวเกม <span className="text-rose-500">*</span></label>
                  <div className="space-y-2">
                    <select
                      value={showCustomGenre ? '__new__' : genre}
                      onChange={(e) => {
                        const val = e.target.value
                        if (val === '__new__') {
                          setShowCustomGenre(true)
                          setGenre('')
                        } else {
                          setShowCustomGenre(false)
                          setGenre(val)
                        }
                      }}
                      className="w-full px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors"
                    >
                      <option value="" className="bg-bg1">-- เลือกหมวดหมู่ที่มีอยู่ --</option>
                      {Array.from(new Set(games.map((g) => g.genre))).filter(Boolean).map((gGenre) => (
                        <option key={gGenre} value={gGenre} className="bg-bg1">
                          {gGenre}
                        </option>
                      ))}
                      <option value="__new__" className="bg-bg1 text-blue3 font-bold">
                        ➕ เพิ่มหมวดหมู่ใหม่ (พิมพ์เอง)...
                      </option>
                    </select>

                    {showCustomGenre && (
                      <input 
                        type="text" 
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        required
                        placeholder="ระบุหมวดหมู่ใหม่ (เช่น RPG, Action, Simulation)"
                        className="w-full px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors animate-in slide-in-from-top-2 duration-200"
                      />
                    )}
                  </div>
                </div>

                {/* 4. Emoji Icon */}
                <div>
                  <label className="block text-[11px] font-bold text-text3 uppercase mb-1.5">สัญลักษณ์ Emoji (ไม่จำเป็นต้องระบุ)</label>
                  <input 
                    type="text" 
                    value={emoji}
                    onChange={(e) => setEmoji(e.target.value)}
                    placeholder="ตัวอย่าง 🌆 (เว้นว่างไว้เพื่อใช้ 🎮 เป็นค่าเริ่มต้น)"
                    className="w-full px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors"
                  />
                </div>

                {/* 5. Status */}
                <div>
                  <label className="block text-[11px] font-bold text-text3 uppercase mb-1.5">สถานะการแปล Mod</label>
                  <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value as GameStatus)}
                    className="w-full px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors"
                  >
                    <option value="wip" className="bg-bg1">กำลังพัฒนา (WIP)</option>
                    <option value="done" className="bg-bg1">เสร็จสมบูรณ์แล้ว (DONE)</option>
                  </select>
                </div>

                {/* 6. Technical Spec fields */}
                <div>
                  <label className="block text-[11px] font-bold text-text3 uppercase mb-1.5">เวอร์ชันของตัวเกมที่รองรับ</label>
                  <input 
                    type="text" 
                    value={version}
                    onChange={(e) => setVersion(e.target.value)}
                    placeholder="ตัวอย่าง Patch 7 หรือ v2.12"
                    className="w-full px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text3 uppercase mb-1.5">แพลตฟอร์ม / ไคลเอนต์เกม</label>
                  <input 
                    type="text" 
                    value={client}
                    onChange={(e) => setClient(e.target.value)}
                    placeholder="ตัวอย่าง Steam หรือ Epic, GOG"
                    className="w-full px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text3 uppercase mb-1.5">เวอร์ชันของภาษาไทย (Translation Version)</label>
                  <input 
                    type="text" 
                    value={translationVersion}
                    onChange={(e) => setTranslationVersion(e.target.value)}
                    placeholder="ตัวอย่าง 1.0 หรือ WIP"
                    className="w-full px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-text3 uppercase mb-1.5">ขนาดไฟล์ดาวน์โหลด (File Size)</label>
                  <input 
                    type="text" 
                    value={fileSize}
                    onChange={(e) => setFileSize(e.target.value)}
                    placeholder="ตัวอย่าง 45 MB"
                    className="w-full px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors"
                  />
                </div>

                {/* 7. Image & Video */}
                <div>
                  <label className="block text-[11px] font-bold text-text3 uppercase mb-1.5">ลิงก์วิดีโอตัวอย่าง YouTube Embed</label>
                  <input 
                    type="url" 
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="ตัวอย่าง https://www.youtube.com/embed/XXXXX"
                    className="w-full px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors"
                  />
                </div>

                {/* Poster Image URL & Upload */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-text3 uppercase mb-1.5">รูปภาพปกหลักแนวตั้ง (Poster 2:3)</label>
                  <div className="flex gap-2.5">
                    <input 
                      type="text" 
                      value={posterImage}
                      onChange={(e) => setPosterImage(e.target.value)}
                      placeholder="วางลิงก์ URL รูปภาพ หรือคลิกปุ่มด้านขวาเพื่อเลือกไฟล์"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors"
                    />
                    <label className="px-5 py-2.5 rounded-xl bg-blue/15 border border-[rgba(43,95,255,0.3)] hover:bg-blue/30 text-blue3 hover:text-white transition-all text-xs font-bold cursor-pointer flex items-center justify-center shrink-0">
                      เลือกไฟล์
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'poster')}
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                {/* Cover Image URL & Upload */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-text3 uppercase mb-1.5">รูปภาพพื้นหลังแบนเนอร์แนวนอน (Cinematic Cover 16:9)</label>
                  <div className="flex gap-2.5">
                    <input 
                      type="text" 
                      value={coverImage}
                      onChange={(e) => setCoverImage(e.target.value)}
                      placeholder="วางลิงก์ URL รูปภาพ หรือคลิกปุ่มด้านขวาเพื่อเลือกไฟล์"
                      className="flex-1 px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors"
                    />
                    <label className="px-5 py-2.5 rounded-xl bg-blue/15 border border-[rgba(43,95,255,0.3)] hover:bg-blue/30 text-blue3 hover:text-white transition-all text-xs font-bold cursor-pointer flex items-center justify-center shrink-0">
                      เลือกไฟล์
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, 'cover')}
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                {/* 8. Progress Settings Section */}
                <div className="md:col-span-2 bg-bg2/25 border border-white/5 rounded-2xl p-4 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-white/5">
                    <span className="text-[11px] font-bold text-text3 uppercase">การตั้งค่าความคืบหน้า (Progress Mode)</span>
                    <div className="flex bg-bg0/60 p-0.5 rounded-lg border border-white/5 shrink-0">
                      <button
                        type="button"
                        onClick={() => setIsMultiModule(false)}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                          !isMultiModule 
                            ? 'bg-blue text-white shadow-md' 
                            : 'text-text3 hover:text-text2'
                        }`}
                      >
                        แบบมาตรฐาน (แปล/ตรวจ/ทดสอบ)
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsMultiModule(true)}
                        className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${
                          isMultiModule 
                            ? 'bg-blue text-white shadow-md' 
                            : 'text-text3 hover:text-text2'
                        }`}
                      >
                        แบบแยกภาค / DLC (Sims 4)
                      </button>
                    </div>
                  </div>

                  {!isMultiModule ? (
                    <div className="grid grid-cols-1 gap-4 pt-1">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-text3 uppercase">งานแปล (Translate):</span>
                            <span className="text-xs font-bold text-blue3">{translateProgress}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={translateProgress}
                            disabled={!!sheetUrl}
                            onChange={(e) => setTranslateProgress(Number(e.target.value))}
                            className="w-full accent-blue hover:accent-blue2 cursor-pointer disabled:opacity-50"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-text3 uppercase">งานตรวจทาน (Proofread):</span>
                            <span className="text-xs font-bold text-star">{proofreadProgress}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={proofreadProgress}
                            disabled={!!sheetUrl}
                            onChange={(e) => setProofreadProgress(Number(e.target.value))}
                            className="w-full accent-blue hover:accent-blue2 cursor-pointer disabled:opacity-50"
                          />
                        </div>

                        <div>
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[10px] font-bold text-text3 uppercase">ทดสอบในเกม (Test):</span>
                            <span className="text-xs font-bold text-text2">{testProgress}%</span>
                          </div>
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={testProgress}
                            disabled={!!sheetUrl}
                            onChange={(e) => setTestProgress(Number(e.target.value))}
                            className="w-full accent-blue hover:accent-blue2 cursor-pointer disabled:opacity-50"
                          />
                        </div>
                      </div>

                      {/* Google Sheets URL */}
                      <div className="pt-2 border-t border-white/5">
                        <label className="block text-[10px] font-bold text-text3 uppercase mb-1">🔗 ลิงก์ Google Sheets สำหรับซิงก์ความคืบหน้า (อ่านจากช่อง C1 อัตโนมัติ)</label>
                        <input 
                          type="text" 
                          value={sheetUrl}
                          onChange={(e) => setSheetUrl(e.target.value)}
                          placeholder="วางลิงก์ Google Sheets เช่น https://docs.google.com/spreadsheets/d/.../edit?usp=sharing"
                          className="w-full px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors"
                        />
                        <p className="text-[10px] text-text3/80 mt-1">
                          * ชีตต้องถูกแชร์แบบ "ทุกคนที่มีลิงก์มีสิทธิ์ดู" (Viewer) ตัวระบบจะซ่อนลิงก์ไม่แสดงให้ผู้ใช้อื่นเห็นทางหน้าเว็บเพื่อความปลอดภัย
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 pt-1">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] text-text3 font-semibold">รายการภาค / ส่วนเสริม (DLC Modules)</span>
                        <button
                          type="button"
                          onClick={handleAddModule}
                          className="inline-flex items-center gap-1 text-[10px] font-bold text-blue3 hover:text-white transition-colors"
                        >
                          <Plus size={10} /> เพิ่มภาค/ส่วนเสริม
                        </button>
                      </div>

                      <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1 scrollbar-thin">
                        {modules.map((mod, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-bg0/30 border border-white/5 p-2.5 rounded-xl">
                            <input
                              type="text"
                              placeholder="ชื่อภาค/ส่วนเสริม (เช่น Base Game หรือ Seasons)"
                              value={mod.name}
                              onChange={(e) => handleModuleChange(idx, 'name', e.target.value)}
                              className="flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-bg2/40 border border-white/5 focus:outline-none text-xs text-text1"
                            />
                            <div className="flex items-center gap-2 shrink-0">
                              <input
                                type="range"
                                min="0"
                                max="100"
                                value={mod.progress}
                                onChange={(e) => handleModuleChange(idx, 'progress', e.target.value)}
                                className="w-[80px] sm:w-[120px] accent-blue hover:accent-blue2 cursor-pointer"
                              />
                              <span className="text-xs font-bold text-blue3 w-[34px] text-right shrink-0">{mod.progress}%</span>
                            </div>
                            
                            {modules.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveModule(idx)}
                                className="p-1.5 text-rose-400 hover:bg-white/5 rounded-lg shrink-0 transition-colors"
                              >
                                <X size={12} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* 9. Descriptions */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-text3 uppercase mb-1.5">คำอธิบายด่วนแบบย่อ (Short Description)</label>
                  <textarea 
                    rows={2}
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="เขียนสั้น ๆ แสดงบนหน้าดีเทล..."
                    className="w-full px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors resize-y"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-text3 uppercase mb-1.5">รายละเอียดแพตช์แปลไทย (Full Description)</label>
                  <textarea 
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="บรรยายรายระเอียดเพิ่มเติมของ Mod ตัวนี้..."
                    className="w-full px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors resize-y"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-text3 uppercase mb-1.5">เกี่ยวกับเกม / ภาพรวม (Overview)</label>
                  <textarea 
                    rows={3}
                    value={overview}
                    onChange={(e) => setOverview(e.target.value)}
                    placeholder="เขียนสรุปเรื่องราวหรือรูปแบบการเล่นเกมเบื้องต้น..."
                    className="w-full px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors resize-y"
                  />
                </div>

                {/* 10. Scope */}
                <div className="md:col-span-2">
                  <label className="block text-[11px] font-bold text-text3 uppercase mb-1.5">ขอบเขตเนื้อหาการแปล (คั่นด้วยเครื่องหมายจุลภาค `,` เพื่อแยกรายการ)</label>
                  <input 
                    type="text" 
                    value={translationScope}
                    onChange={(e) => setTranslationScope(e.target.value)}
                    placeholder="ตัวอย่าง UI / เมนู, บทสนทนาทั้งหมด, เควสต์รอง"
                    className="w-full px-4 py-2.5 rounded-xl bg-bg2/40 border border-white/5 focus:border-blue2/40 focus:outline-none text-xs text-text1 transition-colors"
                  />
                </div>

                {/* 11. Dynamic Team Members */}
                <div className="md:col-span-2 bg-bg2/25 border border-white/5 rounded-2xl p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-text3 uppercase">ผู้จัดทำและทีมงาน (Team Members)</span>
                    <button 
                      type="button"
                      onClick={handleAddTeamMember}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue3 hover:text-white"
                    >
                      <Plus size={11} /> เพิ่มสมาชิก
                    </button>
                  </div>
                  {team.map((member, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-bg2/10 border border-white/5 p-3 rounded-xl w-full">
                      {/* Avatar Circle Preview & File Upload */}
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="relative group w-10 h-10 rounded-full bg-blue-dim border border-border2 flex items-center justify-center overflow-hidden shrink-0">
                          {member.avatar ? (
                            <img src={member.avatar} alt="Avatar" className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-[10px] text-text3 font-bold">{member.name ? member.name.slice(0, 2) : 'รูป'}</span>
                          )}
                        </div>
                        <label className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-[11px] font-semibold cursor-pointer text-text2 hover:text-white transition-all shrink-0">
                          เลือกรูป
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => handleTeamMemberAvatarUpload(e, idx)}
                            className="hidden" 
                          />
                        </label>
                      </div>

                      {/* Name & Role Inputs */}
                      <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <select
                          value={member.name}
                          onChange={(e) => {
                            const val = e.target.value
                            const poolMem = teamPool.find(m => m.name === val)
                            if (poolMem) {
                              const newTeam = [...team]
                              newTeam[idx].name = poolMem.name
                              newTeam[idx].avatar = poolMem.avatar
                              setTeam(newTeam)
                            } else {
                              const newTeam = [...team]
                              newTeam[idx].name = val
                              newTeam[idx].avatar = ''
                              setTeam(newTeam)
                            }
                          }}
                          className="w-full px-3 py-2 rounded-lg bg-bg2/40 border border-white/5 focus:outline-none text-xs text-text1"
                        >
                          <option value="" className="bg-bg1">-- เลือกรายชื่อทีมงาน --</option>
                          {teamPool.map((poolMem, poolIdx) => (
                            <option key={poolIdx} value={poolMem.name} className="bg-bg1">
                              {poolMem.name}
                            </option>
                          ))}
                          {member.name && !teamPool.some(m => m.name === member.name) && (
                            <option value={member.name} className="bg-bg1">
                              {member.name} (ไม่มีในคลัง)
                            </option>
                          )}
                        </select>
                        <input 
                          type="text" 
                          placeholder="หน้าที่รับผิดชอบ"
                          value={member.role}
                          onChange={(e) => handleTeamMemberChange(idx, 'role', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg bg-bg2/40 border border-white/5 focus:outline-none text-xs text-text1"
                        />
                      </div>
                      
                      {team.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveTeamMember(idx)}
                          className="p-2 text-rose-400 hover:bg-white/5 rounded-lg shrink-0 self-end sm:self-center"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* 12. Dynamic Download Links */}
                <div className="md:col-span-2 bg-bg2/25 border border-white/5 rounded-2xl p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-text3 uppercase">ลิงก์ดาวน์โหลดตัวแปล (Downloads)</span>
                    <button 
                      type="button"
                      onClick={handleAddDownload}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue3 hover:text-white"
                    >
                      <Plus size={11} /> เพิ่มลิงก์
                    </button>
                  </div>
                  {downloads.map((dl, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row gap-3 items-center w-full">
                      <input 
                        type="text" 
                        placeholder="ชื่อปุ่ม (เช่น Nexus Mods)"
                        value={dl.label}
                        onChange={(e) => handleDownloadChange(idx, 'label', e.target.value)}
                        className="w-full sm:w-[150px] px-3 py-2 rounded-lg bg-bg2/40 border border-white/5 focus:outline-none text-xs text-text1"
                      />
                      <input 
                        type="text" 
                        placeholder="ลิงก์ URL"
                        value={dl.url}
                        onChange={(e) => handleDownloadChange(idx, 'url', e.target.value)}
                        className="flex-1 w-full px-3 py-2 rounded-lg bg-bg2/40 border border-white/5 focus:outline-none text-xs text-text1"
                      />
                      <select
                        value={dl.type}
                        onChange={(e) => handleDownloadChange(idx, 'type', e.target.value)}
                        className="w-full sm:w-[110px] px-2.5 py-2 rounded-lg bg-bg2/40 border border-white/5 focus:outline-none text-xs text-text1"
                      >
                        <option value="primary" className="bg-bg1">หลัก (Primary)</option>
                        <option value="secondary" className="bg-bg1">รอง (Secondary)</option>
                      </select>
                      {downloads.length > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleRemoveDownload(idx)}
                          className="p-2 text-rose-400 hover:bg-white/5 rounded-lg"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* 13. Dynamic Installation Steps */}
                <div className="md:col-span-2 bg-bg2/25 border border-white/5 rounded-2xl p-4 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-text3 uppercase">วิธีการติดตั้งม็อด (Installation Steps)</span>
                    <button 
                      type="button"
                      onClick={handleAddInstructionStep}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-blue3 hover:text-white"
                    >
                      <Plus size={11} /> เพิ่มขั้นตอน
                    </button>
                  </div>
                  {instructions.map((step, idx) => (
                    <div key={idx} className="flex flex-col gap-3 bg-bg2/10 border border-white/5 p-3 rounded-xl w-full">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-blue text-white text-[10px] flex items-center justify-center font-bold">
                            {idx + 1}
                          </span>
                          <span className="text-[10px] text-text3 font-semibold uppercase">ขั้นตอนที่ {idx + 1}</span>
                        </div>
                        {instructions.length > 1 && (
                          <button 
                            type="button" 
                            onClick={() => handleRemoveInstructionStep(idx)}
                            className="p-1 text-rose-400 hover:bg-white/5 rounded-lg shrink-0 transition-colors"
                            title="ลบขั้นตอนนี้"
                          >
                            <X size={12} />
                          </button>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 items-start">
                        <textarea 
                          placeholder="คำอธิบายขั้นตอนการติดตั้ง (เช่น โหลดไฟล์ แล้วนำไปวางไว้ในโฟลเดอร์...)"
                          value={step.text}
                          onChange={(e) => handleInstructionStepChange(idx, 'text', e.target.value)}
                          rows={2}
                          className="flex-1 w-full px-3 py-2 rounded-lg bg-bg2/40 border border-white/5 focus:outline-none text-xs text-text1 resize-y"
                        />

                        {/* Image URL & Upload button */}
                        <div className="w-full sm:w-[320px] space-y-2 shrink-0">
                          <div className="flex gap-1.5">
                            <input 
                              type="text" 
                              placeholder="ลิงก์ URL รูปภาพ (ถ้ามี)"
                              value={step.image || ''}
                              onChange={(e) => handleInstructionStepChange(idx, 'image', e.target.value)}
                              className="flex-1 min-w-0 px-3 py-1.5 rounded-lg bg-bg2/40 border border-white/5 focus:outline-none text-xs text-text1"
                            />
                            <label className="px-2.5 py-1.5 rounded-lg bg-blue/15 border border-[rgba(43,95,255,0.3)] hover:bg-blue/30 text-blue3 hover:text-white transition-all text-[10px] font-bold cursor-pointer flex items-center justify-center shrink-0">
                              เลือกรูป
                              <input 
                                type="file" 
                                accept="image/*"
                                onChange={(e) => handleInstructionImageUpload(e, idx)}
                                className="hidden" 
                              />
                            </label>
                          </div>

                          {step.image && (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-white/5">
                              <img src={step.image} alt={`Step ${idx + 1}`} className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => handleInstructionStepChange(idx, 'image', '')}
                                className="absolute top-1 right-1 p-1 bg-black/60 rounded-full hover:bg-rose-500 hover:text-white text-text3 transition-colors"
                                title="ลบรูปภาพ"
                              >
                                <X size={10} />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Form Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={submitting}
                  className="px-5 py-2.5 rounded-full text-xs font-bold text-text2 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-blue via-blue2 to-blue3 hover:scale-[1.01] transition-all disabled:opacity-50"
                >
                  {submitting && <Loader2 className="animate-spin" size={12} />}
                  {submitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Team Pool Management Modal */}
      {isPoolModalOpen && (
        <div className="fixed inset-0 z-[260] flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-bg1 border border-border2 rounded-3xl w-full max-w-[550px] max-h-[85vh] overflow-hidden shadow-2xl relative flex flex-col animate-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Users size={18} className="text-blue3" /> คลังรายชื่อผู้จัดทำและทีมงาน
                </h3>
                <p className="text-[11px] text-text3 mt-0.5">เพิ่ม ลบ หรือแก้ไขข้อมูลทีมงานทั้งหมดที่จะนำไปใส่ในการ์ดเกม</p>
              </div>
              <button 
                onClick={() => setIsPoolModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/5 text-text3 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable list & Add form */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Add New Member Form */}
              <div className="bg-bg2/30 border border-white/5 rounded-2xl p-4.5 space-y-4">
                <div className="text-xs font-bold text-[#00D2FF] tracking-[0.5px] flex items-center gap-1.5">
                  <UserPlus size={14} /> เพิ่มรายชื่อใหม่เข้าคลัง
                </div>
                <form onSubmit={handleAddMemberToPool} className="space-y-3.5">
                  <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
                    {/* Avatar circle & upload */}
                    <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
                      <div className="w-10 h-10 rounded-full bg-blue-dim border border-border2 flex items-center justify-center overflow-hidden shrink-0">
                        {newMemberAvatar ? (
                          <img src={newMemberAvatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[10px] text-text3 font-bold">{newMemberName ? newMemberName.slice(0, 2) : 'รูป'}</span>
                        )}
                      </div>
                      <label className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-[11px] font-semibold cursor-pointer text-text2 hover:text-white transition-all shrink-0">
                        เลือกรูปโปรไฟล์
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleMemberAvatarUpload}
                          className="hidden" 
                        />
                      </label>
                    </div>

                    {/* Name input */}
                    <input 
                      type="text" 
                      placeholder="ระบุชื่อทีมงาน (เช่น แปลเกมสู่ฝัน, Miku)"
                      value={newMemberName}
                      onChange={(e) => setNewMemberName(e.target.value)}
                      required
                      className="flex-1 w-full px-3 py-2 rounded-xl bg-bg2/50 border border-white/5 focus:outline-none text-xs text-text1"
                    />
                  </div>

                  {newMemberAvatar && (
                    <div className="text-[10px] text-text3 font-mono truncate bg-bg2/40 px-2.5 py-1 rounded w-full">
                      ลิงก์รูป: {newMemberAvatar}
                    </div>
                  )}

                  <div className="flex justify-end pt-1">
                    <button
                      type="submit"
                      disabled={savingMember}
                      className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold text-white bg-blue hover:scale-[1.02] shadow-md transition-all disabled:opacity-50"
                    >
                      {savingMember ? 'กำลังบันทึก...' : 'บันทึกเข้าคลัง'}
                    </button>
                  </div>
                </form>
              </div>

              {/* Pool list */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-text3 uppercase tracking-[0.5px]">รายชื่อในคลังปัจจุบัน ({teamPool.length} คน)</div>
                {teamPool.length === 0 ? (
                  <div className="text-xs text-text3 text-center py-6 border border-dashed border-white/5 rounded-xl">
                    ไม่มีรายชื่อในคลังในขณะนี้
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-2">
                    {teamPool.map((member, idx) => (
                      <div key={idx} className="flex items-center justify-between bg-bg2/10 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-blue-dim border border-border2 flex items-center justify-center overflow-hidden shrink-0">
                            {member.avatar ? (
                              <img src={member.avatar} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10px] text-text3 font-bold">{member.name.slice(0, 2)}</span>
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-text1">{member.name}</div>
                            <div className="text-[9px] text-text3">{member.avatar ? 'มีรูปโปรไฟล์' : 'ไม่มีรูปโปรไฟล์'}</div>
                          </div>
                        </div>

                        <button 
                          type="button"
                          onClick={() => handleDeleteMemberFromPool(member.name)}
                          className="p-1.5 rounded-lg hover:bg-white/5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-colors"
                          title="ลบออกจากคลัง"
                        >
                          <Trash size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-4 bg-bg2/40 border-t border-white/5 flex justify-end shrink-0">
              <button 
                type="button"
                onClick={() => setIsPoolModalOpen(false)}
                className="px-4.5 py-2 rounded-xl text-xs font-bold bg-white/5 hover:bg-white/10 text-text2 hover:text-white transition-all"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
