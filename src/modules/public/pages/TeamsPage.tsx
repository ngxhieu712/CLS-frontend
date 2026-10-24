import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, Trophy, Search } from 'lucide-react';
import { MOCK_TEAMS, MOCK_MATCHES, MOCK_GROUPS } from '@/shared/lib/mock-data';
import { TeamAvatar, TeamMascotCard } from '@/shared/components/team-avatar';
import { MatchCard } from '@/shared/components/match-card';
import { PublicSidebar } from '@/shared/components/public-sidebar';

// ─── Teams list page ──────────────────────────────────────────────────────────
export const TeamsPage = () => {
  const [search, setSearch] = useState('');
  const filtered = MOCK_TEAMS.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.tag.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="flex gap-5 items-start">
      <div className="flex-1 min-w-0 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-4"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div>
            <h1 className="text-lg font-extrabold tracking-wide uppercase text-white">
              DANH SÁCH ĐỘI TUYỂN (TEAMS LIST)
            </h1>
            <p className="mt-0.5 text-xs text-slate-600">{MOCK_TEAMS.length} đội · {MOCK_GROUPS.length} bảng</p>
          </div>
          <div className="relative w-44 shrink-0">
            <Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-slate-600" />
            <input
              type="search" placeholder="Tìm đội..."
              value={search} onChange={e => setSearch(e.target.value)}
              className="w-full rounded-lg py-1.5 pl-8 pr-3 text-xs text-white placeholder-slate-700 focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
            />
          </div>
        </div>

        {/* Grid theo bảng */}
        {MOCK_GROUPS.map(g => {
          const teams = filtered.filter(t => t.groupId === g._id);
          if (!teams.length) return null;
          const standing = (tid: string) => g.standings.find(s => s.teamId === tid);
          return (
            <section key={g._id}>
              <p className="mb-3 text-[10px] font-extrabold uppercase tracking-widest text-amber-500">{g.name}</p>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                {teams.map(team => {
                  const s = standing(team._id);
                  return (
                    <Link key={team._id} to={`/teams/${team._id}`} className="block">
                      <TeamMascotCard
                        name={team.name} tag={team.tag} logoUrl={team.logoUrl}
                        groupName={g.name}
                        wins={s?.wins} losses={s?.losses} points={s?.points} advance={s?.advance}
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
            <Users className="mx-auto mb-3 size-12 opacity-10 text-amber-400" />
            <p className="text-sm text-slate-600">Không tìm thấy đội nào</p>
          </div>
        )}
      </div>
      <PublicSidebar />
    </div>
  );
};

// ─── Team detail ──────────────────────────────────────────────────────────────
export const TeamDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const team = MOCK_TEAMS.find(t => t._id === id);
  const group = MOCK_GROUPS.find(g => g._id === team?.groupId);
  const standing = group?.standings.find(s => s.teamId === id);
  const teamMatches = MOCK_MATCHES.filter(m => m.teamA?._id === id || m.teamB?._id === id);

  if (!team) return (
    <div className="py-24 text-center text-slate-600">
      <p>Không tìm thấy đội</p>
      <Link to="/teams" className="mt-2 inline-block text-sm text-amber-400 hover:underline">← Danh sách đội</Link>
    </div>
  );

  return (
    <div className="flex gap-5 items-start">
      <div className="flex-1 min-w-0 max-w-3xl space-y-5">
        <Link to="/teams" className="inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 transition-colors">
          <ArrowLeft className="size-4" /> Danh sách đội
        </Link>

        <div className="flex items-center gap-5 rounded-xl p-6"
          style={{ background: '#0d1424', border: '1px solid rgba(138,43,226,0.2)', boxShadow: '0 0 40px rgba(138,43,226,0.06)' }}>
          <TeamAvatar name={team.name} tag={team.tag} logoUrl={team.logoUrl} size="xl" />
          <div>
            <h1 className="text-2xl font-extrabold text-white">{team.name}</h1>
            <p className="text-xs font-semibold mt-0.5" style={{ color: '#8b5cf6' }}>[{team.tag}]</p>
            <p className="text-sm text-slate-500 mt-0.5">{group?.name ?? 'Chưa có bảng'}</p>
            {standing && (
              <div className="mt-3 flex flex-wrap gap-2 text-xs">
                <span className="rounded-full px-2.5 py-0.5 font-semibold" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399' }}>{standing.wins} Thắng</span>
                <span className="rounded-full px-2.5 py-0.5 font-semibold" style={{ background: 'rgba(239,68,68,0.1)', color: '#f87171' }}>{standing.losses} Thua</span>
                <span className="rounded-full px-2.5 py-0.5 font-bold"
                  style={standing.advance
                    ? { background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }
                    : { color: '#64748b' }}>
                  {standing.points} điểm{standing.advance ? ' · Đi tiếp ✓' : ''}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl p-5" style={{ background: '#0d1424', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-bold text-white">
            <Users className="size-4 text-amber-400" /> Danh sách tuyển thủ
          </h2>
          <p className="text-sm text-slate-600 italic">Dữ liệu tuyển thủ sẽ hiển thị sau khi quản lý đội hoàn thiện hồ sơ.</p>
        </div>

        <div className="space-y-3">
          <h2 className="flex items-center gap-2 text-sm font-bold text-white">
            <Trophy className="size-4 text-amber-400" /> Lịch sử trận ({teamMatches.length})
          </h2>
          {teamMatches.map(m => <MatchCard key={m._id} match={m} />)}
          {teamMatches.length === 0 && <p className="py-6 text-center text-sm text-slate-600">Chưa có trận đấu</p>}
        </div>
      </div>
      <PublicSidebar />
    </div>
  );
};
