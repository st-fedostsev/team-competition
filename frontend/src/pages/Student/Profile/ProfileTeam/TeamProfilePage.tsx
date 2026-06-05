import { useEffect, useRef, useState } from 'react';
import { HeaderStudent } from '../../../../components/Header/HeaderStudent';
import { NavTeam } from '../../../../components/Nav/NavTeam';
import { useMyTeam } from '../../../../hooks/useTeam';
import {
  TeamModalCancelButton,
  TeamModalSaveButton,
  TeamRequestAcceptButton,
  TeamRequestRejectButton,
  TeamModalCloseButton,
} from '../../../../components/Buttons';
import '../../../../styles/TeamProfilePage.css';

type JoinRequest = {
  id: number;
  last_name: string;
  first_name: string;
  patronymic?: string;
};

export function TeamProfilePage() {
  const { data: team, isLoading, isError, error } = useMyTeam();

  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);

  const [teamNameDraft, setTeamNameDraft] = useState('');
  const [teamNameLocal, setTeamNameLocal] = useState('');

  const teamMenuRef = useRef<HTMLDivElement | null>(null);


  const joinRequests: JoinRequest[] = [];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        teamMenuRef.current &&
        !teamMenuRef.current.contains(event.target as Node)
      ) {
        setIsTeamMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (team?.name) {
      setTeamNameLocal(team.name);
      setTeamNameDraft(team.name);
    }
  }, [team?.name]);

  const handleOpenEditNameModal = () => {
    setIsTeamMenuOpen(false);
    setTeamNameDraft(teamNameLocal || team?.name || '');
    setIsEditNameModalOpen(true);
  };

  const handleOpenRequestsModal = () => {
    setIsTeamMenuOpen(false);
    setIsRequestsModalOpen(true);
  };

  const handleSaveTeamName = () => {
    const trimmedName = teamNameDraft.trim();

    if (!trimmedName) {
      alert('Введите название команды');
      return;
    }

    
    console.log('Новое название команды:', trimmedName);

    setTeamNameLocal(trimmedName);
    setIsEditNameModalOpen(false);
  };

  const handleAcceptRequest = (requestId: number) => {
   
    console.log('Принять заявку:', requestId);
  };

  const handleRejectRequest = (requestId: number) => {
    
    console.log('Отклонить заявку:', requestId);
  };

  if (isLoading) {
    return (
      <div className="team-profile-container">
        <HeaderStudent />
        <div className="team-profile-content">
          <div className="loading">Загрузка команды...</div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="team-profile-container">
        <HeaderStudent />
        <div className="team-profile-content">
          <div className="error">
            <p>Ошибка загрузки: {error?.message || 'Неизвестная ошибка'}</p>
            <button onClick={() => window.location.reload()}>Повторить</button>
          </div>
        </div>
      </div>
    );
  }

  if (!team) {
    return (
      <div className="team-profile-container">
        <HeaderStudent />
        <div className="team-profile-content">
          <div className="no-team">
            <p>Вы не состоите в команде</p>
            <button onClick={() => window.location.href = '/ProfileStudentPage'}>
              Вернуться назад
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="team-profile-container">
      <HeaderStudent />

      <div className="team-profile-content">

        {/* Карточка команды */}
        <div className="team-card">
          <div className="team-card-left">
            <div className="team-avatar">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <defs><clipPath id="avatarClip"><circle cx="28" cy="28" r="26">
                  </circle></clipPath></defs><g clip-path="url(#avatarClip)"><circle cx="28" cy="22" r="8" stroke="#3B3B3B" stroke-width="1.5"></circle>
                  <path d="M8 50c0-11 9-20 20-20s20 9 20 20" stroke="#3B3B3B" stroke-width="1.5" stroke-linecap="round"></path></g>
                  <circle cx="28" cy="28" r="27" stroke="#3B3B3B" stroke-width="1.5"></circle>
                </svg>
            </div>

            <div>
              <p className="team-name">{teamNameLocal || team.name}</p>
            </div>
          </div>

          <div className="team-card-right" ref={teamMenuRef}>
            <button
              className="team-menu-btn"
              onClick={() => {
                setIsTeamMenuOpen(prev => !prev);
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#999">
                <circle cx="12" cy="5" r="1.5" />
                <circle cx="12" cy="12" r="1.5" />
                <circle cx="12" cy="19" r="1.5" />
              </svg>
            </button>

            {isTeamMenuOpen && (
              <div className="team-card-dropdown">
                <button
                  className="team-card-dropdown-item"
                  onClick={handleOpenEditNameModal}
                >
                  Изменить название команды
                </button>

                <button
                  className="team-card-dropdown-item"
                  onClick={handleOpenRequestsModal}
                >
                  Посмотреть заявки на вступление
                </button>
              </div>
            )}

            {/* <CheckInButton /> */}
          </div>
        </div>

        {/* Нижняя часть: участники + рейтинг */}
        <NavTeam team={team} />
      </div>

      {/* Модалка изменения названия команды */}
      {isEditNameModalOpen && (
        <div
          className="team-modal-backdrop"
          onClick={() => setIsEditNameModalOpen(false)}
        >
          <div
            className="team-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="team-modal-title">Изменить название команды</p>

            <p className="team-modal-text">
              Введите новое название команды.
            </p>

            <input
              className="team-modal-input"
              value={teamNameDraft}
              onChange={(event) => setTeamNameDraft(event.target.value)}
              placeholder="Название команды"
            />

              <div className="team-modal-buttons">
                <TeamModalCancelButton
                  onClick={() => setIsEditNameModalOpen(false)}
                />

                <TeamModalSaveButton
                  onClick={handleSaveTeamName}
                />
              </div>
          </div>
        </div>
      )}

      {/* Модалка заявок на вступление */}
      {isRequestsModalOpen && (
        <div
          className="team-modal-backdrop"
          onClick={() => setIsRequestsModalOpen(false)}
        >
          <div
            className="team-modal team-requests-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="team-modal-header">
              <p className="team-modal-title">Заявки на вступление</p>

              <TeamModalCloseButton
                onClick={() => setIsRequestsModalOpen(false)}
              />
            </div>

            {joinRequests.length === 0 ? (
              <div className="team-requests-empty">
                Заявок на вступление пока нет
              </div>
            ) : (
              <div className="team-requests-list">
                {joinRequests.map(request => (
                  <div key={request.id} className="team-request-row">
                    <div className="team-request-user">
                      <div className="team-request-avatar">
                        <svg width="34" height="34" viewBox="0 0 32 32" fill="none">
                          <circle cx="16" cy="16" r="15" stroke="#ccc" strokeWidth="1.2" />
                          <circle cx="16" cy="12" r="5" stroke="#ccc" strokeWidth="1.2" />
                          <path
                            d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12"
                            stroke="#ccc"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>

                      <div>
                        <p className="team-request-name">
                          {request.last_name} {request.first_name} {request.patronymic || ''}
                        </p>
                        <p className="team-request-status">
                          Хочет вступить в команду
                        </p>
                      </div>
                    </div>

                    <div className="team-request-actions">
                      <TeamRequestAcceptButton
                        onClick={() => handleAcceptRequest(request.id)}
                      />

                      <TeamRequestRejectButton
                        onClick={() => handleRejectRequest(request.id)}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}