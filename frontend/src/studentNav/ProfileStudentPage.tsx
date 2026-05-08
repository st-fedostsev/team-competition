import { useNavigate } from 'react-router';
import React, { useState } from 'react';
import { TopMenu } from '../components/TopMenu/TopMenu'; // Импортируем TopMenu
import { NavStudent } from '../components/NavStudent/NavStudent'; 
import { CreateSletter, CancelButton, CreateButton } from '../components/Button/Button';
import '../styles/ProfilePage.css';

export function ProfileStudentPage() {

  return (
    <div className="profile-container">
      {/* Вставляем TopMenu */}
      <TopMenu />

      {/* Карточка с профилем */}
      <div className="profile-card">
        <div className="profile-avatar">
          <i className="fas fa-user-circle"></i>
        </div>
        <div className="profile-info">
          <p className="profile-name">Логин?</p>
          <p className="profile-role">Роль: контент-менеджер</p>
        </div>
      </div>
      <NavStudent />
    </div>
  );
}