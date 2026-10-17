// js/modules/api.js
// Implementasi Async Programming (Async / Await & Fetch API) untuk data publik eksternal

import { interpretWeatherCode } from "./utils.js";

// Koordinat Geografis Kampus ITERA, Jati Agung, Lampung Selatan
const ITERA_LATITUDE = -5.36;
const ITERA_LONGITUDE = 105.31;

/**
 * Mengambil informasi cuaca real-time di kampus ITERA menggunakan Open-Meteo API
 * Endpoint gratis publik tanpa API Key
 */
export const fetchCampusWeather = async () => {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${ITERA_LATITUDE}&longitude=${ITERA_LONGITUDE}&current_weather=true`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }
    const data = await response.json();
    const { temperature, windspeed, weathercode, time } = data.current_weather;
    const { text: conditionText, icon: weatherIcon } = interpretWeatherCode(weathercode);

    return {
      success: true,
      data: {
        location: "Kampus ITERA (Lampung)",
        temperature: Math.round(temperature),
        windspeed,
        condition: conditionText,
        icon: weatherIcon,
        updatedAt: time
      }
    };
  } catch (error) {
    console.error("Gagal mengambil data cuaca kampus ITERA:", error);
    return {
      success: false,
      error: error.message,
      data: {
        location: "Kampus ITERA",
        temperature: 29,
        windspeed: 10,
        condition: "Cerah Berawan (Offline)",
        icon: "🌤️",
        updatedAt: new Date().toISOString()
      }
    };
  }
};

/**
 * Mengambil kutipan motivasi harian secara asinkron dari DummyJSON Quotes
 */
export const fetchDailyQuote = async () => {
  const url = "https://dummyjson.com/quotes/random";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }
    const { quote, author } = await response.json();
    return {
      success: true,
      data: { quote, author }
    };
  } catch (error) {
    console.warn("Gagal memuat kutipan online, menggunakan fallback:", error);
    return {
      success: false,
      data: {
        quote: "Pendidikan adalah senjata paling mematikan di dunia, karena dengan pendidikan Anda dapat mengubah dunia.",
        author: "Nelson Mandela"
      }
    };
  }
};

/**
 * Mengambil simulasi daftar tugas akademik dari JSONPlaceholder API
 * (Sesuai rekomendasi modul praktikum untuk inisialisasi tugas simulasi)
 */
export const fetchSimulationTodos = async (limit = 3) => {
  const url = `https://jsonplaceholder.typicode.com/todos?_limit=${limit}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Gagal memuat data todo simulasi (${response.status})`);
    }
    const todos = await response.json();
    return todos.map((item) => ({
      title: item.title,
      course: "Simulasi Eksternal (API)",
      category: "Praktikum",
      deadline: new Date(Date.now() + 86400000 * 2).toISOString().slice(0, 16),
      priority: item.completed ? "low" : "medium",
      completed: item.completed,
      notes: "Tugas ini diimpor secara asinkron via JSONPlaceholder API"
    }));
  } catch (error) {
    console.error("Error fetch simulation todos:", error);
    return [];
  }
};
