import { useState } from 'react';
import { Plus, Star, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { LoadingState } from '@/shared/components/loading-state';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { useCreatePlayer, useMyPlayers, useRemovePlayer, useUpdatePlayer } from '../hooks/use-team';

export const RosterPage = () => {
  const players = useMyPlayers();
  const create = useCreatePlayer();
  const update = useUpdatePlayer();
  const remove = useRemovePlayer();
  const [form, setForm] = useState({ nickname: '', fullName: '', position: '' });
  const [adding, setAdding] = useState(false);
  if (players.isPending) return <LoadingState />;
  if (players.isError) return <ErrorState error={players.error} onRetry={() => void players.refetch()} />;
  const starters = players.data.filter((player) => player.status === 'starter');
  const substitutes = players.data.filter((player) => player.status === 'substitute');
  const add = () => create.mutate({ ...form, status: 'substitute' }, { onSuccess: () => { setForm({ nickname: '', fullName: '', position: '' }); setAdding(false); toast.success('Đã thêm tuyển thủ'); } });

  return <div className="space-y-6">
    <div className="flex items-center justify-between"><div><h1 className="text-2xl font-extrabold">Quản lý tuyển thủ</h1><p className="mt-1 text-sm text-muted-foreground">{starters.length}/5 chính thức · {substitutes.length} dự bị · {players.data.length}/20</p></div><Button onClick={() => setAdding(true)}><Plus className="size-4" />Thêm tuyển thủ</Button></div>
    {adding && <div className="grid gap-3 rounded-xl border bg-card p-4 sm:grid-cols-4"><Input placeholder="Nickname *" value={form.nickname} onChange={(event) => setForm({ ...form, nickname: event.target.value })} /><Input placeholder="Họ tên" value={form.fullName} onChange={(event) => setForm({ ...form, fullName: event.target.value })} /><Input placeholder="Vị trí" value={form.position} onChange={(event) => setForm({ ...form, position: event.target.value })} /><div className="flex gap-2"><Button disabled={!form.nickname || create.isPending} onClick={add}>Lưu</Button><Button variant="outline" onClick={() => setAdding(false)}>Hủy</Button></div></div>}
    {players.data.length === 0 ? <EmptyState title="Chưa có tuyển thủ" description="Thêm tuyển thủ đầu tiên cho đội." /> : <><PlayerTable title="Chính thức" players={starters} onToggle={(id, status) => update.mutate({ id, input: { status } })} onRemove={(id) => remove.mutate(id)} disabled={update.isPending || remove.isPending} /><PlayerTable title="Dự bị" players={substitutes} onToggle={(id, status) => update.mutate({ id, input: { status } })} onRemove={(id) => remove.mutate(id)} disabled={update.isPending || remove.isPending} /></>}
  </div>;
};

function PlayerTable({ title, players, onToggle, onRemove, disabled }: { title: string; players: { _id: string; nickname: string; fullName?: string; position?: string; status: 'starter' | 'substitute' }[]; onToggle: (id: string, status: 'starter' | 'substitute') => void; onRemove: (id: string) => void; disabled: boolean }) {
  if (!players.length) return null;
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <h2 className="border-b px-4 py-3 text-sm font-semibold">{title} ({players.length})</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="px-4 py-2">Nickname</th>
            <th className="px-4 py-2">Họ tên</th>
            <th className="px-4 py-2">Vị trí</th>
            <th className="px-4 py-2" />
          </tr>
        </thead>
        <tbody>
          {players.map((player) => (
            <tr key={player._id} className="border-t">
              <td className="px-4 py-3 font-medium">{player.nickname}</td>
              <td className="px-4 py-3">{player.fullName || '—'}</td>
              <td className="px-4 py-3">{player.position || '—'}</td>
              <td className="flex justify-end gap-2 px-4 py-2">
                <Button size="sm" variant="ghost" disabled={disabled} aria-label="Đổi trạng thái" onClick={() => onToggle(player._id, player.status === 'starter' ? 'substitute' : 'starter')} className="h-8 w-8 p-0">
                  <Star className="size-4" fill={player.status === 'starter' ? 'currentColor' : 'none'} />
                </Button>
                <Button size="sm" variant="ghost" disabled={disabled} aria-label="Xóa tuyển thủ" onClick={() => onRemove(player._id)} className="h-8 w-8 p-0">
                  <Trash2 className="size-4" />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
