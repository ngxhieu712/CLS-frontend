import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminTeamApi, type ReviewTeamInput } from '../api/admin-team.api';

export const adminTeamKeys = {
  all: ['admin', 'teams'] as const,
  list: (status?: 'pending' | 'approved' | 'rejected') =>
    [...adminTeamKeys.all, 'list', status] as const,
  pending: ['admin', 'teams', 'pending'] as const,
};

/**
 * Fetch all teams, optionally filtered by status
 */
export const useAdminTeams = (status?: 'pending' | 'approved' | 'rejected') =>
  useQuery({
    queryKey: adminTeamKeys.list(status),
    queryFn: () => adminTeamApi.listTeams(status),
  });

/**
 * Fetch only pending teams
 */
export const usePendingTeams = () =>
  useQuery({
    queryKey: adminTeamKeys.pending,
    queryFn: adminTeamApi.listPending,
  });

/**
 * Approve or reject a team
 */
export const useReviewTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ teamId, input }: { teamId: string; input: ReviewTeamInput }) =>
      adminTeamApi.reviewTeam(teamId, input),
    onSuccess: () => {
      // Invalidate all team lists to refresh data
      void queryClient.invalidateQueries({ queryKey: adminTeamKeys.all });
    },
  });
};
