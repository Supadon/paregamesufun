const fs = require('fs');

let content = fs.readFileSync('src/app/admin/page.tsx', 'utf8');

// 1. Add import for Sims4AdminManager
if (!content.includes('Sims4AdminManager')) {
  content = content.replace(
    "import { \n  getGames,",
    "import Sims4AdminManager from '@/components/admin/Sims4AdminManager'\nimport { \n  getGames,"
  );
}

// 2. Add activeTab state
if (!content.includes('const [adminTab, setAdminTab] = useState')) {
  content = content.replace(
    "const [games, setGames] = useState<Game[]>([])",
    "const [games, setGames] = useState<Game[]>([])\n  const [adminTab, setAdminTab] = useState<'games' | 'sims4' | 'teampool'>('games')"
  );
}

// 3. Update the Header Tabs & Render Section
const targetSectionSearch = '{/* Notice alert */}';
const newTabsUI = `{/* Admin Top Navigation Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-white/10 pb-4 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setAdminTab('games')}
          className={\`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all \${
            adminTab === 'games'
              ? 'bg-blue text-white shadow-[0_0_18px_rgba(43,95,255,0.35)] scale-[1.02]'
              : 'bg-white/5 hover:bg-white/10 text-text3 hover:text-white border border-white/5'
          }\`}
        >
          <span>🎮 จัดการการ์ดเกมทั่วไป ({games.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('sims4')}
          className={\`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all \${
            adminTab === 'sims4'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-[0_0_18px_rgba(16,185,129,0.25)] scale-[1.02]'
              : 'bg-white/5 hover:bg-white/10 text-text3 hover:text-white border border-white/5'
          }\`}
        >
          <span className="w-1.5 h-1.5 rotate-45 bg-emerald-400 inline-block" />
          <span>💎 จัดการ The Sims 4 (ภาคเสริม & ม็อด)</span>
        </button>

        <button
          onClick={() => {
            setAdminTab('teampool');
            setIsPoolModalOpen(true);
          }}
          className={\`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-black transition-all \${
            adminTab === 'teampool'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/50 scale-[1.02]'
              : 'bg-white/5 hover:bg-white/10 text-text3 hover:text-white border border-white/5'
          }\`}
        >
          <Users size={13} className="text-purple-300" />
          <span>👥 คลังรายชื่อทีมงาน ({teamPool.length})</span>
        </button>
      </div>

      {/* Conditionally Render: Sims 4 Hub vs General Games */}
      {adminTab === 'sims4' ? (
        <Sims4AdminManager />
      ) : (
        <>
          {/* Notice alert */}`;

content = content.replace(targetSectionSearch, newTabsUI);

// Close the fragment at the end of the games section
const endSearch = '{/* Add / Edit Game Modal */}';
const newEnd = `  </>
      )}

      {/* Add / Edit Game Modal */}`;

content = content.replace(endSearch, newEnd);

fs.writeFileSync('src/app/admin/page.tsx', content, 'utf8');
console.log('Successfully updated src/app/admin/page.tsx with Sims 4 Tab!');
