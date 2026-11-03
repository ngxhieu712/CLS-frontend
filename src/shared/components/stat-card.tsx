import type { LucideIcon } from 'lucide-react';
import { Card } from '@/shared/components/ui/card';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { cn } from '@/shared/lib/utils';

const TONES = {
  primary: 'bg-primary/10 text-primary',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
} as const;

interface StatCardProps {
  label: string;
  value?: number | string;
  icon: LucideIcon;
  /** Small text under the value, e.g. "3 new this week". */
  hint?: string;
  isLoading?: boolean;
  /** Colour of the icon, so neighbouring cards are easy to tell apart. */
  tone?: keyof typeof TONES;
}

/** One number on a dashboard. */
export const StatCard = ({ label, value, icon: Icon, hint, isLoading, tone = 'primary' }: StatCardProps) => (
  <Card className="flex items-start justify-between gap-4 p-5 transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md">
    <div className="min-w-0 space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      {isLoading ? <Skeleton className="h-8 w-16" /> : <p className="text-3xl font-bold tabular-nums">{value ?? '—'}</p>}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
    <div className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', TONES[tone])}>
      <Icon className="size-5" />
    </div>
  </Card>
);
