import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/TopMenu.css';

interface TabItem {
  label: string;
  path: string;
}

export function TopMenu(props: { tabs: TabItem[] }) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <div className="top-menu-container">
      <div className="top-menu">
        <div className="tabs">
          {props.tabs.map((tab) => (
            <Link key={tab.path} to={tab.path} className="tab">
              {tab.label}
            </Link>
          ))}
        </div>

        <div className="user-settings">
          <button className="bell-button">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </button>

          <div className="user-menu-wrapper">
            <button
              className="user-button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </button>

            {isUserMenuOpen && (
              <div className="user-dropdown">
                <Link to="/ProfileStudentPage" className="user-dropdown-item">
                  Профиль
                </Link>

                <Link to="/settings" className="user-dropdown-item">
                  Настройки
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}