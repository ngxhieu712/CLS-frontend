import { ArrowDown, ArrowUp, Eye, EyeOff, Menu, RotateCcw, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Switch } from '@/shared/components/ui/switch';
import {
  getDefaultPublicNavbarSettings,
  getPublicNavbarSettings,
  PUBLIC_NAV_ITEMS,
  savePublicNavbarSettings,
} from '@/modules/public/navbar-settings';
import type { PublicNavbarSetting } from '@/modules/public/navbar-settings';

export const AdminNavbarPage = () => {
  const [settings, setSettings] = useState(getPublicNavbarSettings);
  const visibleCount = settings.filter(({ visible }) => visible).length;

  const updateSetting = (id: PublicNavbarSetting['id'], changes: Partial<PublicNavbarSetting>) => {
    setSettings((current) => current.map((item) => item.id === id ? { ...item, ...changes } : item));
  };

  const moveSetting = (index: number, offset: -1 | 1) => {
    const targetIndex = index + offset;
    if (targetIndex < 0 || targetIndex >= settings.length) return;

    setSettings((current) => {
      const next = [...current];
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const save = () => {
    if (settings.some(({ label }) => !label.trim() || label.trim().length > 32)) {
      toast.error('Tên mục phải có từ 1 đến 32 ký tự.');
      return;
    }

    try {
      savePublicNavbarSettings(settings.map((item) => ({ ...item, label: item.label.trim() })));
      toast.success('Đã lưu thanh điều hướng.');
    } catch (error) {
      console.error('Unable to save public navbar settings.', error);
      toast.error('Không thể lưu cài đặt. Hãy kiểm tra bộ nhớ trình duyệt và thử lại.');
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Thanh điều hướng"
        description="Đổi tên, sắp xếp hoặc ẩn các mục trên thanh điều hướng dành cho khán giả. Cài đặt chỉ lưu trên trình duyệt này."
        actions={
          <>
            <Button variant="outline" onClick={() => setSettings(getDefaultPublicNavbarSettings())}>
              <RotateCcw className="size-4" />
              Mặc định
            </Button>
            <Button onClick={save}>
              <Save className="size-4" />
              Lưu thay đổi
            </Button>
          </>
        }
      />

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.8fr)]">
        <section className="overflow-hidden rounded-xl border bg-card" aria-labelledby="navbar-items-heading">
          <div className="flex items-center justify-between border-b px-5 py-4">
            <div>
              <h2 id="navbar-items-heading" className="font-semibold">Các mục điều hướng</h2>
              <p className="mt-1 text-sm text-muted-foreground">Dùng các nút mũi tên để đổi thứ tự.</p>
            </div>
            <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
              {visibleCount}/{settings.length} đang hiện
            </span>
          </div>

          <div className="divide-y">
            {settings.map((setting, index) => {
              const navItem = PUBLIC_NAV_ITEMS.find(({ id }) => id === setting.id);
              if (!navItem) return null;
              const Icon = navItem.icon;

              return (
                <div key={setting.id} className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 sm:gap-4 sm:px-5">
                  <div className="flex flex-col gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`Di chuyển ${setting.label} lên`}
                      disabled={index === 0}
                      onClick={() => moveSetting(index, -1)}
                      className="size-8 p-0"
                    >
                      <ArrowUp className="size-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`Di chuyển ${setting.label} xuống`}
                      disabled={index === settings.length - 1}
                      onClick={() => moveSetting(index, 1)}
                      className="size-8 p-0"
                    >
                      <ArrowDown className="size-4" />
                    </Button>
                  </div>

                  <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <Icon className="size-4 shrink-0 text-primary" />
                      <span>{navItem.to}</span>
                    </div>
                    <Input
                      aria-label={`Tên mục ${setting.label}`}
                      value={setting.label}
                      maxLength={32}
                      onChange={(event) => updateSetting(setting.id, { label: event.target.value })}
                    />
                  </div>

                  <div className="flex flex-col items-center gap-1.5">
                    <Switch
                      checked={setting.visible}
                      onCheckedChange={(visible) => updateSetting(setting.id, { visible })}
                      aria-label={`${setting.visible ? 'Ẩn' : 'Hiện'} ${setting.label}`}
                    />
                    <span className="text-xs text-muted-foreground">{setting.visible ? 'Hiện' : 'Ẩn'}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="overflow-hidden rounded-xl border bg-card" aria-labelledby="navbar-preview-heading">
          <div className="border-b px-5 py-4">
            <h2 id="navbar-preview-heading" className="font-semibold">Xem trước</h2>
            <p className="mt-1 text-sm text-muted-foreground">Bản xem trước cập nhật khi bạn chỉnh sửa.</p>
          </div>
          <div className="p-4">
            <div className="overflow-hidden rounded-lg border border-amber-500/20 bg-[#070a13] text-slate-100">
              <div className="flex h-12 items-center gap-2 border-b border-amber-500/15 px-3">
                <div className="flex size-7 items-center justify-center rounded-lg border border-amber-500/40 bg-amber-500/10 text-amber-400">
                  <Menu className="size-4" />
                </div>
                <span className="text-xs font-bold tracking-wide">CHAMPION <span className="text-amber-400">LEAGUE</span></span>
              </div>
              <nav aria-label="Bản xem trước thanh điều hướng" className="flex min-h-12 flex-wrap items-center gap-1 p-2">
                {settings.filter(({ visible }) => visible).map(({ id, label }) => {
                  const item = PUBLIC_NAV_ITEMS.find((navItem) => navItem.id === id);
                  if (!item) return null;
                  const Icon = item.icon;

                  return (
                    <span key={id} className="inline-flex items-center gap-1.5 rounded-md bg-amber-500/10 px-2.5 py-1.5 text-xs text-amber-300">
                      <Icon className="size-3.5" />
                      {label}
                    </span>
                  );
                })}
                {visibleCount === 0 && <span className="px-2 text-xs text-slate-400">Ẩn toàn bộ mục điều hướng</span>}
              </nav>
            </div>
            <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
              {visibleCount > 0 ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5" />}
              {visibleCount} mục sẽ hiện trên trình duyệt này sau khi lưu.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};
