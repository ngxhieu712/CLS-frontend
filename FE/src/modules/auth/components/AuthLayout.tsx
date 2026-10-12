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
    <main className="relative flex min-h-screen w-full items-center justify-center bg-[#090d16] p-4 md:p-8">
      {/* Polygon bg */}
      <div className="absolute inset-0 overflow-hidden">
        <PolygonBg />
      </div>

      {/* Theme toggle */}
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <section className="relative z-10 grid w-full max-w-5xl gap-8 pt-20 md:grid-cols-2 md:pt-24">

        {/* LEFT CARD — overflow:visible để cúp tràn lên trên */}
        <div
          className="relative rounded-2xl border border-[#1e293b] bg-[#121826] px-8 pb-8 pt-28"
          style={{ overflow: 'visible' }}
        >
          {/* Trophy — absolute, top âm để tràn lên trên viền card */}
          <img
            src="/champion-trophy.png"
            alt="Champion Trophy"
            className="auth-trophy-float absolute z-20"
            style={{
              top: '-90px',
              left: '0',
              right: '0',
              margin: '0 auto',
              width: '80%',
              maxWidth: '340px',
              filter: 'drop-shadow(0 0 40px rgba(251,146,60,0.65))',
            }}
          />

          {/* Content */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Champion League System</h1>
            <p className="mt-2 text-sm text-white/60">
              Hệ thống quản lý giải đấu esports — vòng bảng, bracket, kết quả trận đấu theo thời gian thực.
            </p>
            <ul className="mt-5 space-y-2 text-left text-sm text-white/55">
              <li className="flex items-center gap-2">
                <span className="size-1.5 shrink-0 rounded-full bg-violet-500" />
                Quản lý vòng bảng và playoff
              </li>
              <li className="flex items-center gap-2">
                <span className="size-1.5 shrink-0 rounded-full bg-violet-500" />
                5 vai trò: Admin, Trọng tài, Quản lý đội, Biên tập viên, Khán giả
              </li>
            </ul>
          </div>
        </div>

        {/* RIGHT CARD */}
        <div className="flex flex-col justify-center space-y-5 rounded-2xl border border-[#1e293b] bg-[#121826] p-8">
          {/* Tab switcher */}
          <nav className="grid grid-cols-2 rounded-xl border border-white/10 bg-white/5 p-1" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.to}
                type="button"
                role="tab"
                aria-selected={location.pathname === tab.to}
                onClick={() => navigate(tab.to)}
                className={cn(
                  'rounded-lg py-2 text-sm font-semibold transition-all duration-200 cursor-pointer',
                  location.pathname === tab.to
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-white/50 hover:text-white/80'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Form */}
          <div className="auth-form-enter">
            <Outlet />
          </div>
        </div>

      </section>
    </main>
  );
};
