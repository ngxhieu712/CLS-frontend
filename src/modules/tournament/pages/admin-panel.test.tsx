import { fireEvent, screen, within } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render-with-providers';
import { AdminSchedulePage } from './AdminSchedulePage';
import { PlayoffSetupPage } from './PlayoffSetupPage';
import { TeamApprovalPage } from './TeamApprovalPage';
import { TeamManagementPage } from './TeamManagementPage';
import { TournamentSetupPage } from './TournamentSetupPage';

beforeEach(() => window.localStorage.clear());

describe('tournament admin panel', () => {
  it('configures each stage format and scoring rules', () => {
    renderWithProviders(<TournamentSetupPage />);

    fireEvent.change(screen.getByLabelText('Vòng bảng'), { target: { value: 'BO1' } });
    fireEvent.change(screen.getByLabelText('Chung kết'), { target: { value: 'BO5' } });
    fireEvent.change(screen.getByLabelText('Điểm khi thắng'), { target: { value: '5' } });

    expect(screen.getByText('BO1', { selector: 'dd' })).toBeInTheDocument();
    expect(screen.getByText('BO5', { selector: 'dd' })).toBeInTheDocument();
    expect(screen.getByText('5 / 0 điểm')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Lưu cấu hình' }));
    expect(window.localStorage.getItem('champion-league:tournament-settings')).toContain('"groupFormat":"BO1"');
  });

  it('requires a rejection reason and shows it on the rejected application', () => {
    renderWithProviders(<TeamApprovalPage />, { route: '/admin/approval?review=app1', path: '/admin/approval' });
    fireEvent.change(screen.getByPlaceholderText('VD: Bổ sung email liên hệ của đội...'), { target: { value: 'Thiếu email liên hệ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Từ chối hồ sơ' }));

    expect(screen.getByText('Lý do đã gửi: Thiếu email liên hệ')).toBeInTheDocument();
  });

  it('creates a staff account and allows locking it', () => {
    renderWithProviders(<TeamManagementPage />);
    fireEvent.click(screen.getByRole('tab', { name: /Nhân sự/ }));
    fireEvent.click(screen.getByRole('button', { name: 'Thêm nhân sự' }));
    fireEvent.change(screen.getByPlaceholderText('ten@gmail.com'), { target: { value: 'new.referee@gmail.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Tạo tài khoản' }));

    expect(screen.getByText('new.referee@gmail.com')).toBeInTheDocument();
    const accountRow = screen.getByText('new.referee@gmail.com').closest('tr');
    expect(accountRow).not.toBeNull();
    fireEvent.click(within(accountRow as HTMLTableRowElement).getByRole('button', { name: 'Khóa' }));
    expect(within(accountRow as HTMLTableRowElement).getByText('Đã khóa')).toBeInTheDocument();
  });

  it('confirms a submitted match result and writes an audit entry', () => {
    renderWithProviders(<AdminSchedulePage />, { route: '/admin/schedule?review=m4', path: '/admin/schedule' });
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận kết quả' }));
    expect(screen.getAllByText('Đã xác nhận').length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole('tab', { name: 'Nhật ký' }));
    expect(screen.getByText('Xác nhận kết quả')).toBeInTheDocument();
  });

  it('moves a live match into the result review queue after submission', () => {
    renderWithProviders(<AdminSchedulePage />);
    fireEvent.click(screen.getByRole('button', { name: 'Gửi kết quả' }));
    fireEvent.click(screen.getByRole('button', { name: 'Gửi xác nhận' }));

    expect(screen.getAllByText('Chờ xác nhận').length).toBeGreaterThan(0);
    expect(screen.getByText('Duyệt kết quả')).toBeInTheDocument();
  });

  it('supports manual resolution of a tied playoff slot', () => {
    renderWithProviders(<PlayoffSetupPage />);
    fireEvent.change(screen.getByLabelText(/Đồng điểm tại suất cuối/), { target: { value: 't11' } });

    expect(screen.getAllByText('Thunder Eagle')).toHaveLength(2);
    expect(screen.queryByText('Ninja')).not.toBeInTheDocument();
  });
});
