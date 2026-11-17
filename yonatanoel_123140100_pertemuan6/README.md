# Tugas Praktikum Pengembangan Aplikasi Web (PAW)
> **Pertemuan 06:** Pyramid Web Framework — RESTful API Mahasiswa & Matakuliah dengan PostgreSQL dan SQLAlchemy  
> **Teknik Informatika — Institut Teknologi Sumatera (ITERA)**

---

## 👤 Identitas Praktikan
- **Nama Lengkap:** Yonatanoel Petra Hutabarat
- **NIM:** 123140100
- **Kelas Praktikum:** RB
- **Mata Kuliah:** Praktikum Pengembangan Aplikasi Web (PAW)
- **Tahun Ajaran:** 2026/2027 (Gasal)
- **Repositori Git:** `pemrograman_web_itera_123140100`
- **Folder Tugas:** `yonatanoel_123140100_pertemuan6`

---

## 📁 Struktur Direktori Repositori

Struktur berkas dan direktori proyek disusun secara modular sesuai standar konvensi Pylons Project dan spesifikasi praktikum pertemuan 6:

```text
yonatanoel_123140100_pertemuan6/
├── development.ini                      # Konfigurasi environment lokal, logging & koneksi PostgreSQL
├── production.ini                       # Konfigurasi deployment server production
├── setup.py                             # Metadata paket aplikasi, dependensi & entry points
├── README.md                            # Laporan lengkap dokumentasi praktikum dan panduan eksekusi
├── .gitignore                           # Konfigurasi file yang diabaikan Git (venv, sqlite, cache, pyc)
├── screenshots/                         # Tangkapan layar bukti eksekusi API & migrasi
│   ├── screenshot_alembic_seeding.png   # Bukti migrasi Alembic dan seeding data awal
│   ├── screenshot_mahasiswa_crud.png    # Bukti pengujian cURL CRUD Mahasiswa
│   ├── screenshot_matakuliah_crud.png   # Bukti pengujian cURL CRUD Matakuliah
│   └── screenshot_error_handling.png    # Bukti penanganan HTTP 400 Bad Request & 404 Not Found
└── pyramid_mahasiswa/                   # Package utama aplikasi Pyramid
    ├── __init__.py                      # Entry point WSGI Configurator & scan view
    ├── routes.py                        # Peta URL Dispatch dan predikat request_method
    ├── alembic/                         # Skrip pelacakan versi skema basis data Alembic
    │   ├── env.py                       # Runtime runner environment migrasi Alembic
    │   └── versions/                    # Riwayat berkas revisi DDL migrasi
    │       ├── 20261112_create_mahasiswa_table.py
    │       └── 20261112_create_matakuliah_table.py
    ├── models/                          # Lapisan ORM (Object-Relational Mapping)
    │   ├── __init__.py                  # Registrasi model, sessionmaker & transaksi otomatis
    │   ├── meta.py                      # Metadata penamaan constraint & Declarative Base
    │   ├── mahasiswa.py                 # Model ORM tabel 'mahasiswa'
    │   └── matakuliah.py                # Model ORM tabel 'matakuliah' (Tugas Utama)
    ├── scripts/                         # Skrip utilitas CLI database
    │   ├── __init__.py
    │   └── initialize_db.py             # Skrip seeding data awal mahasiswa dan matakuliah
    └── views/                           # Lapisan Controller (View Handlers)
        ├── __init__.py
        ├── default.py                   # Handler rute root web (GET /)
        ├── mahasiswa.py                 # Controller endpoint RESTful API Mahasiswa
        └── matakuliah.py                # Controller endpoint RESTful API Matakuliah (Tugas Utama)
```

---

## 🏛️ Arsitektur Aplikasi & Penerapan Konsep Enterprise

Aplikasi RESTful API ini dibangun di atas **Pyramid Framework** dengan mengimplementasikan arsitektur web modern yang decoupled dan robust:

1. **URL Dispatch & Method Predicate Routing (`routes.py`):**
   - Routing Pyramid memisahkan controller secara deklaratif berdasarkan URL Path dan predikat kata kerja HTTP (`request_method='GET'`, `'POST'`, `'PUT'`, `'DELETE'`).
   - Hal ini memungkinkan satu URI (seperti `/api/matakuliah/{id}`) memiliki handler view yang berbeda secara terisolasi tanpa percabangan manual `if request.method == ...`.

2. **Lapisan ORM SQLAlchemy & Declarative Base (`models/`):**
   - Menggunakan `declarative_base(metadata=metadata)` dengan konvensi penamaan constraint Alembic (`NAMING_CONVENTION`) untuk integritas indeks, unique key, dan primary key pada basis data PostgreSQL.
   - Setiap model (`Mahasiswa` dan `Matakuliah`) menyediakan method serialisasi `to_dict()` untuk menghasilkan representasi data dictionary Python yang siap dirender secara murni sebagai JSON.

3. **Transaction Management Otomatis (`zope.sqlalchemy` & `pyramid_tm`):**
   - Sesi basis data (`request.dbsession`) diikat ke lifecycle request HTTP.
   - Pyramid secara otomatis melakukan **commit** transaksi saat response berstatus sukses (HTTP 2xx) dan melakukan **rollback** otomatis apabila terjadi exception atau error unhandled (HTTP 5xx).

4. **Database Schema Versioning via Alembic (`alembic/`):**
   - Seluruh perubahan skema tabel basis data terlacak dalam berkas migrasi versi:
     - `20261112_create_mahasiswa_table.py`: Membuat tabel `mahasiswa` dengan constraint unique pada `nim`.
     - `20261112_create_matakuliah_table.py`: Membuat tabel `matakuliah` dengan constraint unique pada `kode_mk`.

---

## 📋 Spesifikasi Teknis & Endpoint REST API

### 1. Model Data `Mahasiswa` (Tabel `mahasiswa`)
| Atribut | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `Integer` | Primary Key, Autoincrement |
| `nim` | `Text` | Unique, Not Null |
| `nama` | `Text` | Not Null |
| `jurusan` | `Text` | Not Null |
| `tanggal_lahir` | `Date` | Nullable, Format ISO `YYYY-MM-DD` |
| `alamat` | `Text` | Nullable |

### 2. Model Data `Matakuliah` (Tabel `matakuliah`) — *Spesifikasi Tugas*
| Atribut | Tipe Data | Keterangan |
| :--- | :--- | :--- |
| `id` | `Integer` | Primary Key, Autoincrement |
| `kode_mk` | `Text` | Unique, Not Null (contoh: `IF2110`, `IF3140`, `IF2220`) |
| `nama_mk` | `Text` | Not Null (contoh: `Pemrograman Web`, `Basis Data`) |
| `sks` | `Integer` | Not Null, Wajib integer positif (> 0) |
| `semester` | `Integer` | Not Null, Wajib integer positif (> 0) |

---

### 3. Daftar Endpoint RESTful API

| Method | Endpoint URL | Fungsi & Deskripsi | Response Status |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Endpoint Root: Informasi status dan daftar rute API | `200 OK` |
| `GET` | `/api/mahasiswa` | Mengambil seluruh daftar data mahasiswa | `200 OK` |
| `GET` | `/api/mahasiswa/{id}` | Mengambil detail mahasiswa berdasarkan ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/mahasiswa` | Menambahkan mahasiswa baru (wajib: `nim`, `nama`, `jurusan`) | `200 OK` / `400 Bad Request` |
| `PUT` | `/api/mahasiswa/{id}` | Memperbarui data mahasiswa berdasarkan ID | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/mahasiswa/{id}` | Menghapus data mahasiswa berdasarkan ID | `200 OK` / `404 Not Found` |
| `GET` | `/api/matakuliah` | Mengambil seluruh daftar mata kuliah | `200 OK` |
| `GET` | `/api/matakuliah/{id}` | Mengambil detail mata kuliah berdasarkan ID | `200 OK` / `404 Not Found` |
| `POST` | `/api/matakuliah` | Menambahkan mata kuliah baru (wajib: `kode_mk`, `nama_mk`, `sks`, `semester`) | `200 OK` / `400 Bad Request` |
| `PUT` | `/api/matakuliah/{id}` | Memperbarui mata kuliah berdasarkan ID | `200 OK` / `400 Bad Request` / `404 Not Found` |
| `DELETE` | `/api/matakuliah/{id}` | Menghapus mata kuliah berdasarkan ID | `200 OK` / `404 Not Found` |

---

## ⚙️ Panduan Instalasi & Eksekusi Server

### 1. Masuk ke Direktori Proyek
Buka terminal (PowerShell atau Bash) pada root repositori, lalu masuk ke folder pertemuan 6:
```bash
cd yonatanoel_123140100_pertemuan6
```

### 2. Menyiapkan dan Mengaktifkan Virtual Environment
```bash
# Membuat virtual environment bernama 'venv'
python -m venv venv

# Mengaktifkan venv di Windows PowerShell:
.\venv\Scripts\Activate.ps1

# (Atau jika di Command Prompt cmd.exe):
# .\venv\Scripts\activate.bat

# (Atau jika di macOS/Linux):
# source venv/bin/activate
```

### 3. Menginstal Dependensi Paket
Instal paket yang diperlukan dalam mode pengembangan (*editable mode*):
```bash
pip install --upgrade pip setuptools
pip install -e .
```
> Paket inti yang terpasang meliputi: `pyramid`, `waitress`, `pyramid_jinja2`, `pyramid_tm`, `zope.sqlalchemy`, `SQLAlchemy`, `alembic`, dan `psycopg2-binary`.

### 4. Menyiapkan Database PostgreSQL
Buka shell `psql` sebagai user superuser `postgres`:
```sql
CREATE DATABASE pyramid_mahasiswa;
CREATE USER pyramid_user WITH ENCRYPTED PASSWORD 'pyramid_pass';
GRANT ALL PRIVILEGES ON DATABASE pyramid_mahasiswa TO pyramid_user;
```
> Konfigurasi koneksi database tersimpan pada `development.ini`:
> ```ini
> sqlalchemy.url = postgresql://pyramid_user:pyramid_pass@localhost:5432/pyramid_mahasiswa
> ```

### 5. Menjalankan Migrasi Skema Database Alembic
Terapkan seluruh migrasi tabel `mahasiswa` dan `matakuliah` ke database:
```bash
alembic -c development.ini upgrade head
```

### 6. Melakukan Seeding Data Awal
Jalankan skrip CLI inisialisasi data untuk mengisi data awal mahasiswa dan minimal 3 mata kuliah:
```bash
python -m pyramid_mahasiswa.scripts.initialize_db development.ini
```

### 7. Menjalankan WSGI Web Server Waitress
Jalankan server aplikasi Pyramid dalam mode live reload:
```bash
pserve development.ini --reload
```
Server akan aktif dan siap menerima request HTTP pada:
`http://localhost:6543`

---

## 📷 Dokumentasi Hasil Pengujian API (Screenshots)

Berikut adalah bukti tangkapan layar pengujian terminal untuk seluruh siklus migrasi, data seeding, dan operasi RESTful API:

### 1. Migrasi Database Alembic & Seeding Data Awal
Menjalankan migrasi kedua tabel (`mahasiswa` dan `matakuliah`) via Alembic serta seeding data awal (2 mahasiswa dan 3 mata kuliah) ke basis data:
![Screenshot Alembic & Seeding](screenshots/screenshot_alembic_seeding.png)

---

### 2. Pengujian CRUD Endpoints Mahasiswa (`/api/mahasiswa`)
Pengujian Read All, Read Detail by ID, Create (POST), Update (PUT), dan Delete (DELETE) pada modul Mahasiswa:
![Screenshot Mahasiswa CRUD](screenshots/screenshot_mahasiswa_crud.png)

---

### 3. Pengujian CRUD Endpoints Matakuliah (`/api/matakuliah`) — *Tugas Utama*
Pengujian Read All (3 mata kuliah awal), Read Detail by ID, Tambah Matakuliah Baru (`IF4020`), Update Data Matakuliah (`IF2110`), dan Hapus Matakuliah:
![Screenshot Matakuliah CRUD](screenshots/screenshot_matakuliah_crud.png)

---

### 4. Pengujian Validasi Error (HTTP 400 Bad Request) & Not Found (HTTP 404)
Pengujian robustness sistem terhadap field kosong, SKS/Semester negatif atau nol, pencegahan kode matakuliah duplikat, dan penanganan ID yang tidak ada:
![Screenshot Error Handling](screenshots/screenshot_error_handling.png)

---

## 🧪 Rincian Perintah Pengujian Manual (cURL Cheat Sheet)

Untuk melakukan pengujian mandiri melalui terminal, Anda dapat menyalin perintah cURL berikut saat server `pserve` berjalan:

### Endpoint Matakuliah
```bash
# 1. READ ALL Matakuliah
curl -X GET http://localhost:6543/api/matakuliah

# 2. READ ONE Matakuliah by ID
curl -X GET http://localhost:6543/api/matakuliah/1

# 3. CREATE Matakuliah Baru
curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk": "IF4020", "nama_mk": "Rekayasa Perangkat Lunak", "sks": 4, "semester": 7}'

# 4. UPDATE Matakuliah by ID
curl -X PUT http://localhost:6543/api/matakuliah/1 \
  -H "Content-Type: application/json" \
  -d '{"nama_mk": "Algoritma dan Struktur Data Lanjut", "sks": 4}'

# 5. DELETE Matakuliah by ID
curl -X DELETE http://localhost:6543/api/matakuliah/4

# 6. TEST VALIDASI: SKS Negatif (Error 400)
curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk": "IF9999", "nama_mk": "Uji SKS Negatif", "sks": -2, "semester": 0}'

# 7. TEST VALIDASI: Kode MK Duplikat (Error 400)
curl -X POST http://localhost:6543/api/matakuliah \
  -H "Content-Type: application/json" \
  -d '{"kode_mk": "IF3140", "nama_mk": "Web Duplikat", "sks": 3, "semester": 5}'

# 8. TEST NOT FOUND: ID Tidak Ada (Error 404)
curl -X GET http://localhost:6543/api/matakuliah/99
```

---

## 🔒 Pemenuhan Ketentuan & Kriteria Penilaian

| Komponen Penilaian | Bobot | Realisasi dalam Proyek |
| :--- | :---: | :--- |
| **Model Data & Migrasi Alembic** | **30%** | Tabel `matakuliah` dengan tipe data sesuai spesifikasi (`id`, `kode_mk`, `nama_mk`, `sks`, `semester`), method `to_dict()`, registrasi di `models/__init__.py`, skrip migrasi Alembic (`20261112_create_matakuliah_table.py`), dan data seeding 3 mata kuliah awal pada `initialize_db.py`. |
| **Fungsionalitas API Endpoints & Routes** | **40%** | 5 operasi CRUD lengkap (GET List, GET Detail, POST Create, PUT Update, DELETE Delete), pemanfaatan predikat `request_method` pada `routes.py`, validasi ketat status code `200 OK`, `400 Bad Request`, dan `404 Not Found`. |
| **Dokumentasi README, Pengujian & Kerapian Kode** | **30%** | `README.md` komprehensif beridentitas lengkap, panduan setup step-by-step, 4 screenshot bukti pengujian terminal, implementasi konvensi PEP 8, serta `.gitignore` yang memproteksi direktori `venv/`, `__pycache__/`, dan `*.sqlite`. |

---
*© 2026 Praktikum Pengembangan Aplikasi Web · Teknik Informatika ITERA*
