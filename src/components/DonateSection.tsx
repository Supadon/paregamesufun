'use client'

import React, { useState } from 'react'
import { Heart, ShieldCheck, Coffee, Sparkles, Maximize2, X, Check } from 'lucide-react'

interface DonateSectionProps {
  variant?: 'default' | 'standalone'
  className?: string
  title?: string
  subtitle?: string
}

export default function DonateSection({
  variant = 'default',
  className = '',
  title = 'สนับสนุนผู้แปล แปลเกมสู่ฝัน',
  subtitle = 'ทุกการสนับสนุนคือค่ากาแฟและค่าไฟ ช่วยเติมพลังให้เราพัฒนาผลงานม็อดแปลไทย ให้ทุกคนได้เล่นเกมโปรดในเวอร์ชันภาษาไทยแบบฟรี 100%',
}: DonateSectionProps) {
  const [activeQr, setActiveQr] = useState<{ src: string; title: string; subtitle: string } | null>(null)
  const [copiedBank, setCopiedBank] = useState<string | null>(null)

  const handleCopyPrompt = (name: string) => {
    setCopiedBank(name)
    setTimeout(() => setCopiedBank(null), 2000)
  }

  return (
    <section className={`relative group ${className}`}>
      {/* Background Cosmic Glow Aura */}
      <div className="absolute -inset-1 bg-gradient-to-r from-pink-500/20 via-purple-600/20 to-blue/20 rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Main Container Card */}
      <div className="relative rounded-3xl border border-white/15 bg-gradient-to-b from-bg1/90 via-bg2/85 to-bg1/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        
        {/* Decorative corner light accents */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Header */}
        <div className="text-center max-w-xl mx-auto space-y-3 mb-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-300 text-xs font-bold shadow-[0_0_15px_rgba(244,114,182,0.2)]">
            <Heart size={14} className="fill-pink-400 text-pink-400 animate-pulse" />
            <span>ร่วมเป็นส่วนหนึ่งในการขับเคลื่อนม็อด</span>
            <Sparkles size={13} className="text-pink-300" />
          </div>

          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-black text-white tracking-tight leading-tight">
            {title.includes('แปลเกมสู่ฝัน') ? (
              <>
                สนับสนุนผู้แปล{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-cyan-300">
                  แปลเกมสู่ฝัน
                </span>
              </>
            ) : (
              title
            )}
          </h2>

          <p className="text-xs sm:text-sm text-text2 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* QR Code Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-[580px] mx-auto relative z-10">
          
          {/* Card 1: MAKE by KBank */}
          <div 
            onClick={() => setActiveQr({
              src: '/kbank-qr.jpg',
              title: 'MAKE by KBank',
              subtitle: 'สแกนผ่านแอปธนาคาร / พร้อมเพย์'
            })}
            className="group/card cursor-pointer rounded-2xl border border-emerald-500/30 hover:border-emerald-400/80 bg-gradient-to-b from-emerald-950/20 via-bg1 to-bg2 p-4 transition-all duration-300 hover:shadow-[0_12px_35px_rgba(16,185,129,0.25)] hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                <span className="text-xs font-black text-emerald-300 tracking-wide">MAKE by KBank</span>
              </div>
              <span className="text-[10px] text-text3 flex items-center gap-1 group-hover/card:text-emerald-300 transition-colors">
                <Maximize2 size={11} />
                แตะเพื่อขยาย
              </span>
            </div>

            <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-inner">
              <img
                src="/kbank-qr.jpg"
                alt="MAKE by KBank QR Code"
                className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex items-end justify-center pb-3">
                <span className="text-xs font-bold text-white bg-black/80 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                  <Maximize2 size={12} />
                  คลิกเพื่อดูภาพเต็ม
                </span>
              </div>
            </div>

            <div className="mt-3 text-center">
              <p className="text-[11px] text-text3">รองรับทุกแอปธนาคาร / พร้อมเพย์</p>
            </div>
          </div>

          {/* Card 2: TrueMoney Wallet */}
          <div 
            onClick={() => setActiveQr({
              src: '/truemoney-qr.jpg',
              title: 'TrueMoney Wallet',
              subtitle: 'สแกนผ่านแอป TrueMoney Wallet'
            })}
            className="group/card cursor-pointer rounded-2xl border border-amber-500/30 hover:border-amber-400/80 bg-gradient-to-b from-amber-950/20 via-bg1 to-bg2 p-4 transition-all duration-300 hover:shadow-[0_12px_35px_rgba(245,158,11,0.25)] hover:-translate-y-1"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                <span className="text-xs font-black text-amber-300 tracking-wide">TrueMoney Wallet</span>
              </div>
              <span className="text-[10px] text-text3 flex items-center gap-1 group-hover/card:text-amber-300 transition-colors">
                <Maximize2 size={11} />
                แตะเพื่อขยาย
              </span>
            </div>

            <div className="relative aspect-[2/3] w-full rounded-xl overflow-hidden border border-white/10 bg-black/40 shadow-inner">
              <img
                src="/truemoney-qr.jpg"
                alt="TrueMoney Wallet QR Code"
                className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity flex items-end justify-center pb-3">
                <span className="text-xs font-bold text-white bg-black/80 px-3 py-1 rounded-full border border-white/20 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                  <Maximize2 size={12} />
                  คลิกเพื่อดูภาพเต็ม
                </span>
              </div>
            </div>

            <div className="mt-3 text-center">
              <p className="text-[11px] text-text3">สแกนชำระด้วยแอปทรูมันนี่ วอลเล็ท</p>
            </div>
          </div>

        </div>

        {/* Reassurance & Terms Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 max-w-xl mx-auto relative z-10">
          <div className="flex items-center justify-center gap-2 text-xs font-bold text-text3 uppercase tracking-wider mb-2">
            <ShieldCheck size={14} className="text-cyan-400" />
            <span>ข้อตกลงและเจตนารมณ์</span>
          </div>
          <div className="text-[11px] sm:text-xs text-text2 leading-relaxed space-y-1.5 text-center">
            <p>
              ✦ <strong className="text-white">แปลภาษาฟรี 100%:</strong> ม็อดทั้งหมดเปิดให้ดาวน์โหลดเล่นฟรีสำหรับทุกคน ไม่มีระบบ VIP หรือกั๊กเนื้อหา
            </p>
            <p>
              ✦ <strong className="text-white">สนับสนุนด้วยความสมัครใจ:</strong> ยอดเงินทั้งหมดถือเป็นกำลังใจและสินน้ำใจเพื่อช่วยเหลือนักแปล ขอบพระคุณมากค้าบ 🙏
            </p>
          </div>
        </div>

      </div>

      {/* Fullscreen Lightbox Modal for Scanning Ease */}
      {activeQr && (
        <div 
          onClick={() => setActiveQr(null)}
          className="fixed inset-0 z-[400] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
        >
          <button
            onClick={() => setActiveQr(null)}
            className="absolute top-5 right-5 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-10"
            title="ปิดหน้าต่างสแกน"
          >
            <X size={20} />
          </button>

          <div 
            onClick={(e) => e.stopPropagation()} 
            className="relative max-w-sm w-full bg-bg1 border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4 text-center"
          >
            <div>
              <h3 className="text-lg font-black text-white">{activeQr.title}</h3>
              <p className="text-xs text-text2">{activeQr.subtitle}</p>
            </div>

            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-white/15 bg-black shadow-lg">
              <img
                src={activeQr.src}
                alt={activeQr.title}
                className="w-full h-full object-contain"
              />
            </div>

            <p className="text-xs text-text3">
              สามารถแคปหน้าจอหรือเปิดแอปธนาคาร / ทรูมันนี่ เพื่อสแกนภาพนี้ได้ทันที
            </p>

            <button
              onClick={() => setActiveQr(null)}
              className="w-full py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
            >
              ปิดหน้าต่าง
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
