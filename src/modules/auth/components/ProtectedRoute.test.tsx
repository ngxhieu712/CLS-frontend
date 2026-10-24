import { screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { currentUserKey } from '../hooks/use-current-user';
import { tokenStore } from '../store/token.store';
import { ProtectedRoute } from './ProtectedRoute';
import { createTestQueryClient, renderWithProviders } from '@/test/render-with-providers';

const renderAt = () =>
  renderWithProviders(
    <ProtectedRoute>
      <div>protected content</div>
    </ProtectedRoute>,
    { route: '/profile', otherRoutes: { '/login': 'login page' } },
  );

describe('ProtectedRoute', () => {
  beforeEach(() => {
    tokenStore.clear();
  });

  it('renders the children when a token is stored', () => {
    const queryClient = createTestQueryClient();
    queryClient.setQueryData(currentUserKey, {
      _id: 'user-1',
      email: 'user@example.com',
      isEmailVerified: true,
      role: 'teamManager',
      status: 'active',
      loginOtpEnabled: false,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    });
    tokenStore.set('jwt-value');
    renderWithProviders(
      <ProtectedRoute>
        <div>protected content</div>
      </ProtectedRoute>,
      {
        route: '/profile',
        otherRoutes: { '/login': 'login page' },
        queryClient,
      },
    );
    expect(screen.getByText('protected content')).toBeInTheDocument();
  });

  it('redirects to /login when no token is stored', () => {
    renderAt();
    expect(screen.getByText('login page')).toBeInTheDocument();
    expect(screen.queryByText('protected content')).not.toBeInTheDocument();
  });

  it('treats an empty-string token as unauthenticated', () => {
    window.localStorage.setItem('access_token', '');
    renderAt();
    expect(screen.getByText('login page')).toBeInTheDocument();
  });
});
