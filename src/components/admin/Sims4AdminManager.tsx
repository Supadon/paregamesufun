'use client'

import { useState, useEffect, useMemo } from 'react'
import { Sims4Pack, Sims4Category, Sims4Status } from '@/lib/types'
import { 
  getSims4Packs, createSims4Pack, updateSims4Pack, deleteSims4Pack, uploadLocalFile 
} from '@/app/actions/games'
import { 
  Plus, Edit2, Trash2, Check, X, Loader2, Sparkles, Layers, 
  Package, Sparkle, Wrench, Search, Upload, ExternalLink, Image as ImageIcon 
} from 'lucide-react'

export default function Sims4AdminManager() {
  const [packs, setPacks] = useState<Sims4Pack[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<Sims4Category | 'all'>('all')

  // Modal form state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingPack, setEditingPack] = useState<Sims4Pack | null>(null)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Form fields
  const [formData, setFormData] = useState<Partial<Sims4Pack>>({
    id: '',
    name: '',
    category: 'expansion',
    status: 'wip',
    isReleased: true,
    progress: 95,
    version: 'v1.0',
    author: '',
    description: '',
    coverImage: '',
    downloadUrl: '',
    badgeText: '',
  })

  // Toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null)

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Load packs on mount
  useEffect(() => {
    loadPacks()
  }, [])

  const loadPacks = async () => {
    setLoading(true)
    try {
      const data = await getSims4Packs()
      setPacks(data)
    } catch (err) {
      console.error('Error loading Sims 4 packs:', err)
      showToast('ไม่สามารถโหลดข้อมูล Sims 4 ได้', 'error')
    } finally {
      setLoading(false)
    }
  }

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingPack(null)
    setFormData({
      id: '',
      name: '',
      category: 'expansion',
      status: 'wip',
      isReleased: true,
      progress: 95,
      version: 'v1.0',
      author: '',
      description: '',
      coverImage: '',
      downloadUrl: '',
      badgeText: '',
    })
    setModalOpen(true)
  }

  // Open Edit Modal
  const handleOpenEdit = (pack: Sims4Pack) => {
    setEditingPack(pack)
    setFormData({ ...pack })
    setModalOpen(true)
  }

  // Handle Cover Image Upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const uploadData = new FormData()
      uploadData.append('file', file)
      const res = await uploadLocalFile(uploadData)
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, coverImage: res.url }))
        showToast('อัปโหลดรูปภาพสำเร็จ!', 'success')
      } else {
        showToast(res.error || 'อัปโหลดรูปภาพไม่สำเร็จ', 'error')
      }
    } catch (err: any) {
      showToast(err.message || 'เกิดข้อผิดพลาดในการอัปโหลด', 'error')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  // Save Pack (Create or Update)
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name?.trim()) {
      showToast('กรุณากรอกชื่อภาคเสริมหรือม็อด', 'error')
      return
    }

    setSaving(true)
    try {
      if (editingPack) {
        // Update
        const res = await updateSims4Pack(editingPack.id, formData)
        if (res.success && res.data) {
          setPacks((prev) => prev.map((p) => (p.id === editingPack.id ? res.data! : p)))
          showToast(`บันทึกการแก้ไข "${res.data.name}" เรียบร้อยแล้ว`, 'success')
          setModalOpen(false)
        } else {
          showToast(res.error || 'ไม่สามารถบันทึกข้อมูลได้', 'error')
        }
      } else {
        // Create
        let autoId = formData.id?.trim()
        if (!autoId) {
          autoId = `${formData.category?.slice(0, 2)}-${formData.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')}`
        }

        const newPackPayload: Sims4Pack = {
          id: autoId,
          name: formData.name.trim(),
          category: formData.category || 'expansion',
          status: formData.status || 'done',
          isReleased: formData.isReleased !== false,
          progress: formData.status === 'done' ? 100 : Number(formData.progress || 0),
          version: formData.version?.trim() || 'v1.0',
          author: formData.author?.trim() || '',
          description: formData.description?.trim() || '',
          coverImage: formData.coverImage?.trim() || '',
          downloadUrl: formData.downloadUrl?.trim() || '',
          badgeText: formData.badgeText?.trim() || '',
        }

        const res = await createSims4Pack(newPackPayload)
        if (res.success && res.data) {
          setPacks((prev) => [...prev, res.data!])
          showToast(`เพิ่มภาคเสริม "${res.data.name}" เรียบร้อยแล้ว`, 'success')
          setModalOpen(false)
        } else {
          showToast(res.error || 'ไม่สามารถเพิ่มข้อมูลได้', 'error')
        }
      }
    } catch (err: any) {
      showToast(err.message || 'เกิดข้อผิดพลาดในการบันทึก', 'error')
    } finally {
      setSaving(false)
    }
  }

  // Delete Pack
  const handleDelete = async (pack: Sims4Pack) => {
    if (!confirm(`คุณแน่ใจหรือไม่ว่าต้องการลบ "${pack.name}"?`)) {
      return
    }

    try {
      const res = await deleteSims4Pack(pack.id)
      if (res.success) {
        setPacks((prev) => prev.filter((p) => p.id !== pack.id))
        showToast(`ลบ "${pack.name}" เรียบร้อยแล้ว`, 'success')
      } else {
        showToast(res.error || 'ไม่สามารถลบข้อมูลได้', 'error')
      }
    } catch (err: any) {
      showToast(err.message || 'เกิดข้อผิดพลาดในการลบ', 'error')
    }
  }

  // Filtered packs
  const filteredPacks = useMemo(() => {
    return packs.filter((pack) => {
      if (selectedCategory !== 'all' && pack.category !== selectedCategory) {
        return false
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim()
        const matchName = pack.name.toLowerCase().includes(q)
        const matchId = pack.id.toLowerCase().includes(q)
        const matchAuthor = pack.author?.toLowerCase().includes(q) || false
        if (!matchName && !matchId && !matchAuthor) return false
      }
      return true
    })
  }, [packs, selectedCategory, searchQuery])

  // Category counts
  const counts = useMemo(() => {
    return {
      all: packs.length,
      expansion: packs.filter((p) => p.category === 'expansion').length,
      gamepack: packs.filter((p) => p.category === 'gamepack').length,
      stuffpack: packs.filter((p) => p.category === 'stuffpack').length,
      mod: packs.filter((p) => p.category === 'mod').length,
    }
  }, [packs])

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-2xl border shadow-2xl backdrop-blur-md flex items-center gap-2 animate-scaleUp text-xs font-bold ${
            toast.type === 'success'
              ? 'bg-emerald-950/90 border-emerald-500/50 text-emerald-300'
              : 'bg-rose-950/90 border-rose-500/50 text-rose-300'
          }`}
        >
          {toast.type === 'success' ? <Check size={16} /> : <X size={16} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Top Controls & Category Tabs */}
      <div className="bg-bg1/60 p-4 rounded-2xl border border-white/10 backdrop-blur-md space-y-3.5">
        {/* Row 1: Category Filter Tabs & Add Button */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
            {[
              { id: 'all', label: 'ทั้งหมด', count: counts.all, icon: Sparkles },
              { id: 'expansion', label: 'ภาคเสริมใหญ่ (EP)', count: counts.expansion, icon: Layers },
              { id: 'gamepack', label: 'ชุดเกมเสริม (GP)', count: counts.gamepack, icon: Package },
              { id: 'stuffpack', label: 'ชุดไอเท็มเสริม (SP)', count: counts.stuffpack, icon: Sparkle },
              { id: 'mod', label: 'ม็อดสคริปต์ (Script Mod)', count: counts.mod, icon: Wrench },
            ].map((tab) => {
              const Icon = tab.icon
              const isActive = selectedCategory === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl transition-all ${
                    isActive
                      ? 'bg-blue text-white shadow-lg border border-blue2/50 font-black'
                      : 'bg-white/5 hover:bg-white/10 text-text3 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon size={12} />
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-text3'}`}>
                    {tab.count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Add Button */}
          <button
            onClick={handleOpenAdd}
            className="shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-blue via-blue2 to-blue3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_4px_14px_rgba(43,95,255,0.3)] ml-auto"
          >
            <Plus size={14} />
            <span>เพิ่มภาคเสริม / ม็อดใหม่</span>
          </button>
        </div>

        {/* Row 2: Search Bar & Results Counter */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-white/5">
          <div className="relative flex-1 max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาชื่อภาค / รหัส EP, GP, SP / ม็อด / ผู้พัฒนา..."
              className="w-full bg-bg2/60 border border-white/10 rounded-xl pl-9 pr-8 py-2 text-xs text-white placeholder:text-text3/60 focus:outline-none focus:border-blue2 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text3 hover:text-white p-0.5"
                title="ล้างคำค้นหา"
              >
                <X size={12} />
              </button>
            )}
          </div>

          <div className="text-[11px] text-text3 shrink-0">
            แสดง <span className="text-white font-bold">{filteredPacks.length}</span> จากทั้งหมด {packs.length} รายการ
          </div>
        </div>
      </div>

      {/* Packs Table */}
      {loading ? (
        <div className="text-center py-20 bg-bg1/40 rounded-2xl border border-white/10 space-y-3">
          <Loader2 size={32} className="animate-spin text-blue3 mx-auto" />
          <p className="text-xs text-text3 font-bold">กำลังโหลดข้อมูลภาคเสริม The Sims 4...</p>
        </div>
      ) : filteredPacks.length > 0 ? (
        <div className="bg-bg1/40 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-text3 text-[10px] uppercase font-black tracking-wider">
                  <th className="py-3 px-4">รูปภาพปก</th>
                  <th className="py-3 px-4">รหัส (ID) / ชื่อภาค</th>
                  <th className="py-3 px-4">หมวดหมู่</th>
                  <th className="py-3 px-4">สถานะ / การปล่อย</th>
                  <th className="py-3 px-4">ผู้พัฒนา / ต้นฉบับ</th>
                  <th className="py-3 px-4 text-right">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredPacks.map((pack) => (
                  <tr key={pack.id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Cover Thumbnail */}
                    <td className="py-3 px-4 w-16">
                      <div className="w-12 h-16 rounded-lg bg-bg2 border border-white/10 overflow-hidden flex items-center justify-center relative">
                        {pack.coverImage ? (
                          <img src={pack.coverImage} alt={pack.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-[9px] font-black text-emerald-400">TS4</span>
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-white text-sm">{pack.name}</div>
                      <div className="text-[10px] text-text3 font-mono mt-0.5">{pack.id}</div>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-white/5 border border-white/10 text-text2">
                        {pack.category}
                      </span>
                    </td>

                    {/* Status & Release */}
                    <td className="py-3 px-4">
                      <div className="flex flex-col gap-1 items-start">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            pack.status === 'done'
                              ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                              : pack.status === 'wip'
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              pack.status === 'done'
                                ? 'bg-emerald-400'
                                : pack.status === 'wip'
                                ? 'bg-amber-400 animate-pulse'
                                : 'bg-purple-400'
                            }`}
                          />
                          {pack.status === 'done'
                            ? '✦ แปลเสร็จแล้ว'
                            : pack.status === 'wip'
                            ? `⟳ กำลังแปล (${pack.progress || 0}%)`
                            : '★ เตรียมแปล'}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold border ${
                            pack.isReleased !== false
                              ? 'bg-blue/15 text-blue3 border-blue2/30'
                              : 'bg-white/5 text-text3 border-white/10'
                          }`}
                        >
                          {pack.isReleased !== false ? '✓ ปล่อยแล้ว' : '○ ยังไม่ปล่อย'}
                        </span>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="py-3 px-4 text-[11px] text-text2">
                      <div>{pack.author || 'EA / Maxis'}</div>
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(pack)}
                          title="แก้ไข"
                          className="p-1.5 rounded-lg bg-blue-dim text-blue3 hover:bg-blue hover:text-white transition-colors border border-blue2/20"
                        >
                          <Edit2 size={13} />
                        </button>
                        <button
                          onClick={() => handleDelete(pack)}
                          title="ลบ"
                          className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-600 hover:text-white transition-colors border border-rose-500/20"
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
        </div>
      ) : (
        <div className="text-center py-16 bg-bg1/40 rounded-2xl border border-white/10 space-y-2">
          <p className="text-sm font-bold text-white">ไม่พบรายการภาคเสริมหรือม็อดที่ค้นหา</p>
          <p className="text-xs text-text3">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่น</p>
        </div>
      )}

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
          onClick={() => !saving && setModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl bg-bg1 border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden space-y-6 animate-scaleUp max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-black tracking-widest text-emerald-400 uppercase">
                  THE SIMS 4 DATA EDITOR
                </span>
                <h3 className="font-display text-xl sm:text-2xl font-black text-white">
                  {editingPack ? `แก้ไข: ${editingPack.name}` : 'เพิ่มภาคเสริม / ม็อดใหม่'}
                </h3>
              </div>
              <button
                disabled={saving}
                onClick={() => setModalOpen(false)}
                className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-text3 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ID / Slug */}
                <div>
                  <label className="block text-text3 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    รหัสเฉพาะ (ID / Slug)
                  </label>
                  <input
                    type="text"
                    disabled={!!editingPack}
                    value={formData.id || ''}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    placeholder="เช่น ep-life-death หรือ mod-mccc"
                    className="w-full bg-bg2 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue2 disabled:opacity-50"
                  />
                  <span className="text-[9px] text-text3">ใช้เป็นคีย์อ้างอิง (สร้างแล้วแก้ไขไม่ได้)</span>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-text3 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    หมวดหมู่ (Category)
                  </label>
                  <select
                    value={formData.category || 'expansion'}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full bg-bg2 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue2"
                  >
                    <option value="expansion">💎 Expansion Pack (ภาคเสริมใหญ่)</option>
                    <option value="gamepack">🎮 Game Pack (ชุดเกมเสริม)</option>
                    <option value="stuffpack">📦 Stuff Pack (ชุดไอเท็มเสริม)</option>
                    <option value="mod">⚡ Script Mod (ม็อดสคริปต์ & ระบบ)</option>
                  </select>
                </div>

                {/* Name */}
                <div className="sm:col-span-2">
                  <label className="block text-text3 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    ชื่อภาค / ม็อด ภาษาอังกฤษ <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="เช่น Life & Death หรือ UI Cheats Extension"
                    className="w-full bg-bg2 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue2"
                  />
                </div>

                {/* Release Status Toggle */}
                <div className="sm:col-span-2 p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <div className="text-white font-bold text-xs flex items-center gap-2">
                      <span>ปล่อยให้ดาวน์โหลดแล้ว (Released)</span>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${formData.isReleased !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-text3'}`}>
                        {formData.isReleased !== false ? '✦ ปล่อยแล้ว' : '⟳ ยังไม่ปล่อย'}
                      </span>
                    </div>
                    <div className="text-text3 text-[10px] mt-0.5">
                      ติ๊กเปิดหากม็อดภาคนี้เปิดให้ผู้เล่นดาวน์โหลดได้แล้ว (แม้เปอร์เซ็นต์แปลยังไม่ครบ 100% ก็ตาม)
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isReleased !== false}
                      onChange={(e) => setFormData({ ...formData, isReleased: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue"></div>
                  </label>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-text3 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    สถานะการแปล
                  </label>
                  <select
                    value={formData.status || 'done'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full bg-bg2 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue2"
                  >
                    <option value="done">🟢 แปลเสร็จแล้ว / พร้อมใช้งาน 100%</option>
                    <option value="wip">🟡 กำลังแปลและพัฒนา (In Progress)</option>
                    <option value="planned">🟣 เตรียมแปลในอนาคต (Coming Soon)</option>
                  </select>
                </div>

                {/* Progress % */}
                {formData.status === 'wip' && (
                  <div>
                    <label className="block text-text3 font-bold mb-1 uppercase tracking-wider text-[10px]">
                      ความคืบหน้า ({formData.progress || 0}%)
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={formData.progress || 0}
                      onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value, 10) })}
                      className="w-full accent-blue"
                    />
                  </div>
                )}

                {/* Author */}
                <div className="sm:col-span-2">
                  <label className="block text-text3 font-bold mb-1 uppercase tracking-wider text-[10px]">
                    ผู้สร้าง / ผู้พัฒนาต้นฉบับ
                  </label>
                  <input
                    type="text"
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    placeholder="เช่น Weerbesu, Deaderpool หรือ EA"
                    className="w-full bg-bg2 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue2"
                  />
                </div>
              </div>

              {/* Cover Image URL & Uploader */}
              <div>
                <label className="block text-text3 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  รูปภาพปก (Cover Image Path)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={formData.coverImage || ''}
                    onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                    placeholder="/uploads/ชื่อไฟล์.png หรือ URL รูปภาพ"
                    className="flex-1 bg-bg2 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue2"
                  />
                  <label className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold cursor-pointer transition-colors">
                    {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    <span>{uploading ? 'กำลังอัปโหลด...' : 'อัปโหลดรูป'}</span>
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                {formData.coverImage && (
                  <div className="mt-2.5 flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-3 min-w-0">
                      <img src={formData.coverImage} alt="Preview" className="w-12 h-16 object-cover rounded-lg border border-white/10 shadow-sm shrink-0" />
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-emerald-400">รูปภาพโปสเตอร์พร้อมใช้งาน</div>
                        <div className="text-[10px] text-text3 font-mono mt-0.5 truncate max-w-[280px] sm:max-w-md">{formData.coverImage}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, coverImage: '' }))}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                      title="ลบรูปภาพนี้"
                    >
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Download URL */}
              <div>
                <label className="block text-text3 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  ลิงก์ดาวน์โหลดม็อดนี้ (Download URL)
                </label>
                <input
                  type="url"
                  value={formData.downloadUrl || ''}
                  onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                  placeholder="https://www.nexusmods.com/... หรือ Google Drive"
                  className="w-full bg-bg2 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue2"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-text3 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  รายละเอียดงานแปลภาษาไทย
                </label>
                <textarea
                  rows={3}
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="อธิบายรายละเอียดเกี่ยวกับสิ่งที่แปลในภาคนี้..."
                  className="w-full bg-bg2 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-blue2 leading-relaxed"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-full text-text3 hover:text-white bg-white/5 hover:bg-white/10 font-bold transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-7 py-2.5 rounded-full text-white font-black bg-gradient-to-r from-blue via-blue2 to-blue3 hover:scale-105 transition-all shadow-lg disabled:opacity-50"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />}
                  <span>{editingPack ? 'บันทึกการแก้ไข' : 'เพิ่มภาคเสริม'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  )
}
