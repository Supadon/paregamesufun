import { TeamMember } from '@/lib/types'

interface TeamSectionProps {
  team: TeamMember[]
}

export default function TeamSection({ team }: TeamSectionProps) {
  return (
    <div className="bg-bg1/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 mb-4 shadow-xl">
      <div className="text-[10px] font-bold text-[#00D2FF] tracking-[1.5px] uppercase mb-2.5 flex items-center gap-1.5">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue" />
        ทีมงานผู้แปล (Credits)
      </div>
      <div className="flex gap-2 flex-wrap mt-2.5">
        {team.map((member, idx) => (
          <div
            key={idx}
            className="inline-flex items-center gap-2.5 p-1 pr-3.5 rounded-full bg-bg2 border border-border2"
          >
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
            <div>
              <div className="text-xs text-text2 font-bold leading-tight">{member.name}</div>
              <div className="text-[10px] text-text3 mt-0.5 leading-none">{member.role}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
