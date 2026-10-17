// js/main.js
// ITERA Smart Student Dashboard - Main Controller & DashboardApp Class
// Menerapkan ES6+ Classes, Arrow Functions, Template Literals, Destructuring, Spread, Modern Array Methods, dan Async/Await

import { TaskItem, ScheduleItem, QuickNoteItem } from "./modules/models.js";
import {
  formatIndonesianDate,
  formatTimeOnly,
  formatDeadlineShort,
  sanitizeHTML,
  showToast,
  debounce
} from "./modules/utils.js";
import { fetchCampusWeather, fetchDailyQuote, fetchSimulationTodos } from "./modules/api.js";
import {
  loadTasksFromStorage,
  saveTasksToStorage,
  loadSchedulesFromStorage,
  saveSchedulesToStorage,
  loadNotesFromStorage,
  saveNotesToStorage,
  loadThemeFromStorage,
  saveThemeToStorage,
  resetAllStorageData
} from "./modules/storage.js";

/**
 * Class DashboardApp
 * Mengelola siklus hidup aplikasi, state, event listeners, dan rendering
 */
export class DashboardApp {
  constructor() {
    // Inisialisasi state aplikasi dengan destructuring & data dari storage
    this.tasks = loadTasksFromStorage();
    this.schedules = loadSchedulesFromStorage();
    this.notes = loadNotesFromStorage();
    this.theme = loadThemeFromStorage();

    // State filter, search, & sorting
    this.filterStatus = "all"; // all | pending | completed
    this.filterCategory = "all"; // all | Tugas Kuliah | Praktikum | Proyek | Organisasi
    this.searchQuery = "";
    this.sortBy = "deadline"; // deadline | priority | created
    this.selectedScheduleDay = "Senin";
    this.editingTaskId = null;

    // Cache elemen DOM
    this.dom = {
      // Header & Real-time
      liveClock: document.getElementById("live-clock"),
      liveDate: document.getElementById("live-date"),
      weatherCard: document.getElementById("weather-widget"),
      quoteCard: document.getElementById("quote-widget"),
      refreshQuoteBtn: document.getElementById("btn-refresh-quote"),
      themeToggleBtn: document.getElementById("theme-toggle-btn"),

      // Stats Counters
      statTotalTasks: document.getElementById("stat-total-tasks"),
      statCompletedTasks: document.getElementById("stat-completed-tasks"),
      statPendingTasks: document.getElementById("stat-pending-tasks"),
      statHighPriority: document.getElementById("stat-high-priority"),
      productivityBar: document.getElementById("productivity-bar"),
      productivityPercent: document.getElementById("productivity-percent"),

      // Task Controls
      taskList: document.getElementById("task-list"),
      taskEmptyState: document.getElementById("task-empty-state"),
      taskSearchInput: document.getElementById("task-search-input"),
      filterCategorySelect: document.getElementById("filter-category"),
      sortTasksSelect: document.getElementById("sort-tasks"),
      filterTabs: document.querySelectorAll(".filter-tab"),
      btnOpenAddTaskModal: document.getElementById("btn-open-add-task"),
      btnImportSimulation: document.getElementById("btn-import-simulation"),
      btnClearCompleted: document.getElementById("btn-clear-completed"),

      // Task Modal Form
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

      // Schedule Section
      scheduleDaysNav: document.getElementById("schedule-days-nav"),
      scheduleList: document.getElementById("schedule-list"),
      scheduleEmptyState: document.getElementById("schedule-empty-state"),
      btnAddSchedule: document.getElementById("btn-add-schedule"),
      scheduleModal: document.getElementById("schedule-modal"),
      scheduleForm: document.getElementById("schedule-form"),
      btnCloseScheduleModal: document.getElementById("btn-close-schedule-modal"),

      // Quick Notes Section
      notesGrid: document.getElementById("notes-grid"),
      btnAddNote: document.getElementById("btn-add-note"),
      noteModal: document.getElementById("note-modal"),
      noteForm: document.getElementById("note-form"),
      btnCloseNoteModal: document.getElementById("btn-close-note-modal"),

      // Reset System
      btnResetAll: document.getElementById("btn-reset-all")
    };
  }

  /**
   * Menginisialisasi aplikasi saat DOM siap
   */
  async init() {
    this.applyTheme(this.theme);
    this.startLiveClock();
    this.bindEvents();

    // Render komponen awal dari LocalStorage
    this.renderStats();
    this.renderTasks();
    this.renderSchedules();
    this.renderNotes();

    // Ambil data eksternal secara asinkron (Async/Await)
    await Promise.all([
      this.loadWeather(),
      this.loadQuote()
    ]);
  }

  /**
   * Menghubungkan seluruh event listener antarmuka
   */
  bindEvents() {
    // Theme toggle
    if (this.dom.themeToggleBtn) {
      this.dom.themeToggleBtn.addEventListener("click", () => this.toggleTheme());
    }

    // Refresh quote button
    if (this.dom.refreshQuoteBtn) {
      this.dom.refreshQuoteBtn.addEventListener("click", () => this.loadQuote(true));
    }

    // Search task dengan Debounce
    if (this.dom.taskSearchInput) {
      this.dom.taskSearchInput.addEventListener(
        "input",
        debounce((e) => {
          this.searchQuery = e.target.value.trim().toLowerCase();
          this.renderTasks();
        }, 200)
      );
    }

    // Filter Kategori
    if (this.dom.filterCategorySelect) {
      this.dom.filterCategorySelect.addEventListener("change", (e) => {
        this.filterCategory = e.target.value;
        this.renderTasks();
      });
    }

    // Sorting
    if (this.dom.sortTasksSelect) {
      this.dom.sortTasksSelect.addEventListener("change", (e) => {
        this.sortBy = e.target.value;
        this.renderTasks();
      });
    }

    // Filter Tabs (Semua, Aktif, Selesai)
    this.dom.filterTabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        this.dom.filterTabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        this.filterStatus = tab.dataset.status;
        this.renderTasks();
      });
    });

    // Modal Task Event
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

    // Import Todo Simulasi via API
    if (this.dom.btnImportSimulation) {
      this.dom.btnImportSimulation.addEventListener("click", () => this.handleImportSimulation());
    }

    // Hapus Semua Selesai
    if (this.dom.btnClearCompleted) {
      this.dom.btnClearCompleted.addEventListener("click", () => this.handleClearCompletedTasks());
    }

    // Schedule Nav Tabs (Senin - Jumat)
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

    // Schedule Modal
    if (this.dom.btnAddSchedule) {
      this.dom.btnAddSchedule.addEventListener("click", () => this.openScheduleModal());
    }
    if (this.dom.btnCloseScheduleModal) {
      this.dom.btnCloseScheduleModal.addEventListener("click", () => this.closeScheduleModal());
    }
    if (this.dom.scheduleForm) {
      this.dom.scheduleForm.addEventListener("submit", (e) => this.handleScheduleFormSubmit(e));
    }

    // Notes Modal
    if (this.dom.btnAddNote) {
      this.dom.btnAddNote.addEventListener("click", () => this.openNoteModal());
    }
    if (this.dom.btnCloseNoteModal) {
      this.dom.btnCloseNoteModal.addEventListener("click", () => this.closeNoteModal());
    }
    if (this.dom.noteForm) {
      this.dom.noteForm.addEventListener("submit", (e) => this.handleNoteFormSubmit(e));
    }

    // Reset All Data
    if (this.dom.btnResetAll) {
      this.dom.btnResetAll.addEventListener("click", () => this.handleResetAllData());
    }

    // Delegate Klik pada Task List (Toggle, Edit, Delete)
    if (this.dom.taskList) {
      this.dom.taskList.addEventListener("click", (e) => {
        const itemEl = e.target.closest(".task-card");
        if (!itemEl) return;
        const taskId = itemEl.dataset.id;

        // Toggle Selesai
        if (e.target.closest(".btn-toggle-task")) {
          this.toggleTaskStatus(taskId);
        }
        // Edit Task
        else if (e.target.closest(".btn-edit-task")) {
          this.openTaskModal(taskId);
        }
        // Hapus Task
        else if (e.target.closest(".btn-delete-task")) {
          this.deleteTask(taskId);
        }
      });
    }

    // Delegate Klik pada Schedule List (Delete)
    if (this.dom.scheduleList) {
      this.dom.scheduleList.addEventListener("click", (e) => {
        const deleteBtn = e.target.closest(".btn-delete-schedule");
        if (deleteBtn) {
          const scheduleId = deleteBtn.dataset.id;
          this.deleteSchedule(scheduleId);
        }
      });
    }

    // Delegate Klik pada Notes Grid (Pin, Delete)
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

  // ==========================================
  // REAL-TIME CLOCK & THEME
  // ==========================================

  startLiveClock() {
    const updateTime = () => {
      const now = new Date();
      if (this.dom.liveClock) {
        this.dom.liveClock.textContent = formatTimeOnly(now) + " WIB";
      }
      if (this.dom.liveDate) {
        this.dom.liveDate.textContent = formatIndonesianDate(now);
      }
    };
    updateTime();
    setInterval(updateTime, 1000);
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
    const nextTheme = this.theme === "dark" ? "light" : "dark";
    this.applyTheme(nextTheme);
    showToast(`Tema diganti ke mode ${nextTheme === "dark" ? "Gelap (Dark)" : "Terang (Light)"}`, "info");
  }

  // ==========================================
  // ASYNC API LOADERS (Async/Await)
  // ==========================================

  async loadWeather() {
    if (!this.dom.weatherCard) return;
    this.dom.weatherCard.innerHTML = `
      <div class="weather-loading animate-pulse">
        <div class="h-4 bg-slate-200 dark:bg-slate-700 rounded w-24 mb-2"></div>
        <div class="h-8 bg-slate-200 dark:bg-slate-700 rounded w-16"></div>
      </div>
    `;

    const result = await fetchCampusWeather();
    const { temperature, condition, icon, windspeed, location } = result.data;

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

    if (quoteTextEl) quoteTextEl.textContent = "Memuat kutipan inspiratif harian...";

    const res = await fetchDailyQuote();
    const { quote, author } = res.data;

    if (quoteTextEl) quoteTextEl.textContent = `“${quote}”`;
    if (quoteAuthorEl) quoteAuthorEl.textContent = `— ${author}`;

    if (notify) {
      showToast("Kutipan motivasi berhasil diperbarui!", "success");
    }
  }

  // ==========================================
  // STATS MANAGEMENT (Modern Array Methods)
  // ==========================================

  renderStats() {
    // Array methods: reduce, filter
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

  // ==========================================
  // TASK MANAGEMENT (CRUD & ES6+)
  // ==========================================

  getFilteredTasks() {
    // 1. Filter Status (all / pending / completed)
    let result = this.tasks.filter((t) => {
      if (this.filterStatus === "pending") return !t.completed;
      if (this.filterStatus === "completed") return t.completed;
      return true;
    });

    // 2. Filter Kategori
    if (this.filterCategory !== "all") {
      result = result.filter((t) => t.category === this.filterCategory);
    }

    // 3. Search Query
    if (this.searchQuery) {
      result = result.filter(
        (t) =>
          t.title.toLowerCase().includes(this.searchQuery) ||
          t.course.toLowerCase().includes(this.searchQuery) ||
          (t.notes && t.notes.toLowerCase().includes(this.searchQuery))
      );
    }

    // 4. Sorting
    const priorityWeights = { high: 3, medium: 2, low: 1 };
    result.sort((a, b) => {
      if (this.sortBy === "priority") {
        return priorityWeights[b.priority] - priorityWeights[a.priority];
      }
      if (this.sortBy === "created") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      // default: deadline
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

    // Template Literals untuk rendering dinamis
    this.dom.taskList.innerHTML = filtered
      .map((task) => {
        const { id, title, course, category, deadline, priority, completed, notes } = task;
        const timeStatus = task.timeStatus;

        // Badge prioritas
        const priorityBadges = {
          high: `<span class="badge badge-high">Tinggi</span>`,
          medium: `<span class="badge badge-medium">Sedang</span>`,
          low: `<span class="badge badge-low">Rendah</span>`
        };

        // Status tenggat
        const timeStatusBadges = {
          completed: `<span class="time-badge time-completed">✓ Selesai</span>`,
          overdue: `<span class="time-badge time-overdue">⚠️ ${timeStatus.text}</span>`,
          urgent: `<span class="time-badge time-urgent">⏰ ${timeStatus.text}</span>`,
          upcoming: `<span class="time-badge time-upcoming">📅 ${timeStatus.text}</span>`,
          normal: `<span class="time-badge time-normal">Tanpa Tenggat</span>`
        };

        return `
          <div class="task-card ${completed ? "is-completed" : ""} ${task.isOverdue ? "is-overdue" : ""}" data-id="${id}">
            <div class="task-card-header">
              <div class="flex items-start gap-3 flex-1 min-w-0">
                <button type="button" class="btn-toggle-task ${completed ? "checked" : ""}" title="${completed ? "Tandai Belum Selesai" : "Tandai Selesai"}" aria-label="Toggle task completion">
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
                <button type="button" class="btn-edit-task btn-icon" title="Edit Tugas" aria-label="Edit tugas">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                </button>
                <button type="button" class="btn-delete-task btn-icon text-rose-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40" title="Hapus Tugas" aria-label="Hapus tugas">
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
      // Default deadline: 2 hari ke depan jam 23:59
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
      showToast("Judul tugas dan nama mata kuliah wajib diisi!", "error");
      return;
    }

    if (id) {
      // UPDATE: Cari dan perbarui menggunakan TaskItem method update()
      const existingTask = this.tasks.find((t) => t.id === id);
      if (existingTask) {
        existingTask.update({ title, course, category, deadline, priority, notes });
        showToast("Tugas akademik berhasil diperbarui!", "success");
      }
    } else {
      // CREATE: Buat instance TaskItem baru dan tambahkan dengan spread operator
      const newTask = new TaskItem({
        title,
        course,
        category,
        deadline,
        priority,
        notes
      });
      // Spread operator untuk state update yang rapi
      this.tasks = [newTask, ...this.tasks];
      showToast("Tugas baru berhasil ditambahkan!", "success");
    }

    // Persist ke LocalStorage
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
    showToast(status ? "Tugas ditandai selesai! 🎉" : "Tugas kembali dibuka.", "info");
  }

  deleteTask(taskId) {
    const task = this.tasks.find((t) => t.id === taskId);
    if (!task) return;

    if (confirm(`Hapus tugas "${task.title}"?`)) {
      // Filter out task (Immutable delete)
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
      showToast(`${completedCount} tugas selesai berhasil dibersihkan!`, "success");
    }
  }

  async handleImportSimulation() {
    showToast("Mengunduh tugas simulasi dari JSONPlaceholder...", "info");
    const simulated = await fetchSimulationTodos(3);
    if (simulated.length === 0) {
      showToast("Gagal mengimpor tugas simulasi eksternal.", "error");
      return;
    }

    // Konversi hasil fetch ke instance TaskItem dan gabungkan dengan spread operator
    const newItems = simulated.map((item) => new TaskItem(item));
    this.tasks = [...newItems, ...this.tasks];

    saveTasksToStorage(this.tasks);
    this.renderStats();
    this.renderTasks();
    showToast(`Berhasil mengimpor ${newItems.length} tugas simulasi API!`, "success");
  }

  // ==========================================
  // SCHEDULE MANAGEMENT
  // ==========================================

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
            <div class="schedule-time-badge font-mono">
              ${startTime} - ${endTime}
            </div>
            <div class="schedule-info flex-1">
              <h5 class="font-bold text-slate-900 dark:text-white text-sm">${sanitizeHTML(courseName)}</h5>
              <div class="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span>📍 ${sanitizeHTML(room)}</span>
                ${lecturer ? `<span>👨‍🏫 ${sanitizeHTML(lecturer)}</span>` : ""}
              </div>
            </div>
            <button type="button" class="btn-delete-schedule btn-icon text-slate-400 hover:text-rose-500" data-id="${id}" title="Hapus Jadwal" aria-label="Hapus jadwal">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
            </button>
          </div>
        `;
      })
      .join("");
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
      showToast("Harap isi semua informasi jadwal perkuliahan!", "error");
      return;
    }

    const newSchedule = new ScheduleItem({
      day,
      courseName,
      room,
      startTime,
      endTime,
      lecturer
    });

    this.schedules = [...this.schedules, newSchedule];
    saveSchedulesToStorage(this.schedules);
    this.selectedScheduleDay = day;

    // Aktifkan tab hari yang bersangkutan
    this.dom.scheduleDaysNav.querySelectorAll(".day-tab").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.day === day);
    });

    this.renderSchedules();
    this.closeScheduleModal();
    showToast(`Jadwal kuliah hari ${day} berhasil ditambahkan!`, "success");
  }

  deleteSchedule(scheduleId) {
    if (confirm("Hapus jadwal kuliah ini?")) {
      this.schedules = this.schedules.filter((s) => s.id !== scheduleId);
      saveSchedulesToStorage(this.schedules);
      this.renderSchedules();
      showToast("Jadwal kuliah dihapus.", "info");
    }
  }

  // ==========================================
  // QUICK NOTES MANAGEMENT
  // ==========================================

  renderNotes() {
    if (!this.dom.notesGrid) return;

    if (this.notes.length === 0) {
      this.dom.notesGrid.innerHTML = `
        <div class="col-span-full text-center py-6 text-slate-400 text-xs">
          Belum ada catatan ringkas. Klik <strong>"+ Catatan"</strong> untuk menambahkan memo cepat.
        </div>
      `;
      return;
    }

    // Urutkan: Pinned di atas, lalu berdasarkan tanggal update terbaru
    const sortedNotes = [...this.notes].sort((a, b) => {
      if (a.pinned === b.pinned) {
        return new Date(b.updatedAt) - new Date(a.updatedAt);
      }
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
                <button type="button" class="btn-pin-note btn-icon text-xs ${pinned ? "text-amber-500 font-bold" : "text-slate-400"}" title="${pinned ? "Lepas Pin" : "Sematkan Catatan"}">
                  📌
                </button>
                <button type="button" class="btn-delete-note btn-icon text-xs text-slate-400 hover:text-rose-500" title="Hapus Catatan">
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

    const newNote = new QuickNoteItem({
      title,
      content,
      color,
      pinned: false
    });

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

  // ==========================================
  // RESET ALL DATA
  // ==========================================

  handleResetAllData() {
    if (confirm("Apakah Anda yakin ingin mereset seluruh data dashboard ke pengaturan awal default?")) {
      resetAllStorageData();
      this.tasks = loadTasksFromStorage();
      this.schedules = loadSchedulesFromStorage();
      this.notes = loadNotesFromStorage();
      this.renderStats();
      this.renderTasks();
      this.renderSchedules();
      this.renderNotes();
      showToast("Seluruh data dashboard berhasil direset ke data awal default ITERA.", "success");
    }
  }
}

// Inisialisasi aplikasi saat dokumen HTML telah selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
  const app = new DashboardApp();
  app.init();
});
