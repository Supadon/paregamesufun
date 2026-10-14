import { TeamMember } from '@/lib/types'
import { ExternalLink } from 'lucide-react'

interface TeamSectionProps {
  team: TeamMember[]
}

function getSafeUrl(url?: string): string | null {
  if (!url) return null
  const trimmed = url.trim()
  if (!trimmed || trimmed === '#' || trimmed.toLowerCase().startsWith('javascript:')) return null
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed
  if (trimmed.startsWith('/')) return trimmed
  if (/^[a-zA-Z0-9][-a-zA-Z0-9]*\.[a-zA-Z]{2,}/.test(trimmed)) {
    return `https://${trimmed}`
  }
  return null
}

export default function TeamSection({ team }: TeamSectionProps) {
  if (!team || team.length === 0) return null

  return (
    <div className="bg-bg1/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 mb-4 shadow-xl">
      <div className="text-[10px] font-bold text-blue3 tracking-[1.5px] uppercase mb-2.5 flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue" />
        ทีมงานผู้แปล (Credits)
      </div>
      <div className="flex gap-2 flex-wrap mt-2.5">
        {team.map((member, idx) => {
          const memberUrl = getSafeUrl(member.link || member.url)

          const content = (
            <>
              {member.avatar ? (
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="w-8 h-8 rounded-full object-cover border border-[rgba(100,150,255,0.25)] shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-dim text-blue3 text-[11px] font-bold flex items-center justify-center shrink-0">
                  {member.name ? member.name.slice(0, 2) : '??'}
                </div>
              )}
              <div className="min-w-0 pr-0.5">
                <div className="text-xs text-text2 font-bold leading-tight flex items-center gap-1">
                  <span className="truncate">{member.name}</span>
                  {memberUrl && (
                    <ExternalLink size={10} className="text-blue3 shrink-0 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  )}
                </div>
                <div className="text-[10px] text-text3 mt-0.5 leading-none truncate">{member.role}</div>
              </div>
            </>
          )

          if (memberUrl) {
            return (
              <a
                key={idx}
                href={memberUrl}
                target="_blank"
                rel="noopener noreferrer"
                title={`ดูโปรไฟล์ / ช่องทางของ ${member.name}`}
                className="group inline-flex items-center gap-2.5 p-1 pr-3 rounded-full bg-bg2 border border-border2 hover:border-blue2/50 hover:bg-white/5 hover:-translate-y-0.5 transition-all duration-200 no-underline shadow-sm"
              >
                {content}
              </a>
            )
          }

          return (
            <div
              key={idx}
              className="inline-flex items-center gap-2.5 p-1 pr-3.5 rounded-full bg-bg2 border border-border2"
            >
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}

