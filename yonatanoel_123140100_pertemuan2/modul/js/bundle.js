// modul/js/bundle.js
// Fallback demo script untuk protokol file:// jika dibuka langsung via File Explorer

(function() {
  if (window.__MODUL_DEMO_INITIALIZED__) return;
  window.__MODUL_DEMO_INITIALIZED__ = true;

  const sampleUsers = [
    { id: 1, name: "John Doe", role: "admin", active: true, age: 28 },
    { id: 2, name: "Jane Smith", role: "user", active: false, age: 24 },
    { id: 3, name: "Alice Johnson", role: "user", active: true, age: 31 },
    { id: 4, name: "Bob Martin", role: "admin", active: true, age: 22 }
  ];

  const sampleProducts = [
    { id: "P01", name: "Laptop Gaming", price: 15000000, category: "tech" },
    { id: "P02", name: "Mechanical Keyboard", price: 850000, category: "tech" },
    { id: "P03", name: "Ergonomic Chair", price: 2200000, category: "furniture" }
  ];

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0
    }).format(number);
  };

  const outputContainer = document.getElementById("output");
  const runBtn = document.getElementById("runBtn");
  const clearBtn = document.getElementById("clearBtn");

  function addOutput(title, description, badge = "ES6+ Feature") {
    if (!outputContainer) return;
    const card = document.createElement("div");
    card.className = "p-4 bg-gray-50 border border-gray-200 rounded-lg shadow-sm hover:shadow transition-all duration-200";
    card.innerHTML = `
      <div class="flex items-center justify-between mb-2">
        <h3 class="font-bold text-gray-800 text-lg">${title}</h3>
        <span class="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded font-semibold">${badge}</span>
      </div>
      <p class="text-gray-700 text-sm whitespace-pre-line leading-relaxed">${description}</p>
    `;
    outputContainer.appendChild(card);
  }

  const runAllDemos = async () => {
    outputContainer.innerHTML = "";
    
    // 1. Let & Const
    const PI = 3.14159;
    let hitung = 10 + 5;
    const hitungLuas = (r) => PI * r * r;
    addOutput("Let, Const & Arrow Functions", `Konstanta PI = ${PI}, variabel hitung = ${hitung}. Luas r=7: ${hitungLuas(7).toFixed(2)}`, "Variable & Arrow");

    // 2. Template Literals
    const mhs = { nama: "Yonatanoel Petra Hutabarat", nim: "123140100", jurusan: "Teknik Informatika" };
    addOutput("Template Literals", `Mahasiswa: ${mhs.nama} (${mhs.nim}) - ${mhs.jurusan}`, "Template Literals");

    // 3. Destructuring & Spread
    const [u1, ...sisa] = sampleUsers;
    const { name, role } = u1;
    addOutput("Destructuring & Spread/Rest", `User: ${name} [${role}], Sisa user: ${sisa.length} orang.`, "Destructuring & Spread");

    // 4. Classes
    class Item {
      constructor(n, p) { this.n = n; this.p = p; }
      info() { return `${this.n}: ${formatRupiah(this.p)}`; }
    }
    const item1 = new Item("Buku Algoritma", 75000);
    addOutput("Classes & OOP", item1.info(), "OOP & Classes");

    // 5. Array Methods
    const aktif = sampleUsers.filter(u => u.active).map(u => u.name).join(", ");
    addOutput("Modern Array Methods", `User aktif (${aktif})`, "Array Methods");

    // 6. Async/Await
    addOutput("Async Programming", "Mengambil kutipan via Fetch API...", "Async / Await");
    try {
      const res = await fetch("https://dummyjson.com/quotes/random");
      const d = await res.json();
      const lastChild = outputContainer.lastElementChild;
      if (lastChild) lastChild.querySelector("p").textContent = `"${d.quote}" — ${d.author}`;
    } catch (e) {
      const lastChild = outputContainer.lastElementChild;
      if (lastChild) lastChild.querySelector("p").textContent = `"Pendidikan adalah senjata paling mematikan di dunia." — Nelson Mandela`;
    }
  };

  const clearAllOutput = () => {
    if (!outputContainer) return;
    outputContainer.innerHTML = `
      <div class="text-center text-gray-400 py-8">
        <p>Klik tombol <strong>"Run All Demos"</strong> untuk menjalankan modul pembelajaran ES6+.</p>
      </div>
    `;
  };

  if (runBtn) runBtn.addEventListener("click", runAllDemos);
  if (clearBtn) clearBtn.addEventListener("click", clearAllOutput);
  clearAllOutput();
})();
