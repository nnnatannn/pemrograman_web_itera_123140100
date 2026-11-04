"""
Program Utama: main.py
Menguji seluruh fungsi pada modul math_operations dengan 2 metode import berbeda.

Praktikum Pengembangan Aplikasi Web - Pertemuan 4
Nama : Yonatanoel Petra Hutabarat
NIM  : 123140100
"""

# Cara Import 1: Mengimpor modul secara utuh (module namespace)
import math_operations

# Cara Import 2: Mengimpor fungsi spesifik secara langsung (specific import)
from math_operations import (
    luas_persegi,
    keliling_persegi,
    celsius_ke_fahrenheit,
    celsius_ke_kelvin,
    celsius_ke_reamur,
)


def uji_geometri():
    print("\n" + "=" * 50)
    print("        PENGUJIAN FUNGSI OPERASI GEOMETRI")
    print("=" * 50)

    # 1. Persegi (menggunakan fungsi yang diimpor langsung via Cara 2)
    sisi = 7.0
    print(f"[1] Persegi (sisi = {sisi})")
    print(f"    - Luas     : {luas_persegi(sisi):.2f}")
    print(f"    - Keliling : {keliling_persegi(sisi):.2f}")

    # 2. Persegi Panjang (menggunakan modul via Cara 1)
    panjang = 12.0
    lebar = 6.0
    print(f"\n[2] Persegi Panjang (panjang = {panjang}, lebar = {lebar})")
    print(f"    - Luas     : {math_operations.luas_persegi_panjang(panjang, lebar):.2f}")
    print(f"    - Keliling : {math_operations.keliling_persegi_panjang(panjang, lebar):.2f}")

    # 3. Lingkaran (menggunakan modul dan konstanta PI via Cara 1)
    r = 10.0
    print(f"\n[3] Lingkaran (jari-jari = {r}, konstanta PI = {math_operations.PI})")
    print(f"    - Luas     : {math_operations.luas_lingkaran(r):.2f}")
    print(f"    - Keliling : {math_operations.keliling_lingkaran(r):.2f}")


def uji_konversi_suhu():
    print("\n" + "=" * 50)
    print("         PENGUJIAN FUNGSI KONVERSI SUHU")
    print("=" * 50)

    suhu_uji = [0.0, 25.0, 36.5, 100.0]

    for c in suhu_uji:
        # Menggunakan fungsi konversi via Cara 2
        f = celsius_ke_fahrenheit(c)
        k = celsius_ke_kelvin(c)
        r = celsius_ke_reamur(c)

        print(f"Suhu: {c:>5.1f} C -> {f:>6.2f} F | {k:>6.2f} K | {r:>5.2f} R")


def main():
    print("=" * 50)
    print("  DEMONSTRASI MODUL MATEMATIKA (math_operations)")
    print("=" * 50)
    print(f"Konstanta PI pada modul: {math_operations.PI}")

    uji_geometri()
    uji_konversi_suhu()

    print("\n" + "=" * 50)
    print("         SELURUH PENGUJIAN SELESAI DENGAN BAIK")
    print("=" * 50)


if __name__ == "__main__":
    main()
