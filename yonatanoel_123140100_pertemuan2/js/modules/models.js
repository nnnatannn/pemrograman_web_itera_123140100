// js/modules/models.js
// Implementasi OOP ES6+ Classes untuk entitas data Dashboard Mahasiswa

/**
 * Class TaskItem
 * Memodelkan entitas data tugas akademik mahasiswa
 */
export class TaskItem {
  constructor({
    id = Date.now().toString(),
    title,
    course,
    category = "Tugas Kuliah",
    deadline,
    priority = "medium", // low | medium | high
    completed = false,
    notes = "",
    createdAt = new Date().toISOString()
  }) {
    this.id = id;
    this.title = title;
    this.course = course;
    this.category = category;
    this.deadline = deadline; // YYYY-MM-DDTHH:mm
    this.priority = priority;
    this.completed = completed;
    this.notes = notes;
    this.createdAt = createdAt;
  }

  // Toggle status selesai
  toggle() {
    this.completed = !this.completed;
    return this.completed;
  }

  // Update properti tugas menggunakan destructuring
  update({ title, course, category, deadline, priority, notes }) {
    if (title !== undefined) this.title = title;
    if (course !== undefined) this.course = course;
    if (category !== undefined) this.category = category;
    if (deadline !== undefined) this.deadline = deadline;
    if (priority !== undefined) this.priority = priority;
    if (notes !== undefined) this.notes = notes;
  }

  // Getter: Cek apakah tugas sudah lewat tenggat waktu (overdue)
  get isOverdue() {
    if (!this.deadline || this.completed) return false;
    return new Date(this.deadline) < new Date();
  }

  // Getter: Sisa waktu atau status tenggat terformat
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

  // Static Factory Method untuk membuat objek dari data biasa
  static fromJSON(jsonObj) {
    return new TaskItem(jsonObj);
  }
}

/**
 * Class ScheduleItem
 * Memodelkan entitas jadwal perkuliahan mingguan
 */
export class ScheduleItem {
  constructor({
    id = Date.now().toString(),
    day, // Senin, Selasa, Rabu, Kamis, Jumat
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

/**
 * Class QuickNoteItem
 * Memodelkan catatan cepat / memo mahasiswa
 */
export class QuickNoteItem {
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
