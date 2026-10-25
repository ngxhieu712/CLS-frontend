import { useState } from 'react';
import { ImagePlus, Save, Settings2, Trophy } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { MOCK_TOURNAMENT } from '@/shared/lib/mock-data';
import type { RoundFormat } from '@/shared/types/esports.types';

interface TournamentForm {
  name: string;
  description: string;
  bannerUrl: string;
  groupCount: number;
  advanceCount: number;
  groupFormat: RoundFormat;
  playoffFormat: RoundFormat;
  finalFormat: RoundFormat;
  winPoints: number;
  lossPoints: number;
}

const DEFAULT_FORM: TournamentForm = {
  name: MOCK_TOURNAMENT.name,
  description: 'Giải đấu esports theo thể thức vòng bảng và playoff nhánh đơn.',
  bannerUrl: '',
  groupCount: 4,
  advanceCount: 2,
  groupFormat: 'BO3',
  playoffFormat: 'BO3',
  finalFormat: 'BO5',
  winPoints: 3,
  lossPoints: 0,
};
const ROUND_FORMATS: RoundFormat[] = ['BO1', 'BO3', 'BO5'];
const isRoundFormat = (value: string): value is RoundFormat => ROUND_FORMATS.some((format) => format === value);
const STORAGE_KEY = 'champion-league:tournament-settings';

const getInitialForm = (): TournamentForm => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_FORM;
    const saved: unknown = JSON.parse(raw);
    if (typeof saved !== 'object' || saved === null) return DEFAULT_FORM;
    const values = saved as Record<string, unknown>;
    return {
      name: typeof values.name === 'string' ? values.name : DEFAULT_FORM.name,
      description: typeof values.description === 'string' ? values.description : DEFAULT_FORM.description,
      bannerUrl: typeof values.bannerUrl === 'string' ? values.bannerUrl : DEFAULT_FORM.bannerUrl,
      groupCount: typeof values.groupCount === 'number' && Number.isInteger(values.groupCount) && values.groupCount >= 1 && values.groupCount <= 8 ? values.groupCount : DEFAULT_FORM.groupCount,
      advanceCount: typeof values.advanceCount === 'number' && Number.isInteger(values.advanceCount) && values.advanceCount >= 1 && values.advanceCount <= 4 ? values.advanceCount : DEFAULT_FORM.advanceCount,
      groupFormat: typeof values.groupFormat === 'string' && isRoundFormat(values.groupFormat) ? values.groupFormat : DEFAULT_FORM.groupFormat,
      playoffFormat: typeof values.playoffFormat === 'string' && isRoundFormat(values.playoffFormat) ? values.playoffFormat : DEFAULT_FORM.playoffFormat,
      finalFormat: typeof values.finalFormat === 'string' && isRoundFormat(values.finalFormat) ? values.finalFormat : DEFAULT_FORM.finalFormat,
      winPoints: typeof values.winPoints === 'number' && Number.isInteger(values.winPoints) && values.winPoints >= 0 && values.winPoints <= 10 ? values.winPoints : DEFAULT_FORM.winPoints,
      lossPoints: typeof values.lossPoints === 'number' && Number.isInteger(values.lossPoints) && values.lossPoints >= 0 && values.lossPoints <= 10 ? values.lossPoints : DEFAULT_FORM.lossPoints,
    };
  } catch (error) {
    console.error('Unable to read tournament settings.', error);
    return DEFAULT_FORM;
  }
};

export const TournamentSetupPage = () => {
  const [form, setForm] = useState<TournamentForm>(getInitialForm);
  const update = <K extends keyof TournamentForm>(key: K, value: TournamentForm[K]) =>
    setForm((current) => ({ ...current, [key]: value }));

  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name.trim()) return toast.error('Nhập tên giải đấu trước khi lưu.');
    if (form.advanceCount > 4) return toast.error('Mỗi bảng có tối đa 4 đội đi tiếp.');
    if (form.groupCount < 1 || form.groupCount > 8 || form.advanceCount < 1 || form.winPoints < 0 || form.lossPoints < 0) {
      return toast.error('Kiểm tra lại các thông số giải đấu.');
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...form, name: form.name.trim() }));
      toast.success('Đã lưu cấu hình giải đấu trên trình duyệt này.');
    } catch (error) {
      console.error('Unable to save tournament settings.', error);
      toast.error('Không thể lưu cài đặt. Hãy kiểm tra bộ nhớ trình duyệt.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thiết lập giải đấu"
        description="Thông tin, thể thức và luật tính điểm. Cấu hình hiện là dữ liệu mẫu của frontend."
      />

      <form onSubmit={save} className="grid items-start gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          <section className="rounded-xl border border-border bg-card p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Trophy className="size-4" /></div>
              <div>
                <h2 className="text-sm font-semibold">Thông tin giải đấu</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Nội dung hiển thị trên trang giải công khai.</p>
              </div>
            </div>
            <div className="space-y-4">
              <Field label="Tên giải đấu" required>
                <Input value={form.name} maxLength={100} onChange={(event) => update('name', event.target.value)} />
              </Field>
              <Field label="Mô tả">
                <Textarea value={form.description} maxLength={500} rows={3} onChange={(event) => update('description', event.target.value)} />
              </Field>
              <Field label="URL ảnh bìa hoặc logo">
                <div className="relative">
                  <ImagePlus className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9" type="url" placeholder="https://example.com/banner.jpg" value={form.bannerUrl} onChange={(event) => update('bannerUrl', event.target.value)} />
                </div>
              </Field>
              {form.bannerUrl && (
                <img className="max-h-48 w-full rounded-lg border border-border object-cover" src={form.bannerUrl} alt="Xem trước ảnh bìa giải đấu" />
              )}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary"><Settings2 className="size-4" /></div>
              <div>
                <h2 className="text-sm font-semibold">Thể thức thi đấu</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">Quy mô vòng bảng và số suất đi tiếp.</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Số bảng">
                <Input type="number" min={1} max={8} value={form.groupCount} onChange={(event) => update('groupCount', Number(event.target.value))} />
              </Field>
              <Field label="Đội đi tiếp mỗi bảng">
                <Input type="number" min={1} max={4} value={form.advanceCount} onChange={(event) => update('advanceCount', Number(event.target.value))} />
              </Field>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              <FormatField label="Vòng bảng" value={form.groupFormat} onChange={(value) => update('groupFormat', value)} />
              <FormatField label="Playoff" value={form.playoffFormat} onChange={(value) => update('playoffFormat', value)} />
              <FormatField label="Chung kết" value={form.finalFormat} onChange={(value) => update('finalFormat', value)} />
            </div>
          </section>

          <section className="rounded-xl border border-border bg-card p-5">
            <div className="mb-5">
              <h2 className="text-sm font-semibold">Luật tính điểm</h2>
              <p className="mt-1 text-xs text-muted-foreground">Dùng để xếp hạng đội trong cùng bảng.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Điểm khi thắng">
                <Input type="number" min={0} max={10} value={form.winPoints} onChange={(event) => update('winPoints', Number(event.target.value))} />
              </Field>
              <Field label="Điểm khi thua">
                <Input type="number" min={0} max={10} value={form.lossPoints} onChange={(event) => update('lossPoints', Number(event.target.value))} />
              </Field>
            </div>
          </section>

          <div className="flex justify-end">
            <Button type="submit"><Save className="size-4" /> Lưu cấu hình</Button>
          </div>
        </div>

        <aside className="rounded-xl border border-border bg-card p-5 xl:sticky xl:top-20">
          <h2 className="text-sm font-semibold">Tóm tắt thể thức</h2>
          <p className="mt-1 text-xs text-muted-foreground">Bản xem trước sẽ cập nhật cùng cấu hình.</p>
          <dl className="mt-5 divide-y divide-border">
            <SummaryRow label="Vòng bảng" value={`${form.groupCount} bảng`} />
            <SummaryRow label="Suất đi tiếp" value={`Top ${form.advanceCount} mỗi bảng`} />
            <SummaryRow label="Playoff" value={`${form.groupCount * form.advanceCount} đội`} />
            <SummaryRow label="Vòng bảng" value={form.groupFormat} />
            <SummaryRow label="Playoff" value={form.playoffFormat} />
            <SummaryRow label="Chung kết" value={form.finalFormat} />
            <SummaryRow label="Thắng / thua" value={`${form.winPoints} / ${form.lossPoints} điểm`} />
          </dl>
          <div className="mt-4 rounded-lg bg-muted/70 p-3 text-xs leading-relaxed text-muted-foreground">
            Hệ thống dự kiến có {form.groupCount * form.advanceCount} đội vào vòng loại trực tiếp. Hãy kiểm tra số đội đủ điều kiện trước khi tạo nhánh.
          </div>
        </aside>
      </form>
    </div>
  );
};

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block space-y-1.5 text-sm font-medium">
      <span>{label}{required && <span className="ml-1 text-destructive" aria-hidden="true">*</span>}</span>
      {children}
    </label>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-3 py-3 text-sm"><dt className="text-muted-foreground">{label}</dt><dd className="font-medium tabular-nums">{value}</dd></div>;
}

function FormatField({ label, value, onChange }: { label: string; value: RoundFormat; onChange: (value: RoundFormat) => void }) {
  const handleChange = (candidate: string) => {
    if (isRoundFormat(candidate)) onChange(candidate);
  };

  return (
    <label className="space-y-1.5 text-sm font-medium">
      <span>{label}</span>
      <select className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" value={value} onChange={(event) => handleChange(event.target.value)}>
        {ROUND_FORMATS.map((format) => <option key={format} value={format}>{format}</option>)}
      </select>
    </label>
  );
}
