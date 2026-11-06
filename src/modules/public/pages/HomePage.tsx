import { ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { TeamAvatar } from '@/shared/components/team-avatar';
import { MOCK_GROUPS, MOCK_MATCHES, MOCK_TOURNAMENT } from '@/shared/lib/mock-data';
import { cn } from '@/shared/lib/utils';
import type { Match, Team } from '@/shared/types/esports.types';

const GAMES_IN = { BO1: 1, BO3: 3, BO5: 5 } as const;

const liveMatch = MOCK_MATCHES.find((match) => match.status === 'ongoing');
const upcoming = MOCK_MATCHES
  .filter((match) => match.status === 'scheduled' && match.teamA && match.teamB)
  .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
const latestResult = MOCK_MATCHES
  .filter((match) => match.status === 'confirmed' || match.status === 'pending_confirm')
  .sort((a, b) => b.scheduledAt.localeCompare(a.scheduledAt))[0];
// Trận nổi bật: đang đấu, nếu không có thì trận sắp tới gần nhất.
const featured = liveMatch ?? upcoming[0];
const highlights = MOCK_MATCHES.filter((match) => match.highlightUrl || match.youtubeUrl).slice(0, 3);

const rankOf = (team?: Team) => {
  for (const group of MOCK_GROUPS) {
    const row = group.standings.find(({ teamId }) => teamId === team?._id);
    if (row) return `#${row.rank} ${group.name}`;
  }
  return undefined;
};

const when = (iso: string) => {
  const date = new Date(iso);
  const time = date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  return date.toDateString() === new Date().toDateString() ? `Hôm nay · ${time}` : `${date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} · ${time}`;
};

export const HomePage = () => (
  <div className="space-y-14">
    {/* ── Hero ─────────────────────────────────────────────────── */}
    <section className="flex flex-wrap items-center gap-10 py-4">
      <div className="min-w-0 flex-[1_1_420px]">
        <span className="inline-flex rounded-full border px-3 py-1 text-xs font-semibold text-muted-foreground">
          {MOCK_TOURNAMENT.groupCount * MOCK_TOURNAMENT.teamsPerGroup} đội · {MOCK_TOURNAMENT.groupCount} bảng · {MOCK_TOURNAMENT.format}
        </span>
        <h1 className="mt-5 text-4xl font-black leading-[1.08] tracking-tight sm:text-5xl">
          Champion League
          <span className="block text-primary">{MOCK_TOURNAMENT.name.replace('Champion League ', '')}</span>
        </h1>
        <p className="mt-4 max-w-[480px] text-base leading-relaxed text-muted-foreground">
          Theo dõi trực tiếp tỉ số, lịch thi đấu và bảng xếp hạng của giải đấu esports.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            to={liveMatch ? `/matches/${liveMatch._id}` : '/schedule'}
            className="inline-flex h-12 items-center gap-2 rounded-xl bg-primary px-[22px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Play className="size-4 fill-current" />
            {liveMatch ? 'Xem trận đang đấu' : 'Xem lịch thi đấu'}
          </Link>
          <Link to="/groups" className="inline-flex h-12 items-center rounded-xl border px-[22px] font-semibold transition-colors hover:bg-muted">
            Bảng xếp hạng
          </Link>
        </div>
      </div>

      {featured && <FeaturedMatch match={featured} />}
    </section>

    {/* ── Upcoming ─────────────────────────────────────────────── */}
    <section aria-labelledby="upcoming-title">
      <SectionHead id="upcoming-title" title="Trận sắp diễn ra" link={{ to: '/schedule', label: 'Toàn bộ lịch' }} />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {upcoming.slice(0, latestResult ? 3 : 4).map((match) => <MatchTile key={match._id} match={match} />)}
        {latestResult && <MatchTile match={latestResult} />}
      </div>
      {upcoming.length === 0 && !latestResult && <p className="text-sm text-muted-foreground">Chưa có lịch thi đấu.</p>}
    </section>

    {/* ── Groups ───────────────────────────────────────────────── */}
    <section aria-labelledby="groups-title">
      <SectionHead
        id="groups-title"
        title="Vòng bảng"
        subtitle={`${MOCK_TOURNAMENT.advanceCount} đội đầu mỗi bảng vào Playoff`}
        link={{ to: '/groups', label: 'Xem đầy đủ' }}
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {MOCK_GROUPS.map((group) => (
          <div key={group._id} className="overflow-hidden rounded-2xl border bg-card">
            <h3 className="border-b px-[18px] py-3.5 font-extrabold">{group.name}</h3>
            <ol>
              {group.standings.slice(0, MOCK_TOURNAMENT.teamsPerGroup).map((row, index) => {
                const advances = index < MOCK_TOURNAMENT.advanceCount;
                return (
                  <li
                    key={row.teamId}
                    className={cn(
                      'flex items-center gap-3 px-[18px] py-2.5',
                      index === MOCK_TOURNAMENT.advanceCount - 1 && 'border-b border-dashed',
                      !advances && 'text-muted-foreground',
                    )}
                  >
                    <span className={cn('w-4 font-extrabold tabular-nums', advances && 'text-primary')}>{index + 1}</span>
                    <TeamAvatar name={row.teamName} tag={row.teamTag} logoUrl={row.logoUrl} size="xs" />
                    <span className={cn('min-w-0 flex-1 truncate', advances && 'font-semibold text-foreground')}>{row.teamName}</span>
                    <span className="font-extrabold tabular-nums">{row.points}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
      </div>
    </section>

    {/* ── Highlights ───────────────────────────────────────────── */}
    {highlights.length > 0 && (
      <section aria-labelledby="highlights-title">
        <SectionHead id="highlights-title" title="Highlight mới nhất" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {highlights.map((match) => (
            <Link key={match._id} to={`/matches/${match._id}`} className="group space-y-3">
              <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border bg-card">
                <div className="flex items-center gap-4 opacity-40">
                  <TeamAvatar name={match.teamA?.name ?? 'TBD'} tag={match.teamA?.tag ?? '?'} logoUrl={match.teamA?.logoUrl} size="lg" />
                  <TeamAvatar name={match.teamB?.name ?? 'TBD'} tag={match.teamB?.tag ?? '?'} logoUrl={match.teamB?.logoUrl} size="lg" />
                </div>
                <span className="absolute flex size-14 items-center justify-center rounded-full bg-primary/90 text-primary-foreground transition-transform group-hover:scale-110">
                  <Play className="size-5 fill-current" />
                </span>
              </div>
              <div>
                <p className="font-bold group-hover:text-primary">{match.teamA?.name} vs {match.teamB?.name}</p>
                <p className="text-xs text-muted-foreground">{match.round}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    )}
  </div>
);

function SectionHead({ id, title, subtitle, link }: { id: string; title: string; subtitle?: string; link?: { to: string; label: string } }) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 id={id} className="text-[22px] font-extrabold">{title}</h2>
        {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      {link && (
        <Link to={link.to} className="inline-flex items-center gap-1 font-semibold text-primary hover:underline">
          {link.label} <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  );
}

function FeaturedMatch({ match }: { match: Match }) {
  const isLive = match.status === 'ongoing';
  const slots = Array.from({ length: GAMES_IN[match.format] }, (_, index) => {
    const game = match.games.find(({ gameNumber }) => gameNumber === index + 1);
    if (game?.winnerId) {
      const winner = game.winnerId === match.teamA?._id ? match.teamA : match.teamB;
      return { label: `Ván ${index + 1}`, value: `${winner?.name ?? '?'} thắng`, current: false };
    }
    const current = isLive && index === match.games.length;
    return { label: `Ván ${index + 1}`, value: current ? 'Đang đấu' : '—', current };
  });

  return (
    <Link
      to={`/matches/${match._id}`}
      aria-label={`Trận ${match.teamA?.name} gặp ${match.teamB?.name}`}
      className="block min-w-0 flex-[1_1_460px] overflow-hidden rounded-[20px] border bg-card shadow-[0_24px_60px_rgba(0,0,0,0.35)] transition-colors hover:border-primary/40"
    >
      <div className="flex items-center justify-between border-b px-[22px] py-4">
        {isLive ? (
          <span className="inline-flex items-center gap-2 rounded-full bg-red-500/14 px-2.5 py-1 text-xs font-bold text-red-300">
            <span className="size-[7px] animate-pulse rounded-full bg-red-400" /> TRỰC TIẾP
          </span>
        ) : (
          <span className="rounded-full bg-blue-500/14 px-2.5 py-1 text-xs font-bold text-blue-300">{when(match.scheduledAt)}</span>
        )}
        <span className="text-xs text-muted-foreground">{match.round} · {match.format}</span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-4 px-[22px] py-9 text-center">
        <FeaturedTeam team={match.teamA} />
        <div>
          <p className="text-5xl font-black tabular-nums tracking-wide sm:text-[56px]">
            {match.scoreA ?? 0}<span className="px-2.5 text-muted-foreground/40">:</span>{match.scoreB ?? 0}
          </p>
        </div>
        <FeaturedTeam team={match.teamB} />
      </div>
      <div className="grid border-t" style={{ gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))` }}>
        {slots.map((slot) => (
          <div key={slot.label} className={cn('border-r px-2 py-3.5 text-center last:border-r-0', slot.current && 'bg-primary/6')}>
            <p className={cn('text-xs', slot.current ? 'text-primary' : 'text-muted-foreground')}>{slot.label}</p>
            <p className={cn('truncate text-sm font-bold', slot.value === '—' && 'text-muted-foreground')}>{slot.value}</p>
          </div>
        ))}
      </div>
    </Link>
  );
}

function FeaturedTeam({ team }: { team?: Team }) {
  const rank = rankOf(team);
  return (
    <div className="flex min-w-0 flex-col items-center gap-3">
      <TeamAvatar name={team?.name ?? 'TBD'} tag={team?.tag ?? '?'} logoUrl={team?.logoUrl} size="xl" />
      <p className="max-w-full truncate text-[17px] font-extrabold">{team?.name ?? 'TBD'}</p>
      {rank && <p className="text-xs text-muted-foreground">{rank}</p>}
    </div>
  );
}

function MatchTile({ match }: { match: Match }) {
  const finished = match.status === 'confirmed' || match.status === 'pending_confirm';
  const winnerA = finished && (match.scoreA ?? 0) > (match.scoreB ?? 0);
  const winnerB = finished && (match.scoreB ?? 0) > (match.scoreA ?? 0);
  const row = (team: Team | undefined, score: number | undefined, won: boolean) => (
    <div className={cn('flex items-center gap-2.5', finished && !won && 'text-muted-foreground')}>
      <TeamAvatar name={team?.name ?? 'TBD'} tag={team?.tag ?? '?'} logoUrl={team?.logoUrl} size="sm" />
      <span className="min-w-0 flex-1 truncate font-bold">{team?.name ?? 'TBD'}</span>
      {finished && <span className="font-extrabold tabular-nums">{score ?? 0}</span>}
    </div>
  );

  return (
    <Link
      to={`/matches/${match._id}`}
      className="flex flex-col gap-4 rounded-2xl border bg-card p-[18px] transition-colors hover:border-primary/40"
    >
      <div className="flex justify-between gap-2 text-xs text-muted-foreground">
        <span className="truncate">{match.round}</span>
        <span className={cn('shrink-0 font-bold', finished ? 'text-emerald-400' : 'text-foreground')}>
          {finished ? (match.status === 'confirmed' ? 'Kết thúc' : 'Chờ xác nhận') : when(match.scheduledAt)}
        </span>
      </div>
      <div className="space-y-2.5">
        {row(match.teamA, match.scoreA, winnerA)}
        {row(match.teamB, match.scoreB, winnerB)}
      </div>
      <span className="self-start rounded-full bg-blue-500/14 px-2.5 py-0.5 text-xs font-semibold text-blue-300">{match.format}</span>
    </Link>
  );
}
