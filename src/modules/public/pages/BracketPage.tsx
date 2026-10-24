import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MOCK_BRACKET } from '@/shared/lib/mock-data';
import { PublicSidebar } from '@/shared/components/public-sidebar';
import type { BracketSlot } from '@/shared/types/esports.types';

// ─── Layout constants (px) ────────────────────────────────────────────────────
const CW   = 200;   // card width
const CH   = 72;    // card height  (2 rows × 36)
const HGAP = 60;    // horizontal gap between rounds
const LABEL_H = 32; // height of round label row

// QF: 4 cards, each separated by GAP_QF
const GAP_QF = 24;
// Pairs → midpoint used for connectors
// QF tops:   0, CH+GAP_QF,  (CH+GAP_QF)*2,  (CH+GAP_QF)*3
const QF_TOP  = (i: number) => LABEL_H + i * (CH + GAP_QF);
const QF_MID  = (i: number) => QF_TOP(i) + CH / 2;

// SF: 2 cards, each centred between its 2 QF children
const SF_TOP  = (i: number) => (QF_MID(i * 2) + QF_MID(i * 2 + 1)) / 2 - CH / 2;
const SF_MID  = (i: number) => SF_TOP(i) + CH / 2;

// GF: 1 card, centred between the 2 SF cards
const GF_TOP  = () => (SF_MID(0) + SF_MID(1)) / 2 - CH / 2;
const GF_MID  = () => GF_TOP() + CH / 2;

// Total canvas height
const CANVAS_H = () => QF_TOP(3) + CH + LABEL_H;
// Column X (left edge of card)
const COL = [0, CW + HGAP, (CW + HGAP) * 2];
const TOTAL_W = COL[2] + CW;

// ─── Small logo ───────────────────────────────────────────────────────────────
function SmallLogo({ name, tag, logoUrl }: { name?: string; tag?: string; logoUrl?: string }) {
  const [err, setErr] = useState(false);
  return (
    <div style={{
      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
      background: '#1a2035', border: '2px solid rgba(255,255,255,0.18)',
      overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      {logoUrl && !err
        ? <img src={logoUrl} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setErr(true)} />
        : <span style={{ fontSize: 8, fontWeight: 800, color: 'rgba(255,255,255,0.35)' }}>{(tag ?? '?').slice(0, 3)}</span>
      }
    </div>
  );
}

// ─── Team row ─────────────────────────────────────────────────────────────────
function TeamRow({ name, tag, logoUrl, score, isWinner, isEmpty }: {
  name?: string; tag?: string; logoUrl?: string;
  score?: number; isWinner?: boolean; isEmpty?: boolean;
}) {
  if (isEmpty) return (
    <div style={{ height: 36, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px' }}>
      <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
        border: '1px dashed rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)' }} />
      <span style={{ fontSize: 11, color: '#334155' }}>TBD</span>
    </div>
  );
  return (
    <div style={{ height: 36, display: 'flex', alignItems: 'center', gap: 8, padding: '0 10px',
      background: isWinner ? 'rgba(245,158,11,0.07)' : 'transparent' }}>
      <SmallLogo name={name} tag={tag} logoUrl={logoUrl} />
      <span style={{ fontSize: 12, fontWeight: 600, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        color: isWinner ? '#f59e0b' : '#e2e8f0' }}>{name ?? 'TBD'}</span>
      {score !== undefined && (
        <span style={{ fontSize: 13, fontWeight: 800, color: isWinner ? '#f59e0b' : '#64748b' }}>{score}</span>
      )}
    </div>
  );
}

// ─── Match card ───────────────────────────────────────────────────────────────
function MatchCard({ slot, isGF }: { slot: BracketSlot; isGF?: boolean }) {
  const m = slot.match;
  const isEmpty = !m?.teamA && !m?.teamB;
  const isLive  = m?.status === 'ongoing';
  return (
    <Link to={m ? `/matches/${m._id}` : '#'} style={{
      display: 'block', width: CW, borderRadius: 10, overflow: 'hidden', textDecoration: 'none',
      background: isGF ? 'linear-gradient(135deg,#131c30,#0d1424)' : '#0d1424',
      border: `1px solid ${isGF ? 'rgba(245,158,11,0.4)' : isLive ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.09)'}`,
      boxShadow: isGF ? '0 0 18px rgba(245,158,11,0.12)' : 'none',
      pointerEvents: !m ? 'none' : 'auto',
    }}>
      {isEmpty ? (
        <><TeamRow isEmpty /><div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} /><TeamRow isEmpty /></>
      ) : (
        <>
          <TeamRow name={m?.teamA?.name} tag={m?.teamA?.tag} logoUrl={m?.teamA?.logoUrl}
            score={m?.scoreA} isWinner={m?.winnerId === m?.teamA?._id} />
          <div style={{ height: 1, background: 'rgba(255,255,255,0.06)' }} />
          <TeamRow name={m?.teamB?.name} tag={m?.teamB?.tag} logoUrl={m?.teamB?.logoUrl}
            score={m?.scoreB} isWinner={m?.winnerId === m?.teamB?._id} />
        </>
      )}
    </Link>
  );
}

// ─── SVG connector lines ──────────────────────────────────────────────────────
function Connectors({ h }: { h: number }) {
  const c = 'rgba(255,255,255,0.18)';
  const sw = 1.5;

  const lines: React.ReactNode[] = [];

  // QF → SF: pair (0,1)→SF0  pair (2,3)→SF1
  for (let sf = 0; sf < 2; sf++) {
    const qfA = sf * 2;
    const qfB = sf * 2 + 1;
    const x1   = COL[0] + CW;
    const xMid = COL[1] - HGAP / 2;
    const x2   = COL[1];
    const yA   = QF_MID(qfA);
    const yB   = QF_MID(qfB);
    const yM   = SF_MID(sf);

    lines.push(
      // QF-A → right → midX → SF midY
      <polyline key={`qf${qfA}-mid`} points={`${x1},${yA} ${xMid},${yA} ${xMid},${yM} ${x2},${yM}`}
        fill="none" stroke={c} strokeWidth={sw} strokeLinejoin="round" />,
      // QF-B → right → midX → SF midY (meets same xMid,yM)
      <polyline key={`qf${qfB}-mid`} points={`${x1},${yB} ${xMid},${yB} ${xMid},${yM}`}
        fill="none" stroke={c} strokeWidth={sw} strokeLinejoin="round" />,
    );
  }

  // SF → GF
  const x1   = COL[1] + CW;
  const xMid = COL[2] - HGAP / 2;
  const x2   = COL[2];
  const y0   = SF_MID(0);
  const y1   = SF_MID(1);
  const yGF  = GF_MID();

  lines.push(
    <polyline key="sf0-gf" points={`${x1},${y0} ${xMid},${y0} ${xMid},${yGF} ${x2},${yGF}`}
      fill="none" stroke={c} strokeWidth={sw} strokeLinejoin="round" />,
    <polyline key="sf1-gf" points={`${x1},${y1} ${xMid},${y1} ${xMid},${yGF}`}
      fill="none" stroke={c} strokeWidth={sw} strokeLinejoin="round" />,
  );

  return (
    <svg style={{ position: 'absolute', top: 0, left: 0, pointerEvents: 'none' }}
      width={TOTAL_W} height={h} viewBox={`0 0 ${TOTAL_W} ${h}`}>
      {lines}
    </svg>
  );
}

// ─── BracketPage ──────────────────────────────────────────────────────────────
export const BracketPage = () => {
  const qf = [...MOCK_BRACKET.filter(s => s.round === 1)];
  const sf = [...MOCK_BRACKET.filter(s => s.round === 2)];
  const gf = [...MOCK_BRACKET.filter(s => s.round === 3)];
  while (qf.length < 4) qf.push({ round: 1, position: qf.length });
  while (sf.length < 2) sf.push({ round: 2, position: sf.length });
  if  (!gf.length)       gf.push({ round: 3, position: 0 });

  const canvasH = CANVAS_H();

  const LABELS: Record<number, { text: string; color: string }> = {
    0: { text: 'TỨ KẾT',     color: '#475569' },
    1: { text: 'BÁN KẾT',    color: '#475569' },
    2: { text: '🏆 GRAND FINAL', color: '#f59e0b' },
  };

  return (
    <div className="flex gap-5 items-start">
      <div className="flex-1 min-w-0 space-y-4">
        <h1 className="text-lg font-extrabold text-white tracking-tight">SƠ ĐỒ NHÁNH ĐẤU PLAYOFF</h1>

        <div className="rounded-xl overflow-x-auto"
          style={{ background: '#0a1020', border: '1px solid rgba(255,255,255,0.07)', padding: '24px 24px 20px' }}>

          {/* Round label row */}
          <div style={{ display: 'flex', width: TOTAL_W, marginBottom: 12 }}>
            {[0, 1, 2].map(ci => (
              <div key={ci} style={{ width: CW, marginLeft: ci === 0 ? 0 : HGAP,
                textAlign: 'center', fontSize: 10, fontWeight: 800,
                textTransform: 'uppercase', letterSpacing: '0.1em', color: LABELS[ci].color }}>
                {LABELS[ci].text}
              </div>
            ))}
          </div>

          {/* Cards + SVG connectors */}
          <div style={{ position: 'relative', width: TOTAL_W, height: canvasH }}>
            <Connectors h={canvasH} />

            {/* QF */}
            {qf.map((slot, i) => (
              <div key={slot.matchId ?? `qf${i}`}
                style={{ position: 'absolute', left: COL[0], top: QF_TOP(i) }}>
                <MatchCard slot={slot} />
              </div>
            ))}

            {/* SF */}
            {sf.map((slot, i) => (
              <div key={slot.matchId ?? `sf${i}`}
                style={{ position: 'absolute', left: COL[1], top: SF_TOP(i) }}>
                <MatchCard slot={slot} />
              </div>
            ))}

            {/* GF */}
            {gf.map((slot, i) => (
              <div key={slot.matchId ?? `gf${i}`}
                style={{ position: 'absolute', left: COL[2], top: GF_TOP() }}>
                <MatchCard slot={slot} isGF />
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
              letterSpacing: '0.1em', color: '#f59e0b', marginBottom: 6 }}>PLAYOFF PROGRESS</p>
            <div style={{ height: 6, borderRadius: 9999, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '45%', borderRadius: 9999,
                background: 'linear-gradient(90deg,#f59e0b,#d97706)',
                boxShadow: '0 0 8px rgba(245,158,11,0.4)' }} />
            </div>
          </div>
        </div>
      </div>

      <PublicSidebar />
    </div>
  );
};
