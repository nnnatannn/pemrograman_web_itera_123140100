# LiteraBook — Aplikasi Manajemen Buku Pribadi
> **Tugas Praktikum Pengembangan Aplikasi Web (PAW)**  
> **Pertemuan 03:** React Basics (Component-Based Architecture, Hooks, Context API, React Router, dan Unit Testing)  
> **Teknik Informatika — Institut Teknologi Sumatera (ITERA)**

---

## 👤 Identitas Praktikan
- **Nama Lengkap:** Yonatanoel Petra Hutabarat
- **NIM:** 123140100
- **Mata Kuliah:** Praktikum Pengembangan Aplikasi Web (PAW)
- **Tahun Ajaran:** 2026/2027 (Gasal)
- **Repositori Git:** `pemrograman_web_itera_123140100`
- **Folder Tugas:** `yonatanoel_123140100_pertemuan3`

---

## 📚 Deskripsi Aplikasi
**LiteraBook** adalah aplikasi web manajemen buku pribadi berbasis React yang dirancang untuk memudahkan pengguna dalam mencatat, mengorganisasi, dan melacak buku-buku yang:
1. **Sudah Dimiliki (`milik`)** — buku fisik atau e-book yang tersimpan di rak buku pribadi.
2. **Sedang Dibaca (`baca`)** — buku yang sedang aktif dibaca dengan tracking progres.
3. **Ingin Dibeli (`beli`)** — wishlist buku incaran yang direncanakan untuk dibeli di masa mendatang.

Aplikasi ini mengimplementasikan prinsip arsitektur berbasis komponen (*Component-Based Architecture*), Hooks bawaan dan kustom, state global terpusat dengan Context API, routing multi-halaman dengan React Router, penyimpanan lokal persisten (*localStorage*), validasi input dengan visual feedback, type checking PropTypes, serta pengujian unit otomatis (*unit testing*) dengan Vitest dan React Testing Library.

---

## 🚀 Fitur Utama Aplikasi

### 1. Fitur Fungsional Buku:
- **Tambah Buku Baru:** Menambahkan buku baru dengan atribut Judul, Nama Penulis, Status Koleksi, Genre/Kategori, Tahun Terbit, dan Catatan/Ulasan singkat.
- **Edit & Perbarui Informasi:** Mengubah detail buku kapan saja melalui form modal interaktif.
- **Hapus Buku:** Menghapus buku dari koleksi yang dilengkapi dengan sistem konfirmasi ganda guna mencegah penghapusan tidak sengaja.
- **Quick Status Switcher:** Mengubah status buku secara instan langsung dari kartu buku (misal: memindahkan buku dari status *Ingin Dibeli* ke *Sudah Dimiliki*).
- **Pencarian Real-Time:** Filter dinamis yang mencari judul buku, nama penulis, maupun kategori genre secara instan saat pengguna mengetik.
- **Filter Status & Pengurutan (Sorting):** Memfilter koleksi berdasarkan status (*Semua*, *Dimiliki*, *Sedang Dibaca*, *Ingin Dibeli*) dan mengurutkan berdasarkan waktu penambahan (*Terbaru*, *Terlama*), serta alfabetis (*Judul A-Z*, *Penulis A-Z*).
- **Penyimpanan Persisten:** Seluruh data buku disimpan otomatis di `localStorage` peramban, sehingga data tidak hilang saat halaman di-refresh atau browser ditutup.

### 2. Halaman & Navigasi Multi-Halaman (React Router):
- `/` (**Koleksi Buku / Home**): Halaman katalog utama dengan kartu statistik ringkas, pencarian, filter status, dan daftar kartu buku.
- `/stats` (**Statistik Koleksi**): Analitik mendalam yang menampilkan rasio status membaca, persentase kategori/genre, dan wawasan produktivitas membaca.
- `/about` (**Tentang Aplikasi**): Halaman profil pengembang, rekap konsep React yang diterapkan, dan panduan fitur.

---

## ⚛️ Penjelasan Fitur & Konsep React yang Digunakan

| Konsep React | Implementasi pada Proyek |
| :--- | :--- |
| **Functional Components** | Seluruh komponen dibangun sebagai komponen fungsi modern menggunakan sintaks ES6+. |
| **State (`useState`)** | Mengelola state lokal seperti data form, modal buka/tutup, status konfirmasi hapus, pencarian, dan feedback error. |
| **Lifecycle & Side Effects (`useEffect`)** | Digunakan pada sinkronisasi `localStorage`, deteksi keyboard event (tombol Esc pada Modal), dan penguncian scroll layar. |
| **Memoization (`useMemo`)** | Mengoptimalkan komputasi filtering, sorting, dan kalkulasi statistik buku agar efisien saat data bertambah banyak. |
| **Custom Hook 1 (`useLocalStorage`)** | Mengabstraksi logika pembacaan (*JSON parse*) dan penulisan (*JSON stringify*) data ke `localStorage` dengan penanganan error. |
| **Custom Hook 2 (`useBookStats`)** | Menghitung statistik buku: total buku, kuantitas per status, persentase pembacaan, dan pengelompokan frekuensi genre secara reaktif. |
| **Context API (`BookContext`)** | Menyediakan state global (`books`, `filterStatus`, `searchQuery`, `sortBy`, `addBook`, `updateBook`, `deleteBook`, `stats`) dan custom consumer hook `useBooks()` untuk mencegah *prop drilling*. |
| **React Router (`react-router-dom`)** | Pengaturan rute halaman menggunakan `<BrowserRouter>`, `<Routes>`, `<Route>`, dan navigasi aktif menggunakan `<NavLink>`. |
| **Type Checking (`prop-types`)** | Memvalidasi tipe seluruh props yang diterima komponen UI (`BookForm`, `BookItem`, `BookList`, `BookFilter`, `StatsCard`, `Modal`). |
| **Error Handling Form Input** | Validasi kolom wajib (judul dan penulis buku) dengan umpan balik visual (border merah, ikon peringatan, pesan error, dan fokus input). |
| **Unit Testing (Vitest & RTL)** | 11 unit test otomatis yang menguji rendering, interaksi klik, form submission, filter status, dan logika hook kustom. |

---

## 📁 Struktur Folder Proyek

```text
yonatanoel_123140100_pertemuan3/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── BookFilter/
│   │   │   ├── BookFilter.jsx          # Komponen filter status, search, & sort
│   │   │   ├── BookFilter.css
│   │   │   └── BookFilter.test.jsx     # Unit test BookFilter
│   │   ├── BookForm/
│   │   │   ├── BookForm.jsx            # Formulir tambah & edit buku
│   │   │   ├── BookForm.css
│   │   │   └── BookForm.test.jsx       # Unit test validasi & submit form
│   │   ├── BookItem/
│   │   │   ├── BookItem.jsx            # Kartu individual buku
│   │   │   ├── BookItem.css
│   │   │   └── BookItem.test.jsx       # Unit test kartu buku & aksi
│   │   ├── BookList/
│   │   │   ├── BookList.jsx            # Grid daftar buku & empty state
│   │   │   └── BookList.css
│   │   ├── Modal/
│   │   │   ├── Modal.jsx               # Dialog pop-up modal
│   │   │   └── Modal.css
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx              # Navigasi sticky header multi-halaman
│   │   │   └── Navbar.css
│   │   └── StatsCard/
│   │       ├── StatsCard.jsx           # Kartu indikator metrik & progress bar
│   │       └── StatsCard.css
│   ├── context/
│   │   └── BookContext.jsx             # State global Context API & Provider
│   ├── hooks/
│   │   ├── useLocalStorage.js          # Custom Hook: persistensi browser storage
│   │   ├── useBookStats.js             # Custom Hook: analitik & statistik
│   │   └── useBookStats.test.js        # Unit test useBookStats
│   ├── pages/
│   │   ├── Home/
│   │   │   ├── Home.jsx                # Halaman Beranda (Koleksi Buku)
│   │   │   └── Home.css
│   │   ├── Stats/
│   │   │   ├── Stats.jsx               # Halaman Statistik Koleksi
│   │   │   └── Stats.css
│   │   └── About/
│   │       ├── About.jsx               # Halaman Profil & Penjelasan Fitur
│   │       └── About.css
│   ├── App.jsx                         # Router root dan layout
│   ├── App.css
│   ├── index.css                       # Variabel tema dan reset CSS
│   ├── main.jsx                        # Entry point React 19
│   └── setupTests.js                   # Setup matcher @testing-library/jest-dom
├── screenshots/
│   ├── Screenshot 1 — Halaman Utama.png
│   ├── Screenshot 2 — Validasi Error Form Input.png
│   ├── Screenshot 3 — Modal TambahEdit Buku Terisi.png
│   ├── Screenshot 4 — Halaman Statistik.png
│   ├── Screenshot 5 — Halaman Tentang.png
│   └── Screenshot 6 — Hasil Eksekusi Unit Test di Termina.png
├── index.html
├── package.json
├── vite.config.js                      # Konfigurasi Vite & Vitest runner
└── README.md
```

---

## 🛠️ Panduan Instalasi & Menjalankan Proyek

### 1. Prasyarat Sistem
- **Node.js:** Versi 18 ke atas (Direkomendasikan v20+)
- **NPM:** v9 atau lebih baru

### 2. Langkah Menjalankan Aplikasi
1. Buka terminal pada folder proyek ini:
   ```bash
   cd yonatanoel_123140100_pertemuan3
   ```

2. Pasang seluruh dependensi:
   ```bash
   npm install
   ```

3. Jalankan server pengembangan lokal (*Vite Development Server*):
   ```bash
   npm run dev
   ```

4. Buka tautan lokal yang ditampilkan pada terminal di peramban Anda (biasanya `http://localhost:5173`).

---

## 🧪 Panduan Menjalankan Unit Testing

Proyek ini telah dilengkapi dengan 11 unit tests komprehensif menggunakan **Vitest** dan **React Testing Library**.

### 1. Jalankan Seluruh Test Sekali Jalan:
```bash
npm test
```

### 2. Jalankan Test dalam Mode Interaktif (Watch Mode):
```bash
npm run test:watch
```

### 3. Output Eksekusi Test di Terminal:
```text
 ✓ src/hooks/useBookStats.test.js (2 tests) 76ms
 ✓ src/components/BookFilter/BookFilter.test.jsx (2 tests) 813ms
   ✓ Komponen BookFilter (2)
     ✓ memanggil onFilterChange saat tab filter status diklik 645ms
 ✓ src/components/BookItem/BookItem.test.jsx (4 tests) 1027ms
   ✓ Komponen BookItem (4)
     ✓ memanggil onEdit saat tombol edit diklik 679ms
 ✓ src/components/BookForm/BookForm.test.jsx (3 tests) 1100ms
   ✓ Komponen BookForm (3)
     ✓ merender elemen form dan input utama dengan benar 811ms

 Test Files  4 passed (4)
      Tests  11 passed (11)
```

---

## 📸 Dokumentasi & Bukti Screenshot Antarmuka Aplikasi

Berikut adalah dokumentasi tangkapan layar antarmuka aplikasi **LiteraBook** dan hasil pengujian unit test:

### 1. Halaman Beranda / Koleksi Buku (`/`)
Menampilkan ringkasan metrik statistik koleksi, bilah pencarian *real-time*, filter status buku, serta grid daftar buku.
![Screenshot 1 — Halaman Utama](screenshots/Screenshot%201%20%E2%80%94%20Halaman%20Utama.png)

---

### 2. Validasi Error Form Input
Menampilkan umpan balik visual (*visual feedback*) berupa peringatan dan garis tepi merah ketika formulir disubmit tanpa mengisi kolom wajib (Judul Buku & Nama Penulis).
![Screenshot 2 — Validasi Error Form Input](screenshots/Screenshot%202%20%E2%80%94%20Validasi%20Error%20Form%20Input.png)

---

### 3. Modal Form Tambah / Edit Buku Terisi
Menampilkan modal dialog penambahan atau pengubahan buku saat seluruh data telah diisi lengkap dan siap disimpan.
![Screenshot 3 — Modal TambahEdit Buku Terisi](screenshots/Screenshot%203%20%E2%80%94%20Modal%20TambahEdit%20Buku%20Terisi.png)

---

### 4. Halaman Statistik Koleksi (`/stats`)
Menampilkan analitik mendalam mengenai komposisi status koleksi, persentase kategori/genre buku, serta metrik dan tips progres membaca.
![Screenshot 4 — Halaman Statistik](screenshots/Screenshot%204%20%E2%80%94%20Halaman%20Statistik.png)

---

### 5. Halaman Tentang (`/about`)
Menampilkan profil identitas pengembang (**Yonatanoel Petra Hutabarat - 123140100**), jumlah buku tersimpan di Context, dan rekap konsep React yang diterapkan.
![Screenshot 5 — Halaman Tentang](screenshots/Screenshot%205%20%E2%80%94%20Halaman%20Tentang.png)

---

### 6. Hasil Eksekusi Unit Test di Terminal
Menampilkan hasil uji coba unit test otomatis menggunakan **Vitest** dan **React Testing Library** yang menunjukkan 11 tes lulus 100% (`11 passed`).
![Screenshot 6 — Hasil Eksekusi Unit Test di Terminal](screenshots/Screenshot%206%20%E2%80%94%20Hasil%20Eksekusi%20Unit%20Test%20di%20Termina.png)

---

## 📌 Format Pengumpulan Tugas

- **Format Repositori GitHub:** `pemrograman_web_itera_123140100`
- **Format Folder Pertemuan:** `yonatanoel_123140100_pertemuan3`
- Folder `node_modules/` dan `dist/` sudah dikecualikan di file `.gitignore`.
- Link pengumpulan: Google Form Kelas Praktikum PAW ITERA 2026/2027.
