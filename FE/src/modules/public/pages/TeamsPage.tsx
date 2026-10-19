import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, Search } from 'lucide-react';
import { MOCK_TEAMS, MOCK_MATCHES, MOCK_GROUPS } from '@/shared/lib/mock-data';
import { TeamAvatar, TeamMascotCard } from '@/shared/components/team-avatar';
import { MatchCard } from '@/shared/components/match-card';
import { SidePanel } from '@/shared/components/public-sidebar';

// ─── Sidebar for Teams page ────────────────────────────────────────────────
const TeamsSidebar = () => (
  <aside className="hidden lg:flex lg:flex-col gap-4 w-[272px] shrink-0">
    {/* Tournament overview stats */}
    <SidePanel title="THỐNG KÊ GIẢI ĐẤU TỔNG QUAN">
      <div className="grid grid-cols-2 gap-2">
        {[
          { label: 'Tổng số đội',         value: MOCK_TEAMS.length },
          { label: 'Active rosters',       value: MOCK_TEAMS.length - 2 },
          { label: 'Tổng prize pool',      value: '--' },
          { label: 'Tổng prize pool ($$)', value: '--' },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-lg p-3"
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <p className="text-[10px] text-slate-500 leading-tight">{label}</p>
            <p className="mt-1 text-2xl font-extrabold text-white tabular-nums">{value}</p>
          </div>
        ))}
      </div>
    </SidePanel>

    {/* BXH vòng bảng */}
    <SidePanel title="BẢNG XẾP HẠNG VÒNG BẢNG">
      <div>
        {/* Header */}
        <div
          className="grid grid-cols-[2.5rem_1fr_1.5rem_1.5rem_2rem] gap-1 px-1 pb-2 text-[9px] font-bold uppercase tracking-widest"
          style={{ color: '#475569', borderBottom: '1px solid rgba(255,255,255,0.05)' }}
        >
          <span>HẠNG</span><span>ĐỘI</span>
          <span className="text-center">T</span>
          <span className="text-center">B</span>
          <span className="text-right">ĐIỂM</span>
        </div>
        <div className="mt-1 space-y-0">
          {MOCK_GROUPS.flatMap(g =>
            g.standings.slice(0, 2).map((row, idx) => (
              <div
                key={row.teamId}
                className="grid grid-cols-[2.5rem_1fr_1.5rem_1.5rem_2rem] gap-1 items-center px-1 py-1.5 rounded transition-colors hover:bg-white/[0.03]"
              >
                <span
                  className="text-[10px] font-extrabold"
                  style={{ color: idx === 0 ? 'var(--es-purple)' : 'var(--es-cyan)' }}
                >
                  {g.name.replace('Bảng ', '')}{row.rank}
                </span>
                <span className="truncate text-[11px] font-medium text-slate-200">{row.teamName}</span>
                <span className="text-center text-[11px] text-emerald-400 tabular-nums">{row.wins}</span>
                <span className="text-center text-[11px] text-red-400/70 tabular-nums">{row.losses}</span>
                <span
                  className="text-right text-[11px] font-bold tabular-nums"
                  style={{ color: row.advance ? 'var(--es-purple)' : '#475569' }}
                >
                  {row.points}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </SidePanel>

    {/* Kết quả mới nhất */}
    <SidePanel title="TÓM TẮT TRẬN ĐẤU MỚI NHẤT">
      <div className="space-y-1">
        {MOCK_MATCHES.filter(m => m.status === 'confirmed' || m.status === 'pending_confirm').slice(0, 5).map(m => (
          <Link
            key={m._id}
            to={`/matches/${m._id}`}
            className="grid grid-cols-[2.5rem_1fr_auto_auto] gap-1 items-center px-1 py-1.5 rounded transition-colors hover:bg-white/[0.04]"
          >
            <span className="text-[9px] text-slate-700 tabular-nums">#{m._id.slice(-5)}</span>
            <span className="truncate text-[10px] text-slate-400 leading-tight">
              {m.teamA?.name ?? 'TBD'} vs {m.teamB?.name ?? 'TBD'}
            </span>
            <span
              className="text-[11px] font-bold tabular-nums"
              style={{ color: 'var(--es-cyan)' }}
            >
              {m.scoreA !== undefined ? `${m.scoreA}:${m.scoreB}` : '--'}
            </span>
            <span className="text-[9px] text-slate-700 tabular-nums">
              {new Date(m.scheduledAt).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })}
            </span>
          </Link>
        ))}
      </div>
    </SidePanel>
  </aside>
);

// ─── Teams list page ────────────────────────────────────────────────────────
export const TeamsPage = () => {
  const [search, setSearch] = useState('');
  const filtered = MOCK_TEAMS.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.tag.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex gap-5 items-start">
      {/* ── Main content ───────────────────────────────────────── */}
      <div className="flex-1 min-w-0 space-y-5">

        {/* Page title bar */}
        <div
          className="flex items-center justify-between gap-4 pb-4"
          style={{ borderBottom: '1px solid rgba(155,92,246,0.2)' }}
        >
          <div>
            <h1
              className="text-lg font-extrabold tracking-wide uppercase"
              style={{
                background: 'linear-gradient(90deg, #fff 30%, var(--es-purple) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              DANH SÁCH ĐỘI TUYỂN (TEAMS LIST)
            </h1>
            <p className="mt-0.5 text-xs text-slate-600">
              {MOCK_TEAMS.length} đội · {MOCK_GROUPS.length} bảng
            </p>
          </div>

          {/* Search input */}
          <div className="relative w-44 shrink-0">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-600" />
            <input
              type="search"
              placeholder="Tìm đội..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-700 focus:outline-none"
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.09)',
              }}
            />
          </div>
        </div>

        {/* Grid grouped by bảng */}
        {MOCK_GROUPS.map(g => {
          const teams = filtered.filter(t => t.groupId === g._id);
          if (!teams.length) return null;
          const standing = (tid: string) => g.standings.find(s => s.teamId === tid);
          return (
            <section key={g._id}>
              <p
                className="mb-3 text-[10px] font-extrabold uppercase tracking-widest"
                style={{ color: 'var(--es-purple)' }}
              >
                {g.name}
              </p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4">
                {teams.map(team => {
                  const s = standing(team._id);
                  return (
                    <Link key={team._id} to={`/teams/${team._id}`} className="block">
                      <TeamMascotCard
                        name={team.name}
                        tag={team.tag}
                        logoUrl={team.logoUrl}
                        groupName={g.name}
                        wins={s?.wins}
                        losses={s?.losses}
                        points={s?.points}
                        advance={s?.advance}
                      />
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <Users className="mx-auto mb-3 size-12 opacity-10" style={{ color: 'var(--es-purple)' }} />
            <p className="text-sm text-slate-600">Không tìm thấy đội nào</p>
          </div>
        )}
      </div>

      {/* ── Sidebar ────────────────────────────────────────────── */}
      <TeamsSidebar />
    </div>
  );
};

// ─── Team detail page ────────────────────────────────────────────────────────
export const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const team    = MOCK_TEAMS.find(t => t._id === id);
  const group   = MOCK_GROUPS.find(g => g._id === team?.groupId);
  const standing = group?.standings.find(s => s.teamId === id);
  const teamMatches = MOCK_MATCHES.filter(m => m.teamA?._id === id || m.teamB?._id === id);

  if (!team) {
    return (
      <div className="py-24 text-center text-slate-600">
        <p>Không tìm thấy đội</p>
        <Link to="/teams" className="mt-2 inline-block text-sm hover:underline" style={{ color: 'var(--es-purple)' }}>
          ← Danh sách đội
        </Link>
      </div>
    );
  }

  return (
    <div className="flex gap-5 items-start">
      <div className="flex-1 min-w-0 max-w-3xl space-y-5">
        <Link
          to="/teams"
          className="inline-flex items-center gap-1.5 text-sm transition-colors hover:text-white"
          style={{ color: 'var(--es-purple)' }}
        >
          <ArrowLeft className="size-4" /> Danh sách đội
        </Link>

        {/* Hero card */}
        <div
          className="flex items-center gap-5 rounded-xl p-6"
          style={{
            background: 'linear-gradient(135deg, rgba(155,92,246,0.07), var(--es-bg-card))',
            border: '1px solid rgba(155,92,246,0.25)',
            boxShadow: '0 0 40px rgba(155,92,246,0.06)',
          }}
        >
          <TeamAvatar name={team.name} tag={team.tag} logoUrl={team.logoUrl} size="xl" />
          <div>
            <h1 className="text-2xl font-extrabold text-white">{team.name}</h1>
            <p className="text-sm text-slate-500 mt-0.5">[{team.tag}] · {group?.name ?? 'Chưa có bảng'}</p>
            {standing && (
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full px-2.5 py-0.5 font-semibold" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>
                  {standing.wins} Thắng
                </span>
                <span className="rounded-full px-2.5 py-0.5 font-semibold" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>
                  {standing.losses} Thua
                </span>
                <span
                  className="rounded-full px-2.5 py-0.5 font-bold"
                  style={standing.advance
                    ? { background: 'rgba(155,92,246,0.15)', color: 'var(--es-purple)', border: '1px solid rgba(155,92,246,0.3)' }
                    : { background: 'rgba(255,255,255,0.05)', color: '#64748b' }}
                >
                  {standing.points} điểm{standing.advance ? ' · Đi tiếp ✓' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Players */}
        <div className="rounded-xl p-5" style={{ background: 'var(--es-bg-card)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
            <Users className="size-4" style={{ color: 'var(--es-purple)' }} /> Danh sách tuyển thủ
          </h2>
          <p className="text-sm text-slate-600 italic">
            Dữ liệu tuyển thủ sẽ hiển thị sau khi quản lý đội hoàn thiện hồ sơ.
          </p>
        </div>

        {/* Match history */}
        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-white">
            <Trophy className="size-4" style={{ color: 'var(--es-cyan)' }} /> Lịch sử trận ({teamMatches.length})
          </h2>
          {teamMatches.map(m => <MatchCard key={m._id} match={m} />)}
          {teamMatches.length === 0 && <p className="py-6 text-center text-sm text-slate-600">Chưa có trận đấu</p>}
        </div>
      </div>

      <TeamsSidebar />
    </div>
  );
};
