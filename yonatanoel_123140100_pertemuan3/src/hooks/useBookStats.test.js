import { describe, test, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import useBookStats from './useBookStats';

describe('Custom Hook: useBookStats', () => {
  const sampleBooks = [
    { id: '1', title: 'Buku 1', author: 'A', status: 'milik', genre: 'Teknologi' },
    { id: '2', title: 'Buku 2', author: 'B', status: 'milik', genre: 'Teknologi' },
    { id: '3', title: 'Buku 3', author: 'C', status: 'baca', genre: 'Fiksi' },
    { id: '4', title: 'Buku 4', author: 'D', status: 'beli', genre: 'Bisnis' },
  ];

  test('menghitung metrik total, status, dan persentase dengan tepat', () => {
    const { result } = renderHook(() => useBookStats(sampleBooks));

    expect(result.current.total).toBe(4);
    expect(result.current.milik).toBe(2);
    expect(result.current.baca).toBe(1);
    expect(result.current.beli).toBe(1);

    expect(result.current.milikPct).toBe(50);
    expect(result.current.bacaPct).toBe(25);
    expect(result.current.beliPct).toBe(25);
    expect(result.current.genreCount).toBe(3);
  });

  test('mengembalikan nilai 0 jika daftar buku kosong', () => {
    const { result } = renderHook(() => useBookStats([]));

    expect(result.current.total).toBe(0);
    expect(result.current.milik).toBe(0);
    expect(result.current.baca).toBe(0);
    expect(result.current.beli).toBe(0);
    expect(result.current.milikPct).toBe(0);
  });
});
