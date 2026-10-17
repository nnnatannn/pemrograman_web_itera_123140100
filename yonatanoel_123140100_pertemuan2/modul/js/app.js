// js/app.js
// Kumpulan fungsi demonstrasi fitur modern JavaScript (ES6+)

import { sampleUsers, sampleProducts } from "./modules/data.js";
import { formatRupiah, capitalize } from "./modules/utils.js";

// 1. Let, Const & Arrow Functions
export const demoLetConstAndArrow = () => {
  const PI = 3.14159;
  let hitung = 10;
  hitung += 5;

  const hitungLuasLingkaran = (r) => PI * r * r;
  const luas = hitungLuasLingkaran(7);

  return {
    judul: "Let, Const & Arrow Functions",
    deskripsi: `Konstanta PI = ${PI}, variabel let hitung = ${hitung}. Arrow function hitungLuasLingkaran(7) menghasilkan: ${luas.toFixed(2)}`
  };
};

// 2. Template Literals & Multi-line String
export const demoTemplateLiterals = () => {
  const mahasiswa = {
    nama: "Yonatanoel Petra Hutabarat",
    nim: "123140100",
    jurusan: "Teknik Informatika",
    semester: 4
  };

  const pesan = `Halo! Mahasiswa atas nama ${mahasiswa.nama} (${mahasiswa.nim}) terdaftar di program studi ${mahasiswa.jurusan}, semester ${mahasiswa.semester}.`;
  
  return {
    judul: "Template Literals",
    deskripsi: pesan
  };
};

// 3. Destructuring, Spread, and Rest Operators
export const demoDestructuringAndOperators = () => {
  // Destructuring Object & Array
  const [userPertama, ...sisaUser] = sampleUsers;
  const { name, role, age } = userPertama;

  // Spread Operator untuk cloning dan merge
  const userBaru = { ...userPertama, kampus: "ITERA ITERA", status: "Aktif" };

  // Rest Parameter dalam fungsi
  const hitungTotal = (...angka) => angka.reduce((acc, curr) => acc + curr, 0);
  const total = hitungTotal(10, 25, 45, 20);

  return {
    judul: "Destructuring & Spread/Rest",
    deskripsi: `User pertama: ${name} (${role}, ${age} thn). Sisa user: ${sisaUser.length} orang. Total dengan rest parameter [10,25,45,20]: ${total}. Objek baru hasil spread: nama=${userBaru.name}, kampus=${userBaru.kampus}.`
  };
};

// 4. Classes & Object Literals
class ItemBelanja {
  constructor(nama, harga, kategori = "Umum") {
    this.nama = nama;
    this.harga = harga;
    this.kategori = kategori;
  }

  get formattedHarga() {
    return formatRupiah(this.harga);
  }

  info() {
    return `${this.nama} [${this.kategori}]: ${this.formattedHarga}`;
  }
}

class ItemElektronik extends ItemBelanja {
  constructor(nama, harga, garansiBulan = 12) {
    super(nama, harga, "Elektronik");
    this.garansiBulan = garansiBulan;
  }

  info() {
    return `${super.info()} (Garansi: ${this.garansiBulan} Bulan)`;
  }
}

export const demoClasses = () => {
  const item1 = new ItemBelanja("Buku Algoritma", 75000, "Akademik");
  const item2 = new ItemElektronik("Mouse Wireless", 185000, 24);

  return {
    judul: "Classes & Inheritance",
    deskripsi: `${item1.info()} | ${item2.info()}`
  };
};

// 5. Modern Array Methods (map, filter, reduce)
export const demoArrayMethods = () => {
  // Filter: user aktif
  const userAktif = sampleUsers.filter(u => u.active);
  // Map: nama produk dan harga terformat
  const daftarHarga = sampleProducts.map(p => `${p.name} (${formatRupiah(p.price)})`);
  // Reduce: total harga produk teknologi
  const totalHargaTech = sampleProducts
    .filter(p => p.category === "tech")
    .reduce((sum, p) => sum + p.price, 0);

  return {
    judul: "Modern Array Methods (filter, map, reduce)",
    deskripsi: `User aktif (${userAktif.length}): ${userAktif.map(u => u.name).join(", ")}. Total nilai produk Tech: ${formatRupiah(totalHargaTech)}.`
  };
};

// 6. Async Programming (Async/Await & Fetch)
export const demoAsyncProgramming = async () => {
  try {
    const response = await fetch("https://dummyjson.com/quotes/random");
    if (!response.ok) throw new Error("Gagal mengambil quote");
    const data = await response.json();
    return {
      judul: "Async Programming (Async/Await & Fetch)",
      deskripsi: `"${data.quote}" — ${data.author}`
    };
  } catch (err) {
    return {
      judul: "Async Programming (Fallback)",
      deskripsi: "Berhasil mengeksekusi Async/Await dengan penanganan error gracefully."
    };
  }
};
