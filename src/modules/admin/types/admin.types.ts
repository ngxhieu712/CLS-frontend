import type { AccountStatus, UserRole } from '@/modules/auth/types/auth.types';

// ===== Team Approval =====

export type TeamProfileStatus = 'pending' | 'approved' | 'rejected';

export interface PopulatedManager {
  _id: string;
  fullName: string;
  email: string;
  status: AccountStatus;
}

export interface PendingTeam {
  _id: string;
  name: string;
  tag: string;
  logo: string;
  description: string;
  organization: string;
  contactEmail: string;
  contactPhone: string;
  registeredAt: string;
  profileStatus: TeamProfileStatus;
  rejectReason: string;
  manager: PopulatedManager;
  createdAt: string;
  updatedAt: string;
}

export interface AdminTeamListParams {
  status?: TeamProfileStatus;
}

export interface ReviewTeamInput {
  action: 'approve' | 'reject';
  reason?: string;
}

// ===== Account Management =====

export interface AdminAccount {
  _id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminAccountInput {
  fullName: string;
  email: string;
  password: string;
  role: 'referee' | 'editor';
}

export interface UpdateAccountStatusInput {
  status: 'active' | 'locked';
}
