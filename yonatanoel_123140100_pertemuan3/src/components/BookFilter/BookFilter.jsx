import React from 'react';
import PropTypes from 'prop-types';
import './BookFilter.css';

function BookFilter({
  searchQuery,
  onSearchChange,
  filterStatus,
  onFilterChange,
  sortBy,
  onSortChange,
  stats,
  totalResults,
}) {
  const filterTabs = [
    { id: 'semua', label: 'Semua Buku', count: stats.total },
    { id: 'milik', label: 'Dimiliki', count: stats.milik },
    { id: 'baca', label: 'Sedang Dibaca', count: stats.baca },
    { id: 'beli', label: 'Ingin Dibeli', count: stats.beli },
  ];

  return (
    <div className="book-filter-container">
      {/* Baris Pencarian & Sorting */}
      <div className="filter-top-row">
        <div className="search-box">
          <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          <input
            id="book-search-input"
            type="search"
            className="search-input"
            placeholder="Cari buku berdasarkan judul, penulis, atau genre..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange('')}
              aria-label="Bersihkan pencarian"
              title="Bersihkan"
            >
              ×
            </button>
          )}
        </div>

        <div className="sort-box">
          <label htmlFor="sort-select" className="sort-label">Urutkan:</label>
          <select
            id="sort-select"
            className="sort-select"
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
          >
            <option value="terbaru">Terbaru Ditambahkan</option>
            <option value="terlama">Terlama</option>
            <option value="judul">Judul (A - Z)</option>
            <option value="penulis">Penulis (A - Z)</option>
          </select>
        </div>
      </div>

      {/* Tabs Filter Status */}
      <div className="filter-bottom-row">
        <div className="filter-tabs" role="tablist" aria-label="Filter status buku">
          {filterTabs.map((tab) => {
            const isActive = filterStatus === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`filter-tab-btn ${isActive ? 'active' : ''} tab-${tab.id}`}
                onClick={() => onFilterChange(tab.id)}
              >
                <span className="tab-label">{tab.label}</span>
                <span className="tab-badge">{tab.count}</span>
              </button>
            );
          })}
        </div>

        <div className="results-info">
          <span>Menampilkan <strong>{totalResults}</strong> buku</span>
        </div>
      </div>
    </div>
  );
}

BookFilter.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  filterStatus: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  onSortChange: PropTypes.func.isRequired,
  stats: PropTypes.shape({
    total: PropTypes.number.isRequired,
    milik: PropTypes.number.isRequired,
    baca: PropTypes.number.isRequired,
    beli: PropTypes.number.isRequired,
  }).isRequired,
  totalResults: PropTypes.number.isRequired,
};

export default BookFilter;
