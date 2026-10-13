import { cn } from '@/shared/lib/utils';

interface TeamAvatarProps {
  name: string;
  tag: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const SIZE = {
  sm: { wrap: 'size-8 text-xs',  icon: 'size-4' },
  md: { wrap: 'size-10 text-sm', icon: 'size-5' },
  lg: { wrap: 'size-16 text-base',icon: 'size-8' },
};

export const TeamAvatar = ({ name, tag, logoUrl, size = 'md', className }: TeamAvatarProps) => {
  const s = SIZE[size];
  return (
    <div
      className={cn('flex shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20', s.wrap, className)}
      title={name}
      aria-label={name}
    >
      {logoUrl ? (
        <img src={logoUrl} alt={`Logo ${name}`} className="size-full rounded-lg object-contain p-0.5" />
      ) : (
        <span className="font-bold tracking-wider">{tag.slice(0, 3)}</span>
      )}
    </div>
  );
};

/** Compact inline chip — dùng trong bảng xếp hạng */
export const TeamChip = ({ name, tag, logoUrl }: { name: string; tag: string; logoUrl?: string }) => (
  <div className="flex items-center gap-2">
    <TeamAvatar name={name} tag={tag} logoUrl={logoUrl} size="sm" />
    <div className="min-w-0">
      <p className="truncate text-sm font-medium text-white">{name}</p>
      <p className="text-xs text-zinc-500">{tag}</p>
    </div>
  </div>
);
