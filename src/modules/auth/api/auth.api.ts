import { http } from '@/shared/api/http';
import type { AuthPayload, CurrentUser, GoogleLoginResponse, LoginResponse, MessageResponse, TeamProfileInput, TeamRegistrationPayload } from '../types/auth.types';

/** Every function resolves with the response body (not the Axios response). */
export const authApi = {
  /** Đăng ký quản lý đội — gửi thông tin user + đội, server tạo OTP */
  registerTeamManager: (payload: TeamRegistrationPayload) =>
    http.post<MessageResponse>('/auth/register', payload).then((r) => r.data),
  verifyRegisterOtp: (email: string, otp: string) =>
    http.post<MessageResponse>('/auth/register/verify-otp', { email, otp }).then((r) => r.data),
  /** Nộp lại hồ sơ khi bị từ chối */
  resubmitProfile: (payload: Partial<TeamProfileInput>) =>
    http.patch<MessageResponse>('/auth/resubmit', payload).then((r) => r.data),
  login: (payload: AuthPayload) =>
    http.post<LoginResponse>('/auth/login', payload).then((r) => r.data),
  googleLogin: (idToken: string) =>
    http.post<GoogleLoginResponse>('/auth/google', { idToken }).then((r) => r.data),
  completeGoogleRegistration: (registrationTicket: string, team: TeamProfileInput) =>
    http.post<MessageResponse>('/auth/google/register', { registrationTicket, team }).then((r) => r.data),
  forgotPassword: (email: string) =>
    http.post<MessageResponse>('/auth/forgot-password', { email }).then((r) => r.data),
  resetPassword: (email: string, otp: string, newPassword: string) =>
    http.post<MessageResponse>('/auth/reset-password', { email, otp, newPassword }).then((r) => r.data),
  getMe: () => http.get<CurrentUser>('/auth/me').then((r) => r.data),
  logout: () => http.post('/auth/logout').then(() => undefined),
};
