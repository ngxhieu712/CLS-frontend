import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/shared/lib/utils';
import { ThemeToggle } from '@/shared/components/ui/theme-toggle';
import { useEffect, useRef } from 'react';

const TABS = [
  { to: '/login', label: 'Đăng nhập' },
  { to: '/register', label: 'Đăng ký' },
];

// Particle: mỗi hạt lửa nhỏ bay lên từ cúp
function FireParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="auth-fire-particle absolute rounded-full"
          style={{
            left: `${42 + (Math.sin(i * 1.3) * 12)}%`,
            bottom: '58%',
            width: `${4 + (i % 3) * 2}px`,
            height: `${4 + (i % 3) * 2}px`,
            animationDelay: `${(i * 0.3) % 2.5}s`,
            animationDuration: `${1.8 + (i % 4) * 0.4}s`,
          }}
        />
      ))}
    </div>
  );
}

// Polygon background nodes
function PolygonBg() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const points: { x: number; y: number; vx: number; vy: number }[] = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
    }));

    let raf: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      points.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.strokeStyle = `rgba(124, 58, 237, ${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
        ctx.beginPath();
        ctx.arc(points[i].x, points[i].y, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(124,58,237,0.4)';
        ctx.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />;
}

export const AuthLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0d1117] p-4 md:p-8">
      {/* Polygon animated background */}
      <div className="absolute inset-0">
        <PolygonBg />
      </div>

      {/* Theme toggle */}
      <div className="absolute right-4 top-4 z-20">
        <ThemeToggle />
      </div>

      <section className="relative z-10 grid w-full max-w-5xl gap-6 md:grid-cols-2">
        {/* Left panel — trophy */}
        <div className="relative flex flex-col items-center justify-end rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden">
          <FireParticles />
          {/* Trophy to, tràn 2 bên */}
          <img
            src="/champion-trophy.png"
            alt="Champion Trophy"
            className="auth-trophy-float w-[140%] -mx-[20%] mt-[-5%]"
            style={{ filter: 'drop-shadow(0 0 50px rgba(251,146,60,0.6))' }}
          />
          <div className="w-full px-8 pb-8 -mt-4">
            <h1 className="text-center text-2xl font-bold text-white">Champion League System</h1>
          <p className="mt-2 text-center text-sm text-white/60">
            Hệ thống quản lý giải đấu esports — vòng bảng, bracket, kết quả trận đấu theo thời gian thực.
          </p>
          <ul className="mt-5 space-y-2 text-sm text-white/50">
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-violet-500" />
              Quản lý vòng bảng và playoff
            </li>
            <li className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-violet-500" />
              5 vai trò: Admin, Trọng tài, Quản lý đội, Biên tập viên, Khán giả
            </li>
          </ul>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex flex-col justify-center space-y-5 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
          {/* Tabs */}
          <nav className="grid grid-cols-2 rounded-xl border border-white/10 bg-white/5 p-1" role="tablist">
            {TABS.map((tab) => (
              <button
                key={tab.to}
                type="button"
                role="tab"
                aria-selected={location.pathname === tab.to}
                onClick={() => navigate(tab.to)}
                className={cn(
                  'rounded-lg py-2 text-sm font-semibold transition-all duration-200',
                  location.pathname === tab.to
                    ? 'bg-violet-600 text-white shadow'
                    : 'text-white/50 hover:text-white/80'
                )}
              >
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Page content */}
          <div className="auth-form-enter">
            <Outlet />
          </div>
        </div>
      </section>
    </main>
  );
};
