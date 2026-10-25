import { useMemo, useState } from 'react';
import { Building2, Check, ChevronDown, ChevronUp, Mail, Phone, Search, ShieldCheck, User, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { MOCK_APPLICATIONS, type TeamApplication } from '@/shared/lib/mock-data';

type AppStatus = TeamApplication['status'];
type FilterStatus = AppStatus | 'all';

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
  const [rejectionReasons, setRejectionReasons] = useState<Record<string, string>>({});
  const [statuses, setStatuses] = useState<Record<string, AppStatus>>(
    Object.fromEntries(MOCK_APPLICATIONS.map(({ _id, status }) => [_id, status])),
  );

  const pendingCount = Object.values(statuses).filter((status) => status === 'pending').length;
  const filtered = useMemo(() => MOCK_APPLICATIONS.filter((application) => {
    const matchesStatus = filter === 'all' || statuses[application._id] === filter;
    const searchable = `${application.teamName} ${application.teamTag} ${application.managerName} ${application.managerEmail}`.toLowerCase();
    return matchesStatus && searchable.includes(query.trim().toLowerCase());
  }), [filter, query, statuses]);

  const approve = (id: string) => {
    setStatuses((current) => ({ ...current, [id]: 'approved' }));
    setExpanded(null);
    toast.success('Đã duyệt hồ sơ trong bản demo. Email thông báo sẽ được gửi khi kết nối backend.');
  };

  const reject = (id: string) => {
    if (!rejectReason.trim()) {
      toast.error('Nhập lý do từ chối để quản lý đội có thể chỉnh sửa hồ sơ.');
      return;
    }
    setStatuses((current) => ({ ...current, [id]: 'rejected' }));
    setRejectionReasons((current) => ({ ...current, [id]: rejectReason.trim() }));
    setFilter('rejected');
    setExpanded(id);
    setRejectReason('');
    toast.success('Đã từ chối hồ sơ trong bản demo.');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Duyệt hồ sơ đội"
        description="Kiểm tra thông tin đăng ký và phản hồi rõ lý do để đội có thể bổ sung."
      />

      <section className="grid gap-3 sm:grid-cols-3" aria-label="Tình trạng hồ sơ">
        <CountTile label="Đang chờ" count={pendingCount} tone="amber" />
        <CountTile label="Đã duyệt" count={Object.values(statuses).filter((status) => status === 'approved').length} tone="green" />
        <CountTile label="Đã từ chối" count={Object.values(statuses).filter((status) => status === 'rejected').length} tone="red" />
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
        {filtered.map((application) => {
          const status = statuses[application._id];
          const isOpen = expanded === application._id;
          const isPending = status === 'pending';

          return (
            <article key={application._id} className={`overflow-hidden rounded-xl border bg-card ${isPending ? 'border-amber-500/30' : 'border-border'}`}>
              <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
                <button
                  type="button"
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setExpanded(isOpen ? null : application._id)}
                >
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-sm font-bold text-primary">
                    {application.teamTag.slice(0, 3)}
                  </div>
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-semibold">{application.teamName}</span>
                      <span className="text-xs text-muted-foreground">[{application.teamTag}]</span>
                      <StatusPill status={status} />
                    </span>
                    <span className="mt-1 block truncate text-xs text-muted-foreground">
                      {application.managerName} <span aria-hidden="true">·</span> {application.managerEmail}
                    </span>
                  </span>
                </button>
                <div className="flex items-center gap-2">
                  {isPending && (
                    <>
                      <Button type="button" size="sm" onClick={() => approve(application._id)}><Check className="size-4" /> Duyệt</Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => setExpanded(application._id)}><X className="size-4" /> Từ chối</Button>
                    </>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    aria-label={isOpen ? 'Thu gọn hồ sơ' : 'Mở hồ sơ'}
                    onClick={() => setExpanded(isOpen ? null : application._id)}
                  >
                    {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                  </Button>
                </div>
              </div>

              {isOpen && (
                <div className="space-y-4 border-t border-border bg-muted/20 px-4 py-4">
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <InfoRow icon={User} label="Quản lý đội" value={application.managerName} />
                    <InfoRow icon={Mail} label="Email quản lý" value={application.managerEmail} />
                    <InfoRow icon={Mail} label="Email liên hệ đội" value={application.teamEmail} />
                    <InfoRow icon={Phone} label="Số điện thoại" value={application.teamPhone} />
                    <InfoRow icon={Building2} label="Tổ chức / trường" value={application.teamOrganization || 'Chưa cung cấp'} />
                    <InfoRow icon={ShieldCheck} label="Ngày đăng ký" value={new Date(application.submittedAt).toLocaleString('vi-VN')} />
                  </div>

                  {status === 'rejected' && (rejectionReasons[application._id] || application.rejectReason) && (
                    <p className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                      Lý do đã gửi: {rejectionReasons[application._id] ?? application.rejectReason}
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
                        />
                      </label>
                      <div className="flex gap-2">
                        <Button type="button" onClick={() => approve(application._id)}><Check className="size-4" /> Duyệt hồ sơ</Button>
                        <Button type="button" variant="destructive" onClick={() => reject(application._id)}><X className="size-4" /> Từ chối hồ sơ</Button>
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

function StatusPill({ status }: { status: AppStatus }) {
  const styles: Record<AppStatus, string> = {
    pending: 'border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    approved: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    rejected: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
  };
  const labels: Record<AppStatus, string> = { pending: 'Chờ duyệt', approved: 'Đã duyệt', rejected: 'Đã từ chối' };
  return <span className={`rounded-full border px-2 py-0.5 text-[11px] font-medium ${styles[status]}`}>{labels[status]}</span>;
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof User; label: string; value: string }) {
  return <div className="flex items-start gap-2.5"><Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" /><div><p className="text-xs text-muted-foreground">{label}</p><p className="mt-0.5 break-all text-sm font-medium">{value}</p></div></div>;
}
