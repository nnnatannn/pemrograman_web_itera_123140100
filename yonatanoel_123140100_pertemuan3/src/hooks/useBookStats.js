import { useMemo } from 'react';

/**
 * Custom Hook: useBookStats
 * Menghitung metrik analitik dan statistik dari koleksi buku
 * @param {Array} books - Daftar objek buku
 * @returns {Object} - Objek statistik koleksi buku
 */
function useBookStats(books = []) {
  const stats = useMemo(() => {
    const total = books.length;
    const milik = books.filter(b => b.status === 'milik').length;
    const baca = books.filter(b => b.status === 'baca').length;
    const beli = books.filter(b => b.status === 'beli').length;

    // Persentase status
    const milikPct = total > 0 ? Math.round((milik / total) * 100) : 0;
    const bacaPct = total > 0 ? Math.round((baca / total) * 100) : 0;
    const beliPct = total > 0 ? Math.round((beli / total) * 100) : 0;

    // Rekap kategori / genre
    const genreMap = {};
    books.forEach(b => {
      const g = (b.genre && b.genre.trim()) || 'Umum';
      genreMap[g] = (genreMap[g] || 0) + 1;
    });

    const topGenres = Object.entries(genreMap)
      .map(([genre, count]) => ({ genre, count }))
      .sort((a, b) => b.count - a.count);

    return {
      total,
      milik,
      baca,
      beli,
      milikPct,
      bacaPct,
      beliPct,
      topGenres,
      genreCount: Object.keys(genreMap).length,
    };
  }, [books]);

  return stats;
}

export default useBookStats;
