import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { JoinButton, CreatePlusButton, CreateButton } from '../components/Button/Button';
import { Modal } from '../components/cards/card';
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
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState('');
  const [isCreateTeamOpen, setIsCreateTeamOpen] = useState(false);
  const [teamName, setTeamName] = useState('');

  const filteredTeams = mockTeams.filter((team) =>
    team.name.toLowerCase().includes(searchValue.toLowerCase())
  );

  function handleCreateTeam() {
    if (teamName.trim()) {
      setIsCreateTeamOpen(false);
      closeModal();
      navigate('/team-profile');
    }
  }

  return (
    <>
      <div className="modal-overlay" onClick={closeModal}>
        <div className="search-team-modal" onClick={(e) => e.stopPropagation()}>

          <button className="search-team-close-btn" onClick={closeModal}>⊗</button>

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

          <div className="search-team-list">
            {filteredTeams.map((team) => (
              <div key={team.id} className="search-team-card">
                <div className="search-team-card-left">
                  <div className="search-team-avatar">
                    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                      <circle cx="18" cy="14" r="6" stroke="#999" strokeWidth="1.5" />
                      <path d="M6 30c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#999" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  </div>
                  <div className="search-team-info">
                    <p className="search-team-name">{team.name}</p>
                    <p className="search-team-members">{team.membersCount} участника</p>
                  </div>
                </div>
                <JoinButton />
              </div>
            ))}
          </div>

          {/* Создать+ открывает модалку создания команды */}
          <div className="search-team-footer">
            <CreatePlusButton onClick={() => setIsCreateTeamOpen(true)} />
          </div>

        </div>
      </div>

      {/* Модалка создания команды поверх */}
      {isCreateTeamOpen && (
        <Modal closeModal={() => setIsCreateTeamOpen(false)}>
          <div className="create-team-body">
            <p className="create-team-label">Введите название команды</p>
            <input
              type="text"
              className="create-team-input"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateTeam()}
              autoFocus
            />
            <div className="create-team-footer">
              <CreateButton onClick={handleCreateTeam} />
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
