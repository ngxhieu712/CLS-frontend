import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it } from 'vitest';
import { PublicLayout } from './PublicLayout';

beforeEach(() => window.localStorage.clear());

describe('PublicLayout', () => {
  it('keeps the public navbar sticky while scrolling', () => {
    const { container } = render(
      <MemoryRouter>
        <PublicLayout />
      </MemoryRouter>,
    );

    expect(container.querySelector('header')).toHaveClass('sticky', 'top-0');
    expect(container.querySelector('.overflow-x-clip')).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: 'Điều hướng chính' })).toHaveTextContent('Trang chủ');
  });
});
