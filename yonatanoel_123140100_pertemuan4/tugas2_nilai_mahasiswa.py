"""
Tugas 2: Program Pengelolaan Data Nilai Mahasiswa
Praktikum Pengembangan Aplikasi Web - Pertemuan 4
Nama : Yonatanoel Petra Hutabarat
NIM  : 123140100
"""


def hitung_nilai_akhir(uts: float, uas: float, tugas: float) -> float:
    """Menghitung nilai akhir mahasiswa berdasarkan bobot:

    - UTS   : 30%
    - UAS   : 40%
    - Tugas : 30%
    """
    return (0.30 * uts) + (0.40 * uas) + (0.30 * tugas)


def tentukan_grade(nilai_akhir: float) -> str:
    """Menentukan grade huruf berdasarkan kriteria nilai akhir:

    - A : nilai >= 80
    - B : 70 <= nilai < 80
    - C : 60 <= nilai < 70
    - D : 50 <= nilai < 60
    - E : nilai < 50
    """
    if nilai_akhir >= 80:
        return "A"
    elif nilai_akhir >= 70:
        return "B"
    elif nilai_akhir >= 60:
        return "C"
    elif nilai_akhir >= 50:
        return "D"
    else:
        return "E"


def main():
    # Daftar data mahasiswa (minimal 5 data dictionary)
    daftar_mahasiswa = [
        {
            "nama": "Yonatanoel Petra Hutabarat",
            "nim": "123140100",
            "nilai_uts": 85.0,
            "nilai_uas": 90.0,
            "nilai_tugas": 88.0,
        },
        {
            "nama": "Rifael Eurico Sitorus",
            "nim": "123140077",
            "nilai_uts": 75.0,
            "nilai_uas": 78.0,
            "nilai_tugas": 80.0,
        },
        {
            "nama": "Bintang Al-Fasya",
            "nim": "123140098",
            "nilai_uts": 65.0,
            "nilai_uas": 68.0,
            "nilai_tugas": 70.0,
        },
        {
            "nama": "Ebentua Philippus Limbong",
            "nim": "123140086",
            "nilai_uts": 55.0,
            "nilai_uas": 58.0,
            "nilai_tugas": 52.0,
        },
        {
            "nama": "Agus Subekti",
            "nim": "123140104",
            "nilai_uts": 45.0,
            "nilai_uas": 40.0,
            "nilai_tugas": 48.0,
        },
    ]

    # Proses perhitungan nilai akhir dan penentuan grade
    for mhs in daftar_mahasiswa:
        mhs["nilai_akhir"] = hitung_nilai_akhir(
            mhs["nilai_uts"], mhs["nilai_uas"], mhs["nilai_tugas"]
        )
        mhs["grade"] = tentukan_grade(mhs["nilai_akhir"])

    # Tampilkan tabel data mahasiswa
    header_separator = "+" + "-" * 4 + "+" + "-" * 30 + "+" + "-" * 13 + "+" + "-" * 7 + "+" + "-" * 7 + "+" + "-" * 7 + "+" + "-" * 13 + "+" + "-" * 7 + "+"
    print("=" * 94)
    print("                      DAFTAR NILAI AKHIR MAHASISWA PRAKTIKUM PAW")
    print("=" * 94)
    print(header_separator)
    print(f"| {'No':<2} | {'Nama Mahasiswa':<28} | {'NIM':<11} | {'UTS':<5} | {'UAS':<5} | {'TGS':<5} | {'Nilai Akhir':<11} | {'Grade':<5} |")
    print(header_separator)

    for idx, mhs in enumerate(daftar_mahasiswa, start=1):
        print(
            f"| {idx:<2} "
            f"| {mhs['nama']:<28} "
            f"| {mhs['nim']:<11} "
            f"| {mhs['nilai_uts']:<5.1f} "
            f"| {mhs['nilai_uas']:<5.1f} "
            f"| {mhs['nilai_tugas']:<5.1f} "
            f"| {mhs['nilai_akhir']:<11.2f} "
            f"| {mhs['grade']:<5} |"
        )
    print(header_separator)

    # Mencari mahasiswa dengan nilai tertinggi dan terendah
    mahasiswa_tertinggi = max(daftar_mahasiswa, key=lambda x: x["nilai_akhir"])
    mahasiswa_terendah = min(daftar_mahasiswa, key=lambda x: x["nilai_akhir"])

    # Tampilkan ringkasan statistik
    print("\n" + "=" * 55)
    print("                  STATISTIK NILAI")
    print("=" * 55)
    print("Nilai Akhir Tertinggi:")
    print(f"  - Nama        : {mahasiswa_tertinggi['nama']}")
    print(f"  - NIM         : {mahasiswa_tertinggi['nim']}")
    print(f"  - Nilai Akhir : {mahasiswa_tertinggi['nilai_akhir']:.2f} (Grade: {mahasiswa_tertinggi['grade']})")

    print("\nNilai Akhir Terendah:")
    print(f"  - Nama        : {mahasiswa_terendah['nama']}")
    print(f"  - NIM         : {mahasiswa_terendah['nim']}")
    print(f"  - Nilai Akhir : {mahasiswa_terendah['nilai_akhir']:.2f} (Grade: {mahasiswa_terendah['grade']})")
    print("=" * 55)


if __name__ == "__main__":
    main()

