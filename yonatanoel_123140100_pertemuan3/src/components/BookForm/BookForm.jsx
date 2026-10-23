import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './BookForm.css';

const GENRE_OPTIONS = [
  'Teknologi',
  'Fiksi & Sastra',
  'Self Improvement',
  'Bisnis & Finansial',
  'Sains & Matematika',
  'Sejarah & Filsafat',
  'Lainnya',
];

function BookForm({ initialData, onSubmit, onCancel }) {
  const isEditMode = Boolean(initialData && initialData.id);

  const [formData, setFormData] = useState({
    title: '',
    author: '',
    status: 'milik',
    genre: 'Teknologi',
    year: new Date().getFullYear(),
    notes: '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        author: initialData.author || '',
        status: initialData.status || 'milik',
        genre: initialData.genre || 'Teknologi',
        year: initialData.year || new Date().getFullYear(),
        notes: initialData.notes || '',
      });
    }
  }, [initialData]);

  // Validasi form
  const validate = (data) => {
    const newErrors = {};

    if (!data.title || !data.title.trim()) {
      newErrors.title = 'Judul buku wajib diisi!';
    } else if (data.title.trim().length < 2) {
      newErrors.title = 'Judul buku minimal 2 karakter.';
    }

    if (!data.author || !data.author.trim()) {
      newErrors.author = 'Nama penulis wajib diisi!';
    } else if (data.author.trim().length < 2) {
      newErrors.author = 'Nama penulis minimal 2 karakter.';
    }

    if (data.year) {
      const yearNum = Number(data.year);
      const currentYear = new Date().getFullYear();
      if (isNaN(yearNum) || yearNum < 1000 || yearNum > currentYear + 1) {
        newErrors.year = `Tahun tidak valid (1000 - ${currentYear + 1}).`;
      }
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updated = { ...formData, [name]: value };
    setFormData(updated);

    // Hapus error secara langsung jika input sudah valid
    if (touched[name]) {
      const fieldErrors = validate(updated);
      setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
    }
  };

  const handleBlur = (e) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const fieldErrors = validate(formData);
    setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Tandai semua field telah disentuh
    setTouched({
      title: true,
      author: true,
      year: true,
    });

    const validationErrors = validate(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit payload
    onSubmit({
      ...formData,
      title: formData.title.trim(),
      author: formData.author.trim(),
      year: formData.year ? Number(formData.year) : '',
      notes: formData.notes.trim(),
    });

    // Reset jika bukan mode edit
    if (!isEditMode) {
      setFormData({
        title: '',
        author: '',
        status: 'milik',
        genre: 'Teknologi',
        year: new Date().getFullYear(),
        notes: '',
      });
      setErrors({});
      setTouched({});
    }
  };

  return (
    <form className="book-form" onSubmit={handleSubmit} noValidate>
      <div className="form-header">
        <h3 className="form-title">
          {isEditMode ? 'Edit Informasi Buku' : 'Tambah Buku Baru'}
        </h3>
        <p className="form-subtitle">
          {isEditMode
            ? 'Perbarui detail buku pada koleksi pribadi Anda'
            : 'Lengkapi formulir di bawah ini untuk mencatat buku baru'}
        </p>
      </div>

      <div className="form-body">
        {/* Judul Buku */}
        <div className={`form-group ${errors.title && touched.title ? 'has-error' : ''}`}>
          <label htmlFor="book-title" className="form-label">
            Judul Buku <span className="required-star">*</span>
          </label>
          <input
            id="book-title"
            name="title"
            type="text"
            className="form-input"
            placeholder="Contoh: Clean Architecture"
            value={formData.title}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.title && touched.title)}
            aria-describedby={errors.title ? 'title-error' : undefined}
          />
          {errors.title && touched.title && (
            <span id="title-error" className="error-message">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {errors.title}
            </span>
          )}
        </div>

        {/* Nama Penulis */}
        <div className={`form-group ${errors.author && touched.author ? 'has-error' : ''}`}>
          <label htmlFor="book-author" className="form-label">
            Nama Penulis <span className="required-star">*</span>
          </label>
          <input
            id="book-author"
            name="author"
            type="text"
            className="form-input"
            placeholder="Contoh: Robert C. Martin"
            value={formData.author}
            onChange={handleChange}
            onBlur={handleBlur}
            aria-invalid={Boolean(errors.author && touched.author)}
            aria-describedby={errors.author ? 'author-error' : undefined}
          />
          {errors.author && touched.author && (
            <span id="author-error" className="error-message">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              {errors.author}
            </span>
          )}
        </div>

        {/* Baris Status & Genre */}
        <div className="form-row">
          <div className="form-group flex-1">
            <label htmlFor="book-status" className="form-label">
              Status Buku <span className="required-star">*</span>
            </label>
            <select
              id="book-status"
              name="status"
              className="form-select"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="milik">Sudah Dimiliki (Milik)</option>
              <option value="baca">Sedang Dibaca (Baca)</option>
              <option value="beli">Ingin Dibeli (Wishlist)</option>
            </select>
          </div>

          <div className="form-group flex-1">
            <label htmlFor="book-genre" className="form-label">
              Genre / Kategori
            </label>
            <select
              id="book-genre"
              name="genre"
              className="form-select"
              value={formData.genre}
              onChange={handleChange}
            >
              {GENRE_OPTIONS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Tahun Terbit */}
        <div className={`form-group ${errors.year && touched.year ? 'has-error' : ''}`}>
          <label htmlFor="book-year" className="form-label">
            Tahun Terbit (Opsional)
          </label>
          <input
            id="book-year"
            name="year"
            type="number"
            className="form-input"
            placeholder="Contoh: 2023"
            value={formData.year}
            onChange={handleChange}
            onBlur={handleBlur}
            min="1000"
            max={new Date().getFullYear() + 1}
          />
          {errors.year && touched.year && (
            <span id="year-error" className="error-message">
              {errors.year}
            </span>
          )}
        </div>

        {/* Catatan / Review */}
        <div className="form-group">
          <label htmlFor="book-notes" className="form-label">
            Catatan Pribadi / Ulasan (Opsional)
          </label>
          <textarea
            id="book-notes"
            name="notes"
            className="form-textarea"
            rows="3"
            placeholder="Tuliskan impresi, kutipan favorit, atau alasan ingin membaca buku ini..."
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCancel}
          >
            Batal
          </button>
        )}
        <button type="submit" className="btn btn-primary" id="btn-submit-book">
          {isEditMode ? 'Simpan Perubahan' : 'Tambahkan Buku'}
        </button>
      </div>
    </form>
  );
}

BookForm.propTypes = {
  initialData: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    author: PropTypes.string,
    status: PropTypes.oneOf(['milik', 'baca', 'beli']),
    genre: PropTypes.string,
    year: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    notes: PropTypes.string,
  }),
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func,
};

export default BookForm;
