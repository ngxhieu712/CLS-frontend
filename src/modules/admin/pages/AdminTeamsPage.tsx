import { useMemo, useState } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Building2, Check, Loader2, Mail, Phone, Search, ShieldCheck, User, X } from 'lucide-react';
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
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { cn } from '@/shared/lib/utils';

type FilterStatus = TeamProfileStatus | 'all';

const STATUS: Record<TeamProfileStatus, { label: string; pill: string }> = {
  pending: { label: 'Chờ duyệt', pill: 'bg-amber-500/14 text-amber-700 dark:text-amber-400' },
  approved: { label: 'Đã duyệt', pill: 'bg-emerald-500/14 text-emerald-700 dark:text-emerald-400' },
  rejected: { label: 'Đã từ chối', pill: 'bg-red-500/14 text-red-700 dark:text-red-300' },
};

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Đã từ chối' },
  { value: 'all', label: 'Tất cả' },
];

const REASON_MAX = 500;

const StatusPill = ({ status }: { status: TeamProfileStatus }) => (
  <span className={cn('shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold', STATUS[status].pill)}>{STATUS[status].label}</span>
);

/**
 * Admin duyệt hồ sơ đăng ký đội: danh sách bên trái, chi tiết hồ sơ đang chọn bên phải
 * (xếp chồng trên màn hình nhỏ). Từ chối bắt buộc có lý do. `?review=<teamId>` chọn sẵn một hồ sơ.
 */
export const AdminTeamsPage = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<FilterStatus>('pending');
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(() => searchParams.get('review'));
  const [reason, setReason] = useState('');

  const teams = useAdminTeams();
  const reviewMutation = useReviewTeam();
  const list = useMemo(() => teams.data ?? [], [teams.data]);

  const counts = useMemo(() => {
    const result: Record<FilterStatus, number> = { pending: 0, approved: 0, rejected: 0, all: list.length };
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

  // A team opened from a link stays selected even if it is outside the current filter.
  const selected = list.find(({ _id }) => _id === selectedId) ?? filtered[0];

  const select = (team: PendingTeam) => {
    setSelectedId(team._id);
    setReason('');
  };

  const review = (action: 'approve' | 'reject') => {
    if (!selected) return;
    const trimmed = reason.trim();
    if (action === 'reject' && !trimmed) return;

    reviewMutation.mutate(
      { id: selected._id, input: action === 'reject' ? { action, reason: trimmed } : { action } },
      {
        onSuccess: () => setReason(''),
        onError: (error) => toast.error(getApiErrorMessage(error, 'Không thể cập nhật hồ sơ đội.')),
      },
    );
  };

  if (teams.isPending) return <LoadingState />;
  if (teams.isError) return <ErrorState error={teams.error} onRetry={() => void teams.refetch()} />;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Duyệt hồ sơ đội"
        description="Kiểm tra thông tin đăng ký, duyệt hoặc gửi lại lý do để đội bổ sung."
      />

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Lọc theo trạng thái" className="flex gap-1 overflow-x-auto rounded-xl border bg-card p-1">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={cn(
                'h-9 whitespace-nowrap rounded-[9px] px-3.5 text-[13px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                filter === value ? 'bg-primary/15 font-bold text-primary' : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              {label}
              <span className="ml-1.5 tabular-nums opacity-70">{counts[value]}</span>
            </button>
          ))}
        </div>
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            aria-label="Tìm hồ sơ đội"
            placeholder="Tìm tên đội, tag, quản lý..."
            className="h-11 rounded-[10px] pl-10"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-4">
        <section aria-label="Danh sách hồ sơ" className="min-w-0 flex-[999_1_420px] overflow-hidden rounded-2xl border bg-card shadow-sm">
          {filtered.length === 0 ? (
            <div className="px-5 py-14 text-center">
              <ShieldCheck className="mx-auto size-8 text-muted-foreground" />
              <p className="mt-3 text-sm font-medium">Không có hồ sơ</p>
              <p className="mt-1 text-xs text-muted-foreground">
                {list.length === 0 ? 'Chưa có đội nào đăng ký giải đấu.' : 'Thử đổi bộ lọc hoặc từ khóa tìm kiếm.'}
              </p>
            </div>
          ) : (
            <ul className="divide-y">
              {filtered.map((team) => {
                const active = team._id === selected?._id;
                return (
                  <li key={team._id}>
                    <button
                      type="button"
                      aria-current={active ? 'true' : undefined}
                      onClick={() => select(team)}
                      className={cn(
                        'flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                        active ? 'bg-primary/8 shadow-[inset_3px_0_0_var(--color-primary)]' : 'hover:bg-muted/50',
                      )}
                    >
                      <TeamAvatar name={team.name} tag={team.tag} logoUrl={team.logo} size="md" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold">
                          {team.name} <span className="font-normal text-muted-foreground">[{team.tag}]</span>
                        </span>
                        <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                          {team.manager.fullName} · {new Date(team.registeredAt).toLocaleDateString('vi-VN')}
                        </span>
                      </span>
                      <StatusPill status={team.profileStatus} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <aside aria-label="Chi tiết hồ sơ" className="min-w-0 flex-[1_1_380px] overflow-hidden rounded-2xl border bg-card shadow-sm lg:sticky lg:top-24">
          {selected ? (
            <>
              <div className="flex items-center gap-4 border-b p-6">
                <TeamAvatar name={selected.name} tag={selected.tag} logoUrl={selected.logo} size="lg" />
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-extrabold">{selected.name}</h2>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">[{selected.tag}]</span>
                    <StatusPill status={selected.profileStatus} />
                  </div>
                </div>
              </div>

              <dl className="grid grid-cols-[repeat(auto-fill,minmax(190px,1fr))] gap-x-5 gap-y-4 px-6 py-5">
                <InfoRow icon={User} label="Quản lý đội" value={selected.manager.fullName} />
                <InfoRow icon={ShieldCheck} label="Ngày đăng ký" value={new Date(selected.registeredAt).toLocaleString('vi-VN')} />
                <InfoRow icon={Mail} label="Email quản lý" value={selected.manager.email} />
                <InfoRow icon={Mail} label="Email liên hệ đội" value={selected.contactEmail || 'Chưa cung cấp'} />
                <InfoRow icon={Phone} label="Số điện thoại" value={selected.contactPhone || 'Chưa cung cấp'} />
                <InfoRow icon={Building2} label="Tổ chức / trường" value={selected.organization || 'Chưa cung cấp'} />
              </dl>
              {selected.description && <p className="px-6 pb-5 text-sm text-muted-foreground">{selected.description}</p>}

              {selected.profileStatus === 'rejected' && selected.rejectReason && (
                <p className="mx-6 mb-5 rounded-[10px] border border-destructive/30 bg-destructive/8 px-3.5 py-3 text-sm text-destructive">
                  Lý do đã gửi: {selected.rejectReason}
                </p>
              )}

              {selected.profileStatus === 'pending' && (
                <div className="space-y-3 border-t px-6 py-5">
                  <label htmlFor="reject-reason" className="block text-[13px] font-semibold">
                    Lý do từ chối <span className="font-normal text-muted-foreground">(bắt buộc nếu từ chối)</span>
                  </label>
                  <Textarea
                    id="reject-reason"
                    rows={3}
                    maxLength={REASON_MAX}
                    placeholder="VD: Bổ sung email liên hệ của đội..."
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    disabled={reviewMutation.isPending}
                  />
                  <p className="text-right text-xs text-muted-foreground">{reason.length}/{REASON_MAX}</p>
                  <div className="flex flex-wrap gap-2.5">
                    <Button
                      type="button"
                      className="h-11 min-w-36 flex-1 rounded-[10px] font-bold"
                      disabled={reviewMutation.isPending}
                      onClick={() => review('approve')}
                    >
                      {reviewMutation.isPending && reviewMutation.variables?.input.action === 'approve'
                        ? <Loader2 className="size-4 animate-spin" />
                        : <Check className="size-4" />}
                      Duyệt hồ sơ
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="h-11 min-w-36 flex-1 rounded-[10px] border-destructive/50 font-bold text-destructive hover:bg-destructive/10 hover:text-destructive"
                      disabled={reviewMutation.isPending || !reason.trim()}
                      title={reason.trim() ? undefined : 'Nhập lý do để từ chối'}
                      onClick={() => review('reject')}
                    >
                      {reviewMutation.isPending && reviewMutation.variables?.input.action === 'reject'
                        ? <Loader2 className="size-4 animate-spin" />
                        : <X className="size-4" />}
                      Từ chối
                    </Button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="px-6 py-16 text-center text-sm text-muted-foreground">Chọn một hồ sơ để xem chi tiết.</p>
          )}
        </aside>
      </div>
    </div>
  );
};

function InfoRow({ icon: Icon, label, value }: { icon: LucideIcon; label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="mt-0.5 break-all text-sm font-semibold">{value}</dd>
      </div>
    </div>
  );
}
