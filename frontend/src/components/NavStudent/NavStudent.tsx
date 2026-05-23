import React, { useState } from 'react';
import '../../styles/NavStudent.css';

export function NavStudent() {
  const [activeTab, setActiveTab] = useState<'achievements' | 'rating'>('achievements');

  return (
    <div className="nav-student-outer">
      <div className="nav-student-container">

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

        {activeTab === 'achievements' && (
          <div className="achievements-wrapper">
            <div className="achievements-container">
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
            </div>
          </div>
        )}

        {activeTab === 'rating' && (
          <div className="raiting-card">
            <div className="reiting-position">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FFD675" strokeWidth="2" strokeLinecap="round" style={{marginRight: 6, verticalAlign: 'middle'}}>
                <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              Позиция
              <p className="reiting-value">1/15000</p>
            </div>
            <div className="reiting-divider" />
            <div className="reiting-number">
              <span className="reiting-label">Общий балл</span>
              <p className="reiting-value">100000</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
