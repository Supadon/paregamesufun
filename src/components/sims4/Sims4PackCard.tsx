'use client'

import { Sims4Pack } from '@/lib/types'
import { Check, Clock, Download, Layers, Wrench, Package, Sparkle } from 'lucide-react'
import ThemedCard from '../ThemedCard'

interface Sims4PackCardProps {
  pack: Sims4Pack
  onSelect?: (pack: Sims4Pack) => void
}

export default function Sims4PackCard({ pack, onSelect }: Sims4PackCardProps) {
  // Only external / script mods or packs with a custom download link are clickable
  const isInteractive = pack.category === 'mod' || !!pack.downloadUrl
  const isReleased = pack.isReleased ?? (pack.status === 'done')

  // Status configs based on release flag
  const statusConfig = isReleased
    ? {
        label: pack.progress === 100 ? 'ปล่อยแล้ว 100%' : `ปล่อยแล้ว (${pack.progress}%)`,
        badgeClass: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]',
        dotClass: 'bg-emerald-400',
        icon: Check,
      }
    : {
        label: `ยังไม่ปล่อย (${pack.progress || 0}%)`,
        badgeClass: 'bg-amber-500/15 text-amber-300 border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]',
        dotClass: 'bg-amber-400 animate-pulse',
        icon: Clock,
      }

  // Category configs with distinct colors
  const categoryConfig = {
    expansion: {
      label: 'EXPANSION',
      thLabel: 'ภาคเสริมใหญ่',
      icon: Layers,
      color: 'emerald',
      badgeBg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      borderGlow: 'hover:border-emerald-400/50 hover:shadow-[0_8px_30px_rgba(16,185,129,0.2)]',
      accentColor: '#00E575',
    },
    gamepack: {
      label: 'GAME PACK',
      thLabel: 'ชุดเกมเสริม',
      icon: Package,
      color: 'purple',
      badgeBg: 'bg-purple-500/15 text-purple-300 border-purple-500/30',
      borderGlow: 'hover:border-purple-400/50 hover:shadow-[0_8px_30px_rgba(168,85,247,0.2)]',
      accentColor: '#A855F7',
    },
    stuffpack: {
      label: 'STUFF PACK',
      thLabel: 'ชุดไอเท็มเสริม',
      icon: Sparkle,
      color: 'cyan',
      badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      borderGlow: 'hover:border-cyan-400/50 hover:shadow-[0_8px_30px_rgba(34,211,238,0.2)]',
      accentColor: '#22D3EE',
    },
    mod: {
      label: 'SCRIPT MOD',
      thLabel: 'ม็อดสคริปต์',
      icon: Wrench,
      color: 'cyan',
      badgeBg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      borderGlow: 'hover:border-cyan-400/50 hover:shadow-[0_8px_30px_rgba(6,182,212,0.25)]',
      accentColor: '#06B6D4',
    },
  }[pack.category]

  const StatusIcon = statusConfig.icon
  const CategoryIcon = categoryConfig.icon

  return (
    <ThemedCard
      accent={categoryConfig.accentColor}
      onClick={isInteractive ? () => onSelect && onSelect(pack) : undefined}
      className={`group bg-bg1/80 border border-white/10 rounded-2xl overflow-hidden flex flex-col backdrop-blur-md shadow-lg select-none ${
        isInteractive ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      {/* Visual Poster Area — clean artwork, framed with cyber HUD brackets */}
      <div className="relative w-full aspect-[7/10] overflow-hidden bg-bg2/80">
        {pack.coverImage ? (
          <>
            <img
              src={pack.coverImage}
              alt={pack.name}
              loading="lazy"
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                isReleased ? '' : 'saturate-[0.55] brightness-90'
              }`}
            />
            {/* Soft fade into the info panel */}
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-bg1/90 to-transparent pointer-events-none" />
          </>
        ) : (
          /* High-Quality Themed Fallback Artwork */
          <div className="w-full h-full p-4 flex flex-col justify-between relative overflow-hidden bg-gradient-to-b from-bg2 via-bg1 to-bg0">
            <div
              className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 blur-2xl pointer-events-none group-hover:opacity-40 transition-opacity"
              style={{ backgroundColor: categoryConfig.accentColor }}
            />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-blue/15 blur-xl pointer-events-none" />

            <div className="absolute inset-0 flex items-center justify-center opacity-[0.08] group-hover:opacity-[0.16] transition-opacity pointer-events-none">
              <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
                <polygon points="50,5 90,50 50,95 10,50" stroke={categoryConfig.accentColor} strokeWidth="2" fill={`${categoryConfig.accentColor}20`} />
                <polygon points="50,18 78,50 50,82 22,50" stroke="#EEF4FF" strokeWidth="1" />
              </svg>
            </div>

            <span className="relative z-10 text-[10px] font-black tracking-widest text-text3 flex items-center gap-1">
              <span
                className="w-1.5 h-1.5 rotate-45 inline-block"
                style={{ backgroundColor: categoryConfig.accentColor, boxShadow: `0 0 6px ${categoryConfig.accentColor}` }}
              />
              THE SIMS 4
            </span>

            <div className="my-auto text-center relative z-10 px-2 py-3">
              <h3 className="font-display text-[15px] sm:text-[16px] font-black text-white leading-snug drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] line-clamp-3">
                {pack.name}
              </h3>
            </div>

            <div className="h-3" />
          </div>
        )}
      </div>

      {/* Card Info Area — Liquid Glass Dock with Specular Top Rim */}
      <div className="p-3 flex-1 flex flex-col gap-2.5 bg-[linear-gradient(180deg,rgba(15,24,72,0.78)_0%,rgba(6,11,34,0.92)_100%)] backdrop-blur-md backdrop-saturate-150 border-t border-white/15 shadow-[inset_0_1px_0_rgba(255,255,255,0.24)]">
        {/* Row 1: category eyebrow */}
        <div
          className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider"
          style={{ color: categoryConfig.accentColor }}
        >
          <CategoryIcon size={11} className="shrink-0" />
          <span className="truncate">{categoryConfig.label}</span>
        </div>

        {/* Row 2: name + author */}
        <div className="min-w-0">
          <h4 className="font-bold text-[13.5px] text-white leading-snug line-clamp-2">
            {pack.name}
          </h4>
          {pack.author && (
            <p className="text-[10px] text-text2 font-medium mt-1 line-clamp-1">
              ผู้สร้าง: {pack.author}
            </p>
          )}
        </div>

        {/* Row 3: release status + cylindrical glass progress tube */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border whitespace-nowrap shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] ${statusConfig.badgeClass}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotClass}`} />
              {isReleased ? 'ปล่อยแล้ว' : 'ยังไม่ปล่อย'}
            </span>
            <span className={`text-[11px] font-black tabular-nums ${isReleased ? 'text-emerald-300' : 'text-amber-300'}`}>
              {pack.progress ?? 0}%
            </span>
          </div>
          <div className="liquid-glass-tube h-2 rounded-full p-[1.5px] overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                isReleased
                  ? 'bg-gradient-to-r from-emerald-400 to-cyan-300 shadow-[0_0_8px_rgba(52,211,153,0.5),inset_0_1px_0_rgba(255,255,255,0.5)]'
                  : 'bg-gradient-to-r from-amber-400 to-yellow-300 shadow-[0_0_8px_rgba(251,191,36,0.45),inset_0_1px_0_rgba(255,255,255,0.5)]'
              }`}
              style={{ width: `${pack.progress ?? 0}%` }}
            />
          </div>
        </div>

        {/* Row 4: footer info & actions */}
        <div className="mt-auto pt-2 border-t border-white/10 flex items-center justify-between gap-2 text-[11px]">
          <span className="text-[10px] text-text2 font-medium">
            {isInteractive ? 'ม็อดเสริม' : 'ไฟล์แปลไทย'}
          </span>

          <div className="shrink-0 flex items-center gap-1.5">
            {isInteractive ? (
              pack.downloadUrl ? (
                <span
                  onClick={(e) => {
                    e.stopPropagation()
                    window.open(pack.downloadUrl, '_blank')
                  }}
                  className="liquid-glass-cta inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white cursor-pointer"
                  title="ดาวน์โหลดม็อดนี้"
                >
                  <Download size={10} className="relative z-10" />
                  <span className="relative z-10">โหลด</span>
                </span>
              ) : (
                <span className="text-[10.5px] font-semibold text-text2 group-hover:text-emerald-300 transition-colors">
                  ดูข้อมูล →
                </span>
              )
            ) : (
              <span className={`text-[10.5px] font-bold whitespace-nowrap ${isReleased ? 'text-emerald-400' : 'text-amber-300/80'}`}>
                {isReleased ? '✓ รวมในตัวหลัก' : 'เร็ว ๆ นี้'}
              </span>
            )}
          </div>
        </div>
      </div>
    </ThemedCard>
  )
}
