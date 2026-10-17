// js/main.js
// Controller DOM untuk menjalankan materi demonstrasi ES6+

import {
  demoLetConstAndArrow,
  demoTemplateLiterals,
  demoDestructuringAndOperators,
  demoClasses,
  demoArrayMethods,
  demoAsyncProgramming
} from "./app.js";

const outputContainer = document.getElementById("output");
const runBtn = document.getElementById("runBtn");
const clearBtn = document.getElementById("clearBtn");

export function addOutput(title, description, badge = "ES6+ Feature") {
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
  
  // 1. Let, Const & Arrow
  const res1 = demoLetConstAndArrow();
  addOutput(res1.judul, res1.deskripsi, "Variable & Arrow");

  // 2. Template Literals
  const res2 = demoTemplateLiterals();
  addOutput(res2.judul, res2.deskripsi, "Template Literals");

  // 3. Destructuring & Spread/Rest
  const res3 = demoDestructuringAndOperators();
  addOutput(res3.judul, res3.deskripsi, "Destructuring & Spread");

  // 4. Classes
  const res4 = demoClasses();
  addOutput(res4.judul, res4.deskripsi, "OOP & Classes");

  // 5. Modern Array Methods
  const res5 = demoArrayMethods();
  addOutput(res5.judul, res5.deskripsi, "Array Methods");

  // 6. Async Programming
  addOutput("Async Programming", "Memuat data eksternal secara asinkron...", "Async / Await");
  const res6 = await demoAsyncProgramming();
  // Update atau tambah hasil
  const lastChild = outputContainer.lastElementChild;
  if (lastChild) {
    lastChild.querySelector("p").textContent = res6.deskripsi;
  }
};

const clearAllOutput = () => {
  outputContainer.innerHTML = `
    <div class="text-center text-gray-400 py-8">
      <p>Klik tombol <strong>"Run Demo"</strong> untuk menjalankan modul pembelajaran ES6+.</p>
    </div>
  `;
};

if (runBtn) runBtn.addEventListener("click", runAllDemos);
if (clearBtn) clearBtn.addEventListener("click", clearAllOutput);

// Inisialisasi tampilan awal
clearAllOutput();
