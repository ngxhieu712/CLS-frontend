import { useState } from 'react';
import { cn } from '@/shared/lib/utils';

interface TeamAvatarProps {
  name: string;
  tag: string;
  logoUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE = {
  xs: { px: 20, text: 7  },
  sm: { px: 32, text: 10 },
  md: { px: 44, text: 13 },
  lg: { px: 64, text: 18 },
  xl: { px: 96, text: 24 },
};

/**
 * Circle logo — viền trắng mỏng, background tối #1a2035.
 * Dùng ở mọi nơi: sidebar, standings, match rows, bracket, v.v.
 */
export const TeamAvatar = ({ name, tag, logoUrl, size = 'md', className }: TeamAvatarProps) => {
  const [err, setErr] = useState(false);
  const s = SIZE[size];
  return (
    <div
      className={cn('shrink-0 overflow-hidden', className)}
      title={name}
      aria-label={name}
      style={{
        width: s.px, height: s.px,
        borderRadius: '50%',
        background: '#1a2035',
        border: '2px solid rgba(255,255,255,0.18)',
        boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {logoUrl && !err ? (
        <img
          src={logoUrl} alt={name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          onError={() => setErr(true)}
        />
      ) : (
        <span style={{ fontSize: s.text, fontWeight: 800, color: 'rgba(255,255,255,0.5)', letterSpacing: 0 }}>
          {tag.slice(0, 3)}
        </span>
      )}
    </div>
  );
};

/**
 * TeamChip — logo circle nhỏ + tên + tag, dùng trong bảng standings.
 */
export const TeamChip = ({ name, tag, logoUrl }: { name: string; tag: string; logoUrl?: string }) => (
  <div className="flex items-center gap-2">
    <TeamAvatar name={name} tag={tag} logoUrl={logoUrl} size="sm" />
    <div className="min-w-0">
      <p className="truncate text-sm font-medium text-white">{name}</p>
      <p className="text-[10px] text-slate-500">{tag}</p>
    </div>
  </div>
);

/**
 * TeamMascotCard — card lớn dùng ở TeamsPage grid.
 * Layout: logo circle to giữa, tên, [TAG], region, roster chữ cái, CTA button.
 */
export const TeamMascotCard = ({
  name, tag, logoUrl, region = 'VIỆT NAM', groupName,
  wins, losses, points, advance,
}: {
  name: string; tag: string; logoUrl?: string; region?: string;
  groupName?: string; wins?: number; losses?: number; points?: number; advance?: boolean;
}) => {
  const [err, setErr] = useState(false);
  // Roster initials từ tên đội (lấy 5 ký tự đầu của các từ)
  const rosterLetters = name.split(' ').map(w => w[0]?.toUpperCase() ?? '?').slice(0, 5);
  while (rosterLetters.length < 5) rosterLetters.push('?');

  return (
    <div
      className="flex flex-col items-center rounded-2xl overflow-hidden transition-all duration-200 cursor-pointer"
      style={{ background: '#0d1424', border: '1px solid rgba(255,255,255,0.08)', padding: '20px 16px 16px' }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = '1px solid rgba(138,43,226,0.5)';
        el.style.boxShadow = '0 0 24px rgba(138,43,226,0.15)';
        el.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = '1px solid rgba(255,255,255,0.08)';
        el.style.boxShadow = 'none';
        el.style.transform = 'none';
      }}
    >
      {/* Logo circle lớn */}
      <div style={{
        width: 96, height: 96, borderRadius: '50%',
        background: '#1a2035',
        border: '2px solid rgba(255,255,255,0.18)',
        boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', marginBottom: 12,
      }}>
        {logoUrl && !err ? (
          <img src={logoUrl} alt={name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={() => setErr(true)}
          />
        ) : (
          <span style={{ fontSize: 22, fontWeight: 800, color: 'rgba(255,255,255,0.4)' }}>{tag.slice(0, 3)}</span>
        )}
      </div>

      {/* Name */}
      <p className="text-center font-bold text-white text-base leading-tight">{name}</p>

      {/* [TAG] */}
      <p className="mt-1 text-center text-xs font-semibold" style={{ color: '#8b5cf6' }}>[{tag}]</p>

      {/* Region */}
      <div className="flex items-center gap-1 mt-1.5">
        <span className="text-[10px]">📍</span>
        <span className="text-[10px] text-slate-400 uppercase tracking-wider">{region}</span>
        {groupName && (
          <>
            <span className="text-slate-700 mx-0.5">·</span>
            <span className="text-[10px] text-amber-500/70">{groupName}</span>
          </>
        )}
      </div>

      {/* Roster members */}
      <div className="mt-4 w-full">
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 text-center mb-2">Roster Members</p>
        <div className="flex items-center justify-center gap-1.5">
          {rosterLetters.map((letter, i) => (
            <div key={i} style={{
              width: 28, height: 28, borderRadius: '50%',
              background: '#1e2a45',
              border: '1px solid rgba(255,255,255,0.12)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)',
            }}>
              {letter}
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      {wins !== undefined && (
        <div className="flex items-center gap-3 mt-3 text-[11px]">
          <span className="text-emerald-400 font-semibold">{wins}T</span>
          <span className="text-red-400/70">{losses}B</span>
          <span className="font-bold ml-1" style={{ color: advance ? '#f59e0b' : '#475569' }}>
            {points}đ{advance ? ' ✓' : ''}
          </span>
        </div>
      )}

      {/* CTA button */}
      <button
        className="mt-4 w-full rounded-xl py-2 text-sm font-bold transition-all flex items-center justify-center gap-2"
        style={{
          background: 'rgba(138,43,226,0.15)',
          border: '1px solid rgba(138,43,226,0.4)',
          color: '#a78bfa',
        }}
      >
        Xem Chi Tiết <span>›</span>
      </button>
    </div>
  );
};
