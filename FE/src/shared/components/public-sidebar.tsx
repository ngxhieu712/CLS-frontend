import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_GROUPS, MOCK_MATCHES, MOCK_TOURNAMENT } from '@/shared/lib/mock-data';

// ─── Small logo ──────────────────────────────────────────────────────────────
function SidebarLogo({ name, tag, logoUrl, size = 22 }: { name: string; tag: string; logoUrl?: string; size?: number }) {
  const [err, setErr] = useState(false);
  return (
    <div className="flex items-center justify-center rounded-full overflow-hidden shrink-0"
      style={{ width: size, height: size, background: '#1a2035', border: '2px solid rgba(255,255,255,0.18)', borderRadius: '50%', overflow: 'hidden' }}>
      {logoUrl && !err
        ? <img src={logoUrl} alt={name} className="w-full h-full object-cover" onError={() => setErr(true)} />
        : <span className="font-bold text-amber-400" style={{ fontSize: size * 0.35 }}>{tag.slice(0,3)}</span>
      }
    </div>
  );
}

// ─── Panel wrapper ───────────────────────────────────────────────────────────
export function SidePanel({ title, children, accent = '#f59e0b' }: {
  title: string; children: React.ReactNode; accent?: string;
}) {
  return (
    <div className="rounded-xl overflow-hidden"
      style={{ background: '#0d1424', border: '1px solid rgba(255,255,255,0.07)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
      <div className="px-3 py-2.5 flex items-center gap-2"
        style={{ background: 'rgba(0,0,0,0.2)', borderBottom: '1px solid rgba(255,255,255,0.06)', borderLeft: `3px solid ${accent}` }}>
        <span className="text-[9px] font-extrabold uppercase tracking-widest" style={{ color: accent }}>{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  );
}

// ─── Main public sidebar ─────────────────────────────────────────────────────
export const PublicSidebar = () => {
  const recentResults = MOCK_MATCHES
    .filter(m => m.status === 'confirmed' || m.status === 'pending_confirm')
    .slice(0, 5);

  // All standings flattened for sidebar BXH
  const allStandings = MOCK_GROUPS.flatMap(g =>
    g.standings.map(row => ({ ...row, groupName: g.name }))
  ).sort((a, b) => b.points - a.points).slice(0, 7);

  return (
    <aside className="hidden lg:flex lg:flex-col gap-3 w-[272px] shrink-0">

      {/* ── BXH TỔNG VÒNG BẢNG ─────────────────────────────────── */}
      <SidePanel title="BẢNG XẾP HẠNG TỔNG VÒNG BẢNG">
        {/* Col headers */}
        <div className="grid px-1 pb-2 text-[9px] font-bold uppercase tracking-wider"
          style={{ gridTemplateColumns: '2rem 1fr 2.5rem 2.5rem 3rem', color: '#334155', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span>HẠNG</span><span>ĐỘI</span>
          <span className="text-center">T</span>
          <span className="text-center">B</span>
          <span className="text-right">ĐIỂM</span>
        </div>
        <div className="mt-1 space-y-0">
          {allStandings.map((row, i) => (
            <div key={row.teamId}
              className="grid items-center px-1 py-1.5 rounded transition-colors hover:bg-white/[0.03]"
              style={{ gridTemplateColumns: '2rem 1fr 2.5rem 2.5rem 3rem' }}>
              <span className="text-[10px] font-extrabold" style={{ color: i < 2 ? '#f59e0b' : '#475569' }}>
                {row.groupName.replace('Bảng ', '')}{row.rank}
              </span>
              <div className="flex items-center gap-1.5 min-w-0">
                <SidebarLogo name={row.teamName} tag={row.teamTag} logoUrl={row.logoUrl} />
                <span className="truncate text-[11px] font-medium" style={{ color: row.advance ? '#e2e8f0' : '#64748b' }}>
                  {row.teamName}
                </span>
              </div>
              <span className="text-center text-[11px] text-emerald-400 tabular-nums">{row.wins}</span>
              <span className="text-center text-[11px] text-red-400/60 tabular-nums">{row.losses}</span>
              <span className="text-right text-[11px] font-bold tabular-nums" style={{ color: row.advance ? '#f59e0b' : '#334155' }}>
                {row.points}
              </span>
            </div>
          ))}
        </div>
      </SidePanel>

      {/* ── KẾT QUẢ GẦN ĐÂY ───────────────────────────────────── */}
      <SidePanel title="KẾT QUẢ GẦN ĐÂY" accent="#22d3ee">
        {/* Col headers */}
        <div className="grid px-1 pb-2 text-[9px] font-bold uppercase tracking-wider"
          style={{ gridTemplateColumns: '2.5rem 1fr 3.5rem 3rem', color: '#334155', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span>ID</span><span>ĐỘI</span>
          <span className="text-center">SCORE</span>
          <span className="text-right">DATE</span>
        </div>
        <div className="mt-1 space-y-0">
          {recentResults.length === 0 && (
            <p className="py-3 text-center text-[11px] text-slate-600">Chưa có kết quả</p>
          )}
          {recentResults.map(m => (
            <Link key={m._id} to={`/matches/${m._id}`}
              className="grid items-center px-1 py-1.5 rounded transition-colors hover:bg-white/[0.04]"
              style={{ gridTemplateColumns: '2.5rem 1fr 3.5rem 3rem' }}>
              <span className="text-[9px] text-slate-700 tabular-nums">#{m._id.slice(-5)}</span>
              <div className="flex items-center gap-1 min-w-0">
                <SidebarLogo name={m.teamA?.name ?? ''} tag={m.teamA?.tag ?? '?'} logoUrl={m.teamA?.logoUrl} size={18} />
                <span className="text-[10px] text-slate-400 truncate">{m.teamA?.name ?? 'TBD'}</span>
              </div>
              <div className="flex items-center justify-center gap-1">
                <SidebarLogo name={m.teamA?.name ?? ''} tag={m.teamA?.tag ?? '?'} logoUrl={m.teamA?.logoUrl} size={14} />
                <span className="text-[10px] font-bold tabular-nums" style={{ color: '#22d3ee' }}>
                  {m.scoreA ?? 0}:{m.scoreB ?? 0}
                </span>
                <SidebarLogo name={m.teamB?.name ?? ''} tag={m.teamB?.tag ?? '?'} logoUrl={m.teamB?.logoUrl} size={14} />
              </div>
              <span className="text-right text-[9px] text-slate-700 tabular-nums">
                {new Date(m.scheduledAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
              </span>
            </Link>
          ))}
        </div>
      </SidePanel>

      {/* ── DỮ LIỆU ĐỘI TUYỂN & CHỈ SỐ ───────────────────────── */}
      <SidePanel title="DỮ LIỆU ĐỘI TUYỂN & CHỈ SỐ" accent="#94a3b8">
        <div className="grid grid-cols-2 gap-2">
          {MOCK_GROUPS.slice(0, 2).flatMap(g => g.standings.slice(0, 1)).map(row => (
            <div key={row.teamId} className="rounded-lg p-2"
              style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-1.5 mb-2">
                <SidebarLogo name={row.teamName} tag={row.teamTag} logoUrl={row.logoUrl} size={20} />
                <span className="text-[10px] font-bold text-white truncate">{row.teamName}</span>
              </div>
              {[
                { label: 'Win rate', val: `${Math.round((row.wins / (row.wins + row.losses || 1)) * 100)}` },
                { label: 'Kill count', val: '--' },
                { label: 'Objective', val: '--' },
              ].map(({ label, val }) => (
                <div key={label} className="flex justify-between text-[9px] py-0.5">
                  <span className="text-slate-600">{label}</span>
                  <span className="text-slate-400 tabular-nums font-medium">{val}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </SidePanel>

    </aside>
  );
};
