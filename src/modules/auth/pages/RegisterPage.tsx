import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, LockKeyhole, Mail, Phone, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../api/auth.api';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { OtpInput } from '@/shared/components/ui/otp-input';

const registerSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  phone: z.string().min(9, 'Số điện thoại không hợp lệ').max(11, 'Số điện thoại không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine(d => d.password === d.confirmPassword, { message: 'Mật khẩu xác nhận không khớp', path: ['confirmPassword'] });

type FormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({ resolver: zodResolver(registerSchema) });
  const navigate = useNavigate();

  const onRegisterSubmit = handleSubmit(async (values) => {
    setLoading(true);
    try {
      await authApi.register({ email: values.email, password: values.password });
      setEmail(values.email);
      setStep('verify');
      toast.success('Mã OTP đã được gửi đến email của bạn.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Đã có lỗi xảy ra'));
    } finally {
      setLoading(false);
    }
  });

  const onVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      await authApi.verifyRegisterOtp(email, otp);
      toast.success('Xác minh thành công! Bạn có thể đăng nhập ngay.');
      navigate('/login');
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
          <h2 id="auth-title">Xác minh tài khoản</h2>
          <p>Nhập mã 6 chữ số đã gửi đến <strong>{email}</strong></p>
        </div>
        <form className="auth-form" onSubmit={onVerifySubmit}>
          <OtpInput value={otp} onChange={setOtp} />
          <button className="submit-button" type="submit" disabled={otp.length !== 6 || loading}>
            {loading ? 'Đang xác minh...' : 'Xác minh tài khoản'} <LockKeyhole />
          </button>
          <button className="forgot-link" type="button" onClick={() => { setStep('register'); setOtp(''); }}>
            Quay lại đăng ký
          </button>
        </form>
      </>
    );
  }

  return (
    <>
      <div className="auth-heading">
        <div className="mini-badge"><Shield /></div>
        <h2 id="auth-title">Tạo tài khoản mới</h2>
        <p>Đăng ký để tham gia quản lý giải đấu.</p>
      </div>
      <form className="auth-form" onSubmit={onRegisterSubmit}>
        <label htmlFor="email">Email</label>
        <div className="input-wrap">
          <Mail />
          <input id="email" type="email" placeholder="ten@example.com" autoComplete="email" {...register('email')} />
        </div>
        {errors.email && <p className="text-red-400 text-[10px] m-0">{errors.email.message}</p>}

        <label htmlFor="phone">Số điện thoại</label>
        <div className="input-wrap">
          <Phone />
          <input id="phone" type="tel" placeholder="0912 345 678" {...register('phone')} />
        </div>
        {errors.phone && <p className="text-red-400 text-[10px] m-0">{errors.phone.message}</p>}

        <label htmlFor="password">Mật khẩu</label>
        <div className="input-wrap">
          <KeyRound />
          <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Ít nhất 6 ký tự" autoComplete="new-password" {...register('password')} />
          <button className="password-toggle" type="button" onClick={() => setShowPassword(v => !v)}>
            {showPassword ? <EyeOff /> : <Eye />}
          </button>
        </div>
        {errors.password && <p className="text-red-400 text-[10px] m-0">{errors.password.message}</p>}

        <label htmlFor="confirmPassword">Xác nhận mật khẩu</label>
        <div className="input-wrap">
          <KeyRound />
          <input id="confirmPassword" type="password" placeholder="Nhập lại mật khẩu" {...register('confirmPassword')} />
        </div>
        {errors.confirmPassword && <p className="text-red-400 text-[10px] m-0">{errors.confirmPassword.message}</p>}

        <button className="submit-button" type="submit" disabled={loading}>
          {loading ? 'Đang đăng ký...' : 'Đăng ký và gửi OTP'} <LockKeyhole />
        </button>
      </form>
    </>
  );
};
