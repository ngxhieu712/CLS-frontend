import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, Trophy, Users } from 'lucide-react';

const TABS = [
  { to: '/login', label: 'Đăng nhập' },
  { to: '/register', label: 'Đăng ký' },
];

export const AuthLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <main className="login-shell dark">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <div className="wireframe wireframe-left" />
      <div className="wireframe wireframe-right" />
      <div className="star-flight star-flight-one" aria-hidden="true"><span>✦</span></div>
      <div className="star-flight star-flight-two" aria-hidden="true"><span>✦</span></div>
      <div className="star-flight star-flight-three" aria-hidden="true"><span>✦</span></div>

      <div className="login-layout">
        {/* LEFT — intro panel */}
        <section className="intro-panel" aria-labelledby="intro-title">
          <div className="intro-art">
            <img
              className="dragon-art"
              src="/champion-trophy.png"
              alt="Rồng kim loại dang cánh bảo vệ chiếc cúp Champion League"
            />
          </div>
          <div className="intro-content">
            <div className="eyebrow"><Sparkles /> ESPORTS MANAGEMENT PLATFORM</div>
            <h1 id="intro-title">Champion League System</h1>
            <p className="intro-copy">Hệ thống quản lý giải đấu esports — vòng bảng, bracket, kết quả trận đấu theo thời gian thực.</p>
            <ul className="feature-list">
              <li><Trophy /> Quản lý vòng bảng và playoff</li>
              <li><Users /> 4 vai trò: Admin, Trọng tài, Quản lý đội, Biên tập viên</li>
            </ul>

          </div>
        </section>

        {/* RIGHT — auth panel */}
        <section className="auth-panel" aria-labelledby="auth-title">
          <div className="tabs" role="tablist" aria-label="Tài khoản">
            {TABS.map((tab) => (
              <button
                key={tab.to}
                className={location.pathname === tab.to ? 'tab active' : 'tab'}
                type="button"
                onClick={() => navigate(tab.to)}
                role="tab"
                aria-selected={location.pathname === tab.to}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div className="auth-content">
            <Outlet />
          </div>
        </section>
      </div>

      <p className="footer-note">© 2025 Champion League System <span>•</span> Nền tảng quản lý giải đấu chuyên nghiệp</p>
    </main>
  );
};
