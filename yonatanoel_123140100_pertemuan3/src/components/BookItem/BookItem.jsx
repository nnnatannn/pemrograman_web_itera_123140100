import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './BookItem.css';

const STATUS_CONFIG = {
  milik: {
    label: 'Dimiliki',
    badgeClass: 'badge-milik',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    ),
  },
  baca: {
    label: 'Sedang Dibaca',
    badgeClass: 'badge-baca',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <polyline points="12 6 12 12 16 14"></polyline>
      </svg>
    ),
  },
  beli: {
    label: 'Ingin Dibeli',
    badgeClass: 'badge-beli',
    icon: (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
    ),
  },
};

function BookItem({ book, onEdit, onDelete, onStatusChange }) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const statusInfo = STATUS_CONFIG[book.status] || STATUS_CONFIG.milik;

  const handleDeleteClick = () => {
    if (showConfirmDelete) {
      onDelete(book.id);
    } else {
      setShowConfirmDelete(true);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDelete(false);
  };

  return (
    <article className="book-card" data-testid={`book-item-${book.id}`}>
      {/* Header Kartu: Status Badge & Tahun */}
      <div className="card-top">
        <span className={`status-badge ${statusInfo.badgeClass}`}>
          {statusInfo.icon}
          <span>{statusInfo.label}</span>
        </span>

        {book.genre && (
          <span className="genre-tag">{book.genre}</span>
        )}
      </div>

      {/* Konten Buku */}
      <div className="card-body">
        <h4 className="book-title" title={book.title}>
          {book.title}
        </h4>
        <p className="book-author">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
          <span>{book.author}</span>
          {book.year && <span className="book-year">({book.year})</span>}
        </p>

        {book.notes && (
          <p className="book-notes" title={book.notes}>
            &ldquo;{book.notes}&rdquo;
          </p>
        )}
      </div>

      {/* Quick Status Switcher */}
      <div className="status-quick-switch">
        <label className="switch-label">Ubah Status:</label>
        <select
          className="quick-status-select"
          value={book.status}
          onChange={(e) => onStatusChange(book.id, e.target.value)}
          aria-label={`Ubah status ${book.title}`}
        >
          <option value="milik">Milik</option>
          <option value="baca">Sedang Dibaca</option>
          <option value="beli">Ingin Dibeli</option>
        </select>
      </div>

      {/* Footer Kartu & Aksi */}
      <div className="card-actions">
        {showConfirmDelete ? (
          <div className="confirm-delete-box">
            <span className="confirm-text">Hapus buku ini?</span>
            <div className="confirm-buttons">
              <button
                type="button"
                className="btn-danger-confirm"
                onClick={handleDeleteClick}
                aria-label="Konfirmasi Hapus"
              >
                Ya, Hapus
              </button>
              <button
                type="button"
                className="btn-cancel-confirm"
                onClick={handleCancelDelete}
                aria-label="Batal Hapus"
              >
                Batal
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              type="button"
              className="action-btn edit-btn"
              onClick={() => onEdit(book)}
              aria-label={`Edit ${book.title}`}
              title="Edit Buku"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              <span>Edit</span>
            </button>

            <button
              type="button"
              className="action-btn delete-btn"
              onClick={handleDeleteClick}
              aria-label={`Hapus ${book.title}`}
              title="Hapus Buku"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                <line x1="10" y1="11" x2="10" y2="17"></line>
                <line x1="14" y1="11" x2="14" y2="17"></line>
              </svg>
              <span>Hapus</span>
            </button>
          </>
        )}
      </div>
    </article>
  );
}

BookItem.propTypes = {
  book: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired,
    genre: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    notes: PropTypes.string,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
};

export default BookItem;
