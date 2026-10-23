import React, { createContext, useContext, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';
import useBookStats from '../hooks/useBookStats';

const BookContext = createContext(null);

// Data awal contoh agar aplikasi tidak kosong saat pertama dibuka
const INITIAL_BOOKS = [
  {
    id: 'b-1',
    title: 'Clean Code: A Handbook of Agile Software Craftsmanship',
    author: 'Robert C. Martin',
    status: 'milik',
    genre: 'Teknologi',
    year: 2008,
    notes: 'Buku wajib untuk pengembang perangkat lunak profesional.',
    createdAt: 1700000000000,
  },
  {
    id: 'b-2',
    title: 'Atomic Habits: Perubahan Kecil yang Memberikan Hasil Luar Biasa',
    author: 'James Clear',
    status: 'baca',
    genre: 'Self Improvement',
    year: 2018,
    notes: 'Sedang membaca bab 4 tentang sistem pembentukan kebiasaan.',
    createdAt: 1700100000000,
  },
  {
    id: 'b-3',
    title: 'Laskar Pelangi',
    author: 'Andrea Hirata',
    status: 'milik',
    genre: 'Fiksi & Sastra',
    year: 2005,
    notes: 'Novel inspiratif tentang perjuangan pendidikan di Belitung.',
    createdAt: 1700200000000,
  },
  {
    id: 'b-4',
    title: 'Designing Data-Intensive Applications',
    author: 'Martin Kleppmann',
    status: 'beli',
    genre: 'Teknologi',
    year: 2017,
    notes: 'Rekomendasi untuk mendalami arsitektur sistem terdistribusi.',
    createdAt: 1700300000000,
  },
];

/**
 * Custom Hook untuk mengonsumsi BookContext
 */
export function useBooks() {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks harus digunakan di dalam BookProvider');
  }
  return context;
}

/**
 * Provider untuk Context Manajemen Buku
 */
export function BookProvider({ children }) {
  const [books, setBooks] = useLocalStorage('paw_books_data', INITIAL_BOOKS);
  const [filterStatus, setFilterStatus] = useState('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('terbaru');

  // Menambah buku baru
  const addBook = (newBook) => {
    const bookWithMeta = {
      ...newBook,
      id: `book-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: Date.now(),
    };
    setBooks(prev => [bookWithMeta, ...prev]);
  };

  // Mengedit buku yang ada
  const updateBook = (id, updatedFields) => {
    setBooks(prev =>
      prev.map(b => (b.id === id ? { ...b, ...updatedFields, updatedAt: Date.now() } : b))
    );
  };

  // Menghapus buku
  const deleteBook = (id) => {
    setBooks(prev => prev.filter(b => b.id !== id));
  };

  // Statistik koleksi
  const stats = useBookStats(books);

  // Filter dan Pencarian Buku
  const filteredBooks = useMemo(() => {
    return books
      .filter(book => {
        // Filter status
        const matchStatus = filterStatus === 'semua' || book.status === filterStatus;

        // Filter search (berdasarkan judul atau penulis)
        const q = searchQuery.toLowerCase().trim();
        const matchSearch =
          !q ||
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q) ||
          (book.genre && book.genre.toLowerCase().includes(q));

        return matchStatus && matchSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'terbaru') return (b.createdAt || 0) - (a.createdAt || 0);
        if (sortBy === 'terlama') return (a.createdAt || 0) - (b.createdAt || 0);
        if (sortBy === 'judul') return a.title.localeCompare(b.title);
        if (sortBy === 'penulis') return a.author.localeCompare(b.author);
        return 0;
      });
  }, [books, filterStatus, searchQuery, sortBy]);

  const value = {
    books,
    filteredBooks,
    filterStatus,
    setFilterStatus,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    addBook,
    updateBook,
    deleteBook,
    stats,
  };

  return <BookContext.Provider value={value}>{children}</BookContext.Provider>;
}

BookProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
