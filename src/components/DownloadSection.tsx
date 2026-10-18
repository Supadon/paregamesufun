import { DownloadLink } from '@/lib/types'
import { Download, Cloud } from 'lucide-react'

interface DownloadSectionProps {
  downloads?: DownloadLink[] | null
}

/**
 * Validates whether a download URL is a real working link.
 * Rejects empty strings, hashes (#), javascript: protocols,
 * and placeholder texts like "เร็วๆนี้", "-", "none".
 */
export function isValidDownloadUrl(url?: string | null): boolean {
  if (!url) return false
  const trimmed = url.trim()
  if (
    !trimmed ||
    trimmed === '#' ||
    trimmed === '/' ||
    trimmed.toLowerCase().startsWith('javascript:')
  ) {
    return false
  }

  const placeholders = [
    'เร็วๆนี้',
    'เร็ว ๆ นี้',
    'ยังไม่มี',
    'ไม่มี',
    'none',
    'n/a',
    '-',
    'null',
    'undefined',
  ]
  if (placeholders.includes(trimmed.toLowerCase())) {
    return false
  }

  // Must start with http://, https://, or /uploads/ or /files/ or look like a valid web domain
  const isHttp = /^https?:\/\//i.test(trimmed)
  const isRelative = trimmed.startsWith('/') && trimmed.length > 1
  const isDomain = /^[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}/.test(trimmed)

  return isHttp || isRelative || isDomain
}

/**
 * Ensures external links have https:// prepended if omitted.
 */
export function getSafeDownloadUrl(url: string): string {
  const trimmed = url.trim()
  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('/')
  ) {
    return trimmed
  }
  return `https://${trimmed}`
}

export default function DownloadSection({ downloads }: DownloadSectionProps) {
  const validDownloads = (downloads || []).filter(
    (dl) => dl && isValidDownloadUrl(dl.url)
  )

  if (validDownloads.length === 0) {
    return null
  }

  return (
    <div className="liquid-glass-panel rounded-2xl p-5 mb-4 overflow-hidden">
      <div className="relative z-10 text-[10px] font-bold text-blue3 tracking-[1.5px] uppercase mb-3.5 flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue3 shadow-[0_0_8px_#6FA0FF] animate-pulse" />
        ดาวน์โหลดตัวแปล (Downloads)
      </div>
      <div className="relative z-10 flex flex-col gap-2.5 mt-3.5">
        {validDownloads.map((dl, idx) => (
          <a
            key={idx}
            href={getSafeDownloadUrl(dl.url)}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-xl text-[14px] font-extrabold no-underline transform group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue2 ${
              dl.type === 'primary'
                ? 'liquid-glass-cta text-white hover:-translate-y-[2px] hover:scale-[1.01]'
                : 'liquid-glass-pill text-text1 hover:text-white hover:border-blue3/40 hover:-translate-y-[1px] hover:scale-[1.005]'
            }`}
          >
            {dl.type === 'primary' ? (
              <Download
                size={16}
                className="relative z-10 shrink-0 transition-transform duration-300 group-hover:translate-y-[2px]"
              />
            ) : (
              <Cloud size={16} className="relative z-10 shrink-0 text-blue3" />
            )}
            <span className="relative z-10 drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">{dl.label?.trim() || 'เข้าสู่หน้าดาวน์โหลด'}</span>
          </a>
        ))}
      </div>
    </div>
  )
}

