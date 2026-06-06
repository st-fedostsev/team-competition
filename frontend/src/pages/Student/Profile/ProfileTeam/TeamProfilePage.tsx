import { useEffect, useRef, useState } from 'react';
import { HeaderStudent } from '../../../../components/Header/HeaderStudent';
import { NavTeam } from '../../../../components/Nav/NavTeam';
import { 
  useMyTeam, 
  useRenameTeam, 
  useTransferCaptain, 
  useVoteUser,
  useJoinRequests,
  useReviewJoinRequest
} from '../../../../hooks/useTeam';
import { useUsersByIds } from '../../../../hooks/useUsers';
import {
  TeamModalCancelButton,
  TeamModalSaveButton,
  TeamRequestAcceptButton,
  TeamRequestRejectButton,
  TeamModalCloseButton,
} from '../../../../components/Buttons';
import '../../../../styles/TeamProfilePage.css';
import type { ApiError } from '../../../../types/error.types';
import { useCurrentUser } from '../../../../hooks/useAuth';

export function TeamProfilePage() {
  const { data: team, isLoading, isError, error, refetch } = useMyTeam();
  const { data: currentUser } = useCurrentUser();

  const [isTeamMenuOpen, setIsTeamMenuOpen] = useState(false);
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [isRequestsModalOpen, setIsRequestsModalOpen] = useState(false);
  const [isTransferCaptainModalOpen, setIsTransferCaptainModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [teamNameDraft, setTeamNameDraft] = useState('');

  const teamMenuRef = useRef<HTMLDivElement | null>(null);

  const { mutate: renameTeam, isPending: isRenaming } = useRenameTeam();
  const { mutate: transferCaptain, isPending: isTransferring } = useTransferCaptain();
  const { mutate: voteUser, isPending: isVoting } = useVoteUser();
  
  // Хуки для заявок
  const { data: joinRequests, refetch: refetchRequests, isLoading: isLoadingRequests } = useJoinRequests();
  const { mutate: reviewRequest, isPending: isReviewing } = useReviewJoinRequest();

  // Фильтруем заявки: показываем только те, что в статусе 'awaiting'
  const awaitingRequests = joinRequests?.filter(
    request => request.status === 'awaiting'
  ) || [];

  // Получаем ID пользователей из заявок
  const userIds = awaitingRequests.map(request => request.from_id);
  
  // Получаем данные пользователей по их ID
  const usersQueries = useUsersByIds(userIds);
  const isLoadingUsers = usersQueries.some(query => query.isLoading);
  
  // Создаем мапу пользователей по ID для быстрого доступа
  const usersMap = new Map();
  usersQueries.forEach(query => {
    if (query.data) {
      usersMap.set(query.data.id, query.data);
    }
  });

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

  const handleOpenEditNameModal = () => {
    setIsTeamMenuOpen(false);
    setTeamNameDraft(team?.name || '');
    setIsEditNameModalOpen(true);
  };

  const handleOpenRequestsModal = () => {
    setIsTeamMenuOpen(false);
    setIsRequestsModalOpen(true);
    refetchRequests();
  };

  const handleOpenTransferCaptainModal = (userId: number) => {
    setSelectedUserId(userId);
    setIsTransferCaptainModalOpen(true);
  };

  const handleSaveTeamName = () => {
    const trimmedName = teamNameDraft.trim();

    if (!trimmedName) {
      alert('Введите название команды');
      return;
    }

    renameTeam(trimmedName, {
      onSuccess: () => {
        setIsEditNameModalOpen(false);
        refetch();
        alert('Название команды успешно изменено!');
      },
      onError: (error: ApiError) => {
        const message = error.response?.data?.msg || error.response?.data?.message || 'Ошибка изменения названия';
        alert(message);
      },
    });
  };

  const handleTransferCaptain = () => {
    if (!selectedUserId) return;

    transferCaptain(selectedUserId, {
      onSuccess: () => {
        setIsTransferCaptainModalOpen(false);
        setSelectedUserId(null);
        refetch();
        alert('Капитанство успешно передано!');
      },
      onError: (error: ApiError) => {
        const message = error.response?.data?.msg || error.response?.data?.message || 'Ошибка передачи капитанства';
        alert(message);
      },
    });
  };

  const handleVote = (userId: number, score: number) => {
    voteUser({ userId, score }, {
      onSuccess: () => {
        alert(`Оценка ${score} успешно выставлена!`);
        refetch();
      },
      onError: (error: ApiError) => {
        const message = error.response?.data?.msg || error.response?.data?.message || 'Ошибка при голосовании';
        alert(message);
      },
    });
  };

  const handleReviewRequest = (requestId: number, newStatus: 'awaiting' | 'approved' | 'rejected') => {
    reviewRequest({ id: requestId, new_status: newStatus }, {
      onSuccess: () => {
        refetchRequests();
        refetch();
        if (newStatus === 'approved') {
          alert('Заявка принята!');
        } else if (newStatus === 'rejected') {
          alert('Заявка отклонена');
        } else if (newStatus === 'awaiting') {
          alert('Заявка отправлена на рассмотрение');
        }
      },
      onError: (error: ApiError) => {
        const message = error.response?.data?.msg || error.response?.data?.message || 'Ошибка при обработке заявки';
        alert(message);
      },
    });
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

  const isCaptain = team.captain_id === currentUser?.id;

  return (
    <div className="team-profile-container">
      <HeaderStudent />

      <div className="team-profile-content">
        {/* Карточка команды */}
        <div className="team-card">
          <div className="team-card-left">
            <div className="team-avatar">
              <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
                <defs>
                  <clipPath id="avatarClip">
                    <circle cx="28" cy="28" r="26" />
                  </clipPath>
                </defs>
                <g clipPath="url(#avatarClip)">
                  <circle cx="28" cy="22" r="8" stroke="#3B3B3B" strokeWidth="1.5" />
                  <path d="M8 50c0-11 9-20 20-20s20 9 20 20" stroke="#3B3B3B" strokeWidth="1.5" strokeLinecap="round" />
                </g>
                <circle cx="28" cy="28" r="27" stroke="#3B3B3B" strokeWidth="1.5" />
              </svg>
            </div>

            <div>
              <p className="team-name">{team.name}</p>
            </div>
          </div>

          {/* Троеточие и меню показываются ТОЛЬКО капитану */}
          {isCaptain && (
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
                    {awaitingRequests.length > 0 && (
                      <span className="requests-badge"> ({awaitingRequests.length})</span>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Нижняя часть: участники + рейтинг */}
        <NavTeam 
          team={team} 
          isCaptain={isCaptain}
          onTransferCaptain={handleOpenTransferCaptainModal}
          onVote={handleVote}
          isVoting={isVoting}
        />
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
              disabled={isRenaming}
            />

            <div className="team-modal-buttons">
              <TeamModalCancelButton
                onClick={() => setIsEditNameModalOpen(false)}
                disabled={isRenaming}
              />

              <TeamModalSaveButton
                onClick={handleSaveTeamName}
                disabled={isRenaming}
              />
            </div>
          </div>
        </div>
      )}

      {/* Модалка передачи капитанства */}
      {isTransferCaptainModalOpen && (
        <div
          className="team-modal-backdrop"
          onClick={() => setIsTransferCaptainModalOpen(false)}
        >
          <div
            className="team-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="team-modal-title">Передать капитанство</p>

            <p className="team-modal-text">
              Вы уверены, что хотите передать капитанство этому участнику?
              После передачи вы больше не сможете управлять командой.
            </p>

            <div className="team-modal-buttons">
              <TeamModalCancelButton
                onClick={() => setIsTransferCaptainModalOpen(false)}
                disabled={isTransferring}
              />

              <button
                className="team-modal-save-btn"
                onClick={handleTransferCaptain}
                disabled={isTransferring}
                style={{ background: '#dc2626' }}
              >
                {isTransferring ? 'Передача...' : 'Подтвердить'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Модалка заявок на вступление - показываем только капитану */}
      {isRequestsModalOpen && isCaptain && (
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

            {isLoadingRequests || isLoadingUsers ? (
              <div className="team-requests-loading">Загрузка заявок...</div>
            ) : awaitingRequests.length === 0 ? (
              <div className="team-requests-empty">
                Заявок на вступление пока нет
              </div>
            ) : (
              <div className="team-requests-list">
                {awaitingRequests.map((request) => {
                  const user = usersMap.get(request.from_id);
                  
                  return (
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
                            {user ? (
                              `${user.last_name || ''} ${user.first_name || ''} ${user.patronymic || ''}`.trim() || `Пользователь`
                            ) : (
                              `Загрузка...`
                            )}
                          </p>
                          {user?.personal_rating !== undefined && (
                            <p className="team-request-rating">
                              Рейтинг: {user.personal_rating}
                            </p>
                          )}
                          {request?.created_at !== undefined && (
                            <p className="team-request-rating">
                              Заявка отправлена: {request?.created_at}
                            </p>
                          )}
                          <p className="team-request-status">
                            Хочет вступить в команду
                          </p>
                        </div>
                      </div>

                      <div className="team-request-actions">
                        <TeamRequestAcceptButton
                          onClick={() => handleReviewRequest(request.id, 'approved')}
                          disabled={isReviewing}
                        />
                        <TeamRequestRejectButton
                          onClick={() => handleReviewRequest(request.id, 'rejected')}
                          disabled={isReviewing}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}