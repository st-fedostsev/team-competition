import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/TopMenuAdmin.css';

export function TopMenuAdmin() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="top-menu-container">
      <div className="top-menu">
        <div className="tabs">
          <Link to="/admin/users" className="tab">Пользователи</Link>
          <Link to="/admin/logs" className="tab">Логи</Link>
          <Link to="/admin/backup" className="tab">Резервное копирование</Link>
          <Link to="/admin/rating" className="tab">Рейтинг</Link>
          <Link to="/admin/integrations" className="tab">Интеграции</Link>
        </div>

        <div className="user-settings">
          {/* Колокольчик */}
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
            <path d="M13.73 21a2 2 0 0 1-3.46 0" />
          </svg>

          {/* Аватар + стрелка — с дропдауном */}
          <div className="admin-user-dropdown">
            <button
              className="admin-user-btn"
              onClick={() => setIsDropdownOpen((v) => !v)}
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <circle cx="16" cy="16" r="15" stroke="#ccc" strokeWidth="1.2" />
                <circle cx="16" cy="12" r="5" stroke="#ccc" strokeWidth="1.2" />
                <path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#ccc" strokeWidth="1.2" strokeLinecap="round" />
              </svg>
              {/* Стрелка вниз */}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {/* Дропдаун меню */}
            {isDropdownOpen && (
              <div className="admin-dropdown-menu">
                <button className="admin-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                  </svg>
                  Мой профиль
                </button>
                <button className="admin-dropdown-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  Настройки
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
