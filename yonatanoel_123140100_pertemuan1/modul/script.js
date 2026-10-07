// ==========================================
// PRAKTIKUM PAW - PERTEMUAN 1
// NAMA: Yonatanoel
// NIM: 123140100
// KELAS: RB
// ==========================================

// --- 1. VARIABEL & OUTPUT ---
var nama = "Yonatanoel";
let usia = 20;
const TAHUN_LAHIR = 2004;

console.log("Nama: " + nama);
console.log("Usia: " + usia);
console.log("Tahun Lahir: " + TAHUN_LAHIR);

const resultDiv = document.getElementById("result");
resultDiv.innerHTML = `
  <p>Nama: <strong>${nama}</strong></p>
  <p>Usia: <strong>${usia}</strong> tahun</p>
  <p>Tahun Lahir: <strong>${TAHUN_LAHIR}</strong></p>
`;

// --- STRUKTUR KONDISIONAL ---
let nilai = 85;
let grade = "";

if (nilai >= 90) {
  grade = "A";
} else if (nilai >= 80) {
  grade = "B";
} else if (nilai >= 70) {
  grade = "C";
} else if (nilai >= 60) {
  grade = "D";
} else {
  grade = "E";
}

let status = nilai >= 60 ? "Lulus" : "Tidak Lulus";

let hari = new Date().getDay();
let namaHari = "";
switch (hari) {
  case 0: namaHari = "Minggu"; break;
  case 1: namaHari = "Senin"; break;
  case 2: namaHari = "Selasa"; break;
  case 3: namaHari = "Rabu"; break;
  case 4: namaHari = "Kamis"; break;
  case 5: namaHari = "Jumat"; break;
  case 6: namaHari = "Sabtu"; break;
  default: namaHari = "Hari tidak valid";
}

resultDiv.innerHTML += `
  <hr>
  <p>Nilai: <strong>${nilai}</strong></p>
  <p>Grade: <strong>${grade}</strong></p>
  <p>Status: <strong>${status}</strong></p>
  <p>Hari ini adalah: <strong>${namaHari}</strong></p>
`;

// --- 2. LOOP & PERULANGAN ---
const loopOutput = document.getElementById("loop-output");

// For Loop
let nilaiSiswa = [85, 92, 78, 90, 88];
let total = 0;
let listHtml = "";

for (let i = 0; i < nilaiSiswa.length; i++) {
  total += nilaiSiswa[i];
  listHtml += `<li>Siswa ${i + 1}: ${nilaiSiswa[i]}</li>`;
}
let rataRata = total / nilaiSiswa.length;

// While Loop Countdown
let hitungMundur = 5;
let countdownHtml = "";
while (hitungMundur > 0) {
  countdownHtml += `<span style="display:inline-block; background:#e0e7ff; padding:2px 8px; margin:2px; border-radius:4px;">${hitungMundur}</span> `;
  hitungMundur--;
}

// For...of Loop
let forOfHtml = "";
for (let n of nilaiSiswa) {
  let statusColor = n >= 80 ? "color: green;" : "color: red;";
  forOfHtml += `<span style="background:#f1f5f9; padding:2px 8px; margin:2px; border-radius:4px; ${statusColor} font-weight:bold;">${n}</span> `;
}

loopOutput.innerHTML = `
  <h4>Daftar Nilai Siswa (For Loop):</h4>
  <ul style="margin-left: 1.5rem; margin-bottom: 0.5rem;">${listHtml}</ul>
  <p>Rata-rata Nilai: <strong>${rataRata.toFixed(2)}</strong></p>
  <hr>
  <h4>Countdown (While Loop):</h4>
  <div style="margin: 0.5rem 0;">${countdownHtml}</div>
  <hr>
  <h4>Nilai dengan for...of:</h4>
  <div style="margin: 0.5rem 0;">${forOfHtml}</div>
`;

// --- FUNGSI & EVENT HANDLER ---
function sapaNama(namaInput) {
  return `Halo, ${namaInput}! Selamat belajar JavaScript di Praktikum PAW ITERA!`;
}

document.getElementById("sapa-button").addEventListener("click", function () {
  const namaInputVal = document.getElementById("nama-input").value;
  const sapaOutput = document.getElementById("sapa-output");
  if (namaInputVal.trim() === "") {
    sapaOutput.innerHTML = `<span style="color: red;">Silakan masukkan nama Anda terlebih dahulu!</span>`;
  } else {
    sapaOutput.innerHTML = `<span style="color: green; font-weight: 500;">${sapaNama(namaInputVal)}</span>`;
  }
});

// Kalkulator
function hitungKalkulator(angka1, angka2, operasi) {
  let hasil = 0;
  switch (operasi) {
    case "tambah": hasil = angka1 + angka2; break;
    case "kurang": hasil = angka1 - angka2; break;
    case "kali": hasil = angka1 * angka2; break;
    case "bagi":
      if (angka2 === 0) return "Error: Pembagian dengan nol tidak diperbolehkan";
      hasil = angka1 / angka2;
      break;
    default: return "Operasi tidak valid";
  }
  return hasil;
}

function prosesKalkulator(op, simbol) {
  const a1 = parseFloat(document.getElementById("angka1").value);
  const a2 = parseFloat(document.getElementById("angka2").value);
  const out = document.getElementById("hasil-kalkulator");

  if (isNaN(a1) || isNaN(a2)) {
    out.innerHTML = `<span style="color: red;">Masukkan kedua angka yang valid!</span>`;
    return;
  }

  const hasil = hitungKalkulator(a1, a2, op);
  out.innerHTML = `Hasil: ${a1} ${simbol} ${a2} = <strong>${hasil}</strong>`;
}

document.getElementById("btn-tambah").addEventListener("click", () => prosesKalkulator("tambah", "+"));
document.getElementById("btn-kurang").addEventListener("click", () => prosesKalkulator("kurang", "-"));
document.getElementById("btn-kali").addEventListener("click", () => prosesKalkulator("kali", "×"));
document.getElementById("btn-bagi").addEventListener("click", () => prosesKalkulator("bagi", "÷"));

// --- 3. STRUKTUR DATA: ARRAY & OBJEK ---
const buah = ["Apel", "Jeruk", "Mangga", "Pisang", "Anggur"];
const arrayDemo = document.getElementById("array-demo");

let htmlArray = `<p><strong>Array Awal:</strong> ${buah.join(", ")}</p>`;
buah.push("Durian");
htmlArray += `<p><strong>Setelah push("Durian"):</strong> ${buah.join(", ")}</p>`;
const itemDihapus = buah.pop();
htmlArray += `<p><strong>Setelah pop():</strong> ${buah.join(", ")} (dihapus: ${itemDihapus})</p>`;
buah.sort();
htmlArray += `<p><strong>Setelah sort():</strong> ${buah.join(", ")}</p>`;

const hargaBuah = [10000, 8000, 15000, 5000, 20000];
const daftarBuah = buah.map((item, idx) => `${item} (Rp${(hargaBuah[idx] || 10000).toLocaleString()})`);
htmlArray += `<p><strong>Map Harga:</strong> ${daftarBuah.join(", ")}</p>`;

const buahMahal = buah.filter((_, idx) => (hargaBuah[idx] || 10000) > 10000);
htmlArray += `<p><strong>Filter (> Rp 10.000):</strong> ${buahMahal.join(", ")}</p>`;
arrayDemo.innerHTML = htmlArray;

// Objek Mahasiswa
const mahasiswa = {
  nama: "Yonatanoel",
  nim: "123140100",
  jurusan: "Teknik Informatika",
  nilai: { algoritma: 88, basis_data: 92, web: 95 },
  hobi: ["Coding", "Musik", "Membaca"],
  tampilkanInfo: function () {
    return `${this.nama} (${this.nim}) - ${this.jurusan}`;
  },
  hitungRataRata: function () {
    const arr = Object.values(this.nilai);
    const sum = arr.reduce((acc, val) => acc + val, 0);
    return (sum / arr.length).toFixed(2);
  }
};

const objekDemo = document.getElementById("objek-demo");
let htmlObjek = `
  <p><strong>Info Mahasiswa:</strong> ${mahasiswa.tampilkanInfo()}</p>
  <p><strong>Rata-rata Nilai:</strong> ${mahasiswa.hitungRataRata()}</p>
  <p><strong>Hobi:</strong> ${mahasiswa.hobi.join(", ")}</p>
`;
mahasiswa.email = "yonata.123140100@student.itera.ac.id";
htmlObjek += `<p><strong>Email Ditambahkan:</strong> ${mahasiswa.email}</p>`;
objekDemo.innerHTML = htmlObjek;

// --- 4. MANIPULASI DOM ---
const domOutput = document.getElementById("dom-output");
let itemCount = 0;

document.getElementById("btn-tambah-item").addEventListener("click", () => {
  if (itemCount === 0) domOutput.innerHTML = "";
  itemCount++;
  const div = document.createElement("div");
  div.style.padding = "6px 10px";
  div.style.margin = "4px 0";
  div.style.background = "#ffffff";
  div.style.borderRadius = "4px";
  div.style.border = "1px solid #cbd5e1";
  div.textContent = `Item ${itemCount} - Ditambahkan secara dinamis`;
  domOutput.appendChild(div);
});

document.getElementById("btn-hapus-item").addEventListener("click", () => {
  if (domOutput.lastChild && itemCount > 0) {
    domOutput.removeChild(domOutput.lastChild);
    itemCount--;
  }
  if (itemCount === 0) {
    domOutput.innerHTML = '<p class="placeholder-text">Area konten manipulasi DOM</p>';
  }
});

document.getElementById("btn-ubah-warna").addEventListener("click", () => {
  const colors = ["bg-blue-100", "bg-green-100", "bg-yellow-100", "bg-pink-100"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  domOutput.className = `dom-box ${randomColor}`;
});

// --- 5. FETCH API ---
document.getElementById("btn-fetch").addEventListener("click", async () => {
  const apiOutput = document.getElementById("api-output");
  apiOutput.innerHTML = "<p>Memuat data dari API...</p>";

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await res.json();
    apiOutput.innerHTML = "<h4 style='margin-bottom:0.5rem;'>Daftar 3 Post Teratas:</h4>";
    data.slice(0, 3).forEach((post) => {
      apiOutput.innerHTML += `
        <div style="background:white; border:1px solid #e2e8f0; padding:8px 12px; margin-bottom:8px; border-radius:6px;">
          <h5 style="color:#1e40af; font-weight:600;">#${post.id} ${post.title}</h5>
          <p style="font-size:0.85rem; color:#475569;">${post.body}</p>
        </div>
      `;
    });
  } catch (err) {
    apiOutput.innerHTML = `<span style="color:red;">Gagal mengambil data: ${err.message}</span>`;
  }
});
