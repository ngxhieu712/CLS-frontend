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

    const list = await screen.findByRole('region', { name: 'Danh sách hồ sơ' });
    expect(within(list).getByText('Nova')).toBeInTheDocument();
    expect(within(list).queryByText('Phoenix')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /^Tất cả/ }));
    expect(within(list).getByText('Phoenix')).toBeInTheDocument();
    expect(within(list).getByText('Storm')).toBeInTheDocument();
  });

  it('requires a reason before rejecting a team', async () => {
    listTeams.mockResolvedValue([team('t1', 'Nova', 'pending')]);
    reviewTeam.mockResolvedValue(team('t1', 'Nova', 'rejected', { rejectReason: 'Thiếu email liên hệ' }));
    renderWithProviders(<AdminTeamsPage />, { route: '/admin/approval' });

    const detail = await screen.findByRole('complementary', { name: 'Chi tiết hồ sơ' });
    const reject = within(detail).getByRole('button', { name: 'Từ chối' });
    expect(reject).toBeDisabled();

    fireEvent.change(within(detail).getByLabelText(/Lý do từ chối/), { target: { value: 'Thiếu email liên hệ' } });
    fireEvent.click(reject);

    await waitFor(() => expect(reviewTeam).toHaveBeenCalledWith('t1', { action: 'reject', reason: 'Thiếu email liên hệ' }));
  });

  it('opens the team named in ?review and approves it', async () => {
    listTeams.mockResolvedValue([team('t1', 'Nova', 'pending'), team('t2', 'Storm', 'pending')]);
    reviewTeam.mockResolvedValue(team('t2', 'Storm', 'approved'));
    renderWithProviders(<AdminTeamsPage />, { route: '/admin/approval?review=t2', path: '/admin/approval' });

    const detail = await screen.findByRole('complementary', { name: 'Chi tiết hồ sơ' });
    expect(within(detail).getByRole('heading', { name: 'Storm' })).toBeInTheDocument();
    fireEvent.click(within(detail).getByRole('button', { name: 'Duyệt hồ sơ' }));

    await waitFor(() => expect(reviewTeam).toHaveBeenCalledWith('t2', { action: 'approve' }));
  });
});
