import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { LoadingState } from '@/shared/components/loading-state';
import { useCurrentUser } from '../hooks/use-current-user';
import { tokenStore } from '../store/token.store';
import type { UserRole } from '../types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactElement;
  /** When set, only these roles may see the page; others are sent home. */
  roles?: UserRole[];
}

/**
 * Các route được phép truy cập khi tài khoản ở trạng thái pending hoặc rejected.
 * Tài liệu: "pending và rejected đăng nhập được nhưng chỉ thấy Dashboard đội và Hồ sơ đội"
 */
const RESTRICTED_ALLOWED = ['/team/dashboard', '/team/profile'];

const RoleGate = ({ children, roles }: Required<ProtectedRouteProps>) => {
  const { data: user, isPending } = useCurrentUser();
  const location = useLocation();

  if (isPending) return <LoadingState />;
  if (!user) return <Navigate to="/login" replace />;

  // Tài khoản bị khoá → về login
  if (user.status === 'locked') return <Navigate to="/login" replace />;

  // Tài khoản pending/rejected → chỉ được vào dashboard + profile đội
  if (user.status === 'pending' || user.status === 'rejected') {
    const allowed = RESTRICTED_ALLOWED.some(p => location.pathname.startsWith(p));
    if (!allowed) return <Navigate to="/team/dashboard" replace />;
  }

  if (!roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

export const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
  const token = tokenStore.get();
  const location = useLocation();
  if (!token) return <Navigate to="/login" replace />;
  if (roles) return <RoleGate roles={roles}>{children}</RoleGate>;

  return <StatusGate location={location}>{children}</StatusGate>;
};

/** Gate chỉ check status (không check role) — dùng cho routes không có roles prop */
const StatusGate = ({ children, location }: { children: React.ReactElement; location: ReturnType<typeof useLocation> }) => {
  const { data: user, isPending } = useCurrentUser();

  if (isPending) return <LoadingState />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.status === 'locked') return <Navigate to="/login" replace />;

  if (user.status === 'pending' || user.status === 'rejected') {
    const allowed = RESTRICTED_ALLOWED.some(p => location.pathname.startsWith(p));
    if (!allowed) return <Navigate to="/team/dashboard" replace />;
  }

  return children;
};
