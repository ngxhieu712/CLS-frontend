import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, KeyRound, LockKeyhole, Mail, Phone, Shield, User, Users } from 'lucide-react';
import { toast } from 'sonner';
import { authApi } from '../api/auth.api';
import { getApiErrorMessage } from '@/shared/api/api-error';
import { OtpInput } from '@/shared/components/ui/otp-input';

// ─── Bước 1: thông tin cá nhân ───────────────────────────────────────────
const step1Schema = z.object({
  displayName:     z.string().min(2, 'Họ tên ít nhất 2 ký tự'),
  email:           z.string().min(1, 'Email là bắt buộc').email('Email không hợp lệ'),
  password:        z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  confirmPassword: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Mật khẩu xác nhận không khớp',
  path: ['confirmPassword'],
});

// ─── Bước 2: thông tin đội ────────────────────────────────────────────────
const step2Schema = z.object({
  teamName:         z.string().min(2, 'Tên đội ít nhất 2 ký tự'),
  teamTag:          z.string().min(2, 'Tag 2–5 ký tự').max(5, 'Tag tối đa 5 ký tự'),
  teamEmail:        z.string().email('Email đội không hợp lệ'),
  teamPhone:        z.string().min(9, 'SĐT không hợp lệ').max(11, 'SĐT không hợp lệ'),
  teamOrganization: z.string().optional(),
});

type Step1Values = z.infer<typeof step1Schema>;
type Step2Values = z.infer<typeof step2Schema>;

export const RegisterPage = () => {
  const [step, setStep]       = useState<'info' | 'team' | 'otp'>('info');
  const [step1Data, setStep1] = useState<Step1Values | null>(null);
  const [email, setEmail]     = useState('');
  const [otp, setOtp]         = useState('');
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw]   = useState(false);
  const navigate = useNavigate();

  const form1 = useForm<Step1Values>({ resolver: zodResolver(step1Schema) });
  const form2 = useForm<Step2Values>({ resolver: zodResolver(step2Schema) });

  // ── Bước 1 xong ───────────────────────────────────────────────────────
  const onStep1 = form1.handleSubmit((values) => {
    setStep1(values);
    setEmail(values.email);
    setStep('team');
  });

  // ── Bước 2 xong — gửi API ─────────────────────────────────────────────
  const onStep2 = form2.handleSubmit(async (teamValues) => {
    if (!step1Data) return;
    setLoading(true);
    try {
      await authApi.registerTeamManager({
        displayName:     step1Data.displayName,
        email:           step1Data.email,
        password:        step1Data.password,
        teamName:        teamValues.teamName,
        teamTag:         teamValues.teamTag.toUpperCase(),
        teamEmail:       teamValues.teamEmail,
        teamPhone:       teamValues.teamPhone,
        teamOrganization:teamValues.teamOrganization,
      });
      setStep('otp');
      toast.success('Mã OTP đã được gửi đến Gmail của bạn.');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Đã có lỗi xảy ra'));
    } finally {
      setLoading(false);
    }
  });

  // ── Bước 3 — xác minh OTP ────────────────────────────────────────────
  const onVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) return;
    setLoading(true);
    try {
      await authApi.verifyRegisterOtp(email, otp);
      toast.success('Đăng ký thành công! Hồ sơ đội đang chờ admin duyệt.');
      navigate('/login');
    } catch (error) {
      toast.error(getApiErrorMessage(error, 'Mã OTP không hợp lệ'));
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  // ── OTP step ────────────────────────────────────────────────────────
  if (step === 'otp') {
    return (
      <>
        <div className="auth-heading">
          <h2 id="auth-title">Xác minh tài khoản</h2>
          <p>Nhập mã 6 chữ số đã gửi đến <strong>{email}</strong></p>
        </div>
        <form className="auth-form" onSubmit={onVerify}>
          <OtpInput value={otp} onChange={setOtp} />
          <button className="submit-button" type="submit" disabled={otp.length !== 6 || loading}>
            {loading ? 'Đang xác minh...' : 'Xác minh'} <LockKeyhole />
          </button>
          <button className="forgot-link" type="button" onClick={() => { setStep('team'); setOtp(''); }}>
            ← Quay lại
          </button>
        </form>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 mt-2 text-xs text-amber-400">
          Sau khi xác minh, hồ sơ đội sẽ gửi cho admin duyệt. Bạn sẽ nhận email khi được duyệt.
        </div>
      </>
    );
  }

  // ── Bước 2: thông tin đội ────────────────────────────────────────────
  if (step === 'team') {
    return (
      <>
        <div className="auth-heading">
          <div className="mini-badge"><Users /></div>
          <h2 id="auth-title">Thông tin đội</h2>
          <p>Bước 2/2 — Thông tin đội tham dự giải đấu</p>
        </div>
        <form className="auth-form" onSubmit={onStep2}>
          <label htmlFor="teamName">Tên đội *</label>
          <div className="input-wrap">
            <Shield />
            <input id="teamName" type="text" placeholder="VD: Team Alpha" {...form2.register('teamName')} />
          </div>
          {form2.formState.errors.teamName && <p className="text-red-400 text-[10px] m-0">{form2.formState.errors.teamName.message}</p>}

          <label htmlFor="teamTag">Tag đội * (2–5 ký tự)</label>
          <div className="input-wrap">
            <Shield />
            <input id="teamTag" type="text" placeholder="VD: ALF" maxLength={5}
              {...form2.register('teamTag')}
              onChange={e => form2.setValue('teamTag', e.target.value.toUpperCase())} />
          </div>
          {form2.formState.errors.teamTag && <p className="text-red-400 text-[10px] m-0">{form2.formState.errors.teamTag.message}</p>}

          <label htmlFor="teamEmail">Email liên hệ đội *</label>
          <div className="input-wrap">
            <Mail />
            <input id="teamEmail" type="email" placeholder="team@example.com" {...form2.register('teamEmail')} />
          </div>
          {form2.formState.errors.teamEmail && <p className="text-red-400 text-[10px] m-0">{form2.formState.errors.teamEmail.message}</p>}

          <label htmlFor="teamPhone">SĐT liên hệ *</label>
          <div className="input-wrap">
            <Phone />
            <input id="teamPhone" type="tel" placeholder="0912 345 678" {...form2.register('teamPhone')} />
          </div>
          {form2.formState.errors.teamPhone && <p className="text-red-400 text-[10px] m-0">{form2.formState.errors.teamPhone.message}</p>}

          <label htmlFor="teamOrg">Tổ chức / Câu lạc bộ (tùy chọn)</label>
          <div className="input-wrap">
            <Users />
            <input id="teamOrg" type="text" placeholder="VD: Esports Club XYZ" {...form2.register('teamOrganization')} />
          </div>

          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? 'Đang gửi...' : 'Gửi hồ sơ & nhận OTP'} <LockKeyhole />
          </button>
          <button className="forgot-link" type="button" onClick={() => setStep('info')}>
            ← Quay lại bước 1
          </button>
        </form>
      </>
    );
  }

  // ── Bước 1: thông tin cá nhân ─────────────────────────────────────────
  return (
    <>
      <div className="auth-heading">
        <div className="mini-badge"><Shield /></div>
        <h2 id="auth-title">Đăng ký quản lý đội</h2>
        <p>Bước 1/2 — Thông tin tài khoản cá nhân</p>
      </div>
      <form className="auth-form" onSubmit={onStep1}>
        <label htmlFor="displayName">Họ và tên *</label>
        <div className="input-wrap">
          <User />
          <input id="displayName" type="text" placeholder="Nguyễn Văn A" autoComplete="name" {...form1.register('displayName')} />
        </div>
        {form1.formState.errors.displayName && <p className="text-red-400 text-[10px] m-0">{form1.formState.errors.displayName.message}</p>}

        <label htmlFor="email">Gmail *</label>
        <div className="input-wrap">
          <Mail />
          <input id="email" type="email" placeholder="ten@gmail.com" autoComplete="email" {...form1.register('email')} />
        </div>
        {form1.formState.errors.email && <p className="text-red-400 text-[10px] m-0">{form1.formState.errors.email.message}</p>}

        <label htmlFor="password">Mật khẩu *</label>
        <div className="input-wrap">
          <KeyRound />
          <input id="password" type={showPw ? 'text' : 'password'} placeholder="Ít nhất 6 ký tự" autoComplete="new-password" {...form1.register('password')} />
          <button className="password-toggle" type="button" onClick={() => setShowPw(v => !v)} aria-label={showPw ? 'Ẩn' : 'Hiện'}>
            {showPw ? <Eye /> : <EyeOff />}
          </button>
        </div>
        {form1.formState.errors.password && <p className="text-red-400 text-[10px] m-0">{form1.formState.errors.password.message}</p>}

        <label htmlFor="confirmPassword">Xác nhận mật khẩu *</label>
        <div className="input-wrap">
          <KeyRound />
          <input id="confirmPassword" type="password" placeholder="Nhập lại mật khẩu" {...form1.register('confirmPassword')} />
        </div>
        {form1.formState.errors.confirmPassword && <p className="text-red-400 text-[10px] m-0">{form1.formState.errors.confirmPassword.message}</p>}

        <button className="submit-button" type="submit">
          Tiếp theo — Thông tin đội →
        </button>
      </form>
      <p className="terms">Đăng ký công khai chỉ dành cho <strong>quản lý đội</strong>. Trọng tài và biên tập viên được admin tạo sẵn.</p>
    </>
  );
};
