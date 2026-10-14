import { http } from '@/shared/api/http';
import type { AuthPayload, CurrentUser, LoginResponse, MessageResponse, TeamRegistrationPayload } from '../types/auth.types';

/** Every function resolves with the response body (not the Axios response). */
export const authApi = {
  /** Đăng ký quản lý đội — gửi thông tin user + đội, server tạo OTP */
  registerTeamManager: (payload: TeamRegistrationPayload) =>
    http.post<MessageResponse>('/auth/register', payload).then((r) => r.data),
  verifyRegisterOtp: (email: string, otp: string) =>
    http.post<MessageResponse>('/auth/register/verify-otp', { email, otp }).then((r) => r.data),
  /** Nộp lại hồ sơ khi bị từ chối */
  resubmitProfile: (payload: Partial<TeamRegistrationPayload>) =>
    http.patch<MessageResponse>('/auth/resubmit', payload).then((r) => r.data),
  login: (payload: AuthPayload) =>
    http.post<LoginResponse>('/auth/login', payload).then((r) => r.data),
  verifyLoginOtp: (email: string, otp: string) =>
    http.post<{ token: string }>('/auth/login/verify-otp', { email, otp }).then((r) => r.data),
  forgotPassword: (email: string) =>
    http.post<MessageResponse>('/auth/forgot-password', { email }).then((r) => r.data),
  resetPassword: (email: string, token: string, newPassword: string) =>
    http.post<MessageResponse>('/auth/reset-password', { email, token, newPassword }).then((r) => r.data),
  getMe: () => http.get<CurrentUser>('/auth/me').then((r) => r.data),
};
