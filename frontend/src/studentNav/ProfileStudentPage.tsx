import React, { useState } from 'react';
import { TopMenu } from '../components/TopMenu/TopMenu';
import { NavStudent } from '../components/NavStudent/NavStudent';
import { NameButton } from '../components/Button/Button';
import { SearchTeamModal } from './SearchTeamModal'; // путь подкорректируй под свой
import '../styles/ProfilePage.css';

export function ProfileStudentPage() {
  const [isSearchTeamOpen, setIsSearchTeamOpen] = useState(false);

  return (
    <div className="profile-container">
      <TopMenu />

      {/* Карточка профиля */}
      <div className="profile-card">
        <div className="profile-avatar">
          <i className="fas fa-user-circle"></i>
        </div>
        <div className="profile-info">
          <p className="profile-name">Фамилия Имя Отчество</p>
          <p className="profile-role">Студенческий билет № 00000000</p>
        </div>
        <div className="name-button">
          <NameButton onClick={() => setIsSearchTeamOpen(true)} />
        </div>
      </div>

      <NavStudent />

      {/* Модальное окно поиска команды */}
      {isSearchTeamOpen && (
        <SearchTeamModal closeModal={() => setIsSearchTeamOpen(false)} />
      )}
    </div>
  );
}
