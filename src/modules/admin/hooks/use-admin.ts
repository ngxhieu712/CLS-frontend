import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { adminApi } from '../api/admin.api';
import type {
  AdminTeamListParams,
  CreateAdminAccountInput,
  ReviewTeamInput,
  UpdateAccountStatusInput,
} from '../types/admin.types';

/** Cache keys. Invalidating `adminKeys.all` refreshes every admin query. */
export const adminKeys = {
  all: ['admin'] as const,
  teams: (params: AdminTeamListParams = {}) => [...adminKeys.all, 'teams', params] as const,
  pendingTeams: () => [...adminKeys.all, 'teams', 'pending'] as const,
  accounts: () => [...adminKeys.all, 'accounts'] as const,
};

// ===== Team Approval Queries =====

/** Lấy danh sách đội chờ duyệt */
export const usePendingTeams = () =>
  useQuery({
    queryKey: adminKeys.pendingTeams(),
    queryFn: adminApi.listPendingTeams,
  });

/** Lấy danh sách tất cả đội, có thể lọc theo status */
export const useAdminTeams = (params: AdminTeamListParams = {}) =>
  useQuery({
    queryKey: adminKeys.teams(params),
    queryFn: () => adminApi.listTeams(params),
  });

/** Duyệt hoặc từ chối hồ sơ đội */
export const useReviewTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ReviewTeamInput }) =>
      adminApi.reviewTeam(id, input),
    onSuccess: (data, variables) => {
      const action = variables.input.action === 'approve' ? 'duyệt' : 'từ chối';
      toast.success(`Đã ${action} hồ sơ đội "${data.name}".`);
      // Invalidate cả pending teams và all teams queries
      void queryClient.invalidateQueries({ queryKey: adminKeys.all });
    },
  });
};

// ===== Account Management Queries =====

/** Lấy danh sách tài khoản trọng tài và biên tập viên */
export const useAdminAccounts = () =>
  useQuery({
    queryKey: adminKeys.accounts(),
    queryFn: adminApi.listAccounts,
  });

/** Tạo tài khoản trọng tài hoặc biên tập viên */
export const useCreateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateAdminAccountInput) => adminApi.createAccount(input),
    onSuccess: (data) => {
      toast.success(`Đã tạo tài khoản ${data.role === 'referee' ? 'trọng tài' : 'biên tập viên'} cho ${data.email}.`);
      void queryClient.invalidateQueries({ queryKey: adminKeys.accounts() });
    },
  });
};

/** Khóa hoặc mở khóa tài khoản */
export const useUpdateAccountStatus = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAccountStatusInput }) =>
      adminApi.updateAccountStatus(id, input),
    onSuccess: (data, variables) => {
      const action = variables.input.status === 'locked' ? 'khóa' : 'mở khóa';
      toast.success(`Đã ${action} tài khoản ${data.email}.`);
      void queryClient.invalidateQueries({ queryKey: adminKeys.accounts() });
    },
  });
};
