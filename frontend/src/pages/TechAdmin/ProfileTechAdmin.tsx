import React from 'react';
import { TopMenuAdmin } from '../../components/TopMenu/TopMenuAdmin';
import '../../styles/ProfilePage.css'

export function ProfileTechAdmin() {
  return (
    <div className="profile-container">
      <TopMenuAdmin />

      <div className="profile-card">
        <div className="profile-avatar">
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="27" stroke="#ccc" strokeWidth="1.5" />
            <circle cx="28" cy="22" r="9" stroke="#ccc" strokeWidth="1.5" />
            <path d="M8 50c0-11 9-20 20-20s20 9 20 20" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>
        <div className="profile-info">
          <p className="profile-name">Логин?</p>
          <p className="profile-role">Роль: администратор игры</p>
        </div>
      </div>
    </div>
  );
}
