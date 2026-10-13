import { useState } from 'react';
import { Upload, Link2, Play, Eye, CheckCircle, X } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_MATCHES } from '@/shared/lib/mock-data';
import { RecordingStatusBadge } from '@/shared/components/status-badge';
import type { RecordingStatus } from '@/shared/types/esports.types';



const CONFIRMED = MOCK_MATCHES.filter(m => m.status === 'confirmed');

const STATUS_TABS: { value: RecordingStatus | 'all'; label: string }[] = [
  { value: 'all',      label: 'Tất cả' },
  { value: 'none',     label: 'Chưa có' },
  { value: 'editing',  label: 'Đang biên tập' },
  { value: 'published',label: 'Đã đăng' },
];

export const RecordingManagerPage = () => {
  const [filter, setFilter] = useState<RecordingStatus | 'all'>('all');
  const [editing, setEditing] = useState<string | null>(null);
  const [hlLink, setHlLink] = useState('');
  const [ytLink, setYtLink] = useState('');
  const [statuses, setStatuses] = useState<Record<string, RecordingStatus>>(
    Object.fromEntries(CONFIRMED.map(m => [m._id, m.recordingStatus ?? 'none']))
  );

  const filtered = CONFIRMED.filter(m => filter === 'all' || (statuses[m._id] ?? 'none') === filter);

  const saveRecording = (matchId: string) => {
    setStatuses(prev => ({ ...prev, [matchId]: 'editing' }));
    setEditing(null);
    toast.success('Đã lưu link bản ghi — trạng thái: Đang biên tập');
  };

  const publish = (matchId: string) => {
    setStatuses(prev => ({ ...prev, [matchId]: 'published' }));
    toast.success('Đã đăng bản ghi — khán giả có thể xem ngay');
  };

  const counts = {
    none: CONFIRMED.filter(m => (statuses[m._id] ?? 'none') === 'none').length,
    editing: CONFIRMED.filter(m => statuses[m._id] === 'editing').length,
    published: CONFIRMED.filter(m => statuses[m._id] === 'published').length,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Quản lý bản ghi</h1>
        <p className="mt-1 text-sm text-zinc-500">Upload highlight & dán link YouTube cho các trận đã có kết quả</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Chưa có', count: counts.none, color: 'text-zinc-400' },
          { label: 'Đang biên tập', count: counts.editing, color: 'text-blue-400' },
          { label: 'Đã đăng', count: counts.published, color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border border-border bg-card p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.count}</p>
            <p className="text-xs text-zinc-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto">
        {STATUS_TABS.map(t => (
          <button
            key={t.value}
            onClick={() => setFilter(t.value)}
            className={`whitespace-nowrap rounded-lg border px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors ${
              filter === t.value
                ? 'border-amber-500/50 bg-amber-500/15 text-amber-400'
                : 'border-border bg-muted/30 text-zinc-400 hover:text-white'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Match list */}
      <div className="space-y-3">
        {filtered.map(m => {
          const status = statuses[m._id] ?? 'none';
          const isEditing = editing === m._id;

          return (
            <div key={m._id} className="rounded-xl border border-border bg-card overflow-hidden">
              <div className="flex items-center justify-between gap-4 px-4 py-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs text-zinc-500">{m.round} · {m.format}</span>
                    <RecordingStatusBadge status={status} />
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium text-white">{m.teamA?.name ?? 'TBD'}</span>
                    <span className="font-black text-amber-400">{m.scoreA} : {m.scoreB}</span>
                    <span className="font-medium text-white">{m.teamB?.name ?? 'TBD'}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {status === 'editing' && (
                    <button
                      onClick={() => publish(m._id)}
                      className="flex items-center gap-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-1.5 text-xs font-semibold text-emerald-400 hover:bg-emerald-500/25 cursor-pointer transition-colors"
                    >
                      <CheckCircle className="size-3.5" /> Đăng
                    </button>
                  )}
                  <button
                    onClick={() => { setEditing(isEditing ? null : m._id); setHlLink(''); setYtLink(''); }}
                    className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold cursor-pointer transition-colors ${
                      isEditing
                        ? 'border-border bg-muted/50 text-zinc-400'
                        : 'border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                    }`}
                  >
                    {isEditing ? <><X className="size-3.5" /> Đóng</> : <><Upload className="size-3.5" /> Chỉnh sửa</>}
                  </button>
                </div>
              </div>

              {/* Edit panel */}
              {isEditing && (
                <div className="border-t border-border bg-background px-4 py-4 space-y-3">
                  <div>
                    <label className="mb-1 block text-xs text-zinc-500 flex items-center gap-1.5">
                      <Play className="size-3" /> Link Cloudinary — Highlight (~2 phút)
                    </label>
                    <input
                      type="url"
                      value={hlLink}
                      onChange={e => setHlLink(e.target.value)}
                      placeholder="https://res.cloudinary.com/..."
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none"
                    />
                    <p className="mt-1 text-xs text-zinc-600">720p, tối đa 100MB (Cloudinary free tier)</p>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs text-zinc-500 flex items-center gap-1.5">
                      <Link2 className="size-3" /> Link YouTube — Full trận
                    </label>
                    <input
                      type="url"
                      value={ytLink}
                      onChange={e => setYtLink(e.target.value)}
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full rounded-lg border border-border bg-card px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => saveRecording(m._id)}
                      className="flex items-center gap-1.5 rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black cursor-pointer hover:opacity-90"
                    >
                      <Eye className="size-4" /> Lưu & Xem trước
                    </button>
                    <button onClick={() => setEditing(null)} className="rounded-lg border border-border px-4 py-2 text-sm text-zinc-400 cursor-pointer">
                      Huỷ
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="py-12 text-center text-zinc-600">Không có trận nào trong danh mục này</p>
        )}
      </div>
    </div>
  );
};
