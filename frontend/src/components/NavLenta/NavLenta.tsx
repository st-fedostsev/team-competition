import React from 'react';
import { useNavigate, useLocation } from 'react-router';
import '../../styles/NavLenta.css';

export function NavLenta() {
  const navigate = useNavigate();
  const location = useLocation();

  const tabs = [
    { label: 'Все', path: '/lenta' },
    { label: 'Челленджи', path: '/challenges' },
    { label: 'Анонсы', path: '/announcements' },
  ];

  return (
    <div className="nav-lenta-tabs">
      {tabs.map((tab) => (
        <button
          key={tab.path}
          className={`nav-lenta-tab ${location.pathname === tab.path ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
