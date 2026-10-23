import React from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookForm from './BookForm';

describe('Komponen BookForm', () => {
  const mockSubmit = vi.fn();
  const mockCancel = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('merender elemen form dan input utama dengan benar', () => {
    render(<BookForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    expect(screen.getByLabelText(/Judul Buku/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Nama Penulis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Status Buku/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Tambahkan Buku/i })).toBeInTheDocument();
  });

  test('menampilkan pesan validasi error ketika disubmit tanpa mengisi field wajib', () => {
    render(<BookForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    const submitBtn = screen.getByRole('button', { name: /Tambahkan Buku/i });
    fireEvent.click(submitBtn);

    expect(screen.getByText(/Judul buku wajib diisi!/i)).toBeInTheDocument();
    expect(screen.getByText(/Nama penulis wajib diisi!/i)).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  test('memanggil onSubmit dengan payload yang benar ketika form diisi lengkap', () => {
    render(<BookForm onSubmit={mockSubmit} onCancel={mockCancel} />);

    const titleInput = screen.getByLabelText(/Judul Buku/i);
    const authorInput = screen.getByLabelText(/Nama Penulis/i);
    const submitBtn = screen.getByRole('button', { name: /Tambahkan Buku/i });

    fireEvent.change(titleInput, { target: { value: 'Belajar React Modern' } });
    fireEvent.change(authorInput, { target: { value: 'John Doe' } });
    fireEvent.click(submitBtn);

    expect(mockSubmit).toHaveBeenCalledTimes(1);
    expect(mockSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'Belajar React Modern',
        author: 'John Doe',
        status: 'milik',
      })
    );
  });
});
