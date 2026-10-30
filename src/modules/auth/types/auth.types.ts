export interface AuthPayload {
  email: string;
  password: string;
}

export type AccountStatus = 'pending' | 'active' | 'locked' | 'rejected';

export interface TeamRegistrationPayload {
  fullName: string;
  email: string;
  password: string;
  team: TeamProfileInput;
}

export interface TeamProfileInput {
  name: string;
  tag: string;
  contactEmail: string;
  contactPhone: string;
  logo?: string;
  description?: string;
  organization?: string;
}

export type UserRole = 'admin' | 'referee' | 'teamManager' | 'editor';

export interface CurrentUser {
  _id: string;
  email: string;
  role: UserRole;
  status: AccountStatus;
  fullName: string;
  teamId?: string;
  teamProfileStatus?: 'pending' | 'approved' | 'rejected';
  rejectReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MessageResponse {
  message: string;
}

export interface LoginResponse { user: CurrentUser; }

export type GoogleLoginResponse = LoginResponse | {
  needsRegistration: true;
  email: string;
  fullName: string;
  registrationTicket: string;
};
