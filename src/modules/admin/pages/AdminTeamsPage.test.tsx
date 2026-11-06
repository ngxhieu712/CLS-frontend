import { fireEvent, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '@/test/render-with-providers';
import { AdminTeamsPage } from './AdminTeamsPage';

const listTeams = vi.fn();
const reviewTeam = vi.fn();

vi.mock('../api/admin.api', () => ({
  adminApi: {
    listTeams: (params: unknown) => listTeams(params),
    reviewTeam: (id: string, input: unknown) => reviewTeam(id, input),
  },
}));

vi.mock('sonner', () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const team = (id: string, name: string, profileStatus: 'pending' | 'approved' | 'rejected', extra = {}) => ({
  _id: id,
  name,
  tag: name.slice(0, 3).toUpperCase(),
  logo: '',
  description: '',
  organization: '',
  contactEmail: `${id}@team.vn`,
  contactPhone: '0900000000',
  registeredAt: '2026-10-01T00:00:00.000Z',
  profileStatus,
  rejectReason: '',
  manager: { _id: `m-${id}`, fullName: `Manager ${name}`, email: `${id}@example.com`, status: 'active' },
  createdAt: '2026-10-01T00:00:00.000Z',
  updatedAt: '2026-10-01T00:00:00.000Z',
  ...extra,
});

describe('AdminTeamsPage', () => {
  it('shows pending teams first and counts every status', async () => {
    listTeams.mockResolvedValue([team('t1', 'Nova', 'pending'), team('t2', 'Phoenix', 'approved'), team('t3', 'Storm', 'rejected')]);
    renderWithProviders(<AdminTeamsPage />, { route: '/admin/approval' });

    expect(await screen.findByText('Nova')).toBeInTheDocument();
    expect(screen.queryByText('Phoenix')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Tất cả/ }));
    expect(screen.getByText('Phoenix')).toBeInTheDocument();
    expect(screen.getByText('Storm')).toBeInTheDocument();
  });

  it('requires a reason before rejecting a team', async () => {
    listTeams.mockResolvedValue([team('t1', 'Nova', 'pending')]);
    reviewTeam.mockResolvedValue(team('t1', 'Nova', 'rejected', { rejectReason: 'Thiếu email liên hệ' }));
    renderWithProviders(<AdminTeamsPage />, { route: '/admin/approval' });

    fireEvent.click(await screen.findByRole('button', { name: 'Từ chối' }));
    const dialog = screen.getByRole('dialog');
    const confirm = within(dialog).getByRole('button', { name: 'Từ chối hồ sơ' });
    expect(confirm).toBeDisabled();

    fireEvent.change(within(dialog).getByPlaceholderText('VD: Bổ sung email liên hệ của đội...'), { target: { value: 'Thiếu email liên hệ' } });
    fireEvent.click(confirm);

    await waitFor(() => expect(reviewTeam).toHaveBeenCalledWith('t1', { action: 'reject', reason: 'Thiếu email liên hệ' }));
  });

  it('approves a team after confirmation', async () => {
    listTeams.mockResolvedValue([team('t1', 'Nova', 'pending')]);
    reviewTeam.mockResolvedValue(team('t1', 'Nova', 'approved'));
    renderWithProviders(<AdminTeamsPage />, { route: '/admin/approval' });

    fireEvent.click(await screen.findByRole('button', { name: 'Duyệt' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Xác nhận duyệt' }));

    await waitFor(() => expect(reviewTeam).toHaveBeenCalledWith('t1', { action: 'approve' }));
  });
});
