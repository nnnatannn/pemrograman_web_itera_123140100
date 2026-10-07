/**
 * Kantin ITERA Mini POS - JavaScript Logic
 * Praktikum Pemrograman Aplikasi Web (PAW) - Pertemuan 1
 * Nama: Yonatanoel
 * NIM: 123140100
 * Kelas: RB
 */

// ==========================================
// 1. STATE & KONSTANTA APLIKASI
// ==========================================
const STORAGE_KEY = "itera_mini_pos_cart";
const PROMO_CODE_VALID = "HEMAT10";
const MIN_DISCOUNT_THRESHOLD = 50000; // Minimal belanja Rp 50.000 dapat diskon 10%
const DISCOUNT_PERCENTAGE = 0.10; // Diskon 10%

// State Keranjang Belanja
let cart = [];
let appliedPromo = null; // Menyimpan info kode promo aktif

// ==========================================
// 2. HELPER UTILITY: FORMAT RUPIAH
// ==========================================
function formatRupiah(number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
}

// ==========================================
// 3. ELEMEN DOM
// ==========================================
// Form Elements
const formItem = document.getElementById("form-item");
const itemNameInput = document.getElementById("item-name");
const itemPriceInput = document.getElementById("item-price");
const itemQtyInput = document.getElementById("item-qty");

// Error Feedback Elements
const errorItemName = document.getElementById("error-item-name");
const errorItemPrice = document.getElementById("error-item-price");
const errorItemQty = document.getElementById("error-item-qty");

// Table & Empty State Elements
const cartTable = document.getElementById("cart-table");
const cartBody = document.getElementById("cart-body");
const cartEmptyState = document.getElementById("cart-empty-state");
const cartCounterHint = document.getElementById("cart-counter-hint");
const btnResetCart = document.getElementById("btn-reset-cart");

// Promo Code Elements
const promoCodeInput = document.getElementById("promo-code");
const btnApplyPromo = document.getElementById("btn-apply-promo");
const btnCancelPromo = document.getElementById("btn-cancel-promo");
const promoStatus = document.getElementById("promo-status");

// Payment Elements
const cashAmountInput = document.getElementById("cash-amount");
const errorCashAmount = document.getElementById("error-cash-amount");
const paymentStatusBadge = document.getElementById("payment-status-badge");
const changeTextLabel = document.getElementById("change-text-label");
const changeDisplay = document.getElementById("change-display");
const changeNote = document.getElementById("change-note");
const changeBox = document.getElementById("change-box");
const btnCashExact = document.getElementById("btn-cash-exact");
const quickCashButtons = document.querySelectorAll(".quick-cash-buttons .btn-chip[data-val]");

// Summary Display Elements
const summarySubtotal = document.getElementById("summary-subtotal");
const summaryDiscount = document.getElementById("summary-discount");
const summaryGrandTotal = document.getElementById("summary-grand-total");
const summaryPaid = document.getElementById("summary-paid");
const summaryChange = document.getElementById("summary-change");
const discountBadge = document.getElementById("discount-badge");
const btnCheckout = document.getElementById("btn-checkout");

// Modal Struk Elements
const receiptModal = document.getElementById("receipt-modal");
const receiptItems = document.getElementById("receipt-items");
const receiptSubtotal = document.getElementById("receipt-subtotal");
const receiptDiscount = document.getElementById("receipt-discount");
const receiptDiscountLabel = document.getElementById("receipt-discount-label");
const receiptTotal = document.getElementById("receipt-total");
const receiptPaid = document.getElementById("receipt-paid");
const receiptChange = document.getElementById("receipt-change");
const receiptDate = document.getElementById("receipt-date");
const receiptId = document.getElementById("receipt-id");
const btnCloseReceipt = document.getElementById("btn-close-receipt");

// Toast Container
const toastContainer = document.getElementById("toast-container");

// ==========================================
// 4. SISTEM NOTIFIKASI TOAST
// ==========================================
function showToast(message, type = "info") {
  const toast = document.createElement("div");
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  toastContainer.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(100%)";
    toast.style.transition = "all 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ==========================================
// 5. LOCALSTORAGE INTEGRATION (SERIALISASI)
// ==========================================
/**
 * Menyimpan array keranjang ke localStorage dengan JSON.stringify()
 */
function saveCartToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error("Gagal menyimpan ke LocalStorage:", error);
  }
}

/**
 * Memuat array keranjang dari localStorage dengan JSON.parse()
 */
function loadCartFromLocalStorage() {
  try {
    const rawData = localStorage.getItem(STORAGE_KEY);
    if (rawData) {
      cart = JSON.parse(rawData);
    } else {
      cart = [];
    }
  } catch (error) {
    console.error("Gagal memuat dari LocalStorage:", error);
    cart = [];
  }
}

// ==========================================
// 6. VALIDASI FORM INPUT BARANG
// ==========================================
function clearFormErrors() {
  errorItemName.textContent = "";
  errorItemPrice.textContent = "";
  errorItemQty.textContent = "";

  itemNameInput.classList.remove("input-error");
  itemPriceInput.classList.remove("input-error");
  itemQtyInput.classList.remove("input-error");
}

function validateItemInput(name, price, qty) {
  let isValid = true;
  clearFormErrors();

  // Validasi Nama Barang: Wajib diisi, minimal 3 karakter
  if (!name || name.trim().length < 3) {
    errorItemName.textContent = "Nama barang wajib diisi dan minimal 3 karakter!";
    itemNameInput.classList.add("input-error");
    isValid = false;
  }

  // Validasi Harga Satuan: Angka positif dan minimal Rp 500
  if (isNaN(price) || price < 500) {
    errorItemPrice.textContent = "Harga satuan wajib berupa angka positif minimal Rp 500!";
    itemPriceInput.classList.add("input-error");
    isValid = false;
  }

  // Validasi Jumlah / Qty: Angka bulat minimal 1
  if (isNaN(qty) || !Number.isInteger(qty) || qty < 1) {
    errorItemQty.textContent = "Jumlah (Qty) wajib berupa bilangan bulat minimal 1!";
    itemQtyInput.classList.add("input-error");
    isValid = false;
  }

  return isValid;
}

// ==========================================
// 7. EVENT HANDLER: FORM SUBMIT
// ==========================================
formItem.addEventListener("submit", function (e) {
  e.preventDefault();

  const rawName = itemNameInput.value.trim();
  const rawPrice = parseFloat(itemPriceInput.value);
  const rawQty = Number(itemQtyInput.value);

  // Jalankan Validasi
  const isValid = validateItemInput(rawName, rawPrice, rawQty);
  if (!isValid) {
    return; // Cegah barang masuk ke keranjang jika tidak valid
  }

  // Cek apakah item dengan nama yang sama sudah ada di keranjang
  const existingIndex = cart.findIndex(
    (item) => item.name.toLowerCase() === rawName.toLowerCase()
  );

  if (existingIndex !== -1) {
    // Jika barang sudah ada, tambahkan qty
    cart[existingIndex].qty += rawQty;
    cart[existingIndex].price = rawPrice; // Update harga jika berbeda
    cart[existingIndex].subtotal = cart[existingIndex].price * cart[existingIndex].qty;
    showToast(`Qty "${rawName}" diperbarui di keranjang!`, "success");
  } else {
    // Tambah item baru ke keranjang
    const newItem = {
      id: "item-" + Date.now(),
      name: rawName,
      price: rawPrice,
      qty: rawQty,
      subtotal: rawPrice * rawQty, // Subtotal = Harga Satuan × Qty
    };
    cart.push(newItem);
    showToast(`"${rawName}" berhasil ditambahkan!`, "success");
  }

  // Simpan ke LocalStorage
  saveCartToLocalStorage();

  // Render ulang UI
  renderCart();

  // Reset form otomatis dan fokuskan kembali ke input nama
  formItem.reset();
  itemQtyInput.value = "1";
  clearFormErrors();
  itemNameInput.focus();
});

// Clear input error saat pengguna mulai mengetik kembali
[itemNameInput, itemPriceInput, itemQtyInput].forEach((input) => {
  input.addEventListener("input", function () {
    this.classList.remove("input-error");
    if (this === itemNameInput) errorItemName.textContent = "";
    if (this === itemPriceInput) errorItemPrice.textContent = "";
    if (this === itemQtyInput) errorItemQty.textContent = "";
  });
});

// ==========================================
// 8. MANAJEMEN KERANJANG (HAPUS & RESET)
// ==========================================
function deleteItem(itemId) {
  const itemIndex = cart.findIndex((item) => item.id === itemId);
  if (itemIndex !== -1) {
    const deletedName = cart[itemIndex].name;
    cart.splice(itemIndex, 1);
    saveCartToLocalStorage();
    renderCart();
    showToast(`"${deletedName}" dihapus dari keranjang.`, "info");
  }
}

function resetEntireCart() {
  if (cart.length === 0) {
    showToast("Keranjang sudah kosong.", "info");
    return;
  }

  const confirmReset = confirm("Apakah Anda yakin ingin mengosongkan seluruh keranjang belanja dan memulai transaksi baru?");
  if (confirmReset) {
    cart = [];
    localStorage.removeItem(STORAGE_KEY);
    appliedPromo = null;
    promoCodeInput.value = "";
    promoStatus.textContent = "";
    promoStatus.className = "promo-status-msg";
    btnCancelPromo.style.display = "none";
    cashAmountInput.value = "";
    renderCart();
    showToast("Keranjang berhasil dikosongkan. Transaksi baru siap!", "danger");
  }
}

btnResetCart.addEventListener("click", resetEntireCart);

// ==========================================
// 9. MODUL KALKULATOR & PERHITUNGAN OTOMATIS
// ==========================================
function calculateTotals() {
  // 1. Total Belanja (Jumlah seluruh subtotal barang)
  const totalBelanja = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // 2. Kalkulasi Diskon Sederhana:
  // - Otomatis 10% jika belanja >= Rp 50.000
  // - ATAU jika menggunakan kode promo HEMAT10
  let discountRate = 0;
  let discountReason = "";

  if (totalBelanja >= MIN_DISCOUNT_THRESHOLD) {
    discountRate = DISCOUNT_PERCENTAGE;
    discountReason = "Otomatis 10% (Belanja ≥ Rp 50.000)";
  } else if (appliedPromo === PROMO_CODE_VALID) {
    discountRate = DISCOUNT_PERCENTAGE;
    discountReason = `Voucher Promo ${PROMO_CODE_VALID} (10%)`;
  }

  const discountAmount = Math.round(totalBelanja * discountRate);
  const grandTotal = Math.max(0, totalBelanja - discountAmount);

  return {
    totalBelanja,
    discountRate,
    discountAmount,
    discountReason,
    grandTotal,
  };
}

// ==========================================
// 10. MODUL PEMBAYARAN & KEMBALIAN REALTIME
// ==========================================
function updatePaymentAndChange() {
  const { grandTotal } = calculateTotals();
  const rawCash = cashAmountInput.value.trim();
  const cashAmount = parseFloat(rawCash);

  // Reset kelas box
  changeBox.classList.remove("status-insufficient", "status-sufficient");

  // Jika keranjang kosong
  if (cart.length === 0) {
    paymentStatusBadge.className = "badge badge-neutral";
    paymentStatusBadge.textContent = "Keranjang Kosong";
    changeTextLabel.textContent = "Kembalian:";
    changeDisplay.textContent = formatRupiah(0);
    changeNote.textContent = "Tambahkan barang terlebih dahulu sebelum pembayaran.";
    summaryPaid.textContent = formatRupiah(0);
    summaryChange.textContent = formatRupiah(0);
    btnCheckout.disabled = true;
    return;
  }

  // Jika input uang bayar kosong / belum diisi
  if (rawCash === "" || isNaN(cashAmount)) {
    paymentStatusBadge.className = "badge badge-neutral";
    paymentStatusBadge.textContent = "Menunggu Pembayaran";
    changeTextLabel.textContent = "Kembalian:";
    changeDisplay.textContent = formatRupiah(0);
    changeNote.textContent = `Total yang harus dibayar: ${formatRupiah(grandTotal)}. Masukkan nominal uang.`;
    summaryPaid.textContent = formatRupiah(0);
    summaryChange.textContent = formatRupiah(0);
    btnCheckout.disabled = true;
    return;
  }

  // Update summary Uang Diterima
  summaryPaid.textContent = formatRupiah(cashAmount);

  // Perhitungan Kembalian = Uang Bayar - Total Akhir
  const diff = cashAmount - grandTotal;

  if (diff < 0) {
    // Kasus 1: Uang Belum Mencukupi
    const kekurangan = Math.abs(diff);
    changeBox.classList.add("status-insufficient");
    paymentStatusBadge.className = "badge badge-danger";
    paymentStatusBadge.textContent = "Uang Kurang";
    changeTextLabel.textContent = "Kekurangan:";
    changeDisplay.textContent = formatRupiah(kekurangan);
    changeNote.textContent = `Uang pembayaran belum mencukupi! Kurang ${formatRupiah(kekurangan)}.`;
    summaryChange.textContent = `Kurang ${formatRupiah(kekurangan)}`;
    btnCheckout.disabled = true;
  } else {
    // Kasus 2: Uang Cukup / Lunas
    changeBox.classList.add("status-sufficient");
    paymentStatusBadge.className = "badge badge-success";
    paymentStatusBadge.textContent = diff === 0 ? "Uang Pas / Lunas" : "Lunas";
    changeTextLabel.textContent = "Kembalian:";
    changeDisplay.textContent = formatRupiah(diff);
    changeNote.textContent = diff === 0 
      ? "Pembayaran pas tanpa kembalian. Transaksi siap diselesaikan!"
      : `Kembalian sebesar ${formatRupiah(diff)} siap diberikan ke pembeli.`;
    summaryChange.textContent = formatRupiah(diff);
    btnCheckout.disabled = false;
  }
}

// Event listener input uang bayar realtime
cashAmountInput.addEventListener("input", updatePaymentAndChange);

// Quick Cash Buttons
btnCashExact.addEventListener("click", () => {
  const { grandTotal } = calculateTotals();
  if (grandTotal > 0) {
    cashAmountInput.value = grandTotal;
    updatePaymentAndChange();
  }
});

quickCashButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const val = parseFloat(btn.getAttribute("data-val"));
    cashAmountInput.value = val;
    updatePaymentAndChange();
  });
});

// ==========================================
// 11. SISTEM KODE PROMO (VOUCHER)
// ==========================================
btnApplyPromo.addEventListener("click", () => {
  const code = promoCodeInput.value.trim().toUpperCase();

  if (!code) {
    promoStatus.textContent = "Masukkan kode promo terlebih dahulu!";
    promoStatus.className = "promo-status-msg error";
    return;
  }

  if (code === PROMO_CODE_VALID) {
    appliedPromo = PROMO_CODE_VALID;
    promoStatus.textContent = "✅ Kode promo HEMAT10 berhasil diterapkan! (Diskon 10%)";
    promoStatus.className = "promo-status-msg success";
    btnCancelPromo.style.display = "inline-flex";
    renderCart();
    showToast("Kode promo HEMAT10 berhasil diterapkan!", "success");
  } else {
    promoStatus.textContent = `❌ Kode "${code}" tidak valid. Coba gunakan HEMAT10.`;
    promoStatus.className = "promo-status-msg error";
  }
});

btnCancelPromo.addEventListener("click", () => {
  appliedPromo = null;
  promoCodeInput.value = "";
  promoStatus.textContent = "Voucher promo dibatalkan.";
  promoStatus.className = "promo-status-msg";
  btnCancelPromo.style.display = "none";
  renderCart();
  showToast("Kode promo dibatalkan.", "info");
});

// ==========================================
// 12. RENDER KERANJANG & RINGKASAN
// ==========================================
function renderCart() {
  // Update Subtotal per item
  cart.forEach((item) => {
    item.subtotal = item.price * item.qty;
  });

  // Hitung total dan diskon
  const { totalBelanja, discountRate, discountAmount, discountReason, grandTotal } =
    calculateTotals();

  // Render Baris Tabel
  cartBody.innerHTML = "";

  if (cart.length === 0) {
    cartTable.style.display = "none";
    cartEmptyState.style.display = "block";
    cartCounterHint.textContent = "0 item di keranjang (Tersimpan di LocalStorage)";
  } else {
    cartTable.style.display = "table";
    cartEmptyState.style.display = "none";

    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCounterHint.textContent = `${cart.length} jenis barang (${totalQty} total item) · Tersimpan di LocalStorage`;

    cart.forEach((item, index) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td class="text-center font-semibold">${index + 1}</td>
        <td>
          <strong>${escapeHtml(item.name)}</strong>
        </td>
        <td class="text-right">${formatRupiah(item.price)}</td>
        <td class="text-center">
          <span class="qty-pill">${item.qty}</span>
        </td>
        <td class="text-right">
          <strong>${formatRupiah(item.subtotal)}</strong>
        </td>
        <td class="text-center">
          <button 
            type="button" 
            class="btn-delete-row" 
            title="Hapus ${escapeHtml(item.name)}" 
            onclick="deleteItem('${item.id}')"
          >
            ❌
          </button>
        </td>
      `;
      cartBody.appendChild(tr);
    });
  }

  // Update Tampilan Ringkasan Pembayaran
  summarySubtotal.textContent = formatRupiah(totalBelanja);

  if (discountAmount > 0) {
    summaryDiscount.textContent = `- ${formatRupiah(discountAmount)}`;
    discountBadge.textContent = `${Math.round(discountRate * 100)}%`;
    discountBadge.title = discountReason;
  } else {
    summaryDiscount.textContent = "- Rp 0";
    discountBadge.textContent = "0%";
    discountBadge.title = "Belanja minimal Rp 50.000 atau gunakan kode HEMAT10";
  }

  summaryGrandTotal.textContent = formatRupiah(grandTotal);

  // Update Status Pembayaran & Kembalian
  updatePaymentAndChange();
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// ==========================================
// 13. STRUK PEMBAYARAN (CHECKOUT & NOTA)
// ==========================================
btnCheckout.addEventListener("click", () => {
  const { totalBelanja, discountAmount, discountReason, grandTotal } = calculateTotals();
  const rawCash = parseFloat(cashAmountInput.value);

  if (cart.length === 0 || isNaN(rawCash) || rawCash < grandTotal) {
    showToast("Pembayaran belum mencukupi untuk menyelesaikan transaksi!", "danger");
    return;
  }

  const change = rawCash - grandTotal;
  const now = new Date();
  const dateFormatted = now.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }) + " " + now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const trxId = "TRX-" + now.getFullYear() + String(now.getMonth() + 1).padStart(2, "0") + String(now.getDate()).padStart(2, "0") + "-" + String(Math.floor(Math.random() * 900) + 100);

  // Render receipt items
  receiptDate.textContent = dateFormatted;
  receiptId.textContent = trxId;

  receiptItems.innerHTML = "";
  cart.forEach((item) => {
    const itemRow = document.createElement("div");
    itemRow.className = "receipt-item-row";
    itemRow.innerHTML = `
      <div>
        <div class="receipt-item-name">${escapeHtml(item.name)}</div>
        <div class="receipt-item-sub">${item.qty} x ${formatRupiah(item.price)}</div>
      </div>
      <div><strong>${formatRupiah(item.subtotal)}</strong></div>
    `;
    receiptItems.appendChild(itemRow);
  });

  receiptSubtotal.textContent = formatRupiah(totalBelanja);
  if (discountAmount > 0) {
    receiptDiscountLabel.textContent = `Diskon (${discountReason}):`;
    receiptDiscount.textContent = `- ${formatRupiah(discountAmount)}`;
  } else {
    receiptDiscountLabel.textContent = "Diskon:";
    receiptDiscount.textContent = "Rp 0";
  }

  receiptTotal.textContent = formatRupiah(grandTotal);
  receiptPaid.textContent = formatRupiah(rawCash);
  receiptChange.textContent = formatRupiah(change);

  // Tampilkan Modal
  receiptModal.classList.add("active");
});

btnCloseReceipt.addEventListener("click", () => {
  receiptModal.classList.remove("active");
  // Bersihkan keranjang belanja setelah transaksi selesai
  cart = [];
  localStorage.removeItem(STORAGE_KEY);
  appliedPromo = null;
  promoCodeInput.value = "";
  promoStatus.textContent = "";
  promoStatus.className = "promo-status-msg";
  btnCancelPromo.style.display = "none";
  cashAmountInput.value = "";
  renderCart();
  showToast("Transaksi selesai! Keranjang telah direset untuk transaksi baru.", "success");
});

// Tutup modal jika klik di luar area modal
receiptModal.addEventListener("click", (e) => {
  if (e.target === receiptModal) {
    receiptModal.classList.remove("active");
  }
});

// ==========================================
// 14. INISIALISASI APLIKASI SAAT LOAD
// ==========================================
window.addEventListener("DOMContentLoaded", () => {
  loadCartFromLocalStorage();
  renderCart();
  itemNameInput.focus();
  console.log("Mini POS ITERA siap digunakan. Data keranjang dimuat dari localStorage.");
});
