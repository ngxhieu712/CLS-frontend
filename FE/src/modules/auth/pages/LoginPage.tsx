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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
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
      <Card>
        <CardHeader className="text-center">
          <CardTitle>Xác minh OTP</CardTitle>
          <CardDescription>
            Nhập mã 6 chữ số đã gửi đến <span className="font-medium text-foreground">{email}</span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={onVerifySubmit}>
            <OtpInput value={otp} onChange={setOtp} />
            <Button className="w-full" type="submit" disabled={otp.length !== 6 || loading}>
              {loading && <Loader2 className="size-4 animate-spin" />}
              Xác minh và đăng nhập
            </Button>
            <button
              type="button"
              onClick={() => { setStep('login'); setOtp(''); }}
              className="block w-full text-center text-sm text-muted-foreground transition hover:text-foreground"
            >
              Quay lại đăng nhập
            </button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Chào mừng trở lại</CardTitle>
        <CardDescription>Nhập thông tin tài khoản để tiếp tục.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onLoginSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" className="pl-9" placeholder="ten@example.com" {...register('email')} />
            </div>
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <div className="relative">
              <KeyRound className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" className="pl-9" type="password" placeholder="Nhập mật khẩu" {...register('password')} />
            </div>
            {errors.password && <p className="text-xs text-destructive">{errors.password.message}</p>}
          </div>

          <Button className="w-full" type="submit" disabled={loading}>
            {loading && <Loader2 className="size-4 animate-spin" />}
            Đăng nhập
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
