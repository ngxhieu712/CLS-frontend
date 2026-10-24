import { useState } from 'react';
import { Shuffle, Check } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_TEAMS, MOCK_GROUPS } from '@/shared/lib/mock-data';
import { TeamAvatar } from '@/shared/components/team-avatar';

type GroupAssignment = Record<string, string[]>; // groupId → teamIds[]

const initialAssignment: GroupAssignment = {
  g1: ['t1','t2','t3','t4'],
  g2: ['t5','t6','t7','t8'],
  g3: ['t9','t10','t11','t12'],
  g4: ['t13','t14','t15','t16'],
};

export const DrawPage = () => {
  const [assignment, setAssignment] = useState<GroupAssignment>(initialAssignment);
  const [confirmed, setConfirmed] = useState(false);
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOverGroup, setDragOverGroup] = useState<string | null>(null);

  const shuffle = () => {
    if (confirmed) return toast.error('Bảng đã được xác nhận');
    const shuffled = [...MOCK_TEAMS].sort(() => Math.random() - 0.5);
    const groups = MOCK_GROUPS.map((g, i) => [g._id, shuffled.slice(i * 4, (i + 1) * 4).map(t => t._id)] as [string, string[]]);
    setAssignment(Object.fromEntries(groups));
    toast.success('Bốc thăm ngẫu nhiên thành công!');
  };

  const handleDragStart = (teamId: string) => setDragging(teamId);
  const handleDrop = (targetGroupId: string) => {
    if (!dragging || confirmed) return;
    const sourceGroupId = Object.entries(assignment).find(([, ids]) => ids.includes(dragging))?.[0];
    if (!sourceGroupId || sourceGroupId === targetGroupId) return;

    setAssignment(prev => ({
      ...prev,
      [sourceGroupId]: prev[sourceGroupId].filter(id => id !== dragging),
      [targetGroupId]: [...prev[targetGroupId], dragging],
    }));
    setDragging(null);
    setDragOverGroup(null);
  };

  const confirmDraw = () => {
    setConfirmed(true);
    toast.success('Đã xác nhận chia bảng! Lịch đấu có thể tạo ngay.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Chia bảng &amp; Bốc thăm</h1>
          <p className="mt-1 text-sm text-zinc-500">Kéo thả đội giữa các bảng, hoặc bốc thăm ngẫu nhiên</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={shuffle}
            disabled={confirmed}
            className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
          >
            <Shuffle className="size-4" /> Bốc thăm ngẫu nhiên
          </button>
          {!confirmed && (
            <button
              onClick={confirmDraw}
              className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-black hover:opacity-90 cursor-pointer"
            >
              <Check className="size-4" /> Xác nhận chia bảng
            </button>
          )}
          {confirmed && (
            <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-400">
              <Check className="size-4" /> Đã xác nhận
            </div>
          )}
        </div>
      </div>

      {!confirmed && (
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-xs text-amber-400">
          Kéo thả đội giữa các bảng để điều chỉnh thủ công. Nhấn "Xác nhận chia bảng" để khoá lại.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {MOCK_GROUPS.map(g => {
          const teams = (assignment[g._id] ?? []).map(id => MOCK_TEAMS.find(t => t._id === id)!).filter(Boolean);
          const isOver = dragOverGroup === g._id;
          return (
            <div
              key={g._id}
              onDragOver={e => { e.preventDefault(); setDragOverGroup(g._id); }}
              onDragLeave={() => setDragOverGroup(null)}
              onDrop={() => handleDrop(g._id)}
              className={`rounded-xl border p-4 transition-all min-h-[180px] ${
                isOver ? 'border-amber-500/60 bg-amber-500/8' : 'border-border bg-card'
              }`}
            >
              <p className="mb-3 text-xs font-bold uppercase tracking-wider text-amber-400">{g.name}</p>
              <div className="space-y-2">
                {teams.map(t => (
                  <div
                    key={t._id}
                    draggable={!confirmed}
                    onDragStart={() => handleDragStart(t._id)}
                    className={`flex items-center gap-2 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 ${!confirmed ? 'cursor-grab active:cursor-grabbing' : ''} hover:bg-muted/60 transition-colors`}
                  >
                    <TeamAvatar name={t.name} tag={t.tag} size="sm" />
                    <span className="text-sm font-medium text-white">{t.name}</span>
                  </div>
                ))}
                {teams.length < 4 && (
                  <div className={`rounded-lg border-2 border-dashed px-3 py-3 text-center text-xs text-zinc-600 ${isOver ? 'border-amber-500/40' : 'border-border'}`}>
                    Thả đội vào đây
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
