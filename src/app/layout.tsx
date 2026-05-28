import type { Metadata } from "next";
import { Sarabun, Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StarField from "@/components/StarField";
import Footer from "@/components/Footer";

const sarabun = Sarabun({
  variable: "--font-sarabun",
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "แปลเกมสู่ฝัน — Thai Game Translation",
  description:
    "นักแปลเกม PC อิสระชาวไทย แปลเกมภาษาอังกฤษให้เป็นไทย เพื่อให้ทุกคนได้สัมผัสเกมที่ตัวเองรักโดยไม่มีกำแพงภาษา แปลฟรี 100%",
  keywords: ["แปลเกม", "Thai game translation", "แปลเกมสู่ฝัน", "mod ภาษาไทย"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" data-scroll-behavior="smooth" className={`${sarabun.variable} ${notoSansThai.variable}`}>
      <body className="min-h-screen flex flex-col">
        <StarField />
        <Navbar />
        <main className="flex-1 relative">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
