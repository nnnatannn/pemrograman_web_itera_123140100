import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookFilter from './BookFilter';

describe('Komponen BookFilter', () => {
  const dummyStats = {
    total: 10,
    milik: 5,
    baca: 3,
    beli: 2,
  };

  const mockSearchChange = vi.fn();
  const mockFilterChange = vi.fn();
  const mockSortChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('memanggil onSearchChange saat input pencarian diketik', () => {
    render(
      <BookFilter
        searchQuery=""
        onSearchChange={mockSearchChange}
        filterStatus="semua"
        onFilterChange={mockFilterChange}
        sortBy="terbaru"
        onSortChange={mockSortChange}
        stats={dummyStats}
        totalResults={10}
      />
    );

    const searchInput = screen.getByPlaceholderText(/Cari buku berdasarkan/i);
    fireEvent.change(searchInput, { target: { value: 'React' } });

    expect(mockSearchChange).toHaveBeenCalledWith('React');
  });

  test('memanggil onFilterChange saat tab filter status diklik', () => {
    render(
      <BookFilter
        searchQuery=""
        onSearchChange={mockSearchChange}
        filterStatus="semua"
        onFilterChange={mockFilterChange}
        sortBy="terbaru"
        onSortChange={mockSortChange}
        stats={dummyStats}
        totalResults={10}
      />
    );

    const bacaTab = screen.getByRole('tab', { name: /Sedang Dibaca/i });
    fireEvent.click(bacaTab);

    expect(mockFilterChange).toHaveBeenCalledWith('baca');
  });
});
