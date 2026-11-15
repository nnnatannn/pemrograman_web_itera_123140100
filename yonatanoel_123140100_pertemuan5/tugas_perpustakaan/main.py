"""
Program Utama: main.py
Deskripsi: Skrip pengujian komprehensif Sistem Manajemen Perpustakaan Berbasis OOP.

Praktikum Pengembangan Aplikasi Web - Pertemuan 5
Nama : Yonatanoel Petra Hutabarat
NIM  : 123140100
"""

from library_item import LibraryItem, Book, Magazine
from member import Member
from library import Library


def main():
    print("=" * 70)
    print("   SISTEM MANAJEMEN PERPUSTAKAAN TEKNIK INFORMATIKA ITERA (OOP)")
    print("=" * 70)

    # 1. Inisialisasi Perpustakaan
    perpustakaan = Library("Perpustakaan Institut Teknologi Sumatera")

    # 2. Menambahkan Item (Book & Magazine) - Implementasi Inheritance
    print("\n--- 1. MENAMBAHKAN KOLEKSI BUKU & MAJALAH ---")
    buku1 = Book(
        item_id="B001",
        judul="Clean Code: A Handbook of Agile Software Craftsmanship",
        tahun_terbit=2008,
        penulis="Robert C. Martin",
        isbn="978-0132350884",
        jumlah_halaman=464,
    )
    buku2 = Book(
        item_id="B002",
        judul="Learning Python (5th Edition)",
        tahun_terbit=2013,
        penulis="Mark Lutz",
        isbn="978-1449355739",
        jumlah_halaman=1600,
    )
    buku3 = Book(
        item_id="B003",
        judul="Desain Pola Arsitektur Perangkat Lunak Web",
        tahun_terbit=2021,
        penulis="Yonatanoel Petra H.",
        isbn="978-602-12345",
        jumlah_halaman=320,
    )

    majalah1 = Magazine(
        item_id="M001",
        judul="IEEE Software: Software Engineering in Practice",
        tahun_terbit=2024,
        edisi="Jan-Feb 2024",
        volume=41,
        penerbit="IEEE Computer Society",
    )
    majalah2 = Magazine(
        item_id="M002",
        judul="National Geographic Indonesia: Misteri Laut Dalam",
        tahun_terbit=2023,
        edisi="November 2023",
        volume=19,
        penerbit="National Geographic",
    )

    koleksi_awal = [buku1, buku2, buku3, majalah1, majalah2]
    for item in koleksi_awal:
        perpustakaan.tambah_item(item)

    # 3. Pendaftaran Anggota Perpustakaan
    print("\n--- 2. PENDAFTARAN ANGGOTA PERPUSTAKAAN ---")
    member1 = Member("MHS001", "Yonatanoel Petra Hutabarat", "yonatanoel@itera.ac.id")
    member2 = Member("MHS002", "Ahmad Fadhilah", "ahmad.fadhilah@itera.ac.id")

    perpustakaan.tambah_member(member1)
    perpustakaan.tambah_member(member2)

    # 4. Menampilkan Seluruh Katalog Awal (Polymorphism via get_detail)
    print("\n--- 3. MENAMPILKAN SELURUH KATALOG PERPUSTAKAAN ---")
    perpustakaan.tampilkan_katalog(hanya_tersedia=False)

    # 5. Fitur Pencarian Item (Berdasarkan ID & Judul)
    print("\n--- 4. UJI COBA FITUR PENCARIAN ITEM ---")
    # A. Cari Berdasarkan ID
    id_cari = "B002"
    print(f"[Pencarian ID] Mencari item dengan ID: '{id_cari}'")
    hasil_id = perpustakaan.cari_berdasarkan_id(id_cari)
    if hasil_id:
        print(f" -> Ditemukan: {hasil_id.get_detail()}")
    else:
        print(" -> Item tidak ditemukan.")

    # B. Cari Berdasarkan Kata Kunci Judul
    keyword = "Python"
    print(f"\n[Pencarian Judul] Mencari item dengan kata kunci: '{keyword}'")
    hasil_judul = perpustakaan.cari_berdasarkan_judul(keyword)
    print(f" -> Ditemukan {len(hasil_judul)} item:")
    for h in hasil_judul:
        print(f"    * {h.get_detail()}")

    # 6. Transaksi Peminjaman Item
    print("\n--- 5. TRANSAKSI PEMINJAMAN ITEM ---")
    # Yonatanoel meminjam Buku B001 dan Majalah M001
    perpustakaan.pinjam_item(member_id="MHS001", item_id="B001")
    perpustakaan.pinjam_item(member_id="MHS001", item_id="M001")

    # Ahmad mencoba meminjam Buku B001 yang sedang dipinjam (Ekspektasi: Gagal)
    print("\n[Uji Validasi Peminjaman Ganda]")
    perpustakaan.pinjam_item(member_id="MHS002", item_id="B001")

    # Tampilkan daftar pinjaman masing-masing member
    member1.tampilkan_pinjaman()

    # 7. Menampilkan Katalog Item yang Hanya Berstatus TERSEDIA
    print("\n--- 6. MENAMPILKAN KATALOG HANYA YANG TERSEDIA ---")
    perpustakaan.tampilkan_katalog(hanya_tersedia=True)

    # 8. Transaksi Pengembalian & Perhitungan Denda Polimorfik
    print("\n--- 7. TRANSAKSI PENGEMBALIAN & PERHITUNGAN DENDA POLIMORFIK ---")
    # Pengembalian Buku B001 terlambat 3 hari (Denda buku: Rp 2.000 / hari)
    print("\n[Kasus A] Pengembalian Buku B001 (Terlambat 3 hari):")
    perpustakaan.kembalikan_item(member_id="MHS001", item_id="B001", hari_terlambat=3)

    # Pengembalian Majalah M001 terlambat 5 hari (Denda majalah: Rp 1.000 / hari)
    print("\n[Kasus B] Pengembalian Majalah M001 (Terlambat 5 hari):")
    perpustakaan.kembalikan_item(member_id="MHS001", item_id="M001", hari_terlambat=5)

    # 9. Pembuktian Konsep OOP Tingkat Lanjut (Enforcement & Proteksi)
    print("\n--- 8. PEMBUKTIAN PENERAPAN 4 PILAR OOP ---")

    # A. Pembuktian Abstract Class
    print("\n[A. Abstract Class Enforcement]")
    try:
        item_abstrak = LibraryItem("X001", "Item Abstrak", 2024)
    except TypeError as err:
        print(f" -> Berhasil dicegah: {err}")

    # B. Pembuktian Encapsulation & Name Mangling
    print("\n[B. Encapsulation & Private Attribute Protection]")
    try:
        # Mencoba akses langsung ke atribut private __koleksi
        print(perpustakaan.__koleksi)
    except AttributeError:
        print(" -> Akses langsung ke 'perpustakaan.__koleksi' GAGAL (terlindungi name mangling)!")

    # C. Pembuktian Property Setter Validation
    print("\n[C. Property Setter Validation]")
    try:
        buku1.is_dipinjam = "bukan boolean"  # Memancing TypeError
    except TypeError as err:
        print(f" -> Validasi setter tertangkap: {err}")

    # D. Pembuktian Polymorphism Heterogen
    print("\n[D. Polimorfisme List Heterogen]")
    semua_item = [buku1, majalah1]
    for itm in semua_item:
        print(f" -> Tipe: {type(itm).__name__:<8} | Biaya denda jika telat 4 hari: Rp {itm.hitung_denda(4):,.2f}")

    print("\n" + "=" * 70)
    print("      SELURUH PENGUJIAN SISTEM PERPUSTAKAAN SELESAI DENGAN BAIK")
    print("=" * 70)


if __name__ == "__main__":
    main()
