import { Link } from 'react-router-dom';
import { Trophy, Clock } from 'lucide-react';
import { MOCK_GROUPS, MOCK_MATCHES, MOCK_TOURNAMENT } from '@/shared/lib/mock-data';

// ─── Shared panel wrapper ────────────────────────────────────────────────────
export function SidePanel({ title, children, accentColor = 'var(--es-purple)' }: {
  title: string;
  children: React.ReactNode;
  accentColor?: string;
}) {
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'var(--es-bg-card)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      {/* Panel header with left accent line */}
      <div
        className="flex items-center gap-2 px-3 py-2.5"
        style={{
          background: 'rgba(0,0,0,0.2)',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          borderLeft: `3px solid ${accentColor}`,
        }}
      >
        <Trophy className="size-3 shrink-0" style={{ color: accentColor }} />
        <span
          className="text-[9px] font-extrabold uppercase tracking-widest"
          style={{ color: accentColor }}
        >
          {title}
        </span>
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

  return (
    <aside className="hidden lg:flex lg:flex-col gap-4 w-[272px] shrink-0">

      {/* ── Thống kê giải đấu ──────────────────────────────────── */}
      <SidePanel title="THỐNG KÊ GIẢI ĐẤU TỔNG QUAN">
        <div className="grid grid-cols-2 gap-2">
          {[
            { label: 'Tổng số đội',         value: MOCK_TOURNAMENT.groupCount * MOCK_TOURNAMENT.teamsPerGroup },
            { label: 'Active rosters',       value: MOCK_TOURNAMENT.groupCount * MOCK_TOURNAMENT.teamsPerGroup - 2 },
            { label: 'Tổng prize pool',      value: '--' },
            { label: 'Tổng prize pool ($$)', value: '--' },
          ].map(({ label, value }) => (
            <div
              key={label}
              className="rounded-lg p-3"
              style={{
                background: 'rgba(0,0,0,0.25)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <p className="text-[9px] text-slate-600 leading-tight">{label}</p>
              <p
                className="mt-1 text-2xl font-extrabold tabular-nums"
                style={{
                  color: 'white',
                  textShadow: '0 0 20px rgba(155,92,246,0.3)',
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </SidePanel>

      {/* ── Bảng xếp hạng vòng bảng ────────────────────────────── */}
      <SidePanel title="BẢNG XẾP HẠNG VÒNG BẢNG">
        {/* Column headers */}
        <div
          className="grid grid-cols-[2.5rem_1fr_1.5rem_1.5rem_2.5rem] gap-1 px-1 pb-2 text-[9px] font-bold uppercase tracking-widest"
          style={{ color: '#334155', borderBottom: '1px solid rgba(255,255,255,0.04)' }}
        >
          <span>HẠNG</span><span>ĐỘI</span>
          <span className="text-center">T</span>
          <span className="text-center">B</span>
          <span className="text-right">ĐIỂM</span>
        </div>

        <div className="mt-1.5 space-y-0">
          {MOCK_GROUPS.flatMap((g, gi) =>
            g.standings.slice(0, 2).map((row, idx) => (
              <div
                key={row.teamId}
                className="grid grid-cols-[2.5rem_1fr_1.5rem_1.5rem_2.5rem] gap-1 items-center px-1 py-1.5 rounded transition-colors hover:bg-white/[0.03]"
              >
                <span
                  className="text-[10px] font-extrabold"
                  style={{ color: idx === 0 ? 'var(--es-purple)' : 'var(--es-cyan)' }}
                >
                  {g.name.replace('Bảng ', '')}{row.rank}
                </span>
                <span className="truncate text-[11px] font-medium" style={{ color: row.advance ? '#e2e8f0' : '#64748b' }}>
                  {row.teamName}
                </span>
                <span className="text-center text-[11px] tabular-nums text-emerald-400">{row.wins}</span>
                <span className="text-center text-[11px] tabular-nums text-red-400/60">{row.losses}</span>
                <span
                  className="text-right text-[11px] font-bold tabular-nums"
                  style={{ color: row.advance ? 'var(--es-purple)' : '#334155' }}
                >
                  {row.points}
                </span>
              </div>
            ))
          )}
        </div>

        <Link
          to="/groups"
          className="mt-3 block text-center text-[10px] font-semibold transition-colors hover:text-white"
          style={{ color: 'var(--es-purple)', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 8 }}
        >
          Xem tất cả bảng →
        </Link>
      </SidePanel>

      {/* ── Kết quả gần đây ──────────────────────────────────────── */}
      <SidePanel title="TÓM TẮT TRẬN ĐẤU MỚI NHẤT" accentColor="var(--es-cyan)">
        <div className="space-y-1">
          {recentResults.length === 0 && (
            <p className="py-4 text-center text-[11px] text-slate-600">Chưa có kết quả</p>
          )}
          {recentResults.map(m => (
            <Link
              key={m._id}
              to={`/matches/${m._id}`}
              className="grid grid-cols-[2.5rem_1fr_auto_auto] gap-1 items-center rounded px-1 py-1.5 transition-colors hover:bg-white/[0.04]"
            >
              <span className="text-[9px] text-slate-700 tabular-nums">#{m._id.slice(-5)}</span>
              <div className="min-w-0">
                <p className="truncate text-[10px] text-slate-400 leading-tight">
                  {m.teamA?.name ?? 'TBD'} vs {m.teamB?.name ?? 'TBD'}
                </p>
              </div>
              <span
                className="shrink-0 text-[11px] font-bold tabular-nums"
                style={{ color: 'var(--es-cyan)' }}
              >
                {m.scoreA !== undefined && m.scoreB !== undefined
                  ? `${m.scoreA} : ${m.scoreB}`
                  : '--'}
              </span>
              <div className="flex items-center gap-0.5 text-[9px] text-slate-700 shrink-0">
                <Clock className="size-2.5" />
                {new Date(m.scheduledAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
              </div>
            </Link>
          ))}
        </div>
      </SidePanel>

    </aside>
  );
};
