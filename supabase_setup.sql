-- 1. Create the 'games' table
CREATE TABLE IF NOT EXISTS public.games (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    slug text UNIQUE NOT NULL,
    title text NOT NULL,
    genre text NOT NULL,
    emoji text NOT NULL,
    status text NOT NULL CHECK (status IN ('done', 'wip')),
    progress jsonb NOT NULL,
    version text NOT NULL,
    client text NOT NULL,
    translation_version text NOT NULL,
    short_description text NOT NULL,
    description text NOT NULL,
    overview text NOT NULL,
    translation_scope text[] NOT NULL,
    video_url text,
    cover_image text,
    poster_image text,
    file_size text,
    team jsonb NOT NULL,
    downloads jsonb NOT NULL,
    instructions jsonb NOT NULL DEFAULT '[]'::jsonb,
    updated_at text,
    created_at timestamp with time zone default timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS Policies
-- Allow anyone to read game data
CREATE POLICY "Allow public read access" ON public.games
    FOR SELECT USING (true);

-- Allow anyone to insert/update/delete for testing/admin purposes
-- IMPORTANT: In production, you should secure this with Auth (e.g. TO authenticated)
CREATE POLICY "Allow public write access" ON public.games
    FOR ALL USING (true) WITH CHECK (true);

-- 4. Insert Initial Seed Data (6 Mock Games)
INSERT INTO public.games (
    slug, title, genre, emoji, status, progress, version, client, 
    translation_version, short_description, description, overview, 
    translation_scope, video_url, cover_image, file_size, team, downloads, updated_at
) VALUES 
(
    'cyberpunk-2077',
    'Cyberpunk 2077',
    'RPG / Open World',
    '🌆',
    'done',
    '{"translate": 100, "proofread": 100, "test": 100}'::jsonb,
    'v2.12',
    'Steam, GOG',
    '1.08',
    'แปลไทยเต็มรูปแบบ UI + Subtitle + DLC Phantom Liberty ครบทุกบทสนทนา',
    'แปลภาษาไทยเต็มรูปแบบ ครอบคลุม UI, Subtitle, บทสนทนาทั้งหมด และ DLC Phantom Liberty แปลโดยทีมงาน 3 คน ใช้เวลากว่า 8 เดือน ทุกเมนูและ HUD แปลเป็นไทยสมบูรณ์ รองรับทั้ง Steam และ GOG',
    'Cyberpunk 2077 คือเกมแนว Action-Adventure RPG แบบเปิดกว้าง (Open World) ที่ดำเนินเรื่องใน Night City เมืองหลวงแห่งอนาคตที่เต็มไปด้วยแสงสี เทคโนโลยี และการปรับแต่งร่างกาย คุณจะได้รับบทเป็น V ทหารรับจ้างนอกกฎหมายที่ต้องต่อสู้ดิ้นรนเพื่อเอาชีวิตรอดจากชิปทดลองที่กำลังกัดกินจิตวิญญาณของคุณ',
    ARRAY['UI / เมนู', 'Subtitle ทั้งหมด', 'บทสนทนา NPC', 'HUD / แผนที่', 'DLC Phantom Liberty', 'Quest / Side Quest'],
    'https://www.youtube.com/embed/UnA7tepsc7s',
    'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?q=80&w=800&auto=format&fit=crop',
    '45 MB',
    '[{"name": "ฝัน", "role": "หัวหน้าแปล"}, {"name": "Miku", "role": "ตรวจสอบ"}, {"name": "Test99", "role": "ทดสอบ"}]'::jsonb,
    '[{"label": "Nexus Mods", "url": "https://nexusmods.com", "type": "primary"}, {"label": "MediaFire", "url": "https://mediafire.com", "type": "secondary"}]'::jsonb,
    '2026-05-20'
),
(
    'baldurs-gate-3',
    'Baldur''s Gate 3',
    'RPG / Turn-based',
    '⚔️',
    'done',
    '{"translate": 100, "proofread": 95, "test": 90}'::jsonb,
    'Patch 7',
    'Steam',
    '0.92',
    'แปลไทย UI + เมนู + Act 1 เต็มรูปแบบ — Act 2-3 อยู่ระหว่างพัฒนา',
    'แปลไทยครอบคลุม UI หลัก, เมนู, และ Act 1 เต็มรูปแบบ — Act 2-3 อยู่ระหว่างพัฒนา ระบบ Dialogue Choice แปลครบทุกตัวเลือก รองรับ Patch 7 ล่าสุด',
    'Baldur''s Gate 3 คือเกมสวมบทบาท (RPG) ยุคใหม่ระดับมาสเตอร์พีซจากผู้สร้าง Divinity: Original Sin 2 ดำเนินเรื่องในโลกแฟนตาซีอันลึกลับของ Dungeons & Dragons ตัวเกมนำเสนอระบบการตัดสินใจที่เป็นอิสระอย่างแท้จริง การต่อสู้แบบเทิร์นเบสที่ต้องใช้กลยุทธ์ และความสัมพันธ์ระหว่างเพื่อนร่วมทีมที่ลึกซึ้ง',
    ARRAY['UI / เมนู', 'บทสนทนา Act 1', 'Dialogue Choices', 'Item Description', 'Quest Log'],
    'https://www.youtube.com/embed/1T22wNnUmBA',
    'https://images.unsplash.com/photo-1655635643532-fa9ba2648cbe?q=80&w=800&auto=format&fit=crop',
    '38 MB',
    '[{"name": "ฝัน", "role": "แปล"}, {"name": "SkyTH", "role": "Proofreader"}]'::jsonb,
    '[{"label": "Nexus Mods", "url": "https://nexusmods.com", "type": "primary"}, {"label": "MediaFire", "url": "https://mediafire.com", "type": "secondary"}]'::jsonb,
    '2026-05-18'
),
(
    'stardew-valley',
    'Stardew Valley',
    'Simulation / Farming',
    '🌾',
    'done',
    '{"translate": 100, "proofread": 100, "test": 100}'::jsonb,
    '1.6.x',
    'Steam',
    '2.1',
    'แปลไทยครบถ้วน NPC, Quest, บทสนทนา ครอบคลุมทุกฤดูกาล',
    'แปลไทยครบถ้วนทุก NPC, Quest, บทสนทนา ครอบคลุมทุกฤดูกาลและอัปเดตใหม่ล่าสุด 1.6 รวมถึง Festival Events และ Secret Notes',
    'Stardew Valley คือเกมจำลองชีวิตเกษตรกรแสนอบอุ่นหัวใจ คุณจะได้รับมรดกเป็นฟาร์มเก่าของคุณปู่ในหุบเขา Stardew Valley เริ่มต้นชีวิตใหม่ด้วยการปลูกผัก เลี้ยงสัตว์ ทำเหมือง และสร้างมิตรภาพกับชาวเมือง Pelican Town เพื่อพลิกฟื้นฟาร์มที่รกร้างให้กลับมารุ่งเรืองอีกครั้ง',
    ARRAY['UI / เมนู', 'บทสนทนา NPC ทั้งหมด', 'Quest / Events', 'Item / Crafting', 'Festival', 'Secret Notes'],
    'https://www.youtube.com/embed/ot7uXNQskhs',
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800&auto=format&fit=crop',
    '12 MB',
    '[{"name": "ฝัน", "role": "แปล / ทดสอบ"}]'::jsonb,
    '[{"label": "Nexus Mods", "url": "https://nexusmods.com", "type": "primary"}]'::jsonb,
    '2026-05-10'
),
(
    'elden-ring',
    'Elden Ring',
    'Action RPG / Souls',
    '💀',
    'wip',
    '{"translate": 72, "proofread": 55, "test": 30}'::jsonb,
    '1.12 + DLC',
    'Steam',
    'WIP',
    'กำลังแปล DLC Shadow of the Erdtree — คาดแล้วเสร็จ Q2 2026',
    'กำลังแปล DLC Shadow of the Erdtree อยู่ในขั้นตอนการแปลและตรวจทาน คาดแล้วเสร็จ Q2 2026 ครอบคลุม Item Description, NPC Dialogue และ Lore Text ทั้งหมด',
    'Elden Ring คือเกมแนว Action RPG แนวดาร์กแฟนตาซีระดับตำนาน ผลงานความร่วมมือระหว่าง Hidetaka Miyazaki ผู้สร้างซีรีส์ Dark Souls และ George R.R. Martin ผู้เขียน Game of Thrones เดินทางสู่ดินแดนแห่งมัชฌิมา (Lands Between) เพื่อกอบกู้พลังของ Elden Ring และก้าวขึ้นเป็น Elden Lord',
    ARRAY['UI / เมนู', 'Item Description', 'NPC Dialogue', 'Lore Text', 'DLC Shadow of the Erdtree'],
    'https://www.youtube.com/embed/E3Huy2cdIh0',
    'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=800&auto=format&fit=crop',
    '28 MB',
    '[{"name": "ฝัน", "role": "แปล"}, {"name": "Miku", "role": "ตรวจสอบ"}]'::jsonb,
    '[{"label": "เร็ว ๆ นี้", "url": "#", "type": "secondary"}]'::jsonb,
    '2026-05-22'
),
(
    'dave-the-diver',
    'Dave the Diver',
    'Indie / Adventure',
    '🐠',
    'done',
    '{"translate": 100, "proofread": 100, "test": 100}'::jsonb,
    '1.0.4',
    'Steam',
    '1.0',
    'แปลไทยครบทุก Story, UI และระบบร้านอาหาร',
    'แปลภาษาไทยครบทุก Story, UI และระบบร้านอาหาร รวมถึง Fish Encyclopedia และ Recipe ทั้งหมด เล่นสนุกเข้าใจง่ายในภาษาไทย',
    'Dave the Diver คือเกมแนวผจญภัยกึ่งจัดการร้านอาหารที่ผสมผสานความสนุกได้อย่างลงตัว ในตอนกลางวันคุณต้องดำน้ำลงไปใต้ทะเลลึกของ Blue Hole เพื่อจับปลาและสิ่งมีชีวิตแปลกๆ และในตอนกลางคืนก็นำวัตถุดิบเหล่านั้นมาเปิดร้านซูชิสุดหรูร่วมกับ Bancho พ่อครัวฝีมือเอก',
    ARRAY['UI / เมนู', 'Story / บทสนทนา', 'ระบบร้านอาหาร', 'Fish Encyclopedia', 'Recipe'],
    'https://www.youtube.com/embed/9cZ5E_8Z5_A',
    'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=800&auto=format&fit=crop',
    '8 MB',
    '[{"name": "ฝัน", "role": "แปล / ทดสอบ"}]'::jsonb,
    '[{"label": "Nexus Mods", "url": "https://nexusmods.com", "type": "primary"}, {"label": "MediaFire", "url": "https://mediafire.com", "type": "secondary"}]'::jsonb,
    '2026-05-05'
),
(
    'hades-2',
    'Hades II',
    'Roguelite / Action',
    '🔱',
    'wip',
    '{"translate": 40, "proofread": 20, "test": 0}'::jsonb,
    'Early Access',
    'Steam',
    'WIP',
    'เพิ่งเริ่มแปล — รอ Early Access เต็มรูปแบบ',
    'เพิ่งเริ่มแปล รอ Early Access เต็มรูปแบบก่อน จะครอบคลุม Dialogue, Boon Description, Item Text และ Codex ทั้งหมด',
    'Hades II คือเกมแนว Action Roguelike ภาคต่อของเกม Hades ที่ได้รับรางวัลมากมาย ดำเนินเรื่องในโลกกรีกโบราณที่เต็มไปด้วยเวทมนตร์ดำและการต่อสู้ คุณจะได้รับบทเป็น Melinoë เจ้าหญิงแห่งยมโลกและน้องสาวของ Zagreus ที่ต้องใช้พลังคาถาอาคมในการต่อกรกับ Chronos ไททันแห่งกาลเวลา',
    ARRAY['UI / เมนู', 'Dialogue', 'Boon Description', 'Item Text'],
    'https://www.youtube.com/embed/l-X3qRPlXv0',
    'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?q=80&w=800&auto=format&fit=crop',
    'TBD',
    '[{"name": "ฝัน", "role": "แปล"}]'::jsonb,
    '[{"label": "ยังไม่พร้อม", "url": "#", "type": "secondary"}]'::jsonb,
    '2026-05-15'
)
ON CONFLICT (slug) DO NOTHING;

-- 4.2 Seed The Sims 4 (Multi-Module Game)
INSERT INTO public.games (
    slug, title, genre, emoji, status, progress, version, client, 
    translation_version, short_description, description, overview, 
    translation_scope, video_url, cover_image, poster_image, file_size, team, downloads, updated_at
) VALUES (
    'the-sims-4',
    'The Sims 4',
    'Simulation / Life',
    '💎',
    'wip',
    '{"isMultiModule": true, "modules": [{"name": "ภาคหลัก (Base Game)", "progress": 100}, {"name": "Get to Work (ทำงานทำการ)", "progress": 95}, {"name": "City Living (ชีวิตชาวกรุง)", "progress": 80}, {"name": "Cats & Dogs (เพื่อนรักสี่ขา)", "progress": 75}, {"name": "Seasons (สี่ฤดู)", "progress": 60}, {"name": "Cottage Living (ชีวิตชนบท)", "progress": 40}, {"name": "For Rent (บ้านเช่าสุดอลเวง)", "progress": 15}], "translate": 66, "proofread": 66, "test": 66}'::jsonb,
    'v1.107',
    'EA App, Steam',
    '0.45',
    'แปลภาษาไทยสำหรับภาคหลักและ DLC ยอดนิยม แยกสถานะความคืบหน้าของแต่ละภาคชัดเจน',
    'โปรเจกต์แปลภาษาไทยสำหรับเกม The Sims 4 และบรรดาส่วนเสริม (DLC) มากมาย โดยระบบจะจัดแบ่งความคืบหน้าของตัวเกมตามแต่ละภาค เพื่อให้ผู้เล่นทราบความคืบหน้าในการอัปเดตอย่างละเอียด แปลคำอธิบายไอเท็ม, เมนู, ความปรารถนา, สังคม และบทสนทนาการเล่น',
    'The Sims 4 คือเกมแนวจำลองชีวิตยอดนิยมระดับโลกที่เปิดโอกาสให้คุณสร้างและควบคุมผู้คน (Sims) ในโลกเสมือนจริงได้อย่างอิสระเต็มที่ ตั้งแต่รูปร่างหน้าตา ลักษณะนิสัย ความสัมพันธ์ หน้าที่การงาน ไปจนถึงการสร้างบ้านในฝันและผจญภัยในส่วนเสริมหลากหลายรูปแบบ',
    ARRAY['เมนูและ UI หลัก', 'ความปรารถนา (Whims/Wants)', 'คำอธิบายไอเท็มสร้างบ้าน', 'บทสนทนาและการโต้ตอบ', 'ส่วนเสริม Expansion Packs ทั้งหมด'],
    'https://www.youtube.com/embed/z00mK3Pxc8w',
    '/uploads/sims_cover_art.png',
    '/uploads/sims_poster_art.png',
    '32 MB',
    '[{"name": "ฝัน", "role": "ผู้แปลหลัก"}, {"name": "SimmerTH", "role": "เรียบเรียงภาษา"}]'::jsonb,
    '[{"label": "ดาวน์โหลด Mod", "url": "#", "type": "primary"}, {"label": "วิธีติดตั้ง", "url": "https://youtube.com", "type": "secondary"}]'::jsonb,
    '2026-05-23'
)
ON CONFLICT (slug) DO NOTHING;


-- 5. Create Supabase Storage Bucket for Game Assets
INSERT INTO storage.buckets (id, name, public)
VALUES ('game-assets', 'game-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Enable Public Read Policy for game-assets storage
CREATE POLICY "Public Access" ON storage.objects
    FOR SELECT USING (bucket_id = 'game-assets');

-- Enable Upload Policy (Public insert for testing/admin purposes)
CREATE POLICY "Allow public upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'game-assets');

-- Enable Update/Delete Policy (Public manage for testing/admin purposes)
CREATE POLICY "Allow public manage" ON storage.objects
    FOR ALL USING (bucket_id = 'game-assets');

-- MIGRATION: Run this to update your existing database table if it already exists
ALTER TABLE public.games ADD COLUMN IF NOT EXISTS instructions jsonb NOT NULL DEFAULT '[]'::jsonb;


-- 6. Create the 'team_members' table for global team pool
CREATE TABLE IF NOT EXISTS public.team_members (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text UNIQUE NOT NULL,
    avatar text NOT NULL DEFAULT '',
    created_at timestamp with time zone default timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public select" ON public.team_members
    FOR SELECT USING (true);

CREATE POLICY "Allow public write" ON public.team_members
    FOR ALL USING (true) WITH CHECK (true);

-- Seed some initial team members
INSERT INTO public.team_members (name, avatar) VALUES 
('แปลเกมสู่ฝัน', 'https://flvgoyaloxrvxrovtapf.supabase.co/storage/v1/object/public/game-assets/1779715288723-az8rruz.jpg'),
('SimmerTH', ''),
('NoØnetranslator', '')
ON CONFLICT (name) DO NOTHING;

