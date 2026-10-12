import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { KeyRound, Loader2, Mail } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../api/auth.api';
import { tokenStore } from '../store/token.store';
import { getApiErrorBody, getApiErrorMessage } from '@/shared/api/api-error';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { OtpInput } from '@/shared/components/ui/otp-input';

const loginSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

type FormValues = z.infer<typeof loginSchema>;

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.729.083-.729 1.205.084 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.898-.015 3.293 0 .322.216.694.825.576C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export const LoginPage = () => {
  const [step, setStep] = useState<'login' | 'verify'>('login');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
  });
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
      <div className="space-y-5">
        <div>
          <h2 className="text-2xl font-bold text-white">Xác minh OTP</h2>
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
            Xác minh và đăng nhập
          </Button>
          <button
            type="button"
            onClick={() => { setStep('login'); setOtp(''); }}
            className="block w-full text-center text-sm text-white/40 transition hover:text-white/70"
          >
            Quay lại đăng nhập
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-white">Chào mừng trở lại</h2>
        <p className="mt-1 text-sm text-white/50">Nhập thông tin tài khoản để tiếp tục.</p>
      </div>

      <form className="space-y-4" onSubmit={onLoginSubmit}>
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-white/70">Email</Label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
            <Input
              id="email"
              className="auth-input pl-9"
              placeholder="ten.nam.vu@example.com"
              {...register('email')}
            />
          </div>
          {errors.email && <p className="text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-white/70">Mật khẩu</Label>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors"
            >
              Quên mật khẩu?
            </button>
          </div>
          <div className="relative">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/30" />
            <Input
              id="password"
              className="auth-input pl-9"
              type="password"
              placeholder="Mật khẩu của bạn"
              {...register('password')}
            />
          </div>
          {errors.password && <p className="text-xs text-red-400">{errors.password.message}</p>}
        </div>

        <Button
          className="w-full bg-violet-600 hover:bg-violet-700 text-white font-semibold py-2.5 transition-all duration-200"
          type="submit"
          disabled={loading}
        >
          {loading && <Loader2 className="size-4 animate-spin" />}
          Đăng nhập
        </Button>
      </form>

      <div className="relative flex items-center gap-3">
        <span className="h-px flex-1 bg-white/10" />
        <span className="text-xs text-white/30">Đăng nhập nhanh với</span>
        <span className="h-px flex-1 bg-white/10" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => toast.info('Tính năng đang phát triển')}
          className="auth-social-btn flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
            <path fill="#EA4335" d="M5.266 9.765A7.077 7.077 0 0 1 12 4.909c1.69 0 3.218.6 4.418 1.582L19.91 3C17.782 1.145 15.055 0 12 0 7.27 0 3.198 2.698 1.24 6.65l4.026 3.115Z" />
            <path fill="#34A853" d="M16.04 18.013c-1.09.703-2.474 1.078-4.04 1.078a7.077 7.077 0 0 1-6.723-4.823l-4.04 3.067A11.965 11.965 0 0 0 12 24c2.933 0 5.735-1.043 7.834-3l-3.793-2.987Z" />
            <path fill="#4A90D9" d="M19.834 21c2.195-2.048 3.62-5.096 3.62-9 0-.71-.109-1.473-.272-2.182H12v4.637h6.436c-.317 1.559-1.17 2.766-2.395 3.558L19.834 21Z" />
            <path fill="#FBBC05" d="M5.277 14.268A7.12 7.12 0 0 1 4.909 12c0-.782.125-1.533.357-2.235L1.24 6.65A11.934 11.934 0 0 0 0 12c0 1.92.445 3.73 1.237 5.335l4.04-3.067Z" />
          </svg>
          Google
        </button>
        <button
          type="button"
          onClick={() => toast.info('Tính năng đang phát triển')}
          className="auth-social-btn flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 py-2.5 text-sm font-medium text-white/70 transition hover:bg-white/10 hover:text-white"
        >
          <GitHubIcon />
          GitHub
        </button>
      </div>
    </div>
  );
};
