"""
Modul: math_operations.py
Berisi kumpulan fungsi operasi geometri (luas & keliling) dan konversi suhu.

Praktikum Pengembangan Aplikasi Web - Pertemuan 4
Nama : Yonatanoel Petra Hutabarat
NIM  : 123140100
"""

# Nilai konstanta PI
PI = 3.14159


# ==========================================
# FUNGSI PERHITUNGAN GEOMETRI
# ==========================================

def luas_persegi(sisi: float) -> float:
    """Menghitung luas persegi.

    Parameter:
        sisi (float): Panjang sisi persegi.

    Return:
        float: Nilai luas persegi (sisi * sisi).
    """
    return sisi * sisi


def keliling_persegi(sisi: float) -> float:
    """Menghitung keliling persegi.

    Parameter:
        sisi (float): Panjang sisi persegi.

    Return:
        float: Nilai keliling persegi (4 * sisi).
    """
    return 4 * sisi


def luas_persegi_panjang(panjang: float, lebar: float) -> float:
    """Menghitung luas persegi panjang.

    Parameter:
        panjang (float): Panjang persegi panjang.
        lebar (float): Lebar persegi panjang.

    Return:
        float: Nilai luas persegi panjang (panjang * lebar).
    """
    return panjang * lebar


def keliling_persegi_panjang(panjang: float, lebar: float) -> float:
    """Menghitung keliling persegi panjang.

    Parameter:
        panjang (float): Panjang persegi panjang.
        lebar (float): Lebar persegi panjang.

    Return:
        float: Nilai keliling persegi panjang (2 * (panjang + lebar)).
    """
    return 2 * (panjang + lebar)


def luas_lingkaran(jari_jari: float) -> float:
    """Menghitung luas lingkaran menggunakan konstanta PI.

    Parameter:
        jari_jari (float): Jari-jari lingkaran.

    Return:
        float: Nilai luas lingkaran (PI * r^2).
    """
    return PI * (jari_jari ** 2)


def keliling_lingkaran(jari_jari: float) -> float:
    """Menghitung keliling lingkaran menggunakan konstanta PI.

    Parameter:
        jari_jari (float): Jari-jari lingkaran.

    Return:
        float: Nilai keliling lingkaran (2 * PI * r).
    """
    return 2 * PI * jari_jari


# ==========================================
# FUNGSI KONVERSI SUHU
# ==========================================

def celsius_ke_fahrenheit(celsius: float) -> float:
    """Mengonversi suhu dari Celsius ke Fahrenheit.

    Parameter:
        celsius (float): Derajat suhu Celsius.

    Return:
        float: Nilai suhu dalam skala Fahrenheit ((C * 9/5) + 32).
    """
    return (celsius * 9 / 5) + 32


def celsius_ke_kelvin(celsius: float) -> float:
    """Mengonversi suhu dari Celsius ke Kelvin.

    Parameter:
        celsius (float): Derajat suhu Celsius.

    Return:
        float: Nilai suhu dalam skala Kelvin (C + 273.15).
    """
    return celsius + 273.15


def celsius_ke_reamur(celsius: float) -> float:
    """Mengonversi suhu dari Celsius ke Reamur.

    Parameter:
        celsius (float): Derajat suhu Celsius.

    Return:
        float: Nilai suhu dalam skala Reamur (C * 4/5).
    """
    return celsius * 4 / 5

