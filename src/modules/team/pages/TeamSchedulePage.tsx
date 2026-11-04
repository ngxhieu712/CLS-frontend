import { EmptyState } from '@/shared/components/empty-state';
import { useMyTeam } from '@/modules/team/hooks/use-team';
import { LoadingState } from '@/shared/components/loading-state';
import { ErrorState } from '@/shared/components/error-state';
import { Calendar } from 'lucide-react';

export const TeamSchedulePage = () => {
  const teamQuery = useMyTeam();

  // Loading state
  if (teamQuery.isPending) return <LoadingState />;

  // Error state
  if (teamQuery.isError) {
    return <ErrorState error={teamQuery.error} onRetry={() => void teamQuery.refetch()} />;
  }

  const team = teamQuery.data;
  const isApproved = team.profileStatus === 'approved';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Lịch &amp; Kết quả của đội</h1>
        <p className="mt-1 text-sm text-zinc-500">
          {isApproved
            ? 'Lịch thi đấu sẽ được cập nhật khi giải đấu bắt đầu'
            : 'Lịch thi đấu chỉ hiển thị sau khi hồ sơ được duyệt'}
        </p>
      </div>

      <EmptyState
        icon={Calendar}
        title={isApproved ? 'Chưa có trận đấu nào' : 'Hồ sơ chưa được duyệt'}
        description={
          isApproved
            ? 'Lịch thi đấu sẽ được BTC cập nhật sau khi giải đấu chính thức bắt đầu.'
            : 'Bạn cần hoàn tất hồ sơ đội và chờ admin duyệt trước khi xem lịch thi đấu.'
        }
      />
    </div>
  );
};
