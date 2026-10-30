import { http } from '@/shared/api/http';
import type { MessageResponse } from '@/modules/auth/types/auth.types';
import type {
  AdminAccount,
  AdminTeamListParams,
  CreateAdminAccountInput,
  PendingTeam,
  ReviewTeamInput,
  UpdateAccountStatusInput,
} from '../types/admin.types';

/** Drops empty values so the URL stays clean (`?status=` is never sent when undefined). */
const cleanParams = (params: object) =>
  Object.fromEntries(Object.entries(params).filter(([, value]) => value !== undefined && value !== ''));

/** Every function resolves with the response body (not the Axios response). */
export const adminApi = {
  // ===== Team Approval =====
  
  /** Lấy danh sách đội chờ duyệt */
  listPendingTeams: () =>
    http.get<PendingTeam[]>('/admin/teams/pending').then((r) => r.data),

  /** Lấy danh sách tất cả đội, có thể lọc theo status */
  listTeams: (params: AdminTeamListParams = {}) =>
    http.get<PendingTeam[]>('/admin/teams', { params: cleanParams(params) }).then((r) => r.data),

  /** Duyệt hoặc từ chối hồ sơ đội */
  reviewTeam: (id: string, input: ReviewTeamInput) =>
    http.patch<PendingTeam>(`/admin/teams/${id}/review`, input).then((r) => r.data),

  // ===== Account Management =====

  /** Lấy danh sách tài khoản trọng tài và biên tập viên */
  listAccounts: () =>
    http.get<AdminAccount[]>('/admin/accounts').then((r) => r.data),

  /** Tạo tài khoản trọng tài hoặc biên tập viên (admin nhập mật khẩu tạm) */
  createAccount: (input: CreateAdminAccountInput) =>
    http.post<AdminAccount>('/admin/accounts', input).then((r) => r.data),

  /** Khóa hoặc mở khóa tài khoản */
  updateAccountStatus: (id: string, input: UpdateAccountStatusInput) =>
    http.patch<AdminAccount>(`/admin/accounts/${id}/status`, input).then((r) => r.data),
};
