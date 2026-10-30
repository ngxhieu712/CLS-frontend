import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useCreateAccount } from '../hooks/use-admin';
import type { CreateAdminAccountInput } from '../types/admin.types';
import { Button } from '@/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { FormField } from '@/shared/components/form-field';

const createAccountSchema = z.object({
  fullName: z.string().trim().min(2, 'Tên phải có ít nhất 2 ký tự').max(100, 'Tên quá dài'),
  email: z.string().trim().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự').max(128, 'Mật khẩu quá dài'),
  role: z.enum(['referee', 'editor'], { required_error: 'Chọn vai trò' }),
});

interface CreateAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const CreateAccountDialog = ({ open, onOpenChange }: CreateAccountDialogProps) => {
  const createAccount = useCreateAccount();
  const form = useForm<CreateAdminAccountInput>({
    resolver: zodResolver(createAccountSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      role: 'referee',
    },
  });

  const onSubmit = (data: CreateAdminAccountInput) => {
    createAccount.mutate(data, {
      onSuccess: () => {
        form.reset();
        onOpenChange(false);
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo tài khoản mới</DialogTitle>
          <DialogDescription>
            Tạo tài khoản trọng tài hoặc biên tập viên. Mật khẩu tạm sẽ được gửi cho người dùng.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField label="Họ tên" required error={form.formState.errors.fullName?.message}>
            <input
              {...form.register('fullName')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Nguyễn Văn A"
            />
          </FormField>

          <FormField label="Email" required error={form.formState.errors.email?.message}>
            <input
              {...form.register('email')}
              type="email"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="email@example.com"
            />
          </FormField>

          <FormField label="Mật khẩu tạm" required error={form.formState.errors.password?.message}>
            <input
              {...form.register('password')}
              type="password"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="••••••••"
            />
          </FormField>

          <FormField label="Vai trò" required error={form.formState.errors.role?.message}>
            <select
              {...form.register('role')}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="referee">Trọng tài</option>
              <option value="editor">Biên tập viên</option>
            </select>
          </FormField>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Hủy
            </Button>
            <Button type="submit" disabled={createAccount.isPending}>
              {createAccount.isPending ? 'Đang tạo...' : 'Tạo tài khoản'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
