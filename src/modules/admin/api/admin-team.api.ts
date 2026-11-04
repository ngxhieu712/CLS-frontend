import { http } from '@/shared/api/http';

export interface AdminTeam {
  _id: string;
  name: string;
  tag: string;
  profileStatus: 'pending' | 'approved' | 'rejected';
  registeredAt: string;
  rejectReason?: string;
  manager: {
    _id: string;
    fullName: string;
    email: string;
    status: string;
  };
}

export interface ReviewTeamInput {
  action: 'approve' | 'reject';
  reason?: string;
}

export const adminTeamApi = {
  /**
   * List all teams, optionally filtered by profile status
   */
  listTeams: (status?: 'pending' | 'approved' | 'rejected') => {
    const params = status ? { status } : {};
    return http
      .get<AdminTeam[]>('/admin/teams', { params })
      .then((response) => response.data);
  },

  /**
   * List only teams with pending status (waiting for review)
   */
  listPending: () =>
    http.get<AdminTeam[]>('/admin/teams/pending').then((response) => response.data),

  /**
   * Approve or reject a team registration
   */
  reviewTeam: (teamId: string, input: ReviewTeamInput) =>
    http
      .patch<AdminTeam>(`/admin/teams/${teamId}/review`, input)
      .then((response) => response.data),
};
