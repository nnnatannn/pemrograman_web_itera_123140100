"""
Modul: library_item.py
Deskripsi: Mendefinisikan abstract base class LibraryItem dan subclass Book serta Magazine.

Praktikum Pengembangan Aplikasi Web - Pertemuan 5
Nama : Yonatanoel Petra Hutabarat
NIM  : 123140100
"""

from abc import ABC, abstractmethod


class LibraryItem(ABC):
    """Abstract Base Class yang merepresentasikan item umum di perpustakaan."""

    def __init__(self, item_id: str, judul: str, tahun_terbit: int):
        # Protected attributes (enkapsulasi: hanya untuk class ini dan subclass)
        self._item_id = str(item_id)
        self._judul = str(judul)
        self._tahun_terbit = int(tahun_terbit)
        # Private attribute (status peminjaman)
        self.__is_dipinjam = False

    # --------------------------------------------------------------------------
    # PROPERTY DECORATORS (Getter & Setter)
    # --------------------------------------------------------------------------
    @property
    def item_id(self) -> str:
        """Mengembalikan ID unik item perpustakaan (read-only)."""
        return self._item_id

    @property
    def judul(self) -> str:
        """Mengembalikan judul item perpustakaan."""
        return self._judul

    @property
    def tahun_terbit(self) -> int:
        """Mengembalikan tahun terbit item perpustakaan."""
        return self._tahun_terbit

    @property
    def is_dipinjam(self) -> bool:
        """Mengembalikan status peminjaman item (True jika sedang dipinjam)."""
        return self.__is_dipinjam

    @is_dipinjam.setter
    def is_dipinjam(self, status: bool):
        """Mengatur status peminjaman dengan validasi boolean."""
        if not isinstance(status, bool):
            raise TypeError("Status peminjaman harus berupa nilai boolean (True/False)!")
        self.__is_dipinjam = status

    # --------------------------------------------------------------------------
    # ABSTRACT METHODS (Wajib diimplementasikan oleh setiap subclass)
    # --------------------------------------------------------------------------
    @abstractmethod
    def get_detail(self) -> str:
        """Mengembalikan rincian informasi spesifik dari item."""
        pass

    @abstractmethod
    def hitung_denda(self, hari_terlambat: int) -> float:
        """Menghitung besaran denda keterlambatan per hari secara polimorfik."""
        pass

    # --------------------------------------------------------------------------
    # CONCRETE METHODS (Dapat digunakan langsung oleh seluruh subclass)
    # --------------------------------------------------------------------------
    def pinjam(self) -> bool:
        """Meminjam item jika saat ini tersedia."""
        if self.__is_dipinjam:
            print(f"[Gagal] Item '{self._judul}' (ID: {self._item_id}) sedang dipinjam orang lain.")
            return False
        self.__is_dipinjam = True
        return True

    def kembalikan(self) -> bool:
        """Mengembalikan item ke perpustakaan."""
        if not self.__is_dipinjam:
            print(f"[Peringatan] Item '{self._judul}' (ID: {self._item_id}) sudah berada di perpustakaan.")
            return False
        self.__is_dipinjam = False
        return True

    def __str__(self) -> str:
        status = "Dipinjam" if self.__is_dipinjam else "Tersedia"
        return f"[{self._item_id}] {self._judul} ({self._tahun_terbit}) - Status: {status}"


class Book(LibraryItem):
    """Subclass Buku yang mewarisi LibraryItem."""

    def __init__(self, item_id: str, judul: str, tahun_terbit: int, penulis: str, isbn: str, jumlah_halaman: int):
        super().__init__(item_id, judul, tahun_terbit)
        self.penulis = penulis
        self.isbn = isbn
        self.jumlah_halaman = jumlah_halaman
        # Tarif denda buku per hari
        self.tarif_denda_per_hari = 2000.0

    def get_detail(self) -> str:
        """Implementasi spesifik rincian data buku."""
        status = "Dipinjam" if self.is_dipinjam else "Tersedia"
        return (
            f"[BUKU] ID: {self.item_id} | Judul: '{self.judul}' | Penulis: {self.penulis} | "
            f"Tahun: {self.tahun_terbit} | Halaman: {self.jumlah_halaman} | ISBN: {self.isbn} | Status: {status}"
        )

    def hitung_denda(self, hari_terlambat: int) -> float:
        """Menghitung denda buku (Rp 2.000 / hari keterlambatan)."""
        if hari_terlambat <= 0:
            return 0.0
        return float(hari_terlambat * self.tarif_denda_per_hari)


class Magazine(LibraryItem):
    """Subclass Majalah yang mewarisi LibraryItem."""

    def __init__(self, item_id: str, judul: str, tahun_terbit: int, edisi: str, volume: int, penerbit: str):
        super().__init__(item_id, judul, tahun_terbit)
        self.edisi = edisi
        self.volume = volume
        self.penerbit = penerbit
        # Tarif denda majalah per hari
        self.tarif_denda_per_hari = 1000.0

    def get_detail(self) -> str:
        """Implementasi spesifik rincian data majalah."""
        status = "Dipinjam" if self.is_dipinjam else "Tersedia"
        return (
            f"[MAJALAH] ID: {self.item_id} | Judul: '{self.judul}' | Edisi: {self.edisi} | "
            f"Vol: {self.volume} | Penerbit: {self.penerbit} | Tahun: {self.tahun_terbit} | Status: {status}"
        )

    def hitung_denda(self, hari_terlambat: int) -> float:
        """Menghitung denda majalah (Rp 1.000 / hari keterlambatan)."""
        if hari_terlambat <= 0:
            return 0.0
        return float(hari_terlambat * self.tarif_denda_per_hari)
