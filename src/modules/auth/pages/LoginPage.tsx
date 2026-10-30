import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, GitBranch, KeyRound, LockKeyhole, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../api/auth.api';
import { useSetCurrentUser } from '../hooks/use-current-user';
import { getApiErrorMessage } from '@/shared/api/api-error';

const loginSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});
type FormValues = z.infer<typeof loginSchema>;

type GoogleCredentialResponse = { credential: string };
type GoogleAccounts = { id: { initialize: (options: { client_id: string; callback: (response: GoogleCredentialResponse) => void }) => void; renderButton: (element: HTMLElement, options: { theme: string; size: string; width: number }) => void } };

declare global {
  interface Window { google?: { accounts: GoogleAccounts } }
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined;

export const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const googleButton = useRef<HTMLDivElement>(null);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(loginSchema) });
  const navigate = useNavigate();
  const setCurrentUser = useSetCurrentUser();

  const finishGoogleLogin = async (credential: string) => {
    setLoading(true);
    try {
      const response = await authApi.googleLogin(credential);
      if ('needsRegistration' in response) {
        navigate('/register', { state: { googleRegistration: response } });
        return;
      }
      setCurrentUser(response.user);
      toast.success('Đăng nhập thành công.');
      
      // Redirect dựa theo role
      switch (response.user.role) {
        case 'admin':
          navigate('/admin/accounts');
          break;
        case 'referee':
          navigate('/referee/dashboard');
          break;
        case 'editor':
          navigate('/editor/recordings');
          break;
        case 'teamManager':
          navigate('/team/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Không thể đăng nhập bằng Google'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!googleClientId || !googleButton.current) return;
    const render = () => {
      if (!window.google || !googleButton.current) return;
      window.google.accounts.id.initialize({ client_id: googleClientId, callback: (response) => void finishGoogleLogin(response.credential) });
      window.google.accounts.id.renderButton(googleButton.current, { theme: 'outline', size: 'large', width: 280 });
    };
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-identity]');
    if (existing) {
      existing.addEventListener('load', render, { once: true });
      if (window.google) render();
      return () => existing.removeEventListener('load', render);
    }
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.dataset.googleIdentity = 'true';
    script.addEventListener('load', render, { once: true });
    document.head.appendChild(script);
    return () => script.removeEventListener('load', render);
  }, []);

  const onLoginSubmit = handleSubmit(async (values) => {
    setLoading(true);
    try {
      const { user } = await authApi.login(values);
      setCurrentUser(user);
      toast.success('Đăng nhập thành công.');
      
      // Redirect dựa theo role
      switch (user.role) {
        case 'admin':
          navigate('/admin/accounts');
          break;
        case 'referee':
          navigate('/referee/dashboard');
          break;
        case 'editor':
          navigate('/editor/recordings');
          break;
        case 'teamManager':
          navigate('/team/dashboard');
          break;
        default:
          navigate('/');
      }
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Đã có lỗi xảy ra'));
    } finally {
      setLoading(false);
    }
  });

  return (
    <>
      <div className="auth-heading">
        <div className="mini-badge"><Shield /></div>
        <h2 id="auth-title">Chào mừng trở lại</h2>
        <p>Nhập thông tin tài khoản để tiếp tục.</p>
      </div>
      <form className="auth-form" onSubmit={onLoginSubmit}>
        <label htmlFor="email">Email</label>
        <div className="input-wrap"><Mail /><input id="email" type="email" placeholder="ten.nam.vu@example.com" autoComplete="email" {...register('email')} /></div>
        {errors.email && <p className="text-red-400 text-[10px] m-0">{errors.email.message}</p>}
        <label htmlFor="password">Mật khẩu</label>
        <div className="input-wrap">
          <KeyRound /><input id="password" type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu của bạn" autoComplete="current-password" {...register('password')} />
          <button className="password-toggle" type="button" onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>{showPassword ? <EyeOff /> : <Eye />}</button>
        </div>
        {errors.password && <p className="text-red-400 text-[10px] m-0">{errors.password.message}</p>}
        <button className="forgot-link" type="button" onClick={() => navigate('/forgot-password')}>Quên mật khẩu?</button>
        <button className="submit-button" type="submit" disabled={loading}>{loading ? 'Đang đăng nhập...' : 'Đăng nhập'} <LockKeyhole /></button>
      </form>
      <div className="divider"><span>Đăng nhập nhanh với</span></div>
      {googleClientId ? <div ref={googleButton} className="flex justify-center" /> : <p className="text-center text-xs text-muted-foreground">Google sign-in chưa được cấu hình.</p>}
      <div className="social-row"><button type="button" className="social-button" onClick={() => toast.info('Tính năng đang phát triển')}><GitBranch /> GitHub</button></div>
    </>
  );
};
