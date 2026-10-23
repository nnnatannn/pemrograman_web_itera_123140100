import React from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useBooks } from '../../context/BookContext';
import './Navbar.css';

function Navbar() {
  const { stats } = useBooks();

  return (
    <header className="navbar-header">
      <div className="navbar-container">
        <NavLink to="/" className="navbar-brand">
          <div className="brand-icon">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              <line x1="8" y1="6" x2="16" y2="6"></line>
              <line x1="8" y1="10" x2="14" y2="10"></line>
            </svg>
          </div>
          <div className="brand-text">
            <span className="brand-title">LiteraBook</span>
            <span className="brand-tagline">Manajemen Buku Pribadi</span>
          </div>
        </NavLink>

        <nav className="navbar-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span>Koleksi Buku</span>
            <span className="nav-badge" title="Total Koleksi">{stats.total}</span>
          </NavLink>

          <NavLink
            to="/stats"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span>Statistik</span>
          </NavLink>

          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span>Tentang</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}

Navbar.propTypes = {};

export default Navbar;
