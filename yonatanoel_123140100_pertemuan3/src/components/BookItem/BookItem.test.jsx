import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookItem from './BookItem';

describe('Komponen BookItem', () => {
  const dummyBook = {
    id: 'book-101',
    title: 'Struktur Data & Algoritma',
    author: 'Niklaus Wirth',
    status: 'baca',
    genre: 'Teknologi',
    year: 2020,
    notes: 'Sangat relevan untuk praktikum informatika.',
  };

  const mockEdit = vi.fn();
  const mockDelete = vi.fn();
  const mockStatusChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('merender informasi buku dan status badge dengan benar', () => {
    render(
      <BookItem
        book={dummyBook}
        onEdit={mockEdit}
        onDelete={mockDelete}
        onStatusChange={mockStatusChange}
      />
    );

    expect(screen.getByText('Struktur Data & Algoritma')).toBeInTheDocument();
    expect(screen.getByText('Niklaus Wirth')).toBeInTheDocument();
    expect(screen.getByText('(2020)')).toBeInTheDocument();
    expect(screen.getByText('Teknologi')).toBeInTheDocument();
    expect(screen.getAllByText('Sedang Dibaca')[0]).toBeInTheDocument();
  });

  test('memanggil onEdit saat tombol edit diklik', () => {
    render(
      <BookItem
        book={dummyBook}
        onEdit={mockEdit}
        onDelete={mockDelete}
        onStatusChange={mockStatusChange}
      />
    );

    const editBtn = screen.getByRole('button', { name: /Edit Struktur Data & Algoritma/i });
    fireEvent.click(editBtn);

    expect(mockEdit).toHaveBeenCalledTimes(1);
    expect(mockEdit).toHaveBeenCalledWith(dummyBook);
  });

  test('memanggil onDelete saat konfirmasi hapus disetujui', () => {
    render(
      <BookItem
        book={dummyBook}
        onEdit={mockEdit}
        onDelete={mockDelete}
        onStatusChange={mockStatusChange}
      />
    );

    // Klik tombol hapus pertama kali (muncul konfirmasi)
    const initialDeleteBtn = screen.getByRole('button', { name: /Hapus Struktur Data & Algoritma/i });
    fireEvent.click(initialDeleteBtn);

    // Tombol konfirmasi "Ya, Hapus" muncul
    const confirmBtn = screen.getByRole('button', { name: /Konfirmasi Hapus/i });
    expect(confirmBtn).toBeInTheDocument();

    fireEvent.click(confirmBtn);
    expect(mockDelete).toHaveBeenCalledWith('book-101');
  });

  test('memanggil onStatusChange saat status buku diubah via dropdown quick-switch', () => {
    render(
      <BookItem
        book={dummyBook}
        onEdit={mockEdit}
        onDelete={mockDelete}
        onStatusChange={mockStatusChange}
      />
    );

    const select = screen.getByLabelText(/Ubah status Struktur Data & Algoritma/i);
    fireEvent.change(select, { target: { value: 'milik' } });

    expect(mockStatusChange).toHaveBeenCalledWith('book-101', 'milik');
  });
});
