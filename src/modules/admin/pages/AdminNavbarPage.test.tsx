import { fireEvent, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { renderWithProviders } from '@/test/render-with-providers';
import { AdminNavbarPage } from './AdminNavbarPage';

beforeEach(() => window.localStorage.clear());

describe('AdminNavbarPage', () => {
  it('saves edited labels to browser storage', () => {
    renderWithProviders(<AdminNavbarPage />);

    fireEvent.change(screen.getByRole('textbox', { name: 'Tên mục Trang chủ' }), {
      target: { value: 'Giải đấu' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Lưu thay đổi' }));

    expect(window.localStorage.getItem('champion-league:public-navbar')).toContain('"label":"Giải đấu"');
    expect(screen.getByRole('navigation', { name: 'Bản xem trước thanh điều hướng' })).toHaveTextContent('Giải đấu');
  });

  it('updates the preview when a link is hidden', () => {
    renderWithProviders(<AdminNavbarPage />);

    fireEvent.click(screen.getByRole('switch', { name: 'Ẩn Vòng bảng' }));

    expect(screen.getByRole('navigation', { name: 'Bản xem trước thanh điều hướng' })).not.toHaveTextContent('Vòng bảng');
  });
});
