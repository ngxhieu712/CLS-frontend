import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import {
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Loader2,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  User,
  X,
  XCircle,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAdminTeams, useReviewTeam } from '../hooks/use-admin';
import type { PendingTeam, TeamProfileStatus } from '../types/admin.types';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { ErrorState } from '@/shared/components/error-state';
import { LoadingState } from '@/shared/components/loading-state';
import { PageHeader } from '@/shared/components/page-header';
import { TeamAvatar } from '@/shared/components/team-avatar';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib/utils';

type FilterStatus = TeamProfileStatus | 'all';

const STATUS: Record<TeamProfileStatus, { label: string; icon: LucideIcon; pill: string; tile: string }> = {
  pending: {
    label: 'Chờ duyệt',
    icon: Clock3,
    pill: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    tile: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  },
  approved: {
    label: 'Đã duyệt',
    icon: CheckCircle2,
    pill: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    tile: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  },
  rejected: {
    label: 'Đã từ chối',
    icon: XCircle,
    pill: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
    tile: 'bg-red-500/10 text-red-600 dark:text-red-400',
  },
};

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Đã từ chối' },
  { value: 'all', label: 'Tất cả' },
];

const REASON_MAX = 500;

interface Review {
  team: PendingTeam;
  action: 'approve' | 'reject';
}

/**
 * Admin duyệt hồ sơ đăng ký đội: lọc theo trạng thái, xem chi tiết và duyệt / từ chối
 * (từ chối bắt buộc có lý do để đội biết cần sửa gì). `?review=<teamId>` mở sẵn một hồ sơ.
 */
export const AdminTeamsPage = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<FilterStatus>('pending');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(() => searchParams.get('review'));
  const [review, setReview] = useState<Review | null>(null);
  const [reason, setReason] = useState('');

  const teams = useAdminTeams();
  const reviewMutation = useReviewTeam();
  const list = useMemo(() => teams.data ?? [], [teams.data]);

  const counts = useMemo(() => {
    const result: Record<TeamProfileStatus, number> = { pending: 0, approved: 0, rejected: 0 };
    for (const team of list) result[team.profileStatus] += 1;
    return result;
  }, [list]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return list.filter((team) => {
      const matchesStatus = filter === 'all' || team.profileStatus === filter;
      const searchable = `${team.name} ${team.tag} ${team.manager.fullName} ${team.manager.email}`.toLowerCase();
      return matchesStatus && searchable.includes(term);
    });
  }, [list, filter, query]);

  const openReview = (team: PendingTeam, action: Review['action']) => {
    setReason('');
    setReview({ team, action });
  };

  const confirmReview = () => {
    if (!review) return;
    const trimmed = reason.trim();
    if (review.action === 'reject' && !trimmed) return;

    reviewMutation.mutate(
      { id: review.team._id, input: review.action === 'reject' ? { action: 'reject', reason: trimmed } : { action: 'approve' } },
      {
        onSuccess: () => {
          setExpanded(review.team._id);
          setReview(null);
        },
        onError: (error) => toast.error(getApiErrorMessage(error, 'Không thể cập nhật hồ sơ đội.')),
      },
    );
  };

  if (teams.isPending) return <LoadingState />;
  if (teams.isError) return <ErrorState error={teams.error} onRetry={() => void teams.refetch()} />;

  const isReject = review?.action === 'reject';

  return (
    <div className="space-y-6">
      <PageHeader
        title="Duyệt hồ sơ đội"
        description="Kiểm tra thông tin đăng ký và phản hồi rõ lý do để đội có thể bổ sung."
      />

      <section className="grid gap-4 sm:grid-cols-3" aria-label="Tình trạng hồ sơ">
        {(Object.keys(STATUS) as TeamProfileStatus[]).map((status) => {
          const { label, icon: Icon, tile } = STATUS[status];
          const active = filter === status;
          return (
            <button
              key={status}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(active ? 'all' : status)}
              className={cn(
                'flex items-center justify-between gap-4 rounded-xl border bg-card p-5 text-left shadow-sm transition-all duration-150 hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                active ? 'border-primary/60 ring-1 ring-primary/40' : 'border-border',
              )}
            >
              <span>
                <span className="block text-sm text-muted-foreground">{label}</span>
                <span className="mt-1 block text-3xl font-bold tabular-nums">{counts[status]}</span>
              </span>
              <span className={cn('flex size-10 shrink-0 items-center justify-center rounded-xl', tile)}>
                <Icon className="size-5" />
              </span>
            </button>
          );
        })}
      </section>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={cn(
                'whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                filter === value ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {label}
              <span className="ml-1.5 tabular-nums opacity-70">{value === 'all' ? list.length : counts[value]}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Tìm hồ sơ đội"
            placeholder="Tìm tên đội, tag, quản lý..."
            className="pl-9"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card px-5 py-12 text-center">
          <ShieldCheck className="mx-auto size-8 text-muted-foreground" />
          <p className="mt-3 text-sm font-medium">Không tìm thấy hồ sơ</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {list.length === 0 ? 'Chưa có đội nào đăng ký giải đấu.' : 'Thử đổi bộ lọc hoặc từ khóa tìm kiếm.'}
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {filtered.map((team) => {
            const status = STATUS[team.profileStatus];
            const isOpen = expanded === team._id;
            const isPending = team.profileStatus === 'pending';

            return (
              <article key={team._id}>
                <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-muted/40">
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                    aria-expanded={isOpen}
                    onClick={() => setExpanded(isOpen ? null : team._id)}
                  >
                    <TeamAvatar name={team.name} tag={team.tag} logoUrl={team.logo} size="sm" />
                    <span className="min-w-0">
                      <span className="flex flex-wrap items-center gap-2">
                        <span className="truncate text-sm font-semibold">{team.name}</span>
                        <span className="text-xs text-muted-foreground">[{team.tag}]</span>
                        <span className={cn('rounded-full border px-2 py-0.5 text-[11px] font-medium', status.pill)}>{status.label}</span>
                      </span>
                      <span className="mt-1 block truncate text-xs text-muted-foreground">
                        {team.manager.fullName} <span aria-hidden="true">·</span> {team.manager.email}
                        <span className="hidden sm:inline"> <span aria-hidden="true">·</span> {new Date(team.registeredAt).toLocaleDateString('vi-VN')}</span>
                      </span>
                    </span>
                  </button>
                  <div className="flex items-center gap-2">
                    {isPending && (
                      <>
                        <Button
                          type="button"
                          size="sm"
                          className="bg-emerald-600 text-white hover:bg-emerald-700"
                          onClick={() => openReview(team, 'approve')}
                        >
                          <Check className="size-4" /> Duyệt
                        </Button>
                        <Button type="button" size="sm" variant="outline" onClick={() => openReview(team, 'reject')}>
                          <X className="size-4" /> Từ chối
                        </Button>
                      </>
                    )}
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      aria-label={isOpen ? 'Thu gọn hồ sơ' : 'Mở hồ sơ'}
                      onClick={() => setExpanded(isOpen ? null : team._id)}
                    >
                      <ChevronDown className={cn('size-4 transition-transform duration-150', isOpen && 'rotate-180')} />
                    </Button>
                  </div>
                </div>

                {isOpen && (
                  <div className="space-y-4 border-t border-border bg-muted/20 px-4 py-4">
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                      <InfoRow icon={User} label="Quản lý đội" value={team.manager.fullName} />
                      <InfoRow icon={Mail} label="Email quản lý" value={team.manager.email} />
                      <InfoRow icon={Mail} label="Email liên hệ đội" value={team.contactEmail || 'Chưa cung cấp'} />
                      <InfoRow icon={Phone} label="Số điện thoại" value={team.contactPhone || 'Chưa cung cấp'} />
                      <InfoRow icon={Building2} label="Tổ chức / trường" value={team.organization || 'Chưa cung cấp'} />
                      <InfoRow icon={ShieldCheck} label="Ngày đăng ký" value={new Date(team.registeredAt).toLocaleString('vi-VN')} />
                    </div>
                    {team.description && <p className="text-sm text-muted-foreground">{team.description}</p>}
                    {team.profileStatus === 'rejected' && team.rejectReason && (
                      <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                        Lý do đã gửi: {team.rejectReason}
                      </p>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <Dialog open={Boolean(review)} onOpenChange={(open) => !open && !reviewMutation.isPending && setReview(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isReject ? <XCircle className="size-5 text-destructive" /> : <CheckCircle2 className="size-5 text-emerald-600" />}
              {isReject ? 'Từ chối' : 'Duyệt'} đội {review?.team.name}
            </DialogTitle>
            <DialogDescription>
              {isReject
                ? 'Đội sẽ nhận được lý do này và có thể sửa hồ sơ rồi nộp lại.'
                : 'Đội sẽ được tham gia giải; tên và tag đội sẽ được khóa sau khi duyệt.'}
            </DialogDescription>
          </DialogHeader>
          {isReject && (
            <label className="block space-y-1.5 text-sm font-medium">
              <span>Lý do từ chối <span className="text-destructive">*</span></span>
              <Textarea
                autoFocus
                rows={4}
                maxLength={REASON_MAX}
                placeholder="VD: Bổ sung email liên hệ của đội..."
                value={reason}
                onChange={(event) => setReason(event.target.value)}
              />
              <span className="block text-right text-xs font-normal text-muted-foreground">{reason.length}/{REASON_MAX}</span>
            </label>
          )}
          <DialogFooter>
            <Button type="button" variant="outline" disabled={reviewMutation.isPending} onClick={() => setReview(null)}>
              Hủy
            </Button>
            <Button
              type="button"
              variant={isReject ? 'destructive' : 'default'}
              className={cn(!isReject && 'bg-emerald-600 text-white hover:bg-emerald-700')}
              disabled={reviewMutation.isPending || (isReject && !reason.trim())}
              onClick={confirmReview}
            >
              {reviewMutation.isPending && <Loader2 className="size-4 animate-spin" />}
              {isReject ? 'Từ chối hồ sơ' : 'Xác nhận duyệt'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="mt-0.5 break-all text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
