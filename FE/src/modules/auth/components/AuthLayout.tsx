import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { ThemeToggle } from '@/shared/components/ui/theme-toggle';
import { useEffect, useRef } from 'react';

const TABS = [
  { to: '/login', label: 'Đăng nhập' },
  { to: '/register', label: 'Đăng ký' },
];

function PolygonBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight; };
    resize();
    window.addEventListener('resize', resize);
    const pts = Array.from({ length: 55 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
    }));
    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      pts.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 120) {
            ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = `rgba(124,58,237,${0.15 * (1 - d / 120)})`; ctx.lineWidth = 0.8; ctx.stroke();
          }
        }
        ctx.beginPath(); ctx.arc(pts[i].x, pts[i].y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124,58,237,0.4)'; ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

export const AuthLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <main
      className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8"
      style={{ backgroundColor: '#090d16' }}
    >
      {/* Polygon bg */}
      <div className="absolute inset-0 overflow-hidden">
        <PolygonBg />
      </div>

      {/* Theme toggle */}
      <div className="absolute right-6 top-6 z-20">
        <ThemeToggle />
      </div>

      {/* Main grid — pt-32 để nhường chỗ cho cúp tràn lên */}
      <div className="relative z-10 w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center pt-32">

        {/* ===== LEFT CARD ===== */}
        {/* overflow:visible là BẮT BUỘC để cúp tràn lên trên */}
        <div
          className="relative rounded-2xl p-8 shadow-2xl flex flex-col justify-between min-h-[520px]"
          style={{
            background: '#121826',
            border: '1px solid #1e293b',
            overflow: 'visible',
            position: 'relative',
          }}
        >
          {/* TROPHY — absolute, top âm, căn giữa */}
          <div
            className="absolute z-30 pointer-events-none flex justify-center"
            style={{
              top: '-128px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
            }}
          >
            <img
              src="/champion-trophy.png"
              alt="Dragon Trophy"
              className="auth-trophy-float object-contain"
              style={{
                width: '340px',
                filter: 'drop-shadow(0 15px 25px rgba(139,92,246,0.35))',
              }}
            />
          </div>

          {/* Content — pt-36 để không bị cúp đè */}
          <div className="text-center pt-36">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-2">
              Champion League System
            </h1>
            <p className="text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
              Hệ thống quản lý giải đấu esports — vòng bảng, bracket, kết quả trận đấu theo thời gian thực.
            </p>
          </div>

          {/* Features */}
          <div className="space-y-3 my-6">
            <div
              className="flex items-center gap-3 text-sm text-slate-300 p-3 rounded-xl"
              style={{ background: 'rgba(9,13,22,0.5)', border: '1px solid rgba(30,41,59,0.6)' }}
            >
              <svg className="h-4 w-4 shrink-0 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              <span>Quản lý vòng bảng và playoff mượt mà</span>
            </div>
            <div
              className="flex items-center gap-3 text-sm text-slate-300 p-3 rounded-xl"
              style={{ background: 'rgba(9,13,22,0.5)', border: '1px solid rgba(30,41,59,0.6)' }}
            >
              <svg className="h-4 w-4 shrink-0 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>5 vai trò: Admin, Trọng tài, Quản lý đội, Biên tập viên, Khán giả</span>
            </div>
          </div>

          {/* Tech stack */}
          <div
            className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs font-medium"
            style={{ borderTop: '1px solid #1e293b' }}
          >
            {[
              { label: 'TypeScript', color: 'text-sky-400' },
              { label: 'React', color: 'text-cyan-400' },
              { label: 'shadcn/ui', color: 'text-purple-400' },
              { label: 'TailwindCSS', color: 'text-teal-400' },
            ].map((t) => (
              <span
                key={t.label}
                className={`px-2.5 py-1 rounded-md ${t.color}`}
                style={{ background: 'rgba(30,41,59,0.5)' }}
              >
                {t.label}
              </span>
            ))}
          </div>
        </div>

        {/* ===== RIGHT CARD ===== */}
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{ background: '#121826', border: '1px solid #1e293b' }}
        >
          {/* Tab switcher */}
          <div
            className="grid grid-cols-2 p-1.5 rounded-xl mb-8"
            style={{ background: '#090d16', border: '1px solid #1e293b' }}
          >
            {TABS.map((tab) => (
              <button
                key={tab.to}
                type="button"
                onClick={() => navigate(tab.to)}
                className={cn(
                  'py-2.5 text-sm font-semibold rounded-lg transition-all cursor-pointer',
                  location.pathname === tab.to
                    ? 'bg-violet-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Form outlet */}
          <div className="auth-form-enter">
            <Outlet />
          </div>
        </div>

      </div>
    </main>
  );
};
