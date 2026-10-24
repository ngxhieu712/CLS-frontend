import { Trophy, Calendar, Flame, ChevronRight, Clock, Zap, Shield } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_MATCHES, MOCK_TOURNAMENT, MOCK_GROUPS, MOCK_TEAMS } from '@/shared/lib/mock-data';
import { MatchCard } from '@/shared/components/match-card';
import { PublicSidebar } from '@/shared/components/public-sidebar';

const liveMatches     = MOCK_MATCHES.filter(m => m.status === 'ongoing');
const upcomingMatches = MOCK_MATCHES.filter(m => m.status === 'scheduled').slice(0, 4);
const recentMatches   = MOCK_MATCHES.filter(m => m.status === 'confirmed').slice(0, 3);

const totalConfirmed = MOCK_MATCHES.filter(m => m.status === 'confirmed').length;
const totalMatches   = MOCK_MATCHES.length;
const progressPct    = Math.round((totalConfirmed / totalMatches) * 100);

export const HomePage = () => (
  <div className="flex gap-5 items-start">
    {/* ── Main ─────────────────────────────────────────────────── */}
    <div className="flex-1 min-w-0 space-y-6">

      {/* ── Hero banner ──────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden rounded-xl"
        style={{
          background: 'linear-gradient(135deg, #0c1428 0%, #0a1020 50%, #111830 100%)',
          border: '1px solid rgba(155,92,246,0.25)',
          boxShadow: '0 0 60px rgba(155,92,246,0.08), inset 0 1px rgba(255,255,255,0.04)',
        }}
      >
        {/* Decorative glows */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-20 -top-20 size-72 rounded-full blur-3xl"
            style={{ background: 'rgba(155,92,246,0.1)' }} />
          <div className="absolute -bottom-16 left-16 size-56 rounded-full blur-3xl"
            style={{ background: 'rgba(34,211,238,0.06)' }} />
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.025]" style={{
            backgroundImage: 'linear-gradient(rgba(155,92,246,1) 1px,transparent 1px),linear-gradient(90deg,rgba(155,92,246,1) 1px,transparent 1px)',
            backgroundSize: '40px 40px',
          }} />
        </div>

        {/* Trophy decoration */}
        <div
          className="pointer-events-none absolute right-8 top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center"
          style={{
            width: 130, height: 130,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(155,92,246,0.15) 0%, transparent 70%)',
          }}
        >
          <Trophy
            className="size-16 opacity-30"
            style={{ color: 'var(--es-purple)', filter: 'drop-shadow(0 0 20px rgba(155,92,246,0.5))' }}
          />
        </div>

        <div className="relative px-6 py-8 md:px-8">
          {/* Eyebrow */}
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--es-purple)' }}>
            <Zap className="size-3.5" />
            Giải đấu đang diễn ra
            {liveMatches.length > 0 && (
              <span className="ml-2 flex items-center gap-1 rounded-full px-2 py-0.5"
                style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}>
                <span className="inline-block size-1.5 rounded-full bg-red-400" style={{ animation: 'pulse 1.5s ease-in-out infinite' }} />
                LIVE
              </span>
            )}
          </div>

          {/* Title with gradient */}
          <h1
            className="mb-3 text-2xl font-extrabold leading-tight tracking-tight md:text-3xl"
            style={{
              background: 'linear-gradient(90deg, #ffffff 40%, var(--es-purple) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {MOCK_TOURNAMENT.name}
          </h1>

          <p className="mb-4 max-w-md text-sm text-slate-400">
            {MOCK_TOURNAMENT.format} · {MOCK_TOURNAMENT.groupCount} bảng × {MOCK_TOURNAMENT.teamsPerGroup} đội
            <span className="mx-2 text-slate-700">·</span>
            Top {MOCK_TOURNAMENT.advanceCount} mỗi bảng đi tiếp
          </p>

          {/* Progress */}
          <div className="mb-5 max-w-xs space-y-1.5">
            <div className="flex justify-between text-xs text-slate-500">
              <span>Tiến trình giải đấu</span>
              <span style={{ color: 'var(--es-purple)' }}>{progressPct}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <div
                className="h-full rounded-full transition-all"
                style={{
                  width: `${progressPct}%`,
                  background: 'linear-gradient(90deg, var(--es-purple), var(--es-cyan))',
                  boxShadow: '0 0 8px rgba(155,92,246,0.5)',
                }}
              />
            </div>
            <p className="text-[10px] text-slate-700">{totalConfirmed}/{totalMatches} trận hoàn thành</p>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-3">
            <Link
              to="/schedule"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-slate-300 transition-all hover:text-white"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <Calendar className="size-4" /> Lịch đấu
            </Link>
            <Link
              to="/bracket"
              className="flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-bold text-white transition-all hover:opacity-90"
              style={{
                background: 'linear-gradient(135deg, var(--es-purple), #6d28d9)',
                boxShadow: '0 0 20px rgba(155,92,246,0.35)',
              }}
            >
              <Shield className="size-4" /> Xem bracket <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Live matches ─────────────────────────────────────────── */}
      {liveMatches.length > 0 && (
        <section>
          <SectionTitle
            icon={<Flame className="size-4" style={{ color: '#f87171' }} />}
            title="Đang diễn ra"
            badge={`${liveMatches.length} LIVE`}
            live
          />
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {liveMatches.map(m => <MatchCard key={m._id} match={m} />)}
          </div>
        </section>
      )}

      {/* ── Upcoming ─────────────────────────────────────────────── */}
      <section>
        <SectionTitle
          icon={<Clock className="size-4" style={{ color: 'var(--es-cyan)' }} />}
          title="Sắp diễn ra"
          link={{ to: '/schedule', label: 'Xem tất cả' }}
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {upcomingMatches.map(m => <MatchCard key={m._id} match={m} compact />)}
        </div>
      </section>

      {/* ── Standings mini ───────────────────────────────────────── */}
      <section>
        <SectionTitle
          icon={<Trophy className="size-4" style={{ color: 'var(--es-purple)' }} />}
          title="Bảng xếp hạng"
          link={{ to: '/groups', label: 'Chi tiết' }}
        />
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {MOCK_GROUPS.map(g => (
            <div
              key={g._id}
              className="rounded-xl overflow-hidden"
              style={{ background: 'var(--es-bg-card)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              {/* Group header */}
              <div
                className="px-3 py-2"
                style={{
                  background: 'rgba(155,92,246,0.08)',
                  borderBottom: '1px solid rgba(155,92,246,0.15)',
                }}
              >
                <p className="text-[10px] font-extrabold uppercase tracking-widest" style={{ color: 'var(--es-purple)' }}>
                  {g.name}
                </p>
              </div>
              <div className="p-3 space-y-2">
                {g.standings.slice(0, 4).map((row, idx) => (
                  <div key={row.teamId} className="flex items-center gap-2">
                    <span
                      className="w-4 shrink-0 text-[10px] font-bold tabular-nums"
                      style={{ color: idx < 2 ? 'var(--es-purple)' : '#334155' }}
                    >
                      {row.rank}
                    </span>
                    <span className={`flex-1 truncate text-xs font-medium ${row.advance ? 'text-slate-200' : 'text-slate-600'}`}>
                      {row.teamName}
                    </span>
                    <span className="text-[9px] tabular-nums text-slate-700">{row.wins}T</span>
                    <span
                      className="w-5 text-right text-xs font-bold tabular-nums"
                      style={{ color: row.advance ? 'var(--es-cyan)' : '#334155' }}
                    >
                      {row.points}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Recent results ───────────────────────────────────────── */}
      {recentMatches.length > 0 && (
        <section>
          <SectionTitle
            icon={<Trophy className="size-4" style={{ color: 'var(--es-cyan)' }} />}
            title="Kết quả mới nhất"
            link={{ to: '/schedule', label: 'Tất cả kết quả' }}
          />
          <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {recentMatches.map(m => <MatchCard key={m._id} match={m} />)}
          </div>
        </section>
      )}

      {/* ── Dữ liệu đội tuyển & chỉ số ──────────────────────────── */}
      <TeamStatsSection />

    </div>

    {/* ── Sidebar ──────────────────────────────────────────────── */}
    <PublicSidebar />
  </div>
);

function SectionTitle({
  icon, title, badge, live, link,
}: {
  icon: React.ReactNode; title: string; badge?: string; live?: boolean;
  link?: { to: string; label: string };
}) {
  return (
    <div className="flex items-center gap-2">
      {icon}
      <h2 className="text-sm font-bold text-white">{title}</h2>
      {badge && (
        <span
          className="rounded-full px-2 py-0.5 text-[10px] font-bold"
          style={live
            ? { background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }
            : { background: 'rgba(255,255,255,0.05)', color: '#64748b' }}
        >
          {badge}
        </span>
      )}
      {link && (
        <Link
          to={link.to}
          className="ml-auto flex items-center gap-1 text-[11px] font-medium transition-colors hover:text-white"
          style={{ color: 'var(--es-purple)' }}
        >
          {link.label} <ChevronRight className="size-3" />
        </Link>
      )}
    </div>
  );
}

// ─── Mini sparkline SVG ───────────────────────────────────────────────────────
function Sparkline({ data, color }: { data: number[]; color: string }) {
  const w = 200, h = 48;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 8) - 4;
    return `${x},${y}`;
  });
  const linePath = `M ${pts.join(' L ')}`;
  const fillPath = `${linePath} L ${w},${h} L 0,${h} Z`;
  return (
    <svg width="100%" height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#grad-${color.replace('#','')})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Single stat row ─────────────────────────────────────────────────────────
function StatRow({ label, value, color, data }: {
  label: string; value: string | number; color: string; data: number[];
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-[11px]">
        <span className="text-slate-500">{label}</span>
        <span className="font-bold" style={{ color }}>{value}</span>
      </div>
      <Sparkline data={data} color={color} />
    </div>
  );
}

// ─── Team stats card ─────────────────────────────────────────────────────────
function TeamStatsCard({ teamId }: { teamId: string }) {
  const team     = MOCK_TEAMS.find(t => t._id === teamId);
  const group    = MOCK_GROUPS.find(g => g._id === team?.groupId);
  const standing = group?.standings.find(s => s.teamId === teamId);
  const [imgErr, setImgErr] = useState(false);

  if (!team) return null;

  const total   = (standing?.wins ?? 0) + (standing?.losses ?? 0);
  const winRate = total > 0 ? Math.round(((standing?.wins ?? 0) / total) * 100) : 0;

  // Mock sparkline data — 10 điểm ngẫu nhiên nhưng deterministic theo teamId
  const seed  = teamId.charCodeAt(teamId.length - 1);
  const mkData = (base: number, amp: number) =>
    Array.from({ length: 10 }, (_, i) => Math.max(0, base + Math.sin(i * seed) * amp + i * (amp / 10)));

  return (
    <div
      className="rounded-xl p-4 space-y-3"
      style={{ background: '#0a1020', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3">
        <div style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0, overflow: 'hidden',
          background: '#1a2035', border: '2px solid rgba(255,255,255,0.18)',
        }}>
          {team.logoUrl && !imgErr
            ? <img src={team.logoUrl} alt={team.name} className="w-full h-full object-cover" onError={() => setImgErr(true)} />
            : <div className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-500">{team.tag.slice(0,3)}</div>
          }
        </div>
        <div>
          <p className="font-bold text-white text-sm">{team.name}</p>
          <p className="text-[10px] text-slate-500">
            {standing?.wins ?? 0}W · {standing?.losses ?? 0}L · {standing?.points ?? 0} pts
          </p>
        </div>
      </div>

      {/* Charts */}
      <StatRow label="Win rate"   value={`${winRate}%`}     color="#22d3ee" data={mkData(winRate, 15)} />
      <StatRow label="Kill count" value={seed % 20 + 15}    color="#a78bfa" data={mkData(20, 8)} />
      <StatRow label="Objective"  value={seed % 30 + 55}    color="#f59e0b" data={mkData(60, 10)} />
    </div>
  );
}

// ─── Team Stats Section ───────────────────────────────────────────────────────
function TeamStatsSection() {
  // Top 4 đội đứng đầu BXH
  const top4 = MOCK_GROUPS.flatMap(g => g.standings.slice(0, 1))
    .sort((a, b) => b.points - a.points)
    .slice(0, 4)
    .map(s => s.teamId);

  return (
    <section>
      <SectionTitle
        icon={<Zap className="size-4 text-amber-400" />}
        title="Dữ liệu đội tuyển & chỉ số"
        link={{ to: '/teams', label: 'Xem tất cả' }}
      />
      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {top4.map(id => <TeamStatsCard key={id} teamId={id} />)}
      </div>
    </section>
  );
}
