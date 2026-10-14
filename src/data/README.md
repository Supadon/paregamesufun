# 📁 ข้อมูลเกมและรูปภาพ (Local JSON & Public Assets)

โปรเจกต์นี้ทำงานในรูปแบบ **Local JSON** 100% ไม่ต้องเชื่อมต่อ Database ภายนอก และพร้อมสำหรับ Deploy ขึ้น **Vercel** ได้ทันที

---

## 1. การแก้ไข / เพิ่มข้อมูลเกม

ไฟล์ข้อมูลหลักอยู่ที่:
`src/data/games.json`

### ตัวอย่างโครงสร้างข้อมูลเกม 1 เกม:
```json
{
  "id": 1,
  "slug": "the-sims-4",
  "title": "The Sims 4",
  "genre": "Simulation / Life",
  "emoji": "💎",
  "status": "done",
  "progress": {
    "translate": 100,
    "proofread": 100,
    "test": 100,
    "isMultiModule": false
  },
  "version": "v1.107",
  "client": "EA App, Steam",
  "translationVersion": "1.0",
  "shortDescription": "แปลภาษาไทยสำหรับภาคหลักและส่วนเสริม (DLC) ครบสมบูรณ์ 100%",
  "description": "ม็อดภาษาไทยสมบูรณ์แบบสำหรับเกม The Sims 4...",
  "overview": "The Sims 4 คือเกมแนวจำลองชีวิตยอดนิยม...",
  "translationScope": [
    "เมนูและ UI หลัก",
    "ความปรารถนาและปณิธาน",
    "ปฏิสัมพันธ์ระหว่างซิมส์"
  ],
  "videoUrl": "https://www.youtube.com/embed/z00mK3Pxc8w",
  "coverImage": "/uploads/sims_cover_art.png",
  "posterImage": "/uploads/sims_poster_art.png",
  "fileSize": "32 MB",
  "updatedAt": "2026-05-28",
  "team": [
    {
      "name": "แปลเกมสู่ฝัน",
      "role": "ผู้แปลหลัก",
      "avatar": "/logo.jpg"
    }
  ],
  "downloads": [
    {
      "label": "เข้าสู่หน้าดาวน์โหลด",
      "url": "https://www.nexusmods.com",
      "type": "primary"
    }
  ],
  "instructions": [
    {
      "text": "1. แตกไฟล์ .zip แล้วนำไปวางในโฟลเดอร์ Mods",
      "image": "/uploads/step1.jpg"
    }
  ]
}
```

---

## 2. การใส่รูปภาพในโฟลเดอร์ `public/`

คุณสามารถนำไฟล์รูปภาพมาวางในโฟลเดอร์ `public/` ได้โดยตรง เช่น:
- วางใน `public/uploads/` หรือ `public/images/`
- เวลาอ้างอิง path ใน JSON ให้พิมพ์ขึ้นต้นด้วย `/` เช่น:
  - `"coverImage": "/uploads/my-game-cover.jpg"`
  - `"posterImage": "/uploads/my-game-poster.jpg"`
  - `"avatar": "/logo.jpg"`

---

## 3. การจัดการผ่านหน้าแอดมิน (/admin)
- เมื่อรันโปรเจกต์ในเครื่อง (`npm run dev`) คุณสามารถเข้าหน้า `/admin` เพื่อกดเพิ่ม แก้ไข ลบเกม หรืออัปโหลดรูปภาพผ่าน UI ได้โดยตรง ระบบจะทำการบันทึกลง `src/data/games.json` และบันทึกไฟล์รูปภาพลง `public/uploads/` ให้โดยอัตโนมัติ
