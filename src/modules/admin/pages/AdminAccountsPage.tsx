import { Lock, LockOpen, Plus, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useAdminAccounts, useUpdateAccountStatus } from '../hooks/use-admin';
import type { AdminAccount } from '../types/admin.types';
import { PageHeader } from '@/shared/components/page-header';
import { Button } from '@/shared/components/ui/button';
import { EmptyState } from '@/shared/components/empty-state';
import { LoadingState } from '@/shared/components/loading-state';
import { ErrorState } from '@/shared/components/error-state';
import { CreateAccountDialog } from '../components/CreateAccountDialog';
import { ConfirmDialog } from '@/shared/components/confirm-dialog';

/**
 * Admin page để tạo và quản lý tài khoản trọng tài và biên tập viên.
 * Không dùng DataTable vì chức năng đơn giản, chỉ cần list + actions.
 */
export const AdminAccountsPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [lockingAccount, setLockingAccount] = useState<AdminAccount | null>(null);

  const { data: accounts = [], isLoading, error } = useAdminAccounts();
  const updateStatus = useUpdateAccountStatus();

  const handleLockUnlock = (account: AdminAccount) => {
    setLockingAccount(account);
  };

  const confirmLockUnlock = () => {
    if (!lockingAccount) return;
    const newStatus = lockingAccount.status === 'locked' ? 'active' : 'locked';
    updateStatus.mutate(
      { id: lockingAccount._id, input: { status: newStatus } },
      { onSuccess: () => setLockingAccount(null) }
    );
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState />;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý tài khoản"
        description="Tạo và quản lý tài khoản trọng tài và biên tập viên."
        actions={
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="size-4" />
            Tạo tài khoản
          </Button>
        }
      />

      {accounts.length === 0 ? (
        <EmptyState
          icon={UserPlus}
          title="Chưa có tài khoản"
          description="Tạo tài khoản trọng tài hoặc biên tập viên để bắt đầu."
        />
      ) : (
        <div className="space-y-3">
          {accounts.map((account) => {
            const isLocked = account.status === 'locked';
            const roleLabel = account.role === 'referee' ? 'Trọng tài' : 'Biên tập viên';

            return (
              <article
                key={account._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-4"
              >
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-border bg-muted text-sm font-bold text-primary">
                    {account.fullName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="truncate text-sm font-semibold">{account.fullName}</span>
                      <span className="rounded-full border border-border bg-muted px-2 py-0.5 text-[11px] font-medium">
                        {roleLabel}
                      </span>
                      {isLocked && (
                        <span className="rounded-full border border-red-500/30 bg-red-500/10 px-2 py-0.5 text-[11px] font-medium text-red-700 dark:text-red-300">
                          Đã khóa
                        </span>
                      )}
                    </div>
                    <p className="mt-1 truncate text-xs text-muted-foreground">{account.email}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={isLocked ? 'default' : 'outline'}
                  onClick={() => handleLockUnlock(account)}
                  disabled={updateStatus.isPending}
                >
                  {isLocked ? (
                    <>
                      <LockOpen className="size-4" /> Mở khóa
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" /> Khóa
                    </>
                  )}
                </Button>
              </article>
            );
          })}
        </div>
      )}

      <CreateAccountDialog open={showCreateDialog} onOpenChange={setShowCreateDialog} />

      <ConfirmDialog
        open={Boolean(lockingAccount)}
        onOpenChange={(open) => !open && setLockingAccount(null)}
        title={lockingAccount?.status === 'locked' ? 'Mở khóa tài khoản?' : 'Khóa tài khoản?'}
        description={
          lockingAccount?.status === 'locked'
            ? `Tài khoản ${lockingAccount.email} sẽ có thể đăng nhập trở lại.`
            : `Tài khoản ${lockingAccount?.email} sẽ không thể đăng nhập.`
        }
        destructive={lockingAccount?.status !== 'locked'}
        confirmLabel={lockingAccount?.status === 'locked' ? 'Mở khóa' : 'Khóa'}
        onConfirm={confirmLockUnlock}
      />
    </div>
  );
};
