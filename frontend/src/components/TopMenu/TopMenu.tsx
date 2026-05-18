import React from 'react';
import { Link } from 'react-router';
import '../../styles/TopMenu.css';

export function TopMenu() {
  return (
    <div className="top-menu-container">
      <div className="top-menu">
        <div className="tabs">
          <Link to="/lenta" className="tab">Лента</Link>
          <Link to="/knowledge" className="tab">Биржа знаний</Link>
          <Link to="/calendar" className="tab">Календарь</Link>
        </div>

        <div className="user-settings">
          <button className="user-button">
            {/* Иконка колокольчика */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {/* Иконка пользователя */}
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 12 }}>
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
