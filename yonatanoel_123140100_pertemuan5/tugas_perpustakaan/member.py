"""
Modul: member.py
Deskripsi: Mendefinisikan class Member (Anggota Perpustakaan) dengan enkapsulasi.

Praktikum Pengembangan Aplikasi Web - Pertemuan 5
Nama : Yonatanoel Petra Hutabarat
NIM  : 123140100
"""

from library_item import LibraryItem


class Member:
    """Class yang merepresentasikan anggota perpustakaan."""

    def __init__(self, member_id: str, nama: str, email: str):
        self.member_id = str(member_id)
        self.nama = str(nama)
        self.email = str(email)
        # Private attribute: daftar koleksi item yang sedang dipinjam oleh anggota ini
        self.__daftar_pinjaman = []

    # --------------------------------------------------------------------------
    # PROPERTY GETTER
    # --------------------------------------------------------------------------
    @property
    def daftar_pinjaman(self) -> list:
        """Mengembalikan salinan list item yang sedang dipinjam (read-only view)."""
        return list(self.__daftar_pinjaman)

    @property
    def total_pinjaman(self) -> int:
        """Mengembalikan jumlah total item yang sedang dipinjam saat ini."""
        return len(self.__daftar_pinjaman)

    # --------------------------------------------------------------------------
    # METODE BISNIS ANGGOTA
    # --------------------------------------------------------------------------
    def pinjam_item(self, item: LibraryItem) -> bool:
        """Memproses peminjaman item oleh anggota."""
        if not isinstance(item, LibraryItem):
            raise TypeError("Objek yang dipinjam harus merupakan turunan LibraryItem!")

        if item.pinjam():
            self.__daftar_pinjaman.append(item)
            print(f"[Sukses] Anggota '{self.nama}' berhasil meminjam '{item.judul}' (ID: {item.item_id}).")
            return True
        return False

    def kembalikan_item(self, item: LibraryItem) -> bool:
        """Memproses pengembalian item oleh anggota."""
        if item in self.__daftar_pinjaman:
            if item.kembalikan():
                self.__daftar_pinjaman.remove(item)
                print(f"[Sukses] Anggota '{self.nama}' telah mengembalikan '{item.judul}' (ID: {item.item_id}).")
                return True
        else:
            print(f"[Gagal] Item '{item.judul}' tidak tercatat dalam daftar pinjaman '{self.nama}'.")
        return False

    def tampilkan_pinjaman(self):
        """Menampilkan daftar item yang sedang dipinjam oleh anggota."""
        print(f"\n--- Daftar Pinjaman Anggota: {self.nama} (ID: {self.member_id}) ---")
        if not self.__daftar_pinjaman:
            print("  (Tidak ada item yang sedang dipinjam)")
            return

        for idx, item in enumerate(self.__daftar_pinjaman, start=1):
            print(f"  {idx}. {item.get_detail()}")

    def __str__(self) -> str:
        return f"Member: {self.nama} (ID: {self.member_id}) | Pinjaman Aktif: {len(self.__daftar_pinjaman)} item"
