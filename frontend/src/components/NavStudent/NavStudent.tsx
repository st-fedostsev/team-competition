import React, { useState } from 'react';
import '../../styles/NavStudent.css';

export function NavStudent() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'rating'>('achievements');

  return (
    <div className="nav-student-container">
      {/* Навигация */}
      <div className="nav">
        <div
          className={`student-nav-button ${activeTab === 'achievements' ? 'active' : ''}`}
          onClick={() => setActiveTab('achievements')}
        >
          Достижения
        </div>

        <div
          className={`student-nav-button ${activeTab === 'rating' ? 'active' : ''}`}
          onClick={() => setActiveTab('rating')}
        >
          Рейтинг
        </div>
      </div>

      {/* Список достижений */}
      <div className="achievements-wrapper">
        <div className="achievements-container">
          {activeTab === 'achievements' && (
            <ul className="achievements-list">
              <li className="achievement-card received">
                <div className="achievement-left">
                  <div className="achievement-icon">🏆</div>
                  <div className="achievement-info">
                    <div className="achievement-title">Название</div>
                    <div className="achievement-description">Описание</div>
                  </div>
                </div>
                <div className="achievement-right">
                  <div className="achievement-status">Получено</div>
                  <div className="achievement-date">01.01.26</div>
                </div>
              </li>

              <li className="achievement-card received">
                <div className="achievement-left">
                  <div className="achievement-icon">🏆</div>
                  <div className="achievement-info">
                    <div className="achievement-title">Название 2</div>
                    <div className="achievement-description">Описание 2</div>
                  </div>
                </div>
                <div className="achievement-right">
                  <div className="achievement-status">Получено</div>
                  <div className="achievement-date">02.01.26</div>
                </div>
              </li>

              <li className="achievement-card">
                <div className="achievement-left">
                  <div className="achievement-icon">🏆</div>
                  <div className="achievement-info">
                    <div className="achievement-title">Название 3</div>
                    <div className="achievement-description">Описание 3</div>
                  </div>
                </div>
              </li>
            </ul>
          )}
        </div>
      </div>
      {/* Список рейтингов */}
      <div className='reiting'>
        {activeTab === 'rating' && (
        <div className='raiting-card'>
          <div className='reiting-position'>
            Позиция
            <p>1/15000</p>
            </div>
          <div className='reiting-number'>100000</div>
        </div>
        )}
      </div>
    </div>
  );
}