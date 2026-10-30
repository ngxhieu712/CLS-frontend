import { useMemo, useState } from 'react';
import { Building2, Check, ChevronDown, ChevronUp, Mail, Phone, Search, ShieldCheck, User, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { usePendingTeams, useReviewTeam } from '@/modules/admin/hooks/use-admin';
import type { TeamProfileStatus } from '@/modules/admin/types/admin.types';
import { LoadingState } from '@/shared/components/loading-state';
import { ErrorState } from '@/shared/components/error-state';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';

type FilterStatus = TeamProfileStatus | 'all';

const FILTERS: { value: FilterStatus; label: string }[] = [
  { value: 'pending', label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Đã từ chối' },
  { value: 'all', label: 'Tất cả hồ sơ' },
];

export const TeamApprovalPage = () => {
  const [searchParams] = useSearchParams();
  const [filter, setFilter] = useState<FilterStatus>('pending');
  const [query, setQuery] = useState('');
  const [expanded, setExpanded] = useState<string | null>(() => searchParams.get('review'));
  const [rejectReason, setRejectReason] = useState('');

  // Fetch teams từ API
  const { data: teams = [], isLoading, error } = usePendingTeams();
  const reviewMutation = useReviewTeam();

  const pendingCount = teams.filter((team) => team.profileStatus === 'pending').length;
  const approvedCount = teams.filter((team) => team.profileStatus === 'approved').length;
  const rejectedCount = teams.filter((team) => team.profileStatus === 'rejected').length;

  const filtered = useMemo(() => {
    return teams.filter((team) => {
      const matchesStatus = filter === 'all' || team.profileStatus === filter;
      const searchable = `${team.name} ${team.tag} ${team.manager.fullName} ${team.manager.email}`.toLowerCase();
      return matchesStatus && searchable.includes(query.trim().toLowerCase());
    });
  }, [teams, filter, query]);

  const approve = (id: string) => {
    reviewMutation.mutate(
      { id, input: { action: 'approve' } },
      { onSuccess: () => setExpanded(null) }
    );
  };

  const reject = (id: string) => {
    const trimmedReason = rejectReason.trim();
    if (!trimmedReason) {
      // Toast sẽ được hiển thị từ mutation error handler
      return;
    }
    reviewMutation.mutate(
      { id, input: { action: 'reject', reason: trimmedReason } },
      {
        onSuccess: () => {
          setRejectReason('');
          setFilter('rejected');
          setExpanded(id);
        },
      }
    );
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Duyệt hồ sơ đội"
        description="Kiểm tra thông tin đăng ký và phản hồi rõ lý do để đội có thể bổ sung."
      />

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Tình trạng hồ sơ">
        <CountTile label="Đang chờ" count={pendingCount} tone="amber" />
        <CountTile label="Đã duyệt" count={approvedCount} tone="green" />
        <CountTile label="Đã từ chối" count={rejectedCount} tone="red" />
      </section>

      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-card p-1">
          {FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              aria-pressed={filter === value}
              onClick={() => setFilter(value)}
              className={`whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                filter === value ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              {label}{value === 'pending' && pendingCount > 0 && <span className="ml-1.5 tabular-nums">({pendingCount})</span>}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:max-w-xs">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input aria-label="Tìm hồ sơ đội" placeholder="Tìm tên đội, tag, quản lý..." className="pl-9" value={query} onChange={(event) => setQuery(event.target.value)} />
        </div>
      </div>

      <div className="space-y-3">
        {filtered.map((team) => {
          const status = team.profileStatus;
          const isOpen = expanded === team._id;
          const isPending = status === 'pending';

          return (
            <article key={team._id} className={`overflow-hidden rounded-xl border bg-card ${isPending ? 'border-amber-500/30' : 'border-border'}`}>
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
                <button
                  type="button"
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded(isOpen ? null : team._id)}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-sm font-bold text-primary">
                    {team.tag.slice(0, 3)}
                  </div>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-semibold">{team.name}</span>
                      <span className="text-xs text-muted-foreground">[{team.tag}]</span>
                      <StatusPill status={status} />
                    </span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {team.manager.fullName} <span aria-hidden="true">·</span> {team.manager.email}
                    </span>
                  </span>
                </button>
                <div className="flex items-center gap-2">
                  {isPending && (
                    <>
                      <Button 
                        type="button" 
                        size="sm" 
                        onClick={() => approve(team._id)}
                        disabled={reviewMutation.isPending}
                      >
                        <Check className="size-4" /> Duyệt
                      </Button>
                      <Button 
                        type="button" 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setExpanded(team._id)}
                        disabled={reviewMutation.isPending}
                      >
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
                    {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </Button>
                </div>
              </div>

              {isOpen && (
                <div className="space-y-4 border-t border-border bg-muted/20 px-4 py-4">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <InfoRow icon={User} label="Quản lý đội" value={team.manager.fullName} />
                    <InfoRow icon={Mail} label="Email quản lý" value={team.manager.email} />
                    <InfoRow icon={Mail} label="Email liên hệ đội" value={team.contactEmail} />
                    <InfoRow icon={Phone} label="Số điện thoại" value={team.contactPhone} />
                    <InfoRow icon={Building2} label="Tổ chức / trường" value={team.organization || 'Chưa cung cấp'} />
                    <InfoRow icon={ShieldCheck} label="Ngày đăng ký" value={new Date(team.registeredAt).toLocaleString('vi-VN')} />
                  </div>

                  {status === 'rejected' && team.rejectReason && (
                    <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                      Lý do đã gửi: {team.rejectReason}
                    </p>
                  )}

                  {isPending && (
                    <div className="flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-end">
                      <label className="min-w-0 flex-1 space-y-1.5 text-sm font-medium">
                        <span>Lý do từ chối <span className="text-destructive">(bắt buộc nếu từ chối)</span></span>
                        <Input
                          value={rejectReason}
                          maxLength={240}
                          placeholder="VD: Bổ sung email liên hệ của đội..."
                          onChange={(event) => setRejectReason(event.target.value)}
                          disabled={reviewMutation.isPending}
                        />
                      </label>
                      <div className="flex gap-2">
                        <Button 
                          type="button" 
                          onClick={() => approve(team._id)}
                          disabled={reviewMutation.isPending}
                        >
                          <Check className="size-4" /> Duyệt hồ sơ
                        </Button>
                        <Button 
                          type="button" 
                          variant="destructive" 
                          onClick={() => reject(team._id)}
                          disabled={reviewMutation.isPending}
                        >
                          <X className="size-4" /> Từ chối hồ sơ
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </article>
          );
        })}

        {filtered.length === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-card px-5 py-12 text-center">
            <ShieldCheck className="mx-auto size-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-medium">Không tìm thấy hồ sơ</p>
            <p className="mt-1 text-xs text-muted-foreground">Thử đổi bộ lọc hoặc từ khóa tìm kiếm.</p>
          </div>
        )}
      </div>
    </div>
  );
};

function CountTile({ label, count, tone }: { label: string; count: number; tone: 'amber' | 'green' | 'red' }) {
  const colors = {
    amber: 'border-amber-500/25 bg-amber-500/5 text-amber-600 dark:text-amber-400',
    green: 'border-emerald-500/25 bg-emerald-500/5 text-emerald-700 dark:text-emerald-400',
    red: 'border-red-500/25 bg-red-500/5 text-red-700 dark:text-red-400',
  };
  return <div className={`flex items-center justify-between rounded-lg border px-4 py-3 ${colors[tone]}`}><span className="text-sm font-medium">{label}</span><span className="text-xl font-bold tabular-nums">{count}</span></div>;
}

function StatusPill({ status }: { status: TeamProfileStatus }) {
  const styles: Record<TeamProfileStatus, string> = {
    pending: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    approved: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    rejected: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
  };
  const labels: Record<TeamProfileStatus, string> = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Đã từ chối' };
  return <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${styles[status]}`}>{labels[status]}</span>;
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return <div className="flex items-start gap-2.5"><Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-0.5 break-all text-sm font-medium">{value}</p></div></div>;
}
