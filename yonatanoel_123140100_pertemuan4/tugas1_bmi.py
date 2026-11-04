"""
Tugas 1: Program Penghitung BMI (Body Mass Index) Sederhana
Praktikum Pengembangan Aplikasi Web - Pertemuan 4
Nama : Yonatanoel Petra Hutabarat
NIM  : 123140100
"""


def hitung_bmi(berat: float, tinggi: float) -> float:
    """Menghitung nilai Body Mass Index (BMI).

    Rumus: berat (kg) / (tinggi (m) ** 2)
    """
    return berat / (tinggi * tinggi)


def tentukan_kategori(bmi: float) -> str:
    """Menentukan kategori berat badan berdasarkan nilai BMI.

    Kriteria:
    - BMI < 18.5        : Berat badan kurang
    - 18.5 <= BMI < 25  : Berat badan normal
    - 25 <= BMI < 30    : Berat badan berlebih
    - BMI >= 30         : Obesitas
    """
    if bmi < 18.5:
        return "Berat badan kurang"
    elif 18.5 <= bmi < 25:
        return "Berat badan normal"
    elif 25 <= bmi < 30:
        return "Berat badan berlebih"
    else:
        return "Obesitas"


def main():
    print("=" * 45)
    print("      PROGRAM PENGHITUNG BODY MASS INDEX (BMI)")
    print("=" * 45)

    try:
        # Input berat badan dan tinggi badan dari pengguna
        berat = float(input("Masukkan berat badan (kg) : "))
        tinggi = float(input("Masukkan tinggi badan (m)  : "))

        # Validasi nilai positif
        if berat <= 0 or tinggi <= 0:
            print("\n[Error] Berat dan tinggi badan harus bernilai lebih dari 0.")
            return

        # Hitung BMI dan tentukan kategori
        bmi = hitung_bmi(berat, tinggi)
        kategori = tentukan_kategori(bmi)

        # Tampilkan hasil perhitungan
        print("-" * 45)
        print(f"Hasil Perhitungan:")
        print(f"- Nilai BMI       : {bmi:.2f}")
        print(f"- Kategori Status : {kategori}")
        print("=" * 45)

    except ValueError:
        print("\n[Error] Input tidak valid! Harap masukkan angka yang sesuai.")


if __name__ == "__main__":
    main()

