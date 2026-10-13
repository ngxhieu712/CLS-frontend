import { Trophy, Calendar, Flame, ChevronRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MOCK_MATCHES, MOCK_TOURNAMENT, MOCK_GROUPS } from '@/shared/lib/mock-data';
import { MatchCard } from '@/shared/components/match-card';

const liveMatches     = MOCK_MATCHES.filter(m => m.status === 'ongoing');
const upcomingMatches = MOCK_MATCHES.filter(m => m.status === 'scheduled').slice(0, 4);
const recentMatches   = MOCK_MATCHES.filter(m => m.status === 'confirmed').slice(0, 3);

const totalConfirmed = MOCK_MATCHES.filter(m => m.status === 'confirmed').length;
const totalMatches   = MOCK_MATCHES.length;
const progressPct    = Math.round((totalConfirmed / totalMatches) * 100);

export const HomePage = () => (
  <div className="space-y-10">
    {/* ── Hero banner ──────────────────────────────────────────── */}
    <section className="relative overflow-hidden rounded-2xl border border-amber-500/20 bg-gradient-to-br from-[#0d1f38] to-[#071426] px-6 py-10 md:px-10 md:py-14">
      {/* background glow */}
      <div className="pointer-events-none absolute -right-20 -top-20 size-64 rounded-full bg-amber-500/8 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-16 left-10 size-48 rounded-full bg-blue-500/6 blur-3xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-amber-400">
            <Trophy className="size-4" /> Giải đấu đang diễn ra
          </div>
          <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white md:text-4xl">
            {MOCK_TOURNAMENT.name}
          </h1>
          <p className="max-w-md text-sm text-slate-400">{MOCK_TOURNAMENT.format} · {MOCK_TOURNAMENT.groupCount} bảng × {MOCK_TOURNAMENT.teamsPerGroup} đội · Top {MOCK_TOURNAMENT.advanceCount} mỗi bảng đi tiếp</p>

          {/* Progress */}
          <div className="max-w-xs space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Tiến trình giải đấu</span>
              <span className="text-amber-400">{progressPct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-muted/80">
              <div className="h-full rounded-full bg-amber-500 transition-all" style={{ width: `${progressPct}%` }} />
            </div>
            <p className="text-xs text-slate-600">{totalConfirmed} / {totalMatches} trận đã hoàn thành</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link to="/schedule" className="flex items-center gap-2 rounded-xl border border-white/10 bg-muted/50 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/10">
            <Calendar className="size-4" /> Lịch đấu
          </Link>
          <Link to="/bracket" className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-black transition-opacity hover:opacity-90">
            Xem bracket <ChevronRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>

    {/* ── Đang đấu ─────────────────────────────────────────────── */}
    {liveMatches.length > 0 && (
      <section>
        <SectionHeader icon={<Flame className="size-4 text-amber-400" />} title="Đang diễn ra" badge={`${liveMatches.length} trận`} badgeLive />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {liveMatches.map(m => <MatchCard key={m._id} match={m} />)}
        </div>
      </section>
    )}

    {/* ── Sắp diễn ra ──────────────────────────────────────────── */}
    <section>
      <SectionHeader icon={<Clock className="size-4 text-blue-400" />} title="Sắp diễn ra" link={{ to: '/schedule', label: 'Xem tất cả' }} />
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {upcomingMatches.map(m => <MatchCard key={m._id} match={m} compact />)}
      </div>
    </section>

    {/* ── BXH nhanh ────────────────────────────────────────────── */}
    <section>
      <SectionHeader icon={<Trophy className="size-4 text-amber-400" />} title="Bảng xếp hạng" link={{ to: '/groups', label: 'Chi tiết' }} />
      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_GROUPS.map(g => (
          <div key={g._id} className="rounded-xl border border-white/10 public-card p-4">
            <p className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-400">{g.name}</p>
            <div className="space-y-2">
              {g.standings.slice(0, 4).map((row, idx) => (
                <div key={row.teamId} className="flex items-center gap-2 text-sm">
                  <span className={`w-4 shrink-0 text-xs font-bold ${idx < 2 ? 'text-amber-400' : 'text-slate-600'}`}>{row.rank}</span>
                  <span className={`flex-1 truncate font-medium ${row.advance ? 'text-white' : 'text-slate-400'}`}>{row.teamName}</span>
                  <span className="tabular-nums text-xs text-slate-500">{row.wins}T {row.losses}B</span>
                  <span className="w-6 text-right tabular-nums text-xs font-bold text-amber-400">{row.points}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* ── Trận vừa hoàn thành ──────────────────────────────────── */}
    {recentMatches.length > 0 && (
      <section>
        <SectionHeader icon={<Trophy className="size-4 text-emerald-400" />} title="Kết quả mới nhất" link={{ to: '/schedule', label: 'Tất cả kết quả' }} />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {recentMatches.map(m => <MatchCard key={m._id} match={m} />)}
        </div>
      </section>
    )}
  </div>
);

function SectionHeader({ icon, title, badge, badgeLive, link }: {
  icon: React.ReactNode; title: string; badge?: string; badgeLive?: boolean;
  link?: { to: string; label: string };
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="text-base font-bold text-white">{title}</h2>
      {badge && (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badgeLive ? 'animate-pulse bg-amber-500/20 text-amber-400' : 'bg-muted/80 text-slate-400'}`}>
          {badge}
        </span>
      )}
      {link && (
        <Link to={link.to} className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-amber-400 transition-colors">
          {link.label} <ChevronRight className="size-3" />
        </Link>
      )}
    </div>
  );
}
