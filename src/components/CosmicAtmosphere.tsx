'use client'

export default function CosmicAtmosphere() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 select-none">
      {/* 1. Deep Atmospheric Radial Ambient Glows */}
      {/* Left-top aura: Cosmic Violet / Indigo */}
      <div 
        className="absolute -top-[10%] -left-[15%] w-[60vw] h-[60vw] max-w-[850px] max-h-[850px] rounded-full blur-[140px] opacity-65"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.12) 40%, transparent 70%)',
        }}
      />

      {/* Right-top aura: Electric Cyan / Sky Blue */}
      <div 
        className="absolute top-[5%] -right-[15%] w-[65vw] h-[65vw] max-w-[900px] max-h-[900px] rounded-full blur-[140px] opacity-70"
        style={{
          background: 'radial-gradient(circle, rgba(6,182,212,0.22) 0%, rgba(43,95,255,0.18) 45%, transparent 70%)',
        }}
      />

      {/* Center showcase aura: Vivid Azure Blue */}
      <div 
        className="absolute top-[28%] left-1/2 -translate-x-1/2 w-[75vw] h-[450px] max-w-[1100px] rounded-full blur-[120px] opacity-50"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(43,95,255,0.22) 0%, rgba(0,210,255,0.08) 50%, transparent 75%)',
        }}
      />

      {/* Bottom-left aura: Deep Indigo */}
      <div 
        className="absolute top-[65%] -left-[10%] w-[50vw] h-[50vw] max-w-[700px] max-h-[700px] rounded-full blur-[130px] opacity-45"
        style={{
          background: 'radial-gradient(circle, rgba(79,70,229,0.18) 0%, rgba(30,58,138,0.1) 50%, transparent 70%)',
        }}
      />

      {/* Bottom-right aura: Cosmic Violet / Rose tint matching reference */}
      <div 
        className="absolute top-[75%] -right-[10%] w-[55vw] h-[55vw] max-w-[750px] max-h-[750px] rounded-full blur-[140px] opacity-50"
        style={{
          background: 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, rgba(217,70,239,0.08) 40%, transparent 70%)',
        }}
      />



      {/* 3. Right Neon Edge Rim Light (as seen prominently in the reference screenshot) */}
      <div className="absolute right-0 top-[22%] h-[420px] w-[3px] hidden sm:block">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-cyan-400 to-blue rounded-l-full shadow-[0_0_18px_#00D2FF,0_0_35px_#2B5FFF]" />
      </div>

      {/* 4. Left Neon Edge Rim Light */}
      <div className="absolute left-0 top-[45%] h-[320px] w-[3px] hidden sm:block">
        <div className="h-full w-full bg-gradient-to-b from-transparent via-indigo-500 to-transparent rounded-r-full shadow-[0_0_16px_#6366F1]" />
      </div>

      {/* 5. Subtle Grid Pattern */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(100,150,255,0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(100,150,255,0.4) 1px, transparent 1px)
          `,
          backgroundSize: '72px 72px',
        }}
      />
    </div>
  )
}
