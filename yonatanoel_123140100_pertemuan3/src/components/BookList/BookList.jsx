import React from 'react';
import PropTypes from 'prop-types';
import BookItem from '../BookItem/BookItem';
import './BookList.css';

function BookList({ books, onEdit, onDelete, onStatusChange, onAddNew, onResetFilter }) {
  if (books.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            <circle cx="12" cy="11" r="3"></circle>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
        </div>
        <h4 className="empty-state-title">Tidak ada buku yang ditemukan</h4>
        <p className="empty-state-desc">
          Tidak ada buku yang cocok dengan kriteria pencarian atau filter yang Anda pilih saat ini.
        </p>
        <div className="empty-state-actions">
          {onResetFilter && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onResetFilter}
            >
              Reset Filter & Pencarian
            </button>
          )}
          {onAddNew && (
            <button
              type="button"
              className="btn btn-primary"
              onClick={onAddNew}
            >
              + Tambah Buku Baru
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="book-grid" data-testid="book-grid">
      {books.map((book) => (
        <BookItem
          key={book.id}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
          onStatusChange={onStatusChange}
        />
      ))}
    </div>
  );
}

BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      author: PropTypes.string.isRequired,
      status: PropTypes.oneOf(['milik', 'baca', 'beli']).isRequired,
      genre: PropTypes.string,
      year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      notes: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onAddNew: PropTypes.func,
  onResetFilter: PropTypes.func,
};

export default BookList;
