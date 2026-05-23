import React, { useState } from 'react';
import { TopMenu } from '../components/TopMenu/TopMenu';
import { CheckInButton } from '../components/Button/Button';
import { NavTeam } from '../components/NavTeam/NavTeam';
import '../styles/TeamProfilePage.css';

export function TeamProfilePage() {
  return (
    <div className="team-profile-container">
      <TopMenu />

      <div className="team-profile-content">

        {/* Карточка команды */}
        <div className="team-card">
          <div className="team-card-left">
            <div className="team-avatar">
              <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
                <circle cx="45" cy="45" r="43" stroke="#ccc" strokeWidth="1.5" />
                <circle cx="45" cy="36" r="13" stroke="#ccc" strokeWidth="1.5" />
                <path d="M14 80c0-17 13.88-31 31-31s31 14 31 31" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <p className="team-name">Название команды</p>
          </div>
          <div className="team-card-right">
            <button className="team-menu-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#999">
                <circle cx="12" cy="5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="19" r="1.5"/>
              </svg>
            </button>
            <CheckInButton />
          </div>
        </div>

        {/* Нижняя часть: участники + рейтинг */}
        <NavTeam />

      </div>
    </div>
  );
}
