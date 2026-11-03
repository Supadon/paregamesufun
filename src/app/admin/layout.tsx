import { notFound } from 'next/navigation'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // ปิดการเข้าถึงหน้า /admin บนเว็บจริง (Production / Vercel) 100%
  // ให้เปิดใช้งานได้เฉพาะตอนรันแก้ไขบนเครื่องตัวเอง (npm run dev / localhost) เท่านั้น
  if (process.env.NODE_ENV === 'production' || process.env.VERCEL === '1') {
    notFound()
  }

  return <>{children}</>
}

