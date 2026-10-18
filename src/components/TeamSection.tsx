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
    <div className="liquid-glass-panel rounded-2xl p-5 mb-4">
      <div className="relative z-10 text-[10px] font-bold text-blue3 tracking-[1.5px] uppercase mb-2.5 flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue3 shadow-[0_0_8px_#6FA0FF]" />
        ทีมงานผู้แปล (Credits)
      </div>
      <div className="relative z-10 flex gap-2 flex-wrap mt-2.5">
        {team.map((member, idx) => {
          const memberUrl = getSafeUrl(member.link || member.url)

          const content = (
            <>
              {member.avatar ? (
                <img 
                  src={member.avatar} 
                  alt={member.name} 
                  className="relative z-10 w-8 h-8 rounded-full object-cover border border-white/25 shadow-[0_2px_8px_rgba(0,0,0,0.4)] shrink-0"
                />
              ) : (
                <div className="relative z-10 w-8 h-8 rounded-full bg-blue/25 border border-white/20 text-star2 text-[11px] font-bold flex items-center justify-center shrink-0 shadow-inner">
                  {member.name ? member.name.slice(0, 2) : '??'}
                </div>
              )}
              <div className="relative z-10 min-w-0 pr-0.5">
                <div className="text-xs text-text1 font-bold leading-tight flex items-center gap-1">
                  <span className="truncate">{member.name}</span>
                  {memberUrl && (
                    <ExternalLink size={10} className="text-blue3 shrink-0 opacity-75 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                  )}
                </div>
                <div className="text-[10px] text-text2 mt-0.5 leading-none truncate">{member.role}</div>
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
                className="liquid-glass-pill group inline-flex items-center gap-2.5 p-1 pr-3.5 rounded-full hover:border-blue3/55 hover:-translate-y-0.5 no-underline"
              >
                {content}
              </a>
            )
          }

          return (
            <div
              key={idx}
              className="liquid-glass-pill inline-flex items-center gap-2.5 p-1 pr-3.5 rounded-full"
            >
              {content}
            </div>
          )
        })}
      </div>
    </div>
  )
}

