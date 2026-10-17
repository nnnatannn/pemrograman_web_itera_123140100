// js/bundle.js
// Standalone ES6+ Bundle Fallback untuk mendukung protokol file:// (double-click File Explorer)
// Tetap menggunakan 100% fitur modern ES6+ (Classes, Arrow Functions, Template Literals, Async/Await)

(function () {
  // Cegah eksekusi ganda jika ES Module sudah berjalan
  if (window.__DASHBOARD_INITIALIZED__) return;
  window.__DASHBOARD_INITIALIZED__ = true;

  // ==========================================
  // 1. MODELS (Classes ES6+)
  // ==========================================
  class TaskItem {
    constructor({
      id = Date.now().toString(),
      title,
      course,
      category = "Tugas Kuliah",
      deadline,
      priority = "medium",
      completed = false,
      notes = "",
      createdAt = new Date().toISOString()
    }) {
      this.id = id;
      this.title = title;
      this.course = course;
      this.category = category;
      this.deadline = deadline;
      this.priority = priority;
      this.completed = completed;
      this.notes = notes;
      this.createdAt = createdAt;
    }

    toggle() {
      this.completed = !this.completed;
      return this.completed;
    }

    update({ title, course, category, deadline, priority, notes }) {
      if (title !== undefined) this.title = title;
      if (course !== undefined) this.course = course;
      if (category !== undefined) this.category = category;
      if (deadline !== undefined) this.deadline = deadline;
      if (priority !== undefined) this.priority = priority;
      if (notes !== undefined) this.notes = notes;
    }

    get isOverdue() {
      if (!this.deadline || this.completed) return false;
      return new Date(this.deadline) < new Date();
    }

    get timeStatus() {
      if (this.completed) return { text: "Selesai", status: "completed" };
      if (!this.deadline) return { text: "Tanpa Tenggat", status: "normal" };

      const now = new Date();
      const due = new Date(this.deadline);
      const diffMs = due - now;
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffMs < 0) {
        return { text: `Terlambat (${Math.abs(diffDays)} hari lalu)`, status: "overdue" };
      }
      if (diffHours <= 24) {
        return { text: `Mendekati Tenggat (${diffHours} jam lagi)`, status: "urgent" };
      }
      return { text: `${diffDays} hari lagi`, status: "upcoming" };
    }

    static fromJSON(jsonObj) {
      return new TaskItem(jsonObj);
    }
  }

  class ScheduleItem {
    constructor({
      id = Date.now().toString(),
      day,
      courseName,
      room,
      startTime,
      endTime,
      lecturer = ""
    }) {
      this.id = id;
      this.day = day;
      this.courseName = courseName;
      this.room = room;
      this.startTime = startTime;
      this.endTime = endTime;
      this.lecturer = lecturer;
    }

    get timeSlot() {
      return `${this.startTime} - ${this.endTime} WIB`;
    }

    static fromJSON(jsonObj) {
      return new ScheduleItem(jsonObj);
    }
  }

  class QuickNoteItem {
    constructor({
      id = Date.now().toString(),
      title,
      content,
      color = "yellow",
      pinned = false,
      updatedAt = new Date().toISOString()
    }) {
      this.id = id;
      this.title = title;
      this.content = content;
      this.color = color;
      this.pinned = pinned;
      this.updatedAt = updatedAt;
    }

    togglePin() {
      this.pinned = !this.pinned;
      this.updatedAt = new Date().toISOString();
    }

    static fromJSON(jsonObj) {
      return new QuickNoteItem(jsonObj);
    }
  }

  // ==========================================
  // 2. UTILS
  // ==========================================
  const formatIndonesianDate = (date = new Date()) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }).format(d);
  };

  const formatTimeOnly = (date = new Date()) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    }).format(d);
  };

  const formatDeadlineShort = (isoString) => {
    if (!isoString) return "Tidak ada tenggat";
    const d = new Date(isoString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    }).format(d);
  };

  const sanitizeHTML = (str = "") => {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    };
    return String(str).replace(/[&<>"']/g, (m) => map[m]);
  };

  const interpretWeatherCode = (code = 0) => {
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

  const showToast = (message, type = "info", duration = 3000) => {
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

  const debounce = (func, delay = 250) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // ==========================================
  // 3. STORAGE & SEED DATA
  // ==========================================
  const STORAGE_KEYS = {
    TASKS: "itera_student_dashboard_tasks",
    SCHEDULES: "itera_student_dashboard_schedules",
    NOTES: "itera_student_dashboard_notes",
    THEME: "itera_student_dashboard_theme"
  };

  const initialTasks = [
    {
      id: "task-seed-1",
      title: "Implementasi Personal Dashboard ES6+",
      course: "Pengembangan Aplikasi Web",
      category: "Praktikum",
      deadline: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
      priority: "high",
      completed: true,
      notes: "Lengkapi semua fitur ES6+: classes, arrow functions, async/await, array methods."
    },
    {
      id: "task-seed-2",
      title: "Review Teori Process Scheduling & Threads",
      course: "Sistem Operasi",
      category: "Tugas Kuliah",
      deadline: new Date(Date.now() + 86400000 * 4).toISOString().slice(0, 16),
      priority: "medium",
      completed: false,
      notes: "Pelajari algoritma Round Robin dan SJF untuk kuis minggu depan."
    },
    {
      id: "task-seed-3",
      title: "Finalisasi Proposal Proyek Aplikasi ITERA",
      course: "Rekayasa Perangkat Lunak",
      category: "Proyek",
      deadline: new Date(Date.now() + 86400000 * 6).toISOString().slice(0, 16),
      priority: "high",
      completed: false,
      notes: "Diskusi kelompok bab 1 s.d. 3 dan diagram UML."
    },
    {
      id: "task-seed-4",
      title: "Rapat Koordinasi Divisi Acara Himpunan",
      course: "Organisasi Mahasiswa (HMIF)",
      category: "Organisasi",
      deadline: new Date(Date.now() + 86400000 * 1).toISOString().slice(0, 16),
      priority: "low",
      completed: false,
      notes: "Membahas rundown kegiatan seminar teknologi web."
    }
  ];

  const initialSchedules = [
    {
      id: "sch-1",
      day: "Senin",
      courseName: "Pengembangan Aplikasi Web (Teori)",
      room: "Gedung Kuliah Umum (GKU 1)",
      startTime: "08:00",
      endTime: "09:40",
      lecturer: "Dosen Pengampu PAW"
    },
    {
      id: "sch-2",
      day: "Senin",
      courseName: "Praktikum PAW (Kelas RB)",
      room: "Lab Komputer 3 (Gedung Labtek 3)",
      startTime: "13:00",
      endTime: "14:40",
      lecturer: "Asisten Praktikum PAW"
    },
    {
      id: "sch-3",
      day: "Selasa",
      courseName: "Sistem Operasi",
      room: "Gedung Kuliah 2 (GK2 204)",
      startTime: "10:00",
      endTime: "11:40",
      lecturer: "Tim Dosen Sistem Operasi"
    },
    {
      id: "sch-4",
      day: "Rabu",
      courseName: "Rekayasa Perangkat Lunak",
      room: "Gedung Kuliah 1 (GK1 102)",
      startTime: "08:00",
      endTime: "10:30",
      lecturer: "Tim Dosen RPL"
    },
    {
      id: "sch-5",
      day: "Kamis",
      courseName: "Probabilitas & Statistika",
      room: "Gedung Kuliah Umum (GKU 2)",
      startTime: "13:00",
      endTime: "15:30",
      lecturer: "Tim Dosen Statistika"
    }
  ];

  const initialNotes = [
    {
      id: "note-1",
      title: "Kontrak Kuliah PAW 2026/2027",
      content: "Setiap tugas praktikum harus memiliki README lengkap dengan screenshot dan daftar baris fitur ES6+.",
      color: "amber",
      pinned: true,
      updatedAt: new Date().toISOString()
    },
    {
      id: "note-2",
      title: "Ruang Diskusi Perpustakaan ITERA",
      content: "Bisa reservasi ruang diskusi lantai 2 gedung Rektorat/Perpustakaan untuk kerja kelompok RPL.",
      color: "blue",
      pinned: false,
      updatedAt: new Date().toISOString()
    }
  ];

  const loadTasksFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
      if (!raw) {
        saveTasksToStorage(initialTasks);
        return initialTasks.map((t) => TaskItem.fromJSON(t));
      }
      return JSON.parse(raw).map((t) => TaskItem.fromJSON(t));
    } catch (err) {
      return initialTasks.map((t) => TaskItem.fromJSON(t));
    }
  };

  const saveTasksToStorage = (tasks = []) => {
    try {
      localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
    } catch (e) {}
  };

  const loadSchedulesFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
      if (!raw) {
        saveSchedulesToStorage(initialSchedules);
        return initialSchedules.map((s) => ScheduleItem.fromJSON(s));
      }
      return JSON.parse(raw).map((s) => ScheduleItem.fromJSON(s));
    } catch (e) {
      return initialSchedules.map((s) => ScheduleItem.fromJSON(s));
    }
  };

  const saveSchedulesToStorage = (schedules = []) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
    } catch (e) {}
  };

  const loadNotesFromStorage = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (!raw) {
        saveNotesToStorage(initialNotes);
        return initialNotes.map((n) => QuickNoteItem.fromJSON(n));
      }
      return JSON.parse(raw).map((n) => QuickNoteItem.fromJSON(n));
    } catch (e) {
      return initialNotes.map((n) => QuickNoteItem.fromJSON(n));
    }
  };

  const saveNotesToStorage = (notes = []) => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {}
  };

  const loadThemeFromStorage = () => localStorage.getItem(STORAGE_KEYS.THEME) || "light";
  const saveThemeToStorage = (theme) => localStorage.setItem(STORAGE_KEYS.THEME, theme);

  // ==========================================
  // 4. API (Async/Await)
  // ==========================================
  const fetchCampusWeather = async () => {
    try {
      const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-5.36&longitude=105.31&current_weather=true");
      if (!res.ok) throw new Error("HTTP error");
      const data = await res.json();
      const { temperature, windspeed, weathercode, time } = data.current_weather;
      const { text, icon } = interpretWeatherCode(weathercode);
      return {
        data: {
          location: "Kampus ITERA (Lampung)",
          temperature: Math.round(temperature),
          windspeed,
          condition: text,
          icon,
          updatedAt: time
        }
      };
    } catch (err) {
      return {
        data: {
          location: "Kampus ITERA",
          temperature: 29,
          windspeed: 10,
          condition: "Cerah Berawan",
          icon: "🌤️",
          updatedAt: new Date().toISOString()
        }
      };
    }
  };

  const fetchDailyQuote = async () => {
    try {
      const res = await fetch("https://dummyjson.com/quotes/random");
      if (!res.ok) throw new Error("HTTP error");
      const data = await res.json();
      return { data: { quote: data.quote, author: data.author } };
    } catch (err) {
      return {
        data: {
          quote: "Pendidikan adalah senjata paling mematikan di dunia, karena dengan pendidikan Anda dapat mengubah dunia.",
          author: "Nelson Mandela"
        }
      };
    }
  };

  const fetchSimulationTodos = async () => {
    try {
      const res = await fetch("https://jsonplaceholder.typicode.com/todos?_limit=3");
      const todos = await res.json();
      return todos.map((item) => ({
        title: item.title,
        course: "Simulasi Eksternal (API)",
        category: "Praktikum",
        deadline: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
        priority: item.completed ? "low" : "medium",
        completed: item.completed,
        notes: "Tugas ini diimpor secara asinkron via JSONPlaceholder API"
      }));
    } catch (e) {
      return [];
    }
  };

  // ==========================================
  // 5. DASHBOARD APP CLASS
  // ==========================================
  class DashboardApp {
    constructor() {
      this.tasks = loadTasksFromStorage();
      this.schedules = loadSchedulesFromStorage();
      this.notes = loadNotesFromStorage();
      this.theme = loadThemeFromStorage();

      this.filterStatus = "all";
      this.filterCategory = "all";
      this.searchQuery = "";
      this.sortBy = "deadline";
      this.selectedScheduleDay = "Senin";
      this.editingTaskId = null;

      this.dom = {
        liveClock: document.getElementById("live-clock"),
        liveDate: document.getElementById("live-date"),
        weatherCard: document.getElementById("weather-widget"),
        quoteCard: document.getElementById("quote-widget"),
        refreshQuoteBtn: document.getElementById("btn-refresh-quote"),
        themeToggleBtn: document.getElementById("theme-toggle-btn"),
        statTotalTasks: document.getElementById("stat-total-tasks"),
        statCompletedTasks: document.getElementById("stat-completed-tasks"),
        statPendingTasks: document.getElementById("stat-pending-tasks"),
        statHighPriority: document.getElementById("stat-high-priority"),
        productivityBar: document.getElementById("productivity-bar"),
        productivityPercent: document.getElementById("productivity-percent"),
        taskList: document.getElementById("task-list"),
        taskEmptyState: document.getElementById("task-empty-state"),
        taskSearchInput: document.getElementById("task-search-input"),
        filterCategorySelect: document.getElementById("filter-category"),
        sortTasksSelect: document.getElementById("sort-tasks"),
        filterTabs: document.querySelectorAll(".filter-tab"),
        btnOpenAddTaskModal: document.getElementById("btn-open-add-task"),
        btnImportSimulation: document.getElementById("btn-import-simulation"),
        btnClearCompleted: document.getElementById("btn-clear-completed"),
        taskModal: document.getElementById("task-modal"),
        taskModalTitle: document.getElementById("task-modal-title"),
        taskForm: document.getElementById("task-form"),
        taskInputId: document.getElementById("task-id"),
        taskInputTitle: document.getElementById("task-title"),
        taskInputCourse: document.getElementById("task-course"),
        taskInputCategory: document.getElementById("task-category"),
        taskInputDeadline: document.getElementById("task-deadline"),
        taskInputPriority: document.getElementById("task-priority"),
        taskInputNotes: document.getElementById("task-notes"),
        btnCloseTaskModal: document.getElementById("btn-close-task-modal"),
        btnCancelTaskModal: document.getElementById("btn-cancel-task-modal"),
        scheduleDaysNav: document.getElementById("schedule-days-nav"),
        scheduleList: document.getElementById("schedule-list"),
        scheduleEmptyState: document.getElementById("schedule-empty-state"),
        btnAddSchedule: document.getElementById("btn-add-schedule"),
        scheduleModal: document.getElementById("schedule-modal"),
        scheduleForm: document.getElementById("schedule-form"),
        btnCloseScheduleModal: document.getElementById("btn-close-schedule-modal"),
        notesGrid: document.getElementById("notes-grid"),
        btnAddNote: document.getElementById("btn-add-note"),
        noteModal: document.getElementById("note-modal"),
        noteForm: document.getElementById("note-form"),
        btnCloseNoteModal: document.getElementById("btn-close-note-modal"),
        btnResetAll: document.getElementById("btn-reset-all")
      };
    }

    async init() {
      this.applyTheme(this.theme);
      this.startLiveClock();
      this.bindEvents();
      this.renderStats();
      this.renderTasks();
      this.renderSchedules();
      this.renderNotes();

      await Promise.all([this.loadWeather(), this.loadQuote()]);

      // Tampilkan info ramah jika dibuka melalui file://
      if (window.location.protocol === "file:") {
        showToast("Dashboard berjalan lancar! (Gunakan 'Live Server' di VS Code untuk standar praktikum)", "info", 5000);
      }
    }

    startLiveClock() {
      const update = () => {
        const now = new Date();
        if (this.dom.liveClock) this.dom.liveClock.textContent = formatTimeOnly(now) + " WIB";
        if (this.dom.liveDate) this.dom.liveDate.textContent = formatIndonesianDate(now);
      };
      update();
      setInterval(update, 1000);
    }

    applyTheme(theme) {
      this.theme = theme;
      document.documentElement.setAttribute("data-theme", theme);
      saveThemeToStorage(theme);
      if (this.dom.themeToggleBtn) {
        this.dom.themeToggleBtn.innerHTML =
          theme === "dark"
            ? `<svg class="w-5 h-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"/></svg>`
            : `<svg class="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/></svg>`;
      }
    }

    toggleTheme() {
      const next = this.theme === "dark" ? "light" : "dark";
      this.applyTheme(next);
      showToast(`Tema diganti ke mode ${next === "dark" ? "Gelap (Dark)" : "Terang (Light)"}`, "info");
    }

    async loadWeather() {
      if (!this.dom.weatherCard) return;
      const res = await fetchCampusWeather();
      const { temperature, condition, icon, windspeed, location } = res.data;
      this.dom.weatherCard.innerHTML = `
        <div class="weather-content flex items-center justify-between">
          <div class="weather-info">
            <div class="weather-location text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
              📍 ${location}
            </div>
            <div class="weather-temp flex items-baseline gap-2 mt-1">
              <span class="text-3xl font-extrabold text-slate-900 dark:text-white">${temperature}°C</span>
              <span class="text-xs text-slate-500 dark:text-slate-400 font-medium">${condition}</span>
            </div>
            <div class="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
              Angin: ${windspeed} km/j • Real-time Open-Meteo
            </div>
          </div>
          <div class="weather-icon-badge text-3xl p-2.5 bg-amber-50 dark:bg-slate-800 rounded-2xl border border-amber-100 dark:border-slate-700 shadow-sm">
            ${icon}
          </div>
        </div>
      `;
    }

    async loadQuote(notify = false) {
      if (!this.dom.quoteCard) return;
      const quoteTextEl = this.dom.quoteCard.querySelector(".quote-text");
      const quoteAuthorEl = this.dom.quoteCard.querySelector(".quote-author");

      const res = await fetchDailyQuote();
      const { quote, author } = res.data;

      if (quoteTextEl) quoteTextEl.textContent = `“${quote}”`;
      if (quoteAuthorEl) quoteAuthorEl.textContent = `— ${author}`;
      if (notify) showToast("Kutipan motivasi diperbarui!", "success");
    }

    renderStats() {
      const total = this.tasks.length;
      const completed = this.tasks.filter((t) => t.completed).length;
      const pending = total - completed;
      const highPriority = this.tasks.filter((t) => t.priority === "high" && !t.completed).length;
      const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

      if (this.dom.statTotalTasks) this.dom.statTotalTasks.textContent = total;
      if (this.dom.statCompletedTasks) this.dom.statCompletedTasks.textContent = completed;
      if (this.dom.statPendingTasks) this.dom.statPendingTasks.textContent = pending;
      if (this.dom.statHighPriority) this.dom.statHighPriority.textContent = highPriority;
      if (this.dom.productivityPercent) this.dom.productivityPercent.textContent = `${percent}%`;
      if (this.dom.productivityBar) this.dom.productivityBar.style.width = `${percent}%`;
    }

    getFilteredTasks() {
      let result = this.tasks.filter((t) => {
        if (this.filterStatus === "pending") return !t.completed;
        if (this.filterStatus === "completed") return t.completed;
        return true;
      });

      if (this.filterCategory !== "all") {
        result = result.filter((t) => t.category === this.filterCategory);
      }

      if (this.searchQuery) {
        result = result.filter(
          (t) =>
            t.title.toLowerCase().includes(this.searchQuery) ||
            t.course.toLowerCase().includes(this.searchQuery) ||
            (t.notes && t.notes.toLowerCase().includes(this.searchQuery))
        );
      }

      const priorityWeights = { high: 3, medium: 2, low: 1 };
      result.sort((a, b) => {
        if (this.sortBy === "priority") {
          return priorityWeights[b.priority] - priorityWeights[a.priority];
        }
        if (this.sortBy === "created") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return new Date(a.deadline) - new Date(b.deadline);
      });

      return result;
    }

    renderTasks() {
      const filtered = this.getFilteredTasks();
      if (filtered.length === 0) {
        this.dom.taskList.innerHTML = "";
        this.dom.taskEmptyState.classList.remove("hidden");
        return;
      }

      this.dom.taskEmptyState.classList.add("hidden");

      const priorityBadges = {
        high: `<span class="badge badge-high">Tinggi</span>`,
        medium: `<span class="badge badge-medium">Sedang</span>`,
        low: `<span class="badge badge-low">Rendah</span>`
      };

      const timeStatusBadges = {
        completed: `<span class="time-badge time-completed">✓ Selesai</span>`,
        overdue: `<span class="time-badge time-overdue">⚠️ Terlambat</span>`,
        urgent: `<span class="time-badge time-urgent">⏰ Mendesak</span>`,
        upcoming: `<span class="time-badge time-upcoming">📅 Mendatang</span>`,
        normal: `<span class="time-badge time-normal">Tanpa Tenggat</span>`
      };

      this.dom.taskList.innerHTML = filtered
        .map((task) => {
          const { id, title, course, category, deadline, priority, completed, notes } = task;
          const timeStatus = task.timeStatus;

          return `
            <div class="task-card ${completed ? "is-completed" : ""} ${task.isOverdue ? "is-overdue" : ""}" data-id="${id}">
              <div class="task-card-header">
                <div class="flex items-start gap-3 flex-1 min-w-0">
                  <button type="button" class="btn-toggle-task ${completed ? "checked" : ""}" title="Toggle Selesai">
                    ${completed ? `<svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7"/></svg>` : ""}
                  </button>
                  <div class="task-meta-info flex-1 min-w-0">
                    <div class="flex items-center gap-2 flex-wrap mb-1">
                      <span class="category-pill">${sanitizeHTML(category)}</span>
                      ${priorityBadges[priority] || ""}
                      ${timeStatusBadges[timeStatus.status] || ""}
                    </div>
                    <h4 class="task-title ${completed ? "line-through text-slate-400 dark:text-slate-500" : "text-slate-900 dark:text-slate-100"}">
                      ${sanitizeHTML(title)}
                    </h4>
                    <p class="task-course text-xs text-amber-700 dark:text-amber-400 font-semibold mt-0.5">
                      📚 ${sanitizeHTML(course)}
                    </p>
                  </div>
                </div>
                <div class="task-actions flex items-center gap-1.5 shrink-0">
                  <button type="button" class="btn-edit-task btn-icon" title="Edit Tugas">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                  </button>
                  <button type="button" class="btn-delete-task btn-icon text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40" title="Hapus Tugas">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                  </button>
                </div>
              </div>
              ${
                notes
                  ? `<div class="task-notes text-xs text-slate-600 dark:text-slate-400 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      📝 ${sanitizeHTML(notes)}
                     </div>`
                  : ""
              }
              <div class="task-footer flex items-center justify-between text-[11px] text-slate-400 dark:text-slate-500 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/60">
                <span>Tenggat: <strong>${formatDeadlineShort(deadline)}</strong></span>
                <span>Dibuat: ${formatDeadlineShort(task.createdAt)}</span>
              </div>
            </div>
          `;
        })
        .join("");
    }

    renderSchedules() {
      const day = this.selectedScheduleDay;
      const daySchedules = this.schedules.filter((s) => s.day === day);

      if (daySchedules.length === 0) {
        this.dom.scheduleList.innerHTML = "";
        this.dom.scheduleEmptyState.classList.remove("hidden");
        return;
      }

      this.dom.scheduleEmptyState.classList.add("hidden");
      this.dom.scheduleList.innerHTML = daySchedules
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .map((item) => {
          const { id, courseName, room, startTime, endTime, lecturer } = item;
          return `
            <div class="schedule-card" data-id="${id}">
              <div class="schedule-time-badge font-mono">${startTime} - ${endTime}</div>
              <div class="schedule-info flex-1">
                <h5 class="font-bold text-slate-900 dark:text-white text-sm">${sanitizeHTML(courseName)}</h5>
                <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span>📍 ${sanitizeHTML(room)}</span>
                  ${lecturer ? `<span>👨‍🏫 ${sanitizeHTML(lecturer)}</span>` : ""}
                </div>
              </div>
              <button type="button" class="btn-delete-schedule btn-icon text-slate-400 hover:text-rose-500" data-id="${id}" title="Hapus Jadwal">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
              </button>
            </div>
          `;
        })
        .join("");
    }

    renderNotes() {
      if (!this.dom.notesGrid) return;
      if (this.notes.length === 0) {
        this.dom.notesGrid.innerHTML = `
          <div class="col-span-full text-center py-6 text-slate-400 text-xs">
            Belum ada catatan ringkas. Klik <strong>"+ Catatan"</strong> untuk menambahkan memo.
          </div>
        `;
        return;
      }

      const sortedNotes = [...this.notes].sort((a, b) => {
        if (a.pinned === b.pinned) return new Date(b.updatedAt) - new Date(a.updatedAt);
        return a.pinned ? -1 : 1;
      });

      const colorClasses = {
        yellow: "note-yellow",
        blue: "note-blue",
        emerald: "note-emerald",
        purple: "note-purple"
      };

      this.dom.notesGrid.innerHTML = sortedNotes
        .map((note) => {
          const { id, title, content, color, pinned, updatedAt } = note;
          return `
            <div class="note-card ${colorClasses[color] || "note-yellow"} ${pinned ? "is-pinned" : ""}" data-id="${id}">
              <div class="note-header flex items-start justify-between gap-2">
                <h5 class="note-title font-bold text-sm text-slate-800 dark:text-slate-100 flex-1">${sanitizeHTML(title)}</h5>
                <div class="flex items-center gap-1">
                  <button type="button" class="btn-pin-note btn-icon text-xs ${pinned ? "text-amber-500 font-bold" : "text-slate-400"}" title="Pin">
                    📌
                  </button>
                  <button type="button" class="btn-delete-note btn-icon text-xs text-slate-400 hover:text-rose-500" title="Hapus">
                    ✕
                  </button>
                </div>
              </div>
              <p class="note-content text-xs text-slate-700 dark:text-slate-300 mt-2 whitespace-pre-line leading-relaxed">
                ${sanitizeHTML(content)}
              </p>
              <div class="note-footer text-[10px] text-slate-400 dark:text-slate-500 mt-3 pt-1 border-t border-black/5 dark:border-white/5">
                Diperbarui: ${formatDeadlineShort(updatedAt)}
              </div>
            </div>
          `;
        })
        .join("");
    }

    bindEvents() {
      if (this.dom.themeToggleBtn) {
        this.dom.themeToggleBtn.addEventListener("click", () => this.toggleTheme());
      }
      if (this.dom.refreshQuoteBtn) {
        this.dom.refreshQuoteBtn.addEventListener("click", () => this.loadQuote(true));
      }
      if (this.dom.taskSearchInput) {
        this.dom.taskSearchInput.addEventListener(
          "input",
          debounce((e) => {
            this.searchQuery = e.target.value.trim().toLowerCase();
            this.renderTasks();
          }, 200)
        );
      }
      if (this.dom.filterCategorySelect) {
        this.dom.filterCategorySelect.addEventListener("change", (e) => {
          this.filterCategory = e.target.value;
          this.renderTasks();
        });
      }
      if (this.dom.sortTasksSelect) {
        this.dom.sortTasksSelect.addEventListener("change", (e) => {
          this.sortBy = e.target.value;
          this.renderTasks();
        });
      }
      this.dom.filterTabs.forEach((tab) => {
        tab.addEventListener("click", () => {
          this.dom.filterTabs.forEach((t) => t.classList.remove("active"));
          tab.classList.add("active");
          this.filterStatus = tab.dataset.status;
          this.renderTasks();
        });
      });
      if (this.dom.btnOpenAddTaskModal) {
        this.dom.btnOpenAddTaskModal.addEventListener("click", () => this.openTaskModal());
      }
      if (this.dom.btnCloseTaskModal) {
        this.dom.btnCloseTaskModal.addEventListener("click", () => this.closeTaskModal());
      }
      if (this.dom.btnCancelTaskModal) {
        this.dom.btnCancelTaskModal.addEventListener("click", () => this.closeTaskModal());
      }
      if (this.dom.taskForm) {
        this.dom.taskForm.addEventListener("submit", (e) => this.handleTaskFormSubmit(e));
      }
      if (this.dom.btnImportSimulation) {
        this.dom.btnImportSimulation.addEventListener("click", () => this.handleImportSimulation());
      }
      if (this.dom.btnClearCompleted) {
        this.dom.btnClearCompleted.addEventListener("click", () => this.handleClearCompletedTasks());
      }
      if (this.dom.scheduleDaysNav) {
        this.dom.scheduleDaysNav.addEventListener("click", (e) => {
          const btn = e.target.closest(".day-tab");
          if (!btn) return;
          this.dom.scheduleDaysNav.querySelectorAll(".day-tab").forEach((b) => b.classList.remove("active"));
          btn.classList.add("active");
          this.selectedScheduleDay = btn.dataset.day;
          this.renderSchedules();
        });
      }
      if (this.dom.btnAddSchedule) {
        this.dom.btnAddSchedule.addEventListener("click", () => this.openScheduleModal());
      }
      if (this.dom.btnCloseScheduleModal) {
        this.dom.btnCloseScheduleModal.addEventListener("click", () => this.closeScheduleModal());
      }
      if (this.dom.scheduleForm) {
        this.dom.scheduleForm.addEventListener("submit", (e) => this.handleScheduleFormSubmit(e));
      }
      if (this.dom.btnAddNote) {
        this.dom.btnAddNote.addEventListener("click", () => this.openNoteModal());
      }
      if (this.dom.btnCloseNoteModal) {
        this.dom.btnCloseNoteModal.addEventListener("click", () => this.closeNoteModal());
      }
      if (this.dom.noteForm) {
        this.dom.noteForm.addEventListener("submit", (e) => this.handleNoteFormSubmit(e));
      }
      if (this.dom.btnResetAll) {
        this.dom.btnResetAll.addEventListener("click", () => this.handleResetAllData());
      }

      if (this.dom.taskList) {
        this.dom.taskList.addEventListener("click", (e) => {
          const itemEl = e.target.closest(".task-card");
          if (!itemEl) return;
          const taskId = itemEl.dataset.id;
          if (e.target.closest(".btn-toggle-task")) {
            this.toggleTaskStatus(taskId);
          } else if (e.target.closest(".btn-edit-task")) {
            this.openTaskModal(taskId);
          } else if (e.target.closest(".btn-delete-task")) {
            this.deleteTask(taskId);
          }
        });
      }

      if (this.dom.scheduleList) {
        this.dom.scheduleList.addEventListener("click", (e) => {
          const deleteBtn = e.target.closest(".btn-delete-schedule");
          if (deleteBtn) this.deleteSchedule(deleteBtn.dataset.id);
        });
      }

      if (this.dom.notesGrid) {
        this.dom.notesGrid.addEventListener("click", (e) => {
          const noteCard = e.target.closest(".note-card");
          if (!noteCard) return;
          const noteId = noteCard.dataset.id;
          if (e.target.closest(".btn-pin-note")) {
            this.toggleNotePin(noteId);
          } else if (e.target.closest(".btn-delete-note")) {
            this.deleteNote(noteId);
          }
        });
      }
    }

    openTaskModal(taskId = null) {
      this.editingTaskId = taskId;
      if (taskId) {
        const task = this.tasks.find((t) => t.id === taskId);
        if (!task) return;
        this.dom.taskModalTitle.textContent = "Edit Tugas Akademik";
        this.dom.taskInputId.value = task.id;
        this.dom.taskInputTitle.value = task.title;
        this.dom.taskInputCourse.value = task.course;
        this.dom.taskInputCategory.value = task.category;
        this.dom.taskInputDeadline.value = task.deadline || "";
        this.dom.taskInputPriority.value = task.priority;
        this.dom.taskInputNotes.value = task.notes || "";
      } else {
        this.dom.taskModalTitle.textContent = "Tambah Tugas Baru";
        this.dom.taskForm.reset();
        this.dom.taskInputId.value = "";
        const defaultDate = new Date(Date.now() + 86400000 * 2);
        defaultDate.setHours(23, 59, 0, 0);
        this.dom.taskInputDeadline.value = defaultDate.toISOString().slice(0, 16);
      }
      this.dom.taskModal.classList.remove("hidden");
      this.dom.taskInputTitle.focus();
    }

    closeTaskModal() {
      this.dom.taskModal.classList.add("hidden");
      this.dom.taskForm.reset();
      this.editingTaskId = null;
    }

    handleTaskFormSubmit(e) {
      e.preventDefault();
      const id = this.dom.taskInputId.value;
      const title = this.dom.taskInputTitle.value.trim();
      const course = this.dom.taskInputCourse.value.trim();
      const category = this.dom.taskInputCategory.value;
      const deadline = this.dom.taskInputDeadline.value;
      const priority = this.dom.taskInputPriority.value;
      const notes = this.dom.taskInputNotes.value.trim();

      if (!title || !course) {
        showToast("Judul tugas dan mata kuliah wajib diisi!", "error");
        return;
      }

      if (id) {
        const existingTask = this.tasks.find((t) => t.id === id);
        if (existingTask) {
          existingTask.update({ title, course, category, deadline, priority, notes });
          showToast("Tugas berhasil diperbarui!", "success");
        }
      } else {
        const newTask = new TaskItem({ title, course, category, deadline, priority, notes });
        this.tasks = [newTask, ...this.tasks];
        showToast("Tugas baru ditambahkan!", "success");
      }

      saveTasksToStorage(this.tasks);
      this.renderStats();
      this.renderTasks();
      this.closeTaskModal();
    }

    toggleTaskStatus(taskId) {
      const task = this.tasks.find((t) => t.id === taskId);
      if (!task) return;
      const status = task.toggle();
      saveTasksToStorage(this.tasks);
      this.renderStats();
      this.renderTasks();
      showToast(status ? "Tugas ditandai selesai! 🎉" : "Tugas dibuka kembali.", "info");
    }

    deleteTask(taskId) {
      const task = this.tasks.find((t) => t.id === taskId);
      if (!task) return;
      if (confirm(`Hapus tugas "${task.title}"?`)) {
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
        saveTasksToStorage(this.tasks);
        this.renderStats();
        this.renderTasks();
        showToast("Tugas berhasil dihapus.", "warning");
      }
    }

    handleClearCompletedTasks() {
      const completedCount = this.tasks.filter((t) => t.completed).length;
      if (completedCount === 0) {
        showToast("Tidak ada tugas selesai untuk dibersihkan.", "info");
        return;
      }
      if (confirm(`Hapus ${completedCount} tugas yang sudah selesai?`)) {
        this.tasks = this.tasks.filter((t) => !t.completed);
        saveTasksToStorage(this.tasks);
        this.renderStats();
        this.renderTasks();
        showToast(`${completedCount} tugas selesai dibersihkan!`, "success");
      }
    }

    async handleImportSimulation() {
      showToast("Mengunduh tugas simulasi dari API...", "info");
      const simulated = await fetchSimulationTodos();
      if (simulated.length === 0) {
        showToast("Gagal mengambil data simulasi.", "error");
        return;
      }
      const newItems = simulated.map((item) => new TaskItem(item));
      this.tasks = [...newItems, ...this.tasks];
      saveTasksToStorage(this.tasks);
      this.renderStats();
      this.renderTasks();
      showToast(`Berhasil mengimpor ${newItems.length} tugas simulasi!`, "success");
    }

    openScheduleModal() {
      this.dom.scheduleForm.reset();
      document.getElementById("schedule-day").value = this.selectedScheduleDay;
      this.dom.scheduleModal.classList.remove("hidden");
    }

    closeScheduleModal() {
      this.dom.scheduleModal.classList.add("hidden");
      this.dom.scheduleForm.reset();
    }

    handleScheduleFormSubmit(e) {
      e.preventDefault();
      const day = document.getElementById("schedule-day").value;
      const courseName = document.getElementById("schedule-course").value.trim();
      const room = document.getElementById("schedule-room").value.trim();
      const startTime = document.getElementById("schedule-start").value;
      const endTime = document.getElementById("schedule-end").value;
      const lecturer = document.getElementById("schedule-lecturer").value.trim();

      if (!courseName || !room || !startTime || !endTime) {
        showToast("Harap lengkapi semua kolom jadwal kuliah!", "error");
        return;
      }

      const newSchedule = new ScheduleItem({ day, courseName, room, startTime, endTime, lecturer });
      this.schedules = [...this.schedules, newSchedule];
      saveSchedulesToStorage(this.schedules);
      this.selectedScheduleDay = day;
      this.dom.scheduleDaysNav.querySelectorAll(".day-tab").forEach((tab) => {
        tab.classList.toggle("active", tab.dataset.day === day);
      });
      this.renderSchedules();
      this.closeScheduleModal();
      showToast(`Jadwal kuliah hari ${day} ditambahkan!`, "success");
    }

    deleteSchedule(scheduleId) {
      if (confirm("Hapus jadwal kuliah ini?")) {
        this.schedules = this.schedules.filter((s) => s.id !== scheduleId);
        saveSchedulesToStorage(this.schedules);
        this.renderSchedules();
        showToast("Jadwal kuliah dihapus.", "info");
      }
    }

    openNoteModal() {
      this.dom.noteForm.reset();
      this.dom.noteModal.classList.remove("hidden");
    }

    closeNoteModal() {
      this.dom.noteModal.classList.add("hidden");
      this.dom.noteForm.reset();
    }

    handleNoteFormSubmit(e) {
      e.preventDefault();
      const title = document.getElementById("note-title").value.trim();
      const content = document.getElementById("note-content").value.trim();
      const color = document.getElementById("note-color").value;

      if (!title || !content) {
        showToast("Judul dan isi catatan wajib diisi!", "error");
        return;
      }

      const newNote = new QuickNoteItem({ title, content, color, pinned: false });
      this.notes = [newNote, ...this.notes];
      saveNotesToStorage(this.notes);
      this.renderNotes();
      this.closeNoteModal();
      showToast("Catatan cepat berhasil disimpan!", "success");
    }

    toggleNotePin(noteId) {
      const note = this.notes.find((n) => n.id === noteId);
      if (!note) return;
      note.togglePin();
      saveNotesToStorage(this.notes);
      this.renderNotes();
      showToast(note.pinned ? "Catatan disematkan ke paling atas." : "Pin catatan dilepas.", "info");
    }

    deleteNote(noteId) {
      if (confirm("Hapus catatan cepat ini?")) {
        this.notes = this.notes.filter((n) => n.id !== noteId);
        saveNotesToStorage(this.notes);
        this.renderNotes();
        showToast("Catatan berhasil dihapus.", "info");
      }
    }

    handleResetAllData() {
      if (confirm("Reset seluruh data ke data awal bawaan ITERA?")) {
        localStorage.clear();
        this.tasks = loadTasksFromStorage();
        this.schedules = loadSchedulesFromStorage();
        this.notes = loadNotesFromStorage();
        this.renderStats();
        this.renderTasks();
        this.renderSchedules();
        this.renderNotes();
        showToast("Seluruh data dashboard berhasil direset ke default ITERA.", "success");
      }
    }
  }

  // Jalankan aplikasi langsung
  const run = () => {
    const app = new DashboardApp();
    app.init();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run);
  } else {
    run();
  }
})();
