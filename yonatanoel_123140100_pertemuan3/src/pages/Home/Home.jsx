import React, { useState } from 'react';
import { useBooks } from '../../context/BookContext';
import StatsCard from '../../components/StatsCard/StatsCard';
import BookFilter from '../../components/BookFilter/BookFilter';
import BookList from '../../components/BookList/BookList';
import Modal from '../../components/Modal/Modal';
import BookForm from '../../components/BookForm/BookForm';
import './Home.css';

function Home() {
  const {
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
  } = useBooks();

  // State untuk modal tambah & edit
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  // Notifikasi toast sederhana
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  const handleOpenAddModal = () => {
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
  };

  const handleOpenEditModal = (book) => {
    setEditingBook(book);
  };

  const handleCloseEditModal = () => {
    setEditingBook(null);
  };

  const handleCreateBook = (bookData) => {
    addBook(bookData);
    setIsAddModalOpen(false);
    showToast(`Buku "${bookData.title}" berhasil ditambahkan!`);
  };

  const handleUpdateBook = (bookData) => {
    if (editingBook) {
      updateBook(editingBook.id, bookData);
      setEditingBook(null);
      showToast(`Buku "${bookData.title}" berhasil diperbarui!`);
    }
  };

  const handleDeleteBook = (bookId) => {
    deleteBook(bookId);
    showToast('Buku berhasil dihapus dari koleksi.');
  };

  const handleStatusChange = (bookId, newStatus) => {
    updateBook(bookId, { status: newStatus });
    showToast('Status buku berhasil diubah!');
  };

  const handleResetFilters = () => {
    setFilterStatus('semua');
    setSearchQuery('');
    setSortBy('terbaru');
  };

  return (
    <div className="home-page">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-notification" role="status" aria-live="polite">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text-wrap">
            <span className="hero-badge">PAW Praktikum #3 ITERA</span>
            <h1 className="hero-title">Aplikasi Manajemen Buku Pribadi</h1>
            <p className="hero-subtitle">
              Kelola daftar pustaka Anda dengan mudah — catat buku yang sudah dimiliki, sedang Anda baca, maupun daftar belanja impian.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-hero"
            id="btn-open-add-book"
            onClick={handleOpenAddModal}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Tambah Buku Baru</span>
          </button>
        </div>

        {/* Ringkasan Statistik */}
        <div className="stats-grid">
          <StatsCard
            title="Total Koleksi"
            count={stats.total}
            percentage={100}
            variant="primary"
            subtitle="Seluruh buku tercatat"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
            }
          />

          <StatsCard
            title="Sudah Dimiliki"
            count={stats.milik}
            percentage={stats.milikPct}
            variant="milik"
            subtitle="Ada di rak fisik/digital"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            }
          />

          <StatsCard
            title="Sedang Dibaca"
            count={stats.baca}
            percentage={stats.bacaPct}
            variant="baca"
            subtitle="Dalam proses membaca"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
            }
          />

          <StatsCard
            title="Ingin Dibeli"
            count={stats.beli}
            percentage={stats.beliPct}
            variant="beli"
            subtitle="Wishlist impian"
            icon={
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
              </svg>
            }
          />
        </div>
      </section>

      {/* Main Section: Filter & Daftar Buku */}
      <section className="catalog-section">
        <BookFilter
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          sortBy={sortBy}
          onSortChange={setSortBy}
          stats={stats}
          totalResults={filteredBooks.length}
        />

        <BookList
          books={filteredBooks}
          onEdit={handleOpenEditModal}
          onDelete={handleDeleteBook}
          onStatusChange={handleStatusChange}
          onAddNew={handleOpenAddModal}
          onResetFilter={handleResetFilters}
        />
      </section>

      {/* Modal Tambah Buku Baru */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={handleCloseAddModal}
        title="Tambah Buku Baru"
      >
        <BookForm
          onSubmit={handleCreateBook}
          onCancel={handleCloseAddModal}
        />
      </Modal>

      {/* Modal Edit Buku */}
      <Modal
        isOpen={Boolean(editingBook)}
        onClose={handleCloseEditModal}
        title="Edit Buku"
      >
        {editingBook && (
          <BookForm
            initialData={editingBook}
            onSubmit={handleUpdateBook}
            onCancel={handleCloseEditModal}
          />
        )}
      </Modal>
    </div>
  );
}

export default Home;
