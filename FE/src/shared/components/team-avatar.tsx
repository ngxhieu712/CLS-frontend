import { cn } from '@/shared/lib/utils';

interface TeamAvatarProps {
  name: string;
  tag: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const SIZE = {
  sm:  { wrap: 'size-8  text-[10px]' },
  md:  { wrap: 'size-11 text-xs'    },
  lg:  { wrap: 'size-16 text-sm'    },
  xl:  { wrap: 'size-24 text-base'  },
};

/** Returns a deterministic hue from team tag so every team gets a unique colour */
function tagHue(tag: string) {
  let h = 0;
  for (let i = 0; i < tag.length; i++) h = (h * 31 + tag.charCodeAt(i)) % 360;
  return h;
}

export const TeamAvatar = ({ name, tag, logoUrl, size = 'md', className }: TeamAvatarProps) => {
  const s = SIZE[size];
  const hue = tagHue(tag);
  return (
    <div
      className={cn('relative flex shrink-0 items-center justify-center rounded-xl font-extrabold tracking-wider overflow-hidden', s.wrap, className)}
      title={name}
      aria-label={name}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 60% 8%), hsl(${(hue + 40) % 360} 50% 12%))`,
        border: `1px solid hsl(${hue} 70% 25% / 0.6)`,
        boxShadow: `0 0 12px hsl(${hue} 80% 40% / 0.15)`,
        color: `hsl(${hue} 80% 70%)`,
      }}
    >
      {logoUrl ? (
        <img src={logoUrl} alt={`Logo ${name}`} className="size-full rounded-xl object-contain p-1" />
      ) : (
        <span>{tag.slice(0, 3)}</span>
      )}
    </div>
  );
};

/**
 * Large mascot card — used in TeamsPage grid.
 * Shows a big coloured mascot area + name + tag + region.
 */
export const TeamMascotCard = ({
  name, tag, logoUrl, region = 'VIỆT NAM', groupName, wins, losses, points, advance,
}: {
  name: string; tag: string; logoUrl?: string; region?: string;
  groupName?: string; wins?: number; losses?: number; points?: number; advance?: boolean;
}) => {
  const hue = tagHue(tag);
  return (
    <div
      className="flex flex-col rounded-xl overflow-hidden transition-all duration-200 cursor-pointer group"
      style={{
        background: 'var(--es-bg-card)',
        border: '1px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = `1px solid hsl(${hue} 70% 45% / 0.5)`;
        el.style.boxShadow = `0 0 24px hsl(${hue} 80% 40% / 0.15)`;
        el.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement;
        el.style.border = '1px solid rgba(255,255,255,0.07)';
        el.style.boxShadow = 'none';
        el.style.transform = 'none';
      }}
    >
      {/* Mascot area */}
      <div
        className="relative flex items-center justify-center py-5"
        style={{
          background: `linear-gradient(160deg, hsl(${hue} 40% 7%), hsl(${(hue+40)%360} 35% 10%))`,
          borderBottom: `1px solid hsl(${hue} 60% 20% / 0.4)`,
          minHeight: 110,
        }}
      >
        {/* Glow behind mascot */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at 50% 60%, hsl(${hue} 80% 40% / 0.12), transparent 65%)`,
          }}
        />
        {/* Mascot */}
        <div
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: 72, height: 72,
            background: `linear-gradient(135deg, hsl(${hue} 60% 10%), hsl(${(hue+40)%360} 50% 14%))`,
            border: `2px solid hsl(${hue} 70% 30% / 0.6)`,
            boxShadow: `0 0 20px hsl(${hue} 80% 40% / 0.25), inset 0 1px hsl(${hue} 80% 70% / 0.1)`,
            fontSize: 32,
          }}
        >
          {logoUrl ? (
            <img src={logoUrl} alt={name} className="size-full rounded-full object-contain p-1.5" />
          ) : (
            <span
              className="font-extrabold tracking-wider text-xl"
              style={{ color: `hsl(${hue} 80% 70%)` }}
            >
              {tag.slice(0, 3)}
            </span>
          )}
        </div>
        {/* Tag badge top-right */}
        <span
          className="absolute top-2 right-2.5 text-[9px] font-bold tracking-widest px-1.5 py-0.5 rounded"
          style={{
            background: `hsl(${hue} 70% 12%)`,
            border: `1px solid hsl(${hue} 60% 30% / 0.4)`,
            color: `hsl(${hue} 70% 60%)`,
          }}
        >
          {tag}
        </span>
      </div>

      {/* Info area */}
      <div className="flex flex-col gap-2 p-3">
        <div>
          <p className="font-bold text-white text-sm leading-tight truncate">{name}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-[9px] text-slate-500">🇻🇳 {region}</span>
            {groupName && (
              <>
                <span className="text-slate-700">·</span>
                <span className="text-[9px]" style={{ color: 'var(--es-cyan)' }}>{groupName}</span>
              </>
            )}
          </div>
        </div>

        {/* Roster member dots */}
        <div className="flex items-center gap-1">
          <span className="text-[9px] text-slate-600 mr-1">Roster Members</span>
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="rounded-full"
              style={{
                width: 16, height: 16,
                background: i < 3
                  ? `hsl(${hue} 50% 20%)`
                  : 'rgba(255,255,255,0.05)',
                border: `1px solid hsl(${hue} 60% 30% / 0.4)`,
              }}
            />
          ))}
        </div>

        {/* Stats row */}
        {wins !== undefined && (
          <div className="flex items-center gap-2 text-[10px]">
            <span className="text-emerald-400 font-semibold">{wins}T</span>
            <span className="text-red-400/70">{losses}B</span>
            <span
              className="font-bold ml-auto"
              style={{ color: advance ? `hsl(${hue} 70% 60%)` : '#475569' }}
            >
              {points}đ {advance ? '✓' : ''}
            </span>
          </div>
        )}

        {/* CTA button */}
        <button
          className="w-full rounded-lg py-1.5 text-[11px] font-bold transition-all mt-1"
          style={{
            background: `hsl(${hue} 60% 10%)`,
            border: `1px solid hsl(${hue} 60% 28% / 0.6)`,
            color: `hsl(${hue} 75% 65%)`,
          }}
        >
          Xem Chi Tiết
        </button>
      </div>
    </div>
  );
};

/** Compact inline chip — dùng trong bảng xếp hạng */
export const TeamChip = ({ name, tag, logoUrl }: { name: string; tag: string; logoUrl?: string }) => (
  <div className="flex items-center gap-2">
    <TeamAvatar name={name} tag={tag} logoUrl={logoUrl} size="sm" />
    <div className="min-w-0">
      <p className="truncate text-sm font-medium text-white">{name}</p>
      <p className="text-[10px] text-slate-500">{tag}</p>
    </div>
  </div>
);
