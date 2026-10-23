import React from 'react';
import { useBooks } from '../../context/BookContext';
import './About.css';

function About() {
  const { stats } = useBooks();

  const techFeatures = [
    {
      title: 'Component-Based Architecture',
      description: 'Dibangun dengan komponen functional yang modular, terpisah, dan reusable (BookForm, BookList, BookItem, BookFilter, StatsCard, Modal, Navbar).',
      badge: 'Core React',
    },
    {
      title: 'State & Lifecycle Hooks',
      description: 'Memanfaatkan useState untuk state lokal komponen, useEffect untuk sinkronisasi efek samping, dan useMemo untuk kalkulasi filter dan performa.',
      badge: 'Hooks',
    },
    {
      title: '2 Custom Hooks Reusable',
      description: 'Implementasi useLocalStorage untuk persistensi data otomatis ke storage browser, dan useBookStats untuk kalkulasi dinamis analitik pustaka.',
      badge: 'Custom Hook',
    },
    {
      title: 'Global State: Context API',
      description: 'BookContext dan useBooks menyediakan jalur state global terpusat tanpa prop drilling ke seluruh cabang pohon komponen aplikasi.',
      badge: 'Context API',
    },
    {
      title: 'Multi-Page Routing',
      description: 'Navigasi cepat single-page application (SPA) menggunakan React Router DOM (Halaman Koleksi, Statistik, dan Tentang).',
      badge: 'React Router',
    },
    {
      title: 'Type Checking & Error Handling',
      description: 'Seluruh komponen divalidasi dengan PropTypes dan form dilengkapi validasi interaktif dengan umpan balik visual saat data tidak lengkap.',
      badge: 'Quality & Test',
    },
  ];

  return (
    <div className="about-page">
      <header className="page-header">
        <div className="header-badge">Tentang Aplikasi & Pengembang</div>
        <h1 className="page-title">LiteraBook — Manajemen Buku Pribadi</h1>
        <p className="page-subtitle">
          Proyek Tugas Praktikum Pengembangan Aplikasi Web (PAW) Pertemuan 3: React Basics — Teknik Informatika ITERA.
        </p>
      </header>

      {/* Profil Mahasiswa Card */}
      <section className="profile-card">
        <div className="profile-avatar">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        </div>
        <div className="profile-details">
          <h2 className="profile-name">Yonatanoel Petra Hutabarat</h2>
          <p className="profile-nim">NIM: <strong>123140100</strong></p>
          <p className="profile-inst">Program Studi Teknik Informatika · Institut Teknologi Sumatera (ITERA)</p>
          <div className="profile-badges">
            <span className="badge-tag">Praktikum PAW 2026/2027</span>
            <span className="badge-tag">Pertemuan 03: React Basics</span>
            <span className="badge-tag highlight">
              Saat ini ada <strong>{stats.total}</strong> buku tersimpan di Context
            </span>
          </div>
        </div>
      </section>

      {/* Rincian Konsep React yang Diimplementasikan */}
      <section className="features-section">
        <div className="section-header">
          <h3 className="section-title">Fitur & Konsep React yang Diterapkan</h3>
          <p className="section-desc">
            Aplikasi ini dirancang untuk memenuhi seluruh standar kompetensi praktikum React:
          </p>
        </div>

        <div className="features-grid">
          {techFeatures.map((item, idx) => (
            <div key={idx} className="feature-item-card">
              <div className="feature-card-header">
                <span className="feature-badge">{item.badge}</span>
              </div>
              <h4 className="feature-title">{item.title}</h4>
              <p className="feature-desc">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Panduan Penggunaan Singkat */}
      <section className="guide-card">
        <h3 className="guide-title">📖 Panduan Singkat Penggunaan:</h3>
        <ol className="guide-list">
          <li><strong>Tambah Buku:</strong> Klik tombol &quot;+ Tambah Buku Baru&quot; di halaman beranda atau tombol CTA empty state. Lengkapi formulir dan klik Simpan.</li>
          <li><strong>Edit & Hapus:</strong> Pada setiap kartu buku, klik tombol &quot;Edit&quot; untuk memperbarui informasi atau &quot;Hapus&quot; dengan konfirmasi keamanan.</li>
          <li><strong>Filter & Cari:</strong> Gunakan kotak pencarian untuk mencari judul/penulis secara langsung, atau klik tab status untuk memfilter buku.</li>
          <li><strong>Lihat Analitik:</strong> Buka halaman &quot;Statistik&quot; di navigasi atas untuk melihat ringkasan pembagian genre dan rasio progres membaca.</li>
        </ol>
      </section>
    </div>
  );
}

export default About;
