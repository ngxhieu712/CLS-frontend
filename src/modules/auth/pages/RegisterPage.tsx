import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLocation, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, LockKeyhole, Mail, Phone, Shield, User, Users } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../api/auth.api';
import type { GoogleLoginResponse } from '../types/auth.types';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { OtpInput } from '@/shared/components/ui/otp-input';

const personalSchema = z.object({
  fullName: z.string().trim().min(2, 'Họ tên ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu ít nhất 8 ký tự'),
  confirmPassword: z.string(),
}).refine((value) => value.password === value.confirmPassword, { message: 'Mật khẩu xác nhận không khớp', path: ['confirmPassword'] });

const teamSchema = z.object({
  name: z.string().trim().min(2, 'Tên đội ít nhất 2 ký tự'),
  tag: z.string().trim().min(2, 'Tag ít nhất 2 ký tự').max(10, 'Tag tối đa 10 ký tự'),
  contactEmail: z.string().email('Email đội không hợp lệ'),
  contactPhone: z.string().min(7, 'SĐT không hợp lệ').max(20, 'SĐT không hợp lệ'),
  organization: z.string().optional(),
});
type PersonalValues = z.infer<typeof personalSchema>;
type TeamValues = z.infer<typeof teamSchema>;
type GoogleRegistration = Extract<GoogleLoginResponse, { needsRegistration: true }>;

export const RegisterPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const googleRegistration = (location.state as { googleRegistration?: GoogleRegistration } | null)?.googleRegistration;
  const [step, setStep] = useState<'personal' | 'team' | 'otp'>(googleRegistration ? 'team' : 'personal');
  const [personal, setPersonal] = useState<PersonalValues | null>(googleRegistration ? { fullName: googleRegistration.fullName, email: googleRegistration.email, password: '', confirmPassword: '' } : null);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const personalForm = useForm<PersonalValues>({ resolver: zodResolver(personalSchema), defaultValues: personal ?? undefined });
  const teamForm = useForm<TeamValues>({ resolver: zodResolver(teamSchema) });

  const beginTeamDetails = personalForm.handleSubmit((values) => { setPersonal(values); setStep('team'); });
  const submitTeam = teamForm.handleSubmit(async (team) => {
    if (!personal) return;
    setLoading(true);
    try {
      const normalizedTeam = { ...team, tag: team.tag.toUpperCase() };
      if (googleRegistration) {
        await authApi.completeGoogleRegistration(googleRegistration.registrationTicket, normalizedTeam);
        toast.success('Hồ sơ đội đang chờ admin duyệt.');
        navigate('/login', { replace: true });
      } else {
        await authApi.registerTeamManager({ fullName: personal.fullName, email: personal.email, password: personal.password, team: normalizedTeam });
        setStep('otp');
        toast.success('Mã OTP đã được gửi đến Gmail của bạn.');
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Đã có lỗi xảy ra'));
    } finally { setLoading(false); }
  });
  const verifyOtp = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!personal || otp.length !== 6) return;
    setLoading(true);
    try {
      await authApi.verifyRegisterOtp(personal.email, otp);
      toast.success('Hồ sơ đội đang chờ admin duyệt.');
      navigate('/login');
    } catch (error) { toast.error(getApiErrorMessage(error, 'Mã OTP không hợp lệ')); setOtp(''); }
    finally { setLoading(false); }
  };

  if (step === 'otp') return <><div className="auth-heading"><h2>Xác minh tài khoản</h2><p>Nhập mã 6 chữ số đã gửi đến <strong>{personal?.email}</strong></p></div><form className="auth-form" onSubmit={verifyOtp}><OtpInput value={otp} onChange={setOtp} /><button className="submit-button" type="submit" disabled={otp.length !== 6 || loading}>{loading ? 'Đang xác minh...' : 'Xác minh'} <LockKeyhole /></button></form></>;

  if (step === 'team') return <>
    <div className="auth-heading"><div className="mini-badge"><Users /></div><h2>Thông tin đội</h2><p>{googleRegistration ? `Đăng ký bằng Google: ${googleRegistration.email}` : 'Bước 2/2 — Thông tin đội tham dự giải đấu'}</p></div>
    <form className="auth-form" onSubmit={submitTeam}>
      <label htmlFor="name">Tên đội *</label><div className="input-wrap"><Shield /><input id="name" {...teamForm.register('name')} /></div>{teamForm.formState.errors.name && <p className="text-red-400 text-[10px] m-0">{teamForm.formState.errors.name.message}</p>}
      <label htmlFor="tag">Tag đội *</label><div className="input-wrap"><Shield /><input id="tag" maxLength={10} {...teamForm.register('tag')} /></div>{teamForm.formState.errors.tag && <p className="text-red-400 text-[10px] m-0">{teamForm.formState.errors.tag.message}</p>}
      <label htmlFor="contactEmail">Email liên hệ *</label><div className="input-wrap"><Mail /><input id="contactEmail" type="email" {...teamForm.register('contactEmail')} /></div>{teamForm.formState.errors.contactEmail && <p className="text-red-400 text-[10px] m-0">{teamForm.formState.errors.contactEmail.message}</p>}
      <label htmlFor="contactPhone">SĐT liên hệ *</label><div className="input-wrap"><Phone /><input id="contactPhone" {...teamForm.register('contactPhone')} /></div>{teamForm.formState.errors.contactPhone && <p className="text-red-400 text-[10px] m-0">{teamForm.formState.errors.contactPhone.message}</p>}
      <label htmlFor="organization">Tổ chức / Câu lạc bộ</label><div className="input-wrap"><Users /><input id="organization" {...teamForm.register('organization')} /></div>
      <button className="submit-button" type="submit" disabled={loading}>{loading ? 'Đang gửi...' : googleRegistration ? 'Gửi hồ sơ' : 'Gửi hồ sơ & nhận OTP'} <LockKeyhole /></button>
      {!googleRegistration && <button className="forgot-link" type="button" onClick={() => setStep('personal')}>← Quay lại</button>}
    </form>
  </>;

  return <>
    <div className="auth-heading"><div className="mini-badge"><Shield /></div><h2>Đăng ký quản lý đội</h2><p>Bước 1/2 — Thông tin tài khoản cá nhân</p></div>
    <form className="auth-form" onSubmit={beginTeamDetails}>
      <label htmlFor="fullName">Họ và tên *</label><div className="input-wrap"><User /><input id="fullName" autoComplete="name" {...personalForm.register('fullName')} /></div>{personalForm.formState.errors.fullName && <p className="text-red-400 text-[10px] m-0">{personalForm.formState.errors.fullName.message}</p>}
      <label htmlFor="email">Gmail *</label><div className="input-wrap"><Mail /><input id="email" type="email" autoComplete="email" {...personalForm.register('email')} /></div>{personalForm.formState.errors.email && <p className="text-red-400 text-[10px] m-0">{personalForm.formState.errors.email.message}</p>}
      <label htmlFor="password">Mật khẩu *</label><div className="input-wrap"><KeyRound /><input id="password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" {...personalForm.register('password')} /><button className="password-toggle" type="button" onClick={() => setShowPassword((value) => !value)}>{showPassword ? <Eye /> : <EyeOff />}</button></div>{personalForm.formState.errors.password && <p className="text-red-400 text-[10px] m-0">{personalForm.formState.errors.password.message}</p>}
      <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label><div className="input-wrap"><KeyRound /><input id="confirmPassword" type="password" {...personalForm.register('confirmPassword')} /></div>{personalForm.formState.errors.confirmPassword && <p className="text-red-400 text-[10px] m-0">{personalForm.formState.errors.confirmPassword.message}</p>}
      <button className="submit-button" type="submit">Tiếp theo — Thông tin đội →</button>
    </form>
  </>;
};
