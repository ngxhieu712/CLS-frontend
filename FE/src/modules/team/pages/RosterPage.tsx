import { useState } from 'react';
import { Plus, Trash2, Star, Lock } from 'lucide-react';
import { toast } from 'sonner';

interface PlayerRow {
  id: string;
  name: string;
  ingameName: string;
  role: string;
  isStarter: boolean;
}

const INITIAL_PLAYERS: PlayerRow[] = [
  { id: 'p1', name: 'Nguyễn Văn A', ingameName: 'xXAlphaXx', role: 'Carry', isStarter: true },
  { id: 'p2', name: 'Trần Thị B',   ingameName: 'BladeFury',  role: 'Support', isStarter: true },
  { id: 'p3', name: 'Lê Văn C',     ingameName: 'IronWall',   role: 'Tank', isStarter: true },
  { id: 'p4', name: 'Phạm Văn D',   ingameName: 'ShadowStep', role: 'Jungler', isStarter: true },
  { id: 'p5', name: 'Hoàng Văn E',  ingameName: 'NeonFlash',  role: 'Mid', isStarter: true },
  { id: 'p6', name: 'Đặng Văn F',   ingameName: 'BackupX',    role: 'Flex', isStarter: false },
];

const LOCKED = false; // deadline đăng ký chưa tới

export const RosterPage = () => {
  const [players, setPlayers] = useState<PlayerRow[]>(INITIAL_PLAYERS);
  const [adding, setAdding] = useState(false);
  const [newPlayer, setNewPlayer] = useState({ name: '', ingameName: '', role: '' });

  const starters = players.filter(p => p.isStarter);
  const subs     = players.filter(p => !p.isStarter);

  const toggleStarter = (id: string) => {
    if (LOCKED) return toast.error('Đã qua hạn chót đăng ký');
    const p = players.find(x => x.id === id)!;
    if (!p.isStarter && starters.length >= 5) return toast.error('Tối đa 5 tuyển thủ chính thức');
    setPlayers(prev => prev.map(x => x.id === id ? { ...x, isStarter: !x.isStarter } : x));
  };

  const removePlayer = (id: string) => {
    if (LOCKED) return toast.error('Đã qua hạn chót đăng ký');
    setPlayers(prev => prev.filter(x => x.id !== id));
    toast.success('Đã xoá tuyển thủ');
  };

  const addPlayer = () => {
    if (!newPlayer.name || !newPlayer.ingameName) return toast.error('Điền đầy đủ tên và ingame name');
    setPlayers(prev => [...prev, { id: `p${Date.now()}`, ...newPlayer, isStarter: false }]);
    setNewPlayer({ name: '', ingameName: '', role: '' });
    setAdding(false);
    toast.success('Đã thêm tuyển thủ');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white">Quản lý tuyển thủ</h1>
          <p className="mt-1 text-sm text-zinc-500">{starters.length}/5 chính thức · {subs.length} dự bị</p>
        </div>
        {LOCKED ? (
          <div className="flex items-center gap-2 rounded-xl border border-orange-500/30 bg-orange-500/10 px-3 py-1.5 text-xs text-orange-400">
            <Lock className="size-3.5" /> Đã khoá sau hạn chót
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-sm font-bold text-black transition-opacity hover:opacity-90 cursor-pointer"
          >
            <Plus className="size-4" /> Thêm tuyển thủ
          </button>
        )}
      </div>

      {/* Add form */}
      {adding && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
          <p className="mb-4 text-sm font-semibold text-amber-400">Thêm tuyển thủ mới</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <input placeholder="Họ tên *" value={newPlayer.name} onChange={e => setNewPlayer(p => ({ ...p, name: e.target.value }))}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none" />
            <input placeholder="Ingame name *" value={newPlayer.ingameName} onChange={e => setNewPlayer(p => ({ ...p, ingameName: e.target.value }))}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none" />
            <input placeholder="Vị trí" value={newPlayer.role} onChange={e => setNewPlayer(p => ({ ...p, role: e.target.value }))}
              className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none" />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={addPlayer} className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-bold text-black cursor-pointer">Thêm</button>
            <button onClick={() => setAdding(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-zinc-400 cursor-pointer">Huỷ</button>
          </div>
        </div>
      )}

      {/* Starters */}
      <PlayerTable title="Tuyển thủ chính thức" players={starters} onToggle={toggleStarter} onRemove={removePlayer} locked={LOCKED} />

      {/* Subs */}
      {subs.length > 0 && (
        <PlayerTable title="Dự bị" players={subs} onToggle={toggleStarter} onRemove={removePlayer} locked={LOCKED} />
      )}
    </div>
  );
};

function PlayerTable({ title, players, onToggle, onRemove, locked }: {
  title: string; players: PlayerRow[];
  onToggle: (id: string) => void; onRemove: (id: string) => void; locked: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <div className="border-b border-border px-4 py-3">
        <p className="text-sm font-bold text-white">{title} <span className="ml-1 text-zinc-500">({players.length})</span></p>
      </div>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 text-xs text-zinc-500">
            <th className="px-4 py-2.5 text-left">Họ tên</th>
            <th className="px-4 py-2.5 text-left">Ingame</th>
            <th className="px-4 py-2.5 text-left">Vị trí</th>
            <th className="px-4 py-2.5 text-center">Chính thức</th>
            <th className="px-4 py-2.5" />
          </tr>
        </thead>
        <tbody>
          {players.map(p => (
            <tr key={p.id} className="border-b border-border/60 last:border-0 hover:bg-muted/30">
              <td className="px-4 py-3 font-medium text-white">{p.name}</td>
              <td className="px-4 py-3 text-zinc-400">{p.ingameName}</td>
              <td className="px-4 py-3 text-zinc-500">{p.role || '—'}</td>
              <td className="px-4 py-3 text-center">
                <button
                  onClick={() => onToggle(p.id)}
                  disabled={locked}
                  className={`cursor-pointer transition-colors ${p.isStarter ? 'text-amber-400' : 'text-zinc-600 hover:text-zinc-400'} disabled:cursor-not-allowed`}
                  aria-label={p.isStarter ? 'Chuyển sang dự bị' : 'Chuyển sang chính thức'}
                >
                  <Star className="size-4" fill={p.isStarter ? 'currentColor' : 'none'} />
                </button>
              </td>
              <td className="px-4 py-3 text-right">
                {!locked && (
                  <button onClick={() => onRemove(p.id)} className="text-zinc-600 transition-colors hover:text-red-400 cursor-pointer" aria-label="Xóa tuyển thủ">
                    <Trash2 className="size-4" />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
