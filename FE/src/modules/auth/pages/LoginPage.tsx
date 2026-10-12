import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, GitBranch, KeyRound, LockKeyhole, Mail, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../api/auth.api';
import { tokenStore } from '../store/token.store';
import { getApiErrorBody, getApiErrorMessage } from '@/shared/api/api-error';
import { OtpInput } from '@/shared/components/ui/otp-input';

const loginSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});
type FormValues = z.infer<typeof loginSchema>;

export const LoginPage = () => {
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(loginSchema) });
  const navigate = useNavigate();

  const onLoginSubmit = handleSubmit(async (values) => {
    setLoading(true);
    try {
      const response = await authApi.login({ email: values.email, password: values.password });
      if ('token' in response) {
        tokenStore.set(response.token);
        toast.success('Đăng nhập thành công.');
        navigate('/');
        return;
      }
      setEmail(values.email);
      setStep('verify');
      toast.success('Mã OTP đã được gửi đến email của bạn.');
    } catch (error) {
      const body = getApiErrorBody(error);
      if (body?.requiresOtp) {
        setEmail(body.email ?? values.email);
        setStep('verify');
        toast.info('Yêu cầu OTP. Vui lòng kiểm tra email.');
      } else {
        toast.error(body?.message ?? 'Đã có lỗi xảy ra');
      }
    } finally {
      setLoading(false);
    }
  });

  const onVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      const response = await authApi.verifyLoginOtp(email, otp);
      tokenStore.set(response.token);
      toast.success('Đăng nhập thành công.');
      navigate('/');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Mã OTP không hợp lệ'));
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'verify') {
    return (
      <>
        <div className="auth-heading">
          <h2 id="auth-title">Xác minh OTP</h2>
          <p>Nhập mã 6 chữ số đã gửi đến <strong>{email}</strong></p>
        </div>
        <form className="auth-form" onSubmit={onVerifySubmit}>
          <OtpInput value={otp} onChange={setOtp} />
          <button className="submit-button" type="submit" disabled={otp.length !== 6 || loading}>
            {loading ? 'Đang xác minh...' : 'Xác minh và đăng nhập'} <LockKeyhole />
          </button>
          <button className="forgot-link" type="button" onClick={() => { setStep('login'); setOtp(''); }}>
            Quay lại đăng nhập
          </button>
        </form>
      </>
    );
  }

  return (
    <>
      <div className="auth-heading">
        <div className="mini-badge"><Shield /></div>
        <h2 id="auth-title">Chào mừng trở lại</h2>
        <p>Nhập thông tin tài khoản để tiếp tục.</p>
      </div>
      <form className="auth-form" onSubmit={onLoginSubmit}>
        <label htmlFor="email">Email</label>
        <div className="input-wrap">
          <Mail />
          <input id="email" type="email" placeholder="ten.nam.vu@example.com" autoComplete="email" {...register('email')} />
        </div>
        {errors.email && <p style={{ color: '#f87171', fontSize: 10, margin: 0 }}>{errors.email.message}</p>}

        <label htmlFor="password">Mật khẩu</label>
        <div className="input-wrap">
          <KeyRound />
          <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Mật khẩu của bạn" autoComplete="current-password" {...register('password')} />
          <button className="password-toggle" type="button" onClick={() => setShowPassword(v => !v)} aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}>
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.password && <p style={{ color: '#f87171', fontSize: 10, margin: 0 }}>{errors.password.message}</p>}

        <button className="forgot-link" type="button" onClick={() => navigate('/forgot-password')}>Quên mật khẩu?</button>

        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? 'Đang đăng nhập...' : 'Đăng nhập'} <LockKeyhole />
        </button>
      </form>

      <div className="divider"><span>Đăng nhập nhanh với</span></div>
      <div className="social-row">
        <button type="button" className="social-button" onClick={() => toast.info('Tính năng đang phát triển')}>
          <span className="google-g">G</span> Google
        </button>
        <button type="button" className="social-button" onClick={() => toast.info('Tính năng đang phát triển')}>
          <GitBranch /> GitHub
        </button>
      </div>
      <p className="terms">Bằng việc tiếp tục, bạn đồng ý với <button type="button">Điều khoản sử dụng</button> và <button type="button">Chính sách bảo mật</button>.</p>
    </>
  );
};
