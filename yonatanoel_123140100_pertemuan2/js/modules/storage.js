// js/modules/storage.js
// Pengelolaan LocalStorage & Inisialisasi Data Default Mahasiswa ITERA

import { TaskItem, ScheduleItem, QuickNoteItem } from "./models.js";

const STORAGE_KEYS = {
  TASKS: "itera_student_dashboard_tasks",
  SCHEDULES: "itera_student_dashboard_schedules",
  NOTES: "itera_student_dashboard_notes",
  THEME: "itera_student_dashboard_theme"
};

// Data awal mahasiswa ITERA (Seed Data) jika LocalStorage kosong
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

export const loadTasksFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
    if (!raw) {
      saveTasksToStorage(initialTasks);
      return initialTasks.map(t => TaskItem.fromJSON(t));
    }
    const parsed = JSON.parse(raw);
    return parsed.map(t => TaskItem.fromJSON(t));
  } catch (err) {
    console.error("Gagal membaca tasks dari LocalStorage:", err);
    return [];
  }
};

export const saveTasksToStorage = (tasks = []) => {
  try {
    localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
  } catch (err) {
    console.error("Gagal menyimpan tasks ke LocalStorage:", err);
  }
};

export const loadSchedulesFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SCHEDULES);
    if (!raw) {
      saveSchedulesToStorage(initialSchedules);
      return initialSchedules.map(s => ScheduleItem.fromJSON(s));
    }
    const parsed = JSON.parse(raw);
    return parsed.map(s => ScheduleItem.fromJSON(s));
  } catch (err) {
    console.error("Gagal membaca schedules dari LocalStorage:", err);
    return [];
  }
};

export const saveSchedulesToStorage = (schedules = []) => {
  try {
    localStorage.setItem(STORAGE_KEYS.SCHEDULES, JSON.stringify(schedules));
  } catch (err) {
    console.error("Gagal menyimpan schedules ke LocalStorage:", err);
  }
};

export const loadNotesFromStorage = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    if (!raw) {
      saveNotesToStorage(initialNotes);
      return initialNotes.map(n => QuickNoteItem.fromJSON(n));
    }
    const parsed = JSON.parse(raw);
    return parsed.map(n => QuickNoteItem.fromJSON(n));
  } catch (err) {
    console.error("Gagal membaca notes dari LocalStorage:", err);
    return [];
  }
};

export const saveNotesToStorage = (notes = []) => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
  } catch (err) {
    console.error("Gagal menyimpan notes ke LocalStorage:", err);
  }
};

export const loadThemeFromStorage = () => {
  return localStorage.getItem(STORAGE_KEYS.THEME) || "light";
};

export const saveThemeToStorage = (theme = "light") => {
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
};

export const resetAllStorageData = () => {
  localStorage.removeItem(STORAGE_KEYS.TASKS);
  localStorage.removeItem(STORAGE_KEYS.SCHEDULES);
  localStorage.removeItem(STORAGE_KEYS.NOTES);
};
