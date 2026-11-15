"""
Modul: library.py
Deskripsi: Mendefinisikan class Library untuk mengelola inventaris item dan anggota perpustakaan.

Praktikum Pengembangan Aplikasi Web - Pertemuan 5
Nama : Yonatanoel Petra Hutabarat
NIM  : 123140100
"""

from library_item import LibraryItem
from member import Member


class Library:
    """Class untuk mengelola seluruh sistem operasional perpustakaan."""

    def __init__(self, nama: str):
        self.nama = nama
        # Atribut Private: inventaris koleksi dan daftar anggota terlindungi dari akses luar langsung
        self.__koleksi = []
        self.__anggota = []

    # --------------------------------------------------------------------------
    # PROPERTY GETTER
    # --------------------------------------------------------------------------
    @property
    def total_item(self) -> int:
        """Mengembalikan total seluruh item yang terdaftar di perpustakaan."""
        return len(self.__koleksi)

    @property
    def total_anggota(self) -> int:
        """Mengembalikan total anggota yang terdaftar."""
        return len(self.__anggota)

    # --------------------------------------------------------------------------
    # MANAJEMEN ITEM PERPUSTAKAAN
    # --------------------------------------------------------------------------
    def tambah_item(self, item: LibraryItem):
        """Menambahkan item baru (Buku/Majalah) ke dalam inventaris perpustakaan."""
        if not isinstance(item, LibraryItem):
            raise TypeError("Item harus merupakan objek turunan dari LibraryItem!")

        # Validasi duplikasi ID
        if any(i.item_id == item.item_id for i in self.__koleksi):
            print(f"[Peringatan] Item dengan ID '{item.item_id}' sudah terdaftar dalam koleksi!")
            return

        self.__koleksi.append(item)
        print(f"[Inventaris] Berhasil menambahkan item: '{item.judul}' (ID: {item.item_id})")

    def tampilkan_katalog(self, hanya_tersedia: bool = False):
        """Menampilkan seluruh katalog item perpustakaan atau hanya yang berstatus tersedia."""
        judul_tabel = "KATALOG ITEM TERSEDIA" if hanya_tersedia else "KATALOG LENGKAP PERPUSTAKAAN"
        print("\n" + "=" * 90)
        print(f"  {self.nama.upper()} - {judul_tabel}")
        print("=" * 90)

        daftar = [item for item in self.__koleksi if not item.is_dipinjam] if hanya_tersedia else self.__koleksi

        if not daftar:
            print("  (Tidak ada item dalam katalog)")
            print("=" * 90)
            return

        for idx, item in enumerate(daftar, start=1):
            # Pemanggilan method get_detail() secara polimorfik
            print(f"{idx:>2}. {item.get_detail()}")
        print("=" * 90)

    def cari_berdasarkan_id(self, item_id: str) -> LibraryItem | None:
        """Mencari item spesifik berdasarkan ID unik."""
        for item in self.__koleksi:
            if item.item_id.lower() == str(item_id).lower():
                return item
        return None

    def cari_berdasarkan_judul(self, keyword: str) -> list:
        """Mencari item berdasarkan kecocokan kata kunci pada judul (case-insensitive)."""
        hasil = [item for item in self.__koleksi if keyword.lower() in item.judul.lower()]
        return hasil

    # --------------------------------------------------------------------------
    # MANAJEMEN ANGGOTA & TRANSAKSI
    # --------------------------------------------------------------------------
    def tambah_member(self, member: Member):
        """Mendaftarkan anggota baru ke perpustakaan."""
        if not isinstance(member, Member):
            raise TypeError("Objek harus merupakan instance dari class Member!")

        if any(m.member_id == member.member_id for m in self.__anggota):
            print(f"[Peringatan] Anggota dengan ID '{member.member_id}' sudah terdaftar!")
            return

        self.__anggota.append(member)
        print(f"[Keanggotaan] Berhasil mendaftarkan anggota: '{member.nama}' (ID: {member.member_id})")

    def cari_member(self, member_id: str) -> Member | None:
        """Mencari anggota berdasarkan member_id."""
        for member in self.__anggota:
            if member.member_id.lower() == str(member_id).lower():
                return member
        return None

    def pinjam_item(self, member_id: str, item_id: str) -> bool:
        """Memproses transaksi peminjaman item oleh anggota perpustakaan."""
        member = self.cari_member(member_id)
        if not member:
            print(f"[Transaksi Gagal] Anggota dengan ID '{member_id}' tidak ditemukan.")
            return False

        item = self.cari_berdasarkan_id(item_id)
        if not item:
            print(f"[Transaksi Gagal] Item dengan ID '{item_id}' tidak ditemukan di katalog.")
            return False

        return member.pinjam_item(item)

    def kembalikan_item(self, member_id: str, item_id: str, hari_terlambat: int = 0) -> bool:
        """Memproses pengembalian item oleh anggota disertai kalkulasi denda jika terlambat."""
        member = self.cari_member(member_id)
        if not member:
            print(f"[Transaksi Gagal] Anggota dengan ID '{member_id}' tidak ditemukan.")
            return False

        item = self.cari_berdasarkan_id(item_id)
        if not item:
            print(f"[Transaksi Gagal] Item dengan ID '{item_id}' tidak ditemukan.")
            return False

        if member.kembalikan_item(item):
            # Perhitungan denda secara polimorfik memanggil hitung_denda milik Book/Magazine
            if hari_terlambat > 0:
                denda = item.hitung_denda(hari_terlambat)
                print(f" -> Keterlambatan: {hari_terlambat} hari. Denda yang wajib dibayar: Rp {denda:,.2f}")
            else:
                print(" -> Tepat waktu. Tidak dikenakan denda keterlambatan.")
            return True
        return False
