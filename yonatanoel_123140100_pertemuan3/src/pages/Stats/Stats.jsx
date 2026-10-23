import React from 'react';
import { Link } from 'react-router-dom';
import { useBooks } from '../../context/BookContext';
import StatsCard from '../../components/StatsCard/StatsCard';
import './Stats.css';

function Stats() {
  const { stats, books } = useBooks();

  return (
    <div className="stats-page">
      <header className="page-header">
        <div className="header-badge">Analitik & Wawasan</div>
        <h1 className="page-title">Statistik Koleksi Buku</h1>
        <p className="page-subtitle">
          Pantau progres membaca dan komposisi buku yang Anda miliki secara komprehensif.
        </p>
      </header>

      {/* Grid 4 Kartu Metrik Utama */}
      <div className="stats-cards-row">
        <StatsCard
          title="Total Buku"
          count={stats.total}
          percentage={100}
          variant="primary"
          subtitle="Seluruh pustaka tersimpan"
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          }
        />

        <StatsCard
          title="Buku Dimiliki"
          count={stats.milik}
          percentage={stats.milikPct}
          variant="milik"
          subtitle={`${stats.milikPct}% dari total pustaka`}
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
          subtitle={`${stats.bacaPct}% aktif dalam bacaan`}
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
          subtitle={`${stats.beliPct}% rencana pembelian`}
          icon={
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
            </svg>
          }
        />
      </div>

      <div className="analytics-layout">
        {/* Distribusi Kategori / Genre */}
        <section className="analytics-card">
          <div className="card-header">
            <h3 className="card-title">Distribusi Berdasarkan Genre</h3>
            <span className="card-tag">{stats.genreCount} Kategori Terdeteksi</span>
          </div>

          <div className="genre-list">
            {stats.topGenres && stats.topGenres.length > 0 ? (
              stats.topGenres.map((item) => {
                const pct = stats.total > 0 ? Math.round((item.count / stats.total) * 100) : 0;
                return (
                  <div key={item.genre} className="genre-item">
                    <div className="genre-item-header">
                      <span className="genre-name">{item.genre}</span>
                      <span className="genre-count">{item.count} buku ({pct}%)</span>
                    </div>
                    <div className="genre-track">
                      <div className="genre-bar" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="empty-text">Belum ada data kategori buku yang tersimpan.</p>
            )}
          </div>
        </section>

        {/* Ringkasan & Wawasan Membaca */}
        <section className="analytics-card">
          <div className="card-header">
            <h3 className="card-title">Wawasan Membaca</h3>
            <span className="card-tag">Rasio & Progres</span>
          </div>

          <div className="insight-content">
            <div className="insight-metric-box">
              <span className="insight-metric-label">Status Membaca Aktif</span>
              <span className="insight-metric-value">{stats.baca} Buku</span>
              <p className="insight-metric-desc">
                {stats.baca > 0
                  ? 'Pertahankan konsistensi membaca Anda! Luangkan waktu 20 menit per hari.'
                  : 'Saat ini belum ada buku yang sedang dibaca. Pilih salah satu buku dari koleksi Anda untuk mulai membaca!'}
              </p>
            </div>

            <div className="insight-tips-box">
              <h4 className="tips-title">💡 Tips Manajemen Bacaan:</h4>
              <ul className="tips-list">
                <li>Prioritaskan buku berstatus <strong>Sedang Dibaca</strong> sebelum menambah buku baru ke wishlist.</li>
                <li>Setelah selesai membaca, jangan lupa perbarui status atau beri catatan singkat impresi Anda.</li>
                <li>Data tersimpan aman di peramban Anda menggunakan <code>localStorage</code>.</li>
              </ul>
            </div>

            <div className="page-cta">
              <Link to="/" className="btn btn-primary">
                Kembali ke Koleksi Buku →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Stats;
