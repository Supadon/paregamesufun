export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-[rgba(100,150,255,0.08)] py-[32px] px-6 text-center relative z-[1] bg-[rgba(4,7,26,0.8)] backdrop-blur-sm">
      <div className="max-w-[1100px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-text3">
        <p className="text-[13px]">
          สร้างด้วย <span className="text-blue3">✦</span> โดย <span className="text-text2 font-semibold">แปลเกมสู่ฝัน</span> &nbsp;·&nbsp; แปลฟรีเพื่อชุมชนเกมเมอร์ไทย
        </p>
        <p className="text-[12px] tracking-wide">
          &copy; {currentYear} แปลเกมสู่ฝัน All rights reserved.
        </p>
      </div>
    </footer>
  )
}
