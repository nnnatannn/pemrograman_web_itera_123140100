// js/modules/utils.js
// Kumpulan fungsi utilitas modern JavaScript (ES6+ Arrow Functions & Template Literals)

// 1. Format tanggal dan waktu lokal Indonesia
export const formatIndonesianDate = (date = new Date()) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(d);
};

// 2. Format jam dan menit
export const formatTimeOnly = (date = new Date()) => {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  }).format(d);
};

// 3. Format tanggal tenggat waktu singkat
export const formatDeadlineShort = (isoString) => {
  if (!isoString) return "Tidak ada tenggat";
  const d = new Date(isoString);
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit"
  }).format(d);
};

// 4. Sanitasi string untuk mencegah XSS injection pada template literals
export const sanitizeHTML = (str = "") => {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  };
  return String(str).replace(/[&<>"']/g, (m) => map[m]);
};

// 5. Pemetaan kode cuaca WMO (Open-Meteo) ke Bahasa Indonesia & Ikon
export const interpretWeatherCode = (code = 0) => {
  // WMO Weather interpretation codes (http://open-meteo.com)
  if (code === 0) return { text: "Cerah Bersih", icon: "☀️" };
  if (code === 1 || code === 2) return { text: "Cerah Berawan", icon: "🌤️" };
  if (code === 3) return { text: "Berawan Mendung", icon: "☁️" };
  if ([45, 48].includes(code)) return { text: "Berkabut", icon: "🌫️" };
  if ([51, 53, 55].includes(code)) return { text: "Gerimis Ringan", icon: "🌦️" };
  if ([61, 63, 65].includes(code)) return { text: "Hujan Ringan - Sedang", icon: "🌧️" };
  if ([80, 81, 82].includes(code)) return { text: "Hujan Lebat", icon: "🌧️" };
  if ([95, 96, 99].includes(code)) return { text: "Hujan Petir", icon: "⛈️" };
  return { text: "Kondisi Normal", icon: "🌥️" };
};

// 6. Toast Notification Helper menggunakan Template Literals
export const showToast = (message, type = "info", duration = 3000) => {
  let container = document.getElementById("toast-container");
  if (!container) {
    container = document.createElement("div");
    container.id = "toast-container";
    container.className = "toast-container";
    document.body.appendChild(container);
  }

  const toast = document.createElement("div");
  const icons = {
    success: `<svg class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
    error: `<svg class="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
    info: `<svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    warning: `<svg class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`
  };

  toast.className = `toast toast-${type}`;
  toast.innerHTML = `
    <div class="toast-icon">${icons[type] || icons.info}</div>
    <div class="toast-message">${message}</div>
    <button class="toast-close" aria-label="Tutup notifikasi">&times;</button>
  `;

  const closeBtn = toast.querySelector(".toast-close");
  const removeToast = () => {
    toast.classList.add("toast-hiding");
    setTimeout(() => toast.remove(), 250);
  };

  closeBtn.addEventListener("click", removeToast);
  container.appendChild(toast);

  setTimeout(removeToast, duration);
};

// 7. Debounce helper untuk search input real-time
export const debounce = (func, delay = 250) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
