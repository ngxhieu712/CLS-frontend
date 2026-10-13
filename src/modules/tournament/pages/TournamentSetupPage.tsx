import { useState } from 'react';
import { Save, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { MOCK_TOURNAMENT } from '@/shared/lib/mock-data';
import type { RoundFormat } from '@/shared/types/esports.types';

export const TournamentSetupPage = () => {
  const [form, setForm] = useState({
    name: MOCK_TOURNAMENT.name,
    format: MOCK_TOURNAMENT.format,
    groupCount: MOCK_TOURNAMENT.groupCount,
    teamsPerGroup: MOCK_TOURNAMENT.teamsPerGroup,
    advanceCount: MOCK_TOURNAMENT.advanceCount,
    defaultFormat: MOCK_TOURNAMENT.defaultFormat as RoundFormat,
    scoringRule: MOCK_TOURNAMENT.scoringRule,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đã lưu cài đặt giải đấu');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400">
          <Settings className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Thiết lập giải đấu</h1>
          <p className="text-sm text-zinc-500">Cấu hình thể thức và luật tính điểm</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Basic */}
        <Section title="Thông tin cơ bản">
          <Field label="Tên giải đấu" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
          <Field label="Mô tả thể thức" value={form.format} onChange={v => setForm(f => ({ ...f, format: v }))} />
        </Section>

        {/* Group stage */}
        <Section title="Vòng bảng">
          <div className="grid gap-4 sm:grid-cols-3">
            <NumberField label="Số bảng" value={form.groupCount} min={1} max={8} onChange={v => setForm(f => ({ ...f, groupCount: v }))} />
            <NumberField label="Đội mỗi bảng" value={form.teamsPerGroup} min={2} max={8} onChange={v => setForm(f => ({ ...f, teamsPerGroup: v }))} />
            <NumberField label="Đội đi tiếp" value={form.advanceCount} min={1} max={4} onChange={v => setForm(f => ({ ...f, advanceCount: v }))} />
          </div>
        </Section>

        {/* Match format */}
        <Section title="Thể thức trận đấu">
          <div>
            <label className="mb-2 block text-xs text-zinc-400">Thể thức mặc định</label>
            <div className="flex gap-2">
              {(['BO1', 'BO3', 'BO5'] as RoundFormat[]).map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setForm(p => ({ ...p, defaultFormat: f }))}
                  className={`rounded-lg border px-4 py-2 text-sm font-bold cursor-pointer transition-colors ${
                    form.defaultFormat === f
                      ? 'border-amber-500/50 bg-amber-500/20 text-amber-400'
                      : 'border-border bg-muted/30 text-zinc-400 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
          <Field label="Luật tính điểm" value={form.scoringRule} onChange={v => setForm(f => ({ ...f, scoringRule: v }))} />
        </Section>

        {/* Preview */}
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-zinc-400">
          <p className="mb-1 text-xs font-semibold text-amber-400 uppercase tracking-wider">Tóm tắt cấu hình</p>
          <p>{form.groupCount} bảng × {form.teamsPerGroup} đội — Top {form.advanceCount} mỗi bảng đi tiếp</p>
          <p>Tổng: {form.groupCount * form.teamsPerGroup} đội · {form.defaultFormat} mặc định</p>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-black hover:opacity-90 cursor-pointer"
        >
          <Save className="size-4" /> Lưu cấu hình
        </button>
      </form>
    </div>
  );
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
      <p className="text-sm font-bold text-white">{title}</p>
      {children}
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-zinc-400">{label}</label>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none"
      />
    </div>
  );
}

function NumberField({ label, value, min, max, onChange }: { label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <div>
      <label className="mb-1.5 block text-xs text-zinc-400">{label}</label>
      <input
        type="number"
        value={value}
        min={min}
        max={max}
        onChange={e => onChange(Number(e.target.value))}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-white focus:border-amber-500/50 focus:outline-none"
      />
    </div>
  );
}
