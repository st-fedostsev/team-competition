import React, { useState } from 'react';
import { JoinButton, CreatePlusButton } from '../components/Button/Button';
import '../styles/SearchTeamModal.css';

interface Team {
  id: number;
  name: string;
  membersCount: number;
}

interface SearchTeamModalProps {
  closeModal: () => void;
}

const mockTeams: Team[] = [
  { id: 1, name: 'Название', membersCount: 3 },
  { id: 2, name: 'Название', membersCount: 3 },
  { id: 3, name: 'Название', membersCount: 3 },
];

export function SearchTeamModal({ closeModal }: SearchTeamModalProps) {
  const [searchValue, setSearchValue] = useState('');

  const filteredTeams = mockTeams.filter((team) =>
    team.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="search-team-modal" onClick={(e) => e.stopPropagation()}>
        {/* Кнопка закрытия */}
        <button className="search-team-close-btn" onClick={closeModal}>
          ⊗
        </button>

        {/* Поле поиска */}
        <div className="search-team-input-wrapper">
          <input
            type="text"
            placeholder="Введите название"
            className="search-team-input"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <span className="search-team-icon">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="9" cy="9" r="6.5" stroke="#999" strokeWidth="1.5" />
              <path d="M14 14L18 18" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </span>
        </div>

        {/* Список команд */}
        <div className="search-team-list">
          {filteredTeams.map((team) => (
            <div key={team.id} className="search-team-card">
              <div className="search-team-card-left">
                {/* Иконка аватара */}
                <div className="search-team-avatar">
                  <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                    <circle cx="18" cy="14" r="6" stroke="#999" strokeWidth="1.5" />
                    <path
                      d="M6 30c0-6.627 5.373-12 12-12s12 5.373 12 12"
                      stroke="#999"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
                <div className="search-team-info">
                  <p className="search-team-name">{team.name}</p>
                  <p className="search-team-members">{team.membersCount} участника</p>
                </div>
              </div>

              {/* Кнопка Вступить */}
              <JoinButton />
            </div>
          ))}
        </div>

        {/* Кнопка Создать */}
        <div className="search-team-footer">
          <CreatePlusButton />
        </div>
      </div>
    </div>
  );
}
