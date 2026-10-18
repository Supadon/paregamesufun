'use client'

import React from 'react'
import { CheckCircle2, Clock, ExternalLink, Activity, Layers } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ProgressModule {
  name: string
  progress: number
}

export interface GameProgressData {
  isMultiModule?: boolean
  translate?: number
  proofread?: number
  test?: number
  modules?: ProgressModule[]
  sheetUrl?: string
  sheetCell?: string
}

export interface ProgressBarProps {
  // Mode 1: Full High-Tech Game Progress Card
  overallProgress?: number
  progress?: GameProgressData
  isGoogleSheetSync?: boolean
  className?: string

  // Mode 2: Legacy single progress bar (backwards compatible)
  label?: string
  value?: number
  size?: 'sm' | 'lg'
  labelWidth?: string
}

export default function ProgressBar({
  overallProgress,
  progress,
  isGoogleSheetSync = false,
  className = '',
  label,
  value,
  size = 'sm',
  labelWidth,
}: ProgressBarProps) {
  // If legacy mode: called with `label` or just `value` without `overallProgress`
  if (overallProgress === undefined && value !== undefined) {
    const isDone = value >= 100
    const labelWidthClass = labelWidth || (size === 'lg' ? 'w-[140px] sm:w-[170px]' : 'w-[44px]')

    return (
      <div className={cn("group/bar flex items-center gap-3", size === 'lg' ? 'mb-3.5' : 'mb-2', className)}>
        {label && (
          <span className={cn("text-xs font-semibold text-text2 shrink-0 truncate pr-1 group-hover/bar:text-white transition-colors", labelWidthClass)} title={label}>
            {label}
          </span>
        )}
        <div className={cn("flex-1 rounded-full bg-black/60 border border-white/10 p-0.5 overflow-hidden shadow-inner", size === 'lg' ? 'h-3.5' : 'h-2.5')}>
          <div
            className={cn(
              'h-full rounded-full transition-all duration-700 ease-out relative',
              isDone
                ? 'bg-gradient-to-r from-blue via-teal-400 to-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.4)]'
                : 'bg-gradient-to-r from-blue-600 via-blue2 to-cyan-400 shadow-[0_0_12px_rgba(43,95,255,0.4)]'
            )}
            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.25),transparent)] opacity-60" />
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-white w-10 text-right shrink-0">
          {value}%
        </span>
      </div>
    )
  }

  // Modern High-Tech Sci-Fi HUD Progress Card
  const currentOverall = overallProgress !== undefined ? overallProgress : (value || 0)
  const isDone = currentOverall >= 100
  const p = progress || {}

  // Milestones for the notches
  const milestones = [0, 25, 50, 75, 100]

  return (
    <div className={cn(
      "liquid-glass-panel relative rounded-2xl p-5 sm:p-6 overflow-hidden group",
      isDone 
        ? "border-emerald-400/30 shadow-[0_16px_44px_-10px_rgba(0,0,0,0.65),0_0_32px_-8px_rgba(16,185,129,0.2),inset_0_1.5px_0_rgba(255,255,255,0.32)] hover:border-emerald-400/45"
        : "border-cyan-400/25 shadow-[0_16px_44px_-10px_rgba(0,0,0,0.65),0_0_32px_-8px_rgba(43,95,255,0.22),inset_0_1.5px_0_rgba(255,255,255,0.32)] hover:border-cyan-300/45",
      className
    )}>
      {/* Ambient background glow aura */}
      <div 
        className={cn(
          "absolute -top-16 -right-16 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-opacity duration-700",
          isDone ? "bg-emerald-500/18 group-hover:bg-emerald-500/28" : "bg-cyan-500/18 group-hover:bg-cyan-500/28"
        )} 
      />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 rounded-full bg-blue/12 blur-3xl pointer-events-none" />

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 mb-5 relative z-10">
        <div className="flex items-center gap-2.5">
          <div className={cn(
            "w-8 h-8 rounded-xl flex items-center justify-center border shadow-[inset_0_1px_0_rgba(255,255,255,0.35)] transition-colors",
            isDone 
              ? "bg-emerald-500/20 border-emerald-400/35 text-emerald-300" 
              : "bg-cyan-500/20 border-cyan-400/35 text-cyan-300"
          )}>
            <Activity size={15} className={cn(!isDone && "animate-pulse")} />
          </div>
          <div>
            <h3 className="text-xs font-black tracking-wider uppercase text-white flex items-center gap-1.5">
              <span>ความคืบหน้าการแปล</span>
              <span className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold border shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]",
                isDone ? "text-emerald-300 bg-emerald-500/15 border-emerald-400/25" : "text-cyan-300 bg-cyan-500/15 border-cyan-400/25"
              )}>
                HUD STATUS
              </span>
            </h3>
            <p className="text-[11px] text-text2">ภาพรวมความสมบูรณ์ของแพตช์แปลภาษาไทย</p>
          </div>
        </div>

        {isGoogleSheetSync && (
          <div className="flex items-center gap-2">
            <span className="liquid-glass-pill inline-flex items-center gap-1.5 text-[10px] text-cyan-200 px-3 py-1 rounded-full font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 -ml-3" />
              LIVE SYNCED
            </span>
          </div>
        )}
      </div>

      {/* Main Status & Big Metric */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-4 relative z-10">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2">
            <span
              className={cn(
                "inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-black border transition-all duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.35)]",
                isDone
                  ? "bg-emerald-500/18 text-emerald-200 border-emerald-400/45 shadow-[0_0_18px_rgba(16,185,129,0.28),inset_0_1px_0_rgba(255,255,255,0.35)]"
                  : "bg-cyan-500/18 text-cyan-200 border-cyan-400/45 shadow-[0_0_18px_rgba(6,182,212,0.28),inset_0_1px_0_rgba(255,255,255,0.35)]"
              )}
            >
              {isDone ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-300" />
                  <span>แปลภาษาไทยเสร็จสิ้นสมบูรณ์ 100%</span>
                </>
              ) : (
                <>
                  <Clock size={14} className="text-cyan-300 animate-spin-slow" />
                  <span>กำลังดำเนินการพัฒนาแปลไทย</span>
                </>
              )}
            </span>
          </div>
          <p className="text-xs text-text2 leading-relaxed">
            {isDone
              ? 'เนื้อเรื่องและระบบเกมได้รับการแปลและตรวจทานสมบูรณ์ พร้อมดาวน์โหลดเล่นได้เลย'
              : 'ทีมงานกำลังดำเนินการแปลและอัปเดตไฟล์อย่างต่อเนื่อง'}
          </p>
        </div>

        {/* Large High-Tech Percentage Display */}
        <div className="text-left sm:text-right flex items-baseline gap-1 sm:justify-end shrink-0">
          <span
            className={cn(
              "font-display text-4xl sm:text-5xl font-black tracking-tight",
              isDone
                ? "text-emerald-200 drop-shadow-[0_0_22px_rgba(52,211,153,0.45)]"
                : "text-star2 drop-shadow-[0_0_22px_rgba(74,127,255,0.5)]"
            )}
          >
            {currentOverall}
          </span>
          <span className={cn(
            "text-xl sm:text-2xl font-black font-mono",
            isDone ? "text-emerald-400" : "text-cyan-400"
          )}>
            %
          </span>
        </div>
      </div>

      {/* Main Cylindrical Liquid Glass Conduit Progress Bar */}
      <div className="space-y-2 relative z-10 mb-5">
        <div className="liquid-glass-tube w-full h-4 sm:h-5 rounded-full p-[3px] relative overflow-hidden flex items-center">
          
          {/* Animated Liquid Plasma Fill */}
          <div
            className={cn(
              "h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden",
              isDone
                ? "bg-gradient-to-r from-blue via-teal-400 to-emerald-400 shadow-[0_0_20px_rgba(52,211,153,0.65),inset_0_1px_1px_rgba(255,255,255,0.65)]"
                : "bg-gradient-to-r from-blue via-blue2 to-cyan-300 shadow-[0_0_20px_rgba(6,182,212,0.65),inset_0_1px_1px_rgba(255,255,255,0.65)]"
            )}
            style={{ width: `${Math.min(100, Math.max(0, currentOverall))}%` }}
          >
            {/* Top convex liquid sheen inside the fill */}
            <div className="absolute inset-x-1 top-[1px] h-[42%] rounded-full bg-gradient-to-b from-white/50 to-transparent pointer-events-none" />

            {/* Subtle cyber scanlines */}
            <div 
              className="absolute inset-0 opacity-15 bg-[linear-gradient(90deg,transparent_50%,rgba(0,0,0,0.6)_50%)] bg-[length:6px_6px]" 
            />

            {/* Liquid Meniscus Leading Edge Beacon */}
            {currentOverall > 3 && currentOverall < 100 && (
              <div className="absolute right-0.5 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_10px_#fff,0_0_18px_#38bdf8]" />
            )}
          </div>
        </div>

        {/* Milestone Notches (0% • 25% • 50% • 75% • 100%) */}
        <div className="flex justify-between items-center px-1 text-[10px] font-mono font-bold text-text3/60 select-none">
          {milestones.map((m) => {
            const isReached = currentOverall >= m
            return (
              <span
                key={m}
                className={cn(
                  "transition-colors duration-300 flex flex-col items-center gap-0.5",
                  isReached ? (isDone ? "text-emerald-300 font-extrabold" : "text-cyan-300 font-extrabold") : "text-text3/50"
                )}
              >
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  isReached ? (isDone ? "bg-emerald-400 shadow-[0_0_6px_#34d399]" : "bg-cyan-300 shadow-[0_0_6px_#67e8f9]") : "bg-white/15"
                )} />
                {m}%
              </span>
            )
          })}
        </div>
      </div>

      {/* Multi-Module Breakdown (if game has modules) */}
      {p.isMultiModule && p.modules && p.modules.length > 0 && (
        <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5 relative z-10">
          <div className="text-[10px] font-bold text-text2 uppercase tracking-wider flex items-center gap-1.5 mb-2">
            <Layers size={13} className="text-blue3" />
            <span>ความคืบหน้ารายพาร์ท / โมดูล ({p.modules.length} ส่วน)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {p.modules.map((m, idx) => (
              <div key={idx} className="liquid-glass-well p-3 rounded-xl space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-text1 truncate" title={m.name}>{m.name}</span>
                  <span className="text-star2 font-mono font-bold">{m.progress}%</span>
                </div>
                <div className="liquid-glass-tube w-full h-2 rounded-full p-[1.5px] overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue via-blue2 to-cyan-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]"
                    style={{ width: `${m.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Google Sheet Direct Link Footer (if available) */}
      {p.sheetUrl && (
        <div className="mt-3.5 pt-3 border-t border-white/10 flex justify-end relative z-10">
          <a
            href={p.sheetUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="liquid-glass-pill inline-flex items-center gap-1.5 text-xs text-cyan-200 hover:text-white px-4 py-1.5 rounded-full font-bold hover:border-cyan-400/50 hover:-translate-y-0.5"
          >
            <span className="relative z-10">เปิดดูตารางแปลภาษา Google Sheet</span>
            <ExternalLink size={12} className="relative z-10" />
          </a>
        </div>
      )}
    </div>
  )
}
