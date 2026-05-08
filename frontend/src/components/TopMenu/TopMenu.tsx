import React from 'react';
import '../../styles/TopMenu.css'; // Стили для TopMenu

export function TopMenu() {
  return (
    <div className="top-menu-container">
      {/* Шапка с ссылками */}
      <div className="top-menu">
        <div className="tabs">
          <a href="/feed" className="tab">Лента</a> {/* Ссылка на страницу Лента */}
          <a href="/moderation" className="tab">Модерация</a> {/* Ссылка на страницу Модерация */}
          <a href="/rating" className="tab">Рейтинг</a> {/* Ссылка на страницу Рейтинг */}
        </div>
        
        <div className="user-settings">
          <button className="user-button">
            <i className="fas fa-bell"></i> {/* Иконка уведомлений */}
            <i className="fas fa-user-circle"></i> {/* Иконка пользователя */}
          </button>
        </div>
      </div>

    </div>
  );
}