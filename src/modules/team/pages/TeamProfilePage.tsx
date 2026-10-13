import { useState } from 'react';
import { Upload, Save } from 'lucide-react';
import { toast } from 'sonner';

export const TeamProfilePage = () => {
  const [form, setForm] = useState({
    name: 'Team Alpha',
    tag: 'ALF',
    contactEmail: 'teamalpha@esports.vn',
    contactPhone: '0912 345 678',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Đã lưu hồ sơ đội');
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Hồ sơ đội</h1>
        <p className="mt-1 text-sm text-zinc-500">Thông tin đội tham dự giải đấu</p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Logo upload */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 text-sm font-bold text-white">Logo đội</h2>
          <div className="flex items-center gap-5">
            <div className="flex size-20 items-center justify-center rounded-xl bg-amber-500/10 ring-2 ring-amber-500/20">
              <span className="text-xl font-black text-amber-400">{form.tag}</span>
            </div>
            <div>
              <button
                type="button"
                className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-4 py-2 text-sm text-zinc-300 transition-colors hover:bg-white/10 cursor-pointer"
                onClick={() => toast.info('Tính năng upload ảnh đang phát triển')}
              >
                <Upload className="size-4" /> Tải logo lên
              </button>
              <p className="mt-1.5 text-xs text-zinc-600">PNG, JPG. Tối đa 2MB. Nên dùng ảnh vuông.</p>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-5 text-sm font-bold text-white">Thông tin cơ bản</h2>
          <div className="space-y-4">
            <Field label="Tên đội *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} placeholder="Team Alpha" />
            <Field label="Tag đội (3–5 ký tự) *" value={form.tag} onChange={v => setForm(f => ({ ...f, tag: v.toUpperCase().slice(0, 5) }))} placeholder="ALF" />
            <Field label="Email liên hệ" value={form.contactEmail} onChange={v => setForm(f => ({ ...f, contactEmail: v }))} type="email" placeholder="team@example.com" />
            <Field label="Số điện thoại" value={form.contactPhone} onChange={v => setForm(f => ({ ...f, contactPhone: v }))} type="tel" placeholder="0912 345 678" />
          </div>
        </div>

        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 py-3 text-sm font-bold text-black transition-opacity hover:opacity-90 cursor-pointer"
        >
          <Save className="size-4" /> Lưu hồ sơ
        </button>
      </form>
    </div>
  );
};

function Field({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-medium text-zinc-400">{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-white placeholder-zinc-600 focus:border-amber-500/50 focus:outline-none"
      />
    </div>
  );
}
