import { useState, useEffect } from 'react';

/**
 * Custom Hook: useLocalStorage
 * Menyimpan dan mengambil state secara persisten di browser localStorage
 * @param {string} key - Kunci penyimpanan localStorage
 * @param {any} initialValue - Nilai default jika key belum ada di storage
 * @returns {[any, Function]} - Pasangan nilai dan setter state
 */
function useLocalStorage(key, initialValue) {
  // Lazy initialization: baca nilai tersimpan hanya saat mount awal
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (typeof window === 'undefined') {
        return initialValue;
      }
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Gagal membaca key "${key}" dari localStorage:`, error);
      return initialValue;
    }
  });

  // Sinkronisasi setiap kali state berubah
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      }
    } catch (error) {
      console.error(`Gagal menyimpan key "${key}" ke localStorage:`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
}

export default useLocalStorage;
