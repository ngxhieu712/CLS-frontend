import { useState } from 'react';
import { CheckCircle, XCircle, ChevronDown, ChevronUp, Mail, Phone, Building2, User } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_APPLICATIONS, type TeamApplication } from '@/shared/lib/mock-data';

type AppStatus = TeamApplication['status'];

const STATUS_TABS: { value: AppStatus | 'all'; label: string }[] = [
  { value: 'all',      label: 'Tất cả' },
  { value: 'pending',  label: 'Chờ duyệt' },
  { value: 'approved', label: 'Đã duyệt' },
  { value: 'rejected', label: 'Đã từ chối' },
];

export const TeamApprovalPage = () => {
  const [filter, setFilter]       = useState<AppStatus | 'all'>('pending');
  const [expanded, setExpanded]   = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [statuses, setStatuses]   = useState<Record<string, AppStatus>>(
    Object.fromEntries(MOCK_APPLICATIONS.map(a => [a._id, a.status]))
  );

  const filtered = MOCK_APPLICATIONS.filter(a => filter === 'all' || statuses[a._id] === filter);
  const pendingCount = MOCK_APPLICATIONS.filter(a => statuses[a._id] === 'pending').length;

  const approve = (id: string) => {
    setStatuses(prev => ({ ...prev, [id]: 'approved' }));
    setExpanded(null);
    toast.success('Đã duyệt hồ sơ — email thông báo đã gửi cho quản lý đội.');
  };

  const reject = (id: string) => {
    if (!rejectReason.trim()) return toast.error('Vui lòng nhập lý do từ chối');
    setStatuses(prev => ({ ...prev, [id]: 'rejected' }));
    setExpanded(null);
    setRejectReason('');
    toast.success('Đã từ chối hồ sơ — email thông báo đã gửi.');
  };

  function fmtTime(iso: string) {
    return new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Duyệt hồ sơ đội</h1>
          <p className="mt-1 text-sm text-slate-500">
            {pendingCount > 0
              ? <span className="text-amber-400 font-semibold">{pendingCount} hồ sơ chờ duyệt</span>
              : 'Không có hồ sơ nào chờ duyệt'}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {STATUS_TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
              filter === t.value
                ? 'border-amber-500/50 bg-amber-500/15 text-amber-400'
                : 'border-border bg-muted/30 text-slate-400 hover:text-white'
            }`}
          >
            {t.label}
            {t.value === 'pending' && pendingCount > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 py-0.5 text-[10px] font-bold text-black">
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Application list */}
      <div className="space-y-3">
        {filtered.map(app => {
          const status    = statuses[app._id];
          const isOpen    = expanded === app._id;
          const isPending = status === 'pending';

          return (
            <div key={app._id} className={`overflow-hidden rounded-xl border transition-all ${
              isPending ? 'border-amber-500/20 bg-card' : 'border-border bg-card'
            }`}>
              {/* Row header */}
              <div
                className="flex cursor-pointer items-center justify-between gap-4 px-4 py-4 hover:bg-muted/20 transition-colors"
                onClick={() => setExpanded(isOpen ? null : app._id)}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-sm font-bold text-white">{app.teamName}</span>
                    <span className="rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-400">
                      [{app.teamTag}]
                    </span>
                    <StatusPill status={status} />
                  </div>
                  <p className="text-xs text-slate-500">
                    Quản lý: {app.managerName} · {fmtTime(app.submittedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isPending && !isOpen && (
                    <>
                      <button
                        onClick={e => { e.stopPropagation(); approve(app._id); }}
                        className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/25 cursor-pointer transition-colors"
                      >
                        Duyệt
                      </button>
                      <button
                        onClick={e => { e.stopPropagation(); setExpanded(app._id); }}
                        className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-400 hover:bg-red-500/20 cursor-pointer transition-colors"
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                  {isOpen ? <ChevronUp className="size-4 text-slate-500" /> : <ChevronDown className="size-4 text-slate-500" />}
                </div>
              </div>

              {/* Detail panel */}
              {isOpen && (
                <div className="border-t border-border bg-background px-4 py-4 space-y-4">
                  {/* Team info */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <InfoRow icon={User} label="Quản lý" value={app.managerName} />
                    <InfoRow icon={Mail} label="Gmail quản lý" value={app.managerEmail} />
                    <InfoRow icon={Mail} label="Email đội" value={app.teamEmail} />
                    <InfoRow icon={Phone} label="SĐT liên hệ" value={app.teamPhone} />
                    {app.teamOrganization && (
                      <InfoRow icon={Building2} label="Tổ chức" value={app.teamOrganization} />
                    )}
                  </div>

                  {/* Reject reason if already rejected */}
                  {status === 'rejected' && app.rejectReason && (
                    <div className="rounded-lg border border-red-500/20 bg-red-500/8 px-3 py-2 text-xs text-red-300">
                      <span className="font-semibold">Lý do từ chối: </span>{app.rejectReason}
                    </div>
                  )}

                  {/* Actions for pending */}
                  {isPending && (
                    <div className="space-y-3 pt-1">
                      <div className="flex gap-2">
                        <button
                          onClick={() => approve(app._id)}
                          className="flex items-center gap-1.5 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-black cursor-pointer hover:opacity-90"
                        >
                          <CheckCircle className="size-4" /> Duyệt hồ sơ
                        </button>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs text-slate-500">Lý do từ chối (không bắt buộc):</p>
                        <input
                          value={rejectReason}
                          onChange={e => setRejectReason(e.target.value)}
                          placeholder="VD: Tên đội trùng, thông tin không hợp lệ..."
                          className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-white placeholder-slate-600 focus:border-amber-500/50 focus:outline-none"
                        />
                        <button
                          onClick={() => reject(app._id)}
                          className="flex items-center gap-1.5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/20 cursor-pointer transition-colors"
                        >
                          <XCircle className="size-4" /> Từ chối hồ sơ
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-600">
            <CheckCircle className="mx-auto mb-3 size-10 opacity-30" />
            <p>Không có hồ sơ nào trong danh mục này</p>
          </div>
        )}
      </div>
    </div>
  );
};

function StatusPill({ status }: { status: AppStatus }) {
  const cfg = {
    pending:  { label: 'Chờ duyệt', cls: 'bg-amber-500/15 text-amber-400 border-amber-500/30' },
    approved: { label: 'Đã duyệt',  cls: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' },
    rejected: { label: 'Từ chối',   cls: 'bg-red-500/15 text-red-400 border-red-500/30' },
  }[status];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${cfg.cls}`}>
      {cfg.label}
    </span>
  );
}

function InfoRow({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="size-3.5 shrink-0 text-amber-400 mt-0.5" />
      <div>
        <p className="text-[10px] text-slate-500">{label}</p>
        <p className="text-sm text-white">{value}</p>
      </div>
    </div>
  );
}
