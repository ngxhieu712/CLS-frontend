import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Loader2, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../api/auth.api';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { OtpInput } from '@/shared/components/ui/otp-input';

const registerSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  phone: z.string().min(9, 'Số điện thoại không hợp lệ').max(11, 'Số điện thoại không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

type FormValues = z.infer<typeof registerSchema>;

export const RegisterPage = () => {
  const [step, setStep] = useState<'register' | 'verify'>('register');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
  });
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
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-white">Xác minh tài khoản</h2>
          <p className="mt-1 text-sm text-white/50">
            Nhập mã 6 chữ số đã gửi đến <span className="font-medium text-white/80">{email}</span>
          </p>
        </div>
        <form className="space-y-4" onSubmit={onVerifySubmit}>
          <OtpInput value={otp} onChange={setOtp} />
          <Button
            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold"
            type="submit"
            disabled={otp.length !== 6 || loading}
          >
            {loading && <Loader2 className="size-4 animate-spin" />}
            Xác minh tài khoản
          </Button>
          <button
            type="button"
            onClick={() => { setStep('register'); setOtp(''); }}
            className="block w-full text-center text-sm text-white/40 transition hover:text-white/70"
          >
            Quay lại đăng ký
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold text-white">Tạo tài khoản</h2>
        <p className="mt-1 text-sm text-white/50">Đăng ký để tham gia hệ thống giải đấu.</p>
      </div>

      <form className="space-y-3" onSubmit={onRegisterSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-white/70">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
            <Input
              id="email"
              className="auth-input pl-9"
              placeholder="ten@example.com"
              {...register('email')}
            />
          </div>
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-white/70">Số điện thoại</Label>
          <div className="relative">
            <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
            <Input
              id="phone"
              className="auth-input pl-9"
              placeholder="0912 345 678"
              type="tel"
              {...register('phone')}
            />
          </div>
          {errors.phone && <p className="text-xs text-red-400">{errors.phone.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="password" className="text-white/70">Mật khẩu</Label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
            <Input
              id="password"
              className="auth-input pl-9"
              type="password"
              placeholder="Ít nhất 6 ký tự"
              {...register('password')}
            />
          </div>
          {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="confirmPassword" className="text-white/70">Xác nhận mật khẩu</Label>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
            <Input
              id="confirmPassword"
              className="auth-input pl-9"
              type="password"
              placeholder="Nhập lại mật khẩu"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && <p className="text-xs text-red-400">{errors.confirmPassword.message}</p>}
        </div>

        <Button
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 transition-all duration-200"
          type="submit"
          disabled={loading}
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          Đăng ký và gửi OTP
        </Button>
      </form>
    </div>
  );
};
