import React, { useState } from 'react';
import '../../styles/NavTeam.css';

const mockMembers = [
  { name: 'Иванов Иван Иванович', role: 'Капитан' },
  { name: 'Иванов Иван Иванович', role: '' },
  { name: 'Иванов Иван Иванович', role: '' },
];

export function NavTeam() {
  const [activeTab, setActiveTab] = useState<'members' | 'score'>('members');

  return (
    <div className="nav-team-wrapper">

      {/* Левая панель */}
      <div className="nav-team-left">
        <div className="nav-team-tabs">
          <div
            className={`nav-team-tab ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            Участники
          </div>
          <div
            className={`nav-team-tab ${activeTab === 'score' ? 'active' : ''}`}
            onClick={() => setActiveTab('score')}
          >
            Оценка
          </div>
        </div>

        {activeTab === 'members' && (
          <div className="nav-team-members">
            <button className="nav-team-invite-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD675" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M19 8v6M16 11h6"/>
              </svg>
              Пригласить участников
            </button>

            {mockMembers.map((m, i) => (
              <div key={i} className="nav-team-member-row">
                <div className="nav-team-member-left">
                  <div className="nav-team-member-avatar">
                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                      <circle cx="16" cy="16" r="15" stroke="#ccc" strokeWidth="1.2"/>
                      <circle cx="16" cy="12" r="5" stroke="#ccc" strokeWidth="1.2"/>
                      <path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#ccc" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <div>
                    <p className="nav-team-member-name">{m.name}</p>
                    {m.role && <p className="nav-team-member-role">{m.role}</p>}
                  </div>
                </div>
                <button className="nav-team-member-remove">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M17 11l4 4m0-4l-4 4"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'score' && (
          <div className="nav-team-score-empty">Оценки пока не выставлены</div>
        )}
      </div>

      {/* Правая панель — рейтинг */}
      <div className="nav-team-right">
        <p className="nav-team-right-title">Рейтинг</p>
        <div className="nav-team-rating-block">
          <p className="nav-team-rating-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFD675" strokeWidth="2" strokeLinecap="round" style={{marginRight:6,verticalAlign:'middle'}}>
              <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            Позиция
          </p>
          <p className="nav-team-rating-value">1/15000</p>
        </div>
        <div className="nav-team-rating-block">
          <p className="nav-team-rating-label">Общий балл</p>
          <p className="nav-team-rating-value">100000</p>
        </div>
      </div>

    </div>
  );
}
