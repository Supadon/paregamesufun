import { DownloadLink } from '@/lib/types'
import { Download, Cloud } from 'lucide-react'

interface DownloadSectionProps {
  downloads: DownloadLink[]
}

export default function DownloadSection({ downloads }: DownloadSectionProps) {
  return (
    <div className="bg-bg1/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 mb-4 relative overflow-hidden shadow-xl">
      <div className="text-[10px] font-bold text-blue3 tracking-[1.5px] uppercase mb-3.5 flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue animate-pulse" />
        ดาวน์โหลดตัวแปล (Downloads)
      </div>
      <div className="flex flex-col gap-2.5 mt-3.5">
        {downloads.map((dl, idx) => (
          <a
            key={idx}
            href={dl.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-5 rounded-xl text-[14px] font-extrabold no-underline transition-all duration-300 transform group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue2 ${
              dl.type === 'primary'
                ? 'bg-gradient-to-r from-blue via-blue2 to-blue3 text-white shadow-[0_8px_20px_rgba(43,95,255,0.25)] hover:shadow-[0_12px_30px_rgba(43,95,255,0.5)] hover:-translate-y-[2px] hover:scale-[1.01] border border-[rgba(255,255,255,0.15)]'
                : 'bg-white/5 text-text1 border border-white/10 hover:bg-white/10 hover:border-white/20 hover:-translate-y-[1px] hover:scale-[1.005]'
            }`}
          >
            {dl.type === 'primary' ? (
              <Download size={16} className="shrink-0 transition-transform duration-300 group-hover:translate-y-[2px]" />
            ) : (
              <Cloud size={16} className="shrink-0" />
            )}
            <span>{dl.label}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
