import React, { useState } from 'react';
import { TopMenu } from '../components/TopMenu/TopMenu';
import { NavStudent } from '../components/NavStudent/NavStudent';
import { NameButton } from '../components/Button/Button';
import { SearchTeamModal } from './SearchTeamModal';
import '../styles/ProfilePage.css';

export function ProfileStudentPage() {
  const [isSearchTeamOpen, setIsSearchTeamOpen] = useState(false);

  return (
    <div className="profile-container">
      <TopMenu />

      <div className="profile-card">
        <div className="profile-avatar">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="27" stroke="#ccc" strokeWidth="1.5" />
            <circle cx="28" cy="22" r="9" stroke="#ccc" strokeWidth="1.5" />
            <path d="M8 50c0-11 9-20 20-20s20 9 20 20" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="profile-info">
          <p className="profile-name">Фамилия Имя Отчество</p>
          <p className="profile-role">Студенческий билет № 00000000</p>
          <div className="profile-team-row">
            <span className="profile-team-label">Команда:</span>
            <NameButton onClick={() => setIsSearchTeamOpen(true)} />
          </div>
        </div>
        {/* Карандаш — просто декоративный, без действия */}
        <button className="profile-edit-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
      </div>

      <NavStudent />

      {isSearchTeamOpen && (
        <SearchTeamModal closeModal={() => setIsSearchTeamOpen(false)} />
      )}
    </div>
  );
}
