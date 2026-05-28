import { Heart, ShieldCheck } from 'lucide-react'

export default function DonatePage() {
  return (
    <div className="max-w-[780px] mx-auto px-6 py-6 pt-28 pb-16">
      
      {/* Header */}
      <div className="text-center mb-8 relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue/10 rounded-full blur-[40px] pointer-events-none" />
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-blue-dim border border-[rgba(43,95,255,0.25)] text-blue3 mb-4 shadow-[0_0_20px_rgba(43,95,255,0.15)]">
          <Heart size={26} className="fill-current animate-pulse" />
        </div>
        <h1 className="text-[28px] md:text-[34px] font-extrabold text-white mb-2.5 tracking-tight">
          สนับสนุนผู้แปล <span className="bg-gradient-to-r from-blue2 via-blue3 to-star2 bg-clip-text text-transparent">แปลเกมสู่ฝัน</span>
        </h1>
        <p className="text-[14px] text-text2 max-w-[540px] mx-auto leading-[1.6]">
          ทุกการสนับสนุนของคุณจะเป็นทุนค่ากาแฟ ค่าไฟ
          และจัดซื้อตัวเกมลิขสิทธิ์สำหรับการแกะโค้ดแปลไทย เพื่อให้ผู้เล่นไทยทุกคนได้สัมผัสเกมโปรดโดยไม่มีกำแพงภาษา ฟรี 100%
        </p>
      </div>

      {/* Donation Methods Container */}
      <div className="space-y-8">
        
        {/* Method: Bank & Wallet Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-[600px] mx-auto">
          
          {/* MAKE by KBank Card */}
          <div className="w-full aspect-[2/3] rounded-4xl overflow-hidden bg-white p-2.5 shadow-[0_12px_45px_rgba(0,0,0,0.5)] hover:scale-[1.02] transition-transform duration-300">
            <img 
              src="/kbank-qr.jpg" 
              alt="MAKE by KBank QR Code" 
              className="w-full h-full object-contain rounded-xl" 
            />
          </div>

          {/* TrueMoney Wallet Card */}
          <div className="w-full aspect-[2/3] rounded-4xl overflow-hidden bg-white p-2.5 shadow-[0_12px_45px_rgba(0,0,0,0.5)] hover:scale-[1.02] transition-transform duration-300">
            <img 
              src="/truemoney-qr.jpg" 
              alt="TrueMoney Wallet QR Code" 
              className="w-full h-full object-contain rounded-xl" 
            />
          </div>

        </div>

        {/* Informational Guidelines Card */}
        <div className="bg-bg1 border border-border2 rounded-xl p-5 shadow-lg max-w-[640px] mx-auto">
          <div className="text-xs text-text3 uppercase font-bold tracking-[1px] mb-3 flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-blue3" />
            ข้อตกลงและการชี้แจงผู้สนับสนุน
          </div>
          <ul className="space-y-2.5 text-xs text-text2 leading-relaxed pl-1 list-none">
            <li className="flex gap-2">
              <span className="text-blue3 shrink-0">✦</span>
              <span><strong>เจตนาแปลภาษาฟรี:</strong> การพัฒนาและจัดทำตัวแปลภาษาไทย (Mod) ทั้งหมดจะให้บริการ <strong>ฟรี 100%</strong> ไม่มีระบบสิทธิพิเศษสำหรับผู้โดเนท เพื่อให้ทุกคนได้เข้าถึงอย่างเท่าเทียม</span>
            </li>
            <li className="flex gap-2">
              <span className="text-blue3 shrink-0">✦</span>
              <span><strong>สนับสนุนด้วยความสมัครใจ:</strong> ยอดเงินบริจาคทั้งหมดถือเป็นการสนับสนุนตามความพึงพอใจและสมัครใจ เพื่อผลักดันการทำงานของนักแปลอิสระ</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  )
}
