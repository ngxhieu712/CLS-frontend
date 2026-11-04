import { useState } from 'react';
import { CheckCircle, Shield, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { EmptyState } from '@/shared/components/empty-state';
import { ErrorState } from '@/shared/components/error-state';
import { LoadingState } from '@/shared/components/loading-state';
import { PageHeader } from '@/shared/components/page-header';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { TeamReviewDialog } from '../components/TeamReviewDialog';
import { useAdminTeams, useReviewTeam } from '../hooks/use-admin-teams';
import type { AdminTeam } from '../api/admin-team.api';

type FilterStatus = 'all' | 'pending' | 'approved' | 'rejected';

export const AdminTeamsPage = () => {
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [reviewingTeam, setReviewingTeam] = useState<AdminTeam | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject' | null>(null);

  const teams = useAdminTeams(statusFilter === 'all' ? undefined : statusFilter);
  const reviewMutation = useReviewTeam();

  const handleReview = (team: AdminTeam, action: 'approve' | 'reject') => {
    setReviewingTeam(team);
    setReviewAction(action);
  };

  const confirmReview = (reason?: string) => {
    if (!reviewingTeam || !reviewAction) return;

    reviewMutation.mutate(
      {
        teamId: reviewingTeam._id,
        input: {
          action: reviewAction,
          ...(reason && { reason }),
        },
      },
      {
        onSuccess: () => {
          toast.success(
            reviewAction === 'approve'
              ? `Đã duyệt đội ${reviewingTeam.name}`
              : `Đã từ chối đội ${reviewingTeam.name}`
          );
          setReviewingTeam(null);
          setReviewAction(null);
        },
        onError: (error: Error) => {
          toast.error(`Lỗi: ${error.message}`);
        },
      }
    );
  };

  const cancelReview = () => {
    setReviewingTeam(null);
    setReviewAction(null);
  };

  if (teams.isPending) return <LoadingState />;
  if (teams.isError)
    return <ErrorState error={teams.error} onRetry={() => void teams.refetch()} />;

  const pendingCount = teams.data.filter((t) => t.profileStatus === 'pending').length;
  const approvedCount = teams.data.filter((t) => t.profileStatus === 'approved').length;
  const rejectedCount = teams.data.filter((t) => t.profileStatus === 'rejected').length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Quản lý đội"
        description="Duyệt và quản lý hồ sơ đội tham dự giải đấu"
        badge={
          <Badge variant="outline" className="ml-2">
            {teams.data.length} đội
          </Badge>
        }
      />

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Chờ duyệt"
          value={pendingCount}
          icon={Shield}
          variant="warning"
          active={statusFilter === 'pending'}
          onClick={() => setStatusFilter('pending')}
        />
        <StatCard
          label="Đã duyệt"
          value={approvedCount}
          icon={CheckCircle}
          variant="success"
          active={statusFilter === 'approved'}
          onClick={() => setStatusFilter('approved')}
        />
        <StatCard
          label="Đã từ chối"
          value={rejectedCount}
          icon={XCircle}
          variant="destructive"
          active={statusFilter === 'rejected'}
          onClick={() => setStatusFilter('rejected')}
        />
      </div>

      {/* Filter */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Lọc:</span>
        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as FilterStatus)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ duyệt</SelectItem>
            <SelectItem value="approved">Đã duyệt</SelectItem>
            <SelectItem value="rejected">Đã từ chối</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Teams Table */}
      {teams.data.length === 0 ? (
        <EmptyState
          title="Không có đội nào"
          description={
            statusFilter === 'all'
              ? 'Chưa có đội nào đăng ký giải đấu.'
              : `Không có đội nào ở trạng thái "${getStatusLabel(statusFilter)}".`
          }
        />
      ) : (
        <div className="overflow-hidden rounded-xl border bg-card">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="px-4 py-3 font-medium">Tên đội</th>
                  <th className="px-4 py-3 font-medium">Tag</th>
                  <th className="px-4 py-3 font-medium">Quản lý</th>
                  <th className="px-4 py-3 font-medium">Trạng thái</th>
                  <th className="px-4 py-3 font-medium">Ngày đăng ký</th>
                  <th className="px-4 py-3 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {teams.data.map((team) => (
                  <tr key={team._id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 font-medium">{team.name}</td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-muted px-2 py-1 text-xs">{team.tag}</code>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium">{team.manager.fullName}</div>
                        <div className="text-xs text-muted-foreground">{team.manager.email}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={team.profileStatus} />
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(team.registeredAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {team.profileStatus === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-green-600 text-green-600 hover:bg-green-50 hover:text-green-700"
                              onClick={() => handleReview(team, 'approve')}
                            >
                              <CheckCircle className="size-4" />
                              Duyệt
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 border-destructive text-destructive hover:bg-destructive/10"
                              onClick={() => handleReview(team, 'reject')}
                            >
                              <XCircle className="size-4" />
                              Từ chối
                            </Button>
                          </>
                        )}
                        {team.profileStatus === 'rejected' && team.rejectReason && (
                          <div className="text-xs text-muted-foreground">
                            Lý do: {team.rejectReason}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Review Dialog */}
      <TeamReviewDialog
        teamName={reviewingTeam?.name ?? ''}
        action={reviewAction}
        onConfirm={confirmReview}
        onCancel={cancelReview}
        isPending={reviewMutation.isPending}
      />
    </div>
  );
};

// Helper Components
function StatCard({
  label,
  value,
  icon: Icon,
  variant,
  active,
  onClick,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  variant: 'warning' | 'success' | 'destructive';
  active: boolean;
  onClick: () => void;
}) {
  const colorClasses = {
    warning: 'border-yellow-500 bg-yellow-50 text-yellow-700',
    success: 'border-green-500 bg-green-50 text-green-700',
    destructive: 'border-red-500 bg-red-50 text-red-700',
  };

  const activeClass = active ? 'ring-2 ring-offset-2' : '';

  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl border-2 p-4 transition-all hover:shadow-md ${colorClasses[variant]} ${activeClass}`}
    >
      <Icon className="size-8" />
      <div className="text-left">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm font-medium">{label}</div>
      </div>
    </button>
  );
}

function StatusBadge({ status }: { status: 'pending' | 'approved' | 'rejected' }) {
  const config = {
    pending: { label: 'Chờ duyệt', variant: 'secondary' as const },
    approved: { label: 'Đã duyệt', variant: 'default' as const },
    rejected: { label: 'Đã từ chối', variant: 'destructive' as const },
  };

  const { label, variant } = config[status];

  return <Badge variant={variant}>{label}</Badge>;
}

function getStatusLabel(status: FilterStatus): string {
  const labels = {
    all: 'Tất cả',
    pending: 'Chờ duyệt',
    approved: 'Đã duyệt',
    rejected: 'Đã từ chối',
  };
  return labels[status];
}
