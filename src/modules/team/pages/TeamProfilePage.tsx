import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Save } from 'lucide-react';
import { toast } from 'sonner';
import { ErrorState } from '@/shared/components/error-state';
import { FormField } from '@/shared/components/form-field';
import { LoadingState } from '@/shared/components/loading-state';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Textarea } from '@/shared/components/ui/textarea';
import { useMyTeam, useUpdateMyTeam } from '../hooks/use-team';

const schema = z.object({
  name: z.string().trim().min(2).max(100), tag: z.string().trim().min(2).max(10),
  contactEmail: z.string().email(), contactPhone: z.string().min(7).max(20),
  organization: z.string().max(200).optional(), description: z.string().max(1000).optional(), logo: z.string().url().or(z.literal('')).optional(),
});
type FormValues = z.infer<typeof schema>;

export const TeamProfilePage = () => {
  const team = useMyTeam();
  const update = useUpdateMyTeam();
  const form = useForm<FormValues>({ resolver: zodResolver(schema) });
  useEffect(() => { if (team.data) form.reset({ ...team.data, logo: team.data.logo || '' }); }, [form, team.data]);
  if (team.isPending) return <LoadingState />;
  if (team.isError) return <ErrorState error={team.error} onRetry={() => void team.refetch()} />;
  const lockedIdentity = team.data.profileStatus === 'approved';

  return <div className="mx-auto max-w-2xl space-y-6">
    <PageHeader title="Hồ sơ đội" description="Thông tin đội tham dự giải đấu" />
    {team.data.profileStatus === 'rejected' && team.data.rejectReason && <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">Lý do từ chối: {team.data.rejectReason}</p>}
    <form className="space-y-4 rounded-xl border bg-card p-6" onSubmit={form.handleSubmit((values) => update.mutate(values, { onSuccess: () => toast.success('Đã lưu hồ sơ đội') }))}>
      <FormField id="name" label="Tên đội" error={form.formState.errors.name?.message}><Input id="name" disabled={lockedIdentity} {...form.register('name')} /></FormField>
      <FormField id="tag" label="Tag đội" error={form.formState.errors.tag?.message}><Input id="tag" disabled={lockedIdentity} {...form.register('tag')} /></FormField>
      {lockedIdentity && <p className="text-xs text-muted-foreground">Tên và tag được khóa sau khi hồ sơ được duyệt.</p>}
      <FormField id="contactEmail" label="Email liên hệ" error={form.formState.errors.contactEmail?.message}><Input id="contactEmail" type="email" {...form.register('contactEmail')} /></FormField>
      <FormField id="contactPhone" label="Số điện thoại" error={form.formState.errors.contactPhone?.message}><Input id="contactPhone" {...form.register('contactPhone')} /></FormField>
      <FormField id="organization" label="Tổ chức / câu lạc bộ" error={form.formState.errors.organization?.message}><Input id="organization" {...form.register('organization')} /></FormField>
      <FormField id="description" label="Giới thiệu" error={form.formState.errors.description?.message}><Textarea id="description" {...form.register('description')} /></FormField>
      <Button className="w-full" type="submit" disabled={update.isPending}><Save className="size-4" />{update.isPending ? 'Đang lưu...' : 'Lưu hồ sơ'}</Button>
    </form>
  </div>;
};
