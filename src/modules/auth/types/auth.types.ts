export interface AuthPayload {
  email: string;
  password: string;
}

export type AccountStatus = 'pending' | 'active' | 'locked' | 'rejected';

export interface TeamRegistrationPayload {
  displayName: string;
  email: string;
  password: string;
  teamName: string;
  teamTag: string;
  teamEmail: string;
  teamPhone: string;
  teamLogo?: string;
  teamDescription?: string;
  teamOrganization?: string;
}

export interface CurrentUser {
  _id: string;
  email: string;
  role: UserRole;
  isEmailVerified: boolean;
  status: AccountStatus;
  loginOtpEnabled: boolean;
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  phone?: string;
  teamId?: string;
  rejectReason?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'referee' | 'teamManager' | 'editor';

export interface MessageResponse {
  message: string;
}

/** `/auth/login` answers with a token, or asks for the emailed OTP when the user enabled it. */
export type LoginResponse = { token: string } | { message: string; requiresOtp: true; email: string };
