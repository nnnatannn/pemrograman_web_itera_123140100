import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { BookProvider } from './context/BookContext';
import Navbar from './components/Navbar/Navbar';
import Home from './pages/Home/Home';
import Stats from './pages/Stats/Stats';
import About from './pages/About/About';
import './App.css';

function App() {
  return (
    <Router>
      <BookProvider>
        <div className="app-layout">
          <Navbar />
          <main className="app-main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/about" element={<About />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <footer className="app-footer">
            <div className="footer-container">
              <p className="footer-text">
                © 2026 <strong>LiteraBook</strong> · Praktikum Pengembangan Aplikasi Web (PAW)
              </p>
              <p className="footer-subtext">
                Teknik Informatika · Institut Teknologi Sumatera (ITERA) · Yonatanoel Petra Hutabarat (123140100)
              </p>
            </div>
          </footer>
        </div>
      </BookProvider>
    </Router>
  );
}

export default App;
