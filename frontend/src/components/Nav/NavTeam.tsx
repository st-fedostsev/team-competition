import { useEffect, useMemo, useRef, useState } from 'react';
import { useMyTeam, useLeaveTeam, useKickMember, useTransferCaptain, useVoteUser, useMyVotes } from '../../hooks/useTeam';
import { useUsersByIds } from '../../hooks/useUsers';
import { useCurrentUser } from '../../hooks/useAuth';
import type { Team } from '../../types/team.types';
import { useTeamPosition } from '../../hooks/useRating';
import '../../styles/NavTeam.css';
import type { ApiError } from '../../types/error.types';

interface NavTeamProps {
  team?: Team;
  isCaptain?: boolean;
  onTransferCaptain?: (userId: number) => void;
  onVote?: (userId: number, score: number) => void;
  isVoting?: boolean;
}

export function NavTeam({ team: propTeam }: NavTeamProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'score'>('members');
  const [openedMenuMemberId, setOpenedMenuMemberId] = useState<number | null>(null);
  const [isTransferWindowOpen, setIsTransferWindowOpen] = useState(false);
  const [selectedNewCaptainId, setSelectedNewCaptainId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { data: hookTeam, isLoading, refetch } = useMyTeam();
  const { data: currentUser } = useCurrentUser();
  const { mutate: leaveTeam } = useLeaveTeam();
  const { mutate: kickMember } = useKickMember();
  const { mutate: transferCaptain, isPending: isTransferring } = useTransferCaptain();
  const { mutate: voteUser, isPending: isVoting } = useVoteUser();
  
  // Получаем сохранённые голоса пользователя
  const { data: myVotes, refetch: refetchVotes } = useMyVotes();

  const team = propTeam || hookTeam;
  const memberIds = (team?.members || []) as number[];
  const memberQueries = useUsersByIds(memberIds);
  const isLoadingMembers = memberQueries.some(q => q.isLoading);
  const membersList = memberQueries.map(q => q.data).filter(Boolean);

  const isCaptain = team?.captain_id === currentUser?.id;

  const computedScores = useMemo(() => {
    if (myVotes && Array.isArray(myVotes)) {
      const scores: Record<number, string> = {};
      myVotes.forEach((vote) => {
        scores[vote.target_id] = String(vote.score);
      });
      return scores;
    }
    return {};
  }, [myVotes]);

   const [memberScores, setMemberScores] = useState<Record<number, string>>(computedScores);

   useEffect(() => {
    setMemberScores(computedScores);
  }, [computedScores]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
      ) {
        setOpenedMenuMemberId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const { data: teamPosition, isLoading: positionLoading } = useTeamPosition(team?.id || 0);
  
  // Сортируем участников: капитан первый, остальные по порядку (по id)
  const sortedMembers = (() => {
    if (!team) return [];
    return [...membersList]
      .filter((member): member is NonNullable<typeof member> => member !== null && member !== undefined)
      .sort((a, b) => {
        if (a.id === team.captain_id) return -1;
        if (b.id === team.captain_id) return 1;
        return a.id - b.id;
      });
  })();

  // Обработчик выхода из команды
  const handleLeaveTeam = () => {
    if (confirm('Вы уверены, что хотите покинуть команду?')) {
      leaveTeam(undefined, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  // Обработчик кика участника (только для капитана)
  const handleKickMember = (memberId: number, memberName: string) => {
    if (confirm(`Вы уверены, что хотите исключить ${memberName} из команды?`)) {
      kickMember(memberId, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  // Функция для копирования ссылки-приглашения
  const handleCopyInviteLink = () => {
    const inviteCode = team?.secret_code;
    if (inviteCode) {
      const inviteLink = `${window.location.origin}/ProfileStudentPage?code=${inviteCode}`;
      navigator.clipboard.writeText(inviteLink);
      alert('Ссылка-приглашение скопирована!');
    }
  };

  // Открытие модалки передачи капитанства
  const handleOpenTransferModal = (memberId: number) => {
    setOpenedMenuMemberId(null);
    setSelectedNewCaptainId(memberId);
    setIsTransferWindowOpen(true);
  };

  // Обработчик передачи капитанства
  const handleTransferCaptain = () => {
    if (selectedNewCaptainId) {
      transferCaptain(selectedNewCaptainId, {
        onSuccess: () => {
          setIsTransferWindowOpen(false);
          setSelectedNewCaptainId(null);
          refetch();
          alert('Капитанство успешно передано!');
        },
        onError: (error: ApiError) => {
          const message = error.response?.data?.msg || error.response?.data?.message || 'Ошибка передачи капитанства';
          alert(message);
        },
      });
    }
  };

  // Обработчик сохранения оценки (автоматически при потере фокуса)
  const handleSaveScore = (userId: number, score: string) => {
    const scoreNumber = parseInt(score, 10);
    if (!isNaN(scoreNumber) && scoreNumber >= 0 && scoreNumber <= 100) {
      voteUser({ userId, score: scoreNumber }, {
        onSuccess: () => {
          // Обновляем локальное состояние
          setMemberScores(prev => ({
            ...prev,
            [userId]: String(scoreNumber),
          }));
          // Обновляем данные голосов с сервера
          refetchVotes();
        },
        onError: (error: ApiError) => {
          const message = error.response?.data?.msg || error.response?.data?.message || 'Ошибка при сохранении оценки';
          alert(message);
        },
      });
    }
  };

  // Обработчик потери фокуса для ввода оценки
  const handleScoreBlur = (userId: number, value: string) => {
    if (value) {
      handleSaveScore(userId, value);
    }
  };

  // Если загрузка
  if (isLoading && !propTeam) {
    return <div className="nav-team-wrapper">Загрузка...</div>;
  }

  // Если нет команды
  if (!team) {
    return (
      <div className="nav-team-wrapper">
        <div className="nav-team-empty">Нет данных о команде</div>
      </div>
    );
  }

  // Показываем загрузку участников
  if (isLoadingMembers && memberIds.length > 0) {
    return <div className="nav-team-wrapper">Загрузка участников...</div>;
  }

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
            {/* Кнопка только для капитана */}
            {isCaptain && (
              <button className="nav-team-invite-btn" onClick={handleCopyInviteLink}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FFD675" strokeWidth="1.5" strokeLinecap="round">
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                  <path d="M19 8v6M16 11h6"/>
                </svg>
                Пригласить участников
              </button>
            )}

            {sortedMembers.map((member) => {
              if (!member) return null;
              const isCurrentUser = member.id === currentUser?.id;
              const isCaptainMember = member.id === team.captain_id;
              
              // Капитан не видит троеточие напротив себя
              // Обычный участник видит троеточие только напротив себя
              const showActionsMenu = (isCaptain && !isCurrentUser) || (!isCaptain && isCurrentUser);

              return (
                <div key={member.id} className="nav-team-member-row">
                  <div className="nav-team-member-left">
                    <div className="nav-team-member-avatar">
                      <svg width="40" height="40" viewBox="0 0 32 32" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <defs>
                          <clipPath id="userCircleClip">
                            <circle cx="16" cy="16" r="15"></circle>
                          </clipPath>
                        </defs>
                        <g clipPath="url(#userCircleClip)">
                          <circle cx="16" cy="11" r="5"></circle>
                          <path d="M6 27c0-5.5 4.5-9 10-9s10 3.5 10 9"></path>
                        </g>
                        <circle cx="16" cy="16" r="15"></circle>
                      </svg>
                    </div>
                    <div>
                      <p className="nav-team-member-name">
                        {member.last_name} {member.first_name} {member.patronymic || ''}
                      </p>
                      <p className="nav-team-member-role">
                        {isCaptainMember ? 'Капитан' : 'Участник'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Кнопка действий (троеточие) - только для нужных случаев */}
                  {showActionsMenu && (
                    <div
                      className="nav-team-member-actions"
                      ref={openedMenuMemberId === member.id ? menuRef : null}
                    >
                      <button
                        className="nav-team-member-remove"
                        onClick={() => {
                          setOpenedMenuMemberId(prev =>
                            prev === member.id ? null : member.id
                          );
                        }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="#999">
                          <circle cx="12" cy="5" r="1.5" />
                          <circle cx="12" cy="12" r="1.5" />
                          <circle cx="12" cy="19" r="1.5" />
                        </svg>
                      </button>

                      {openedMenuMemberId === member.id && (
                        <div className="nav-team-member-menu">
                          {/* Передать капитанство - только для капитана, для других участников (не для себя) */}
                          {isCaptain && !isCurrentUser && (
                            <button
                              className="nav-team-member-menu-item"
                              onClick={() => handleOpenTransferModal(member.id)}
                            >
                              Передать капитанство
                            </button>
                          )}

                          {/* Исключить - только для капитана, для других участников */}
                          {isCaptain && !isCurrentUser && (
                            <button
                              className="nav-team-member-menu-item danger"
                              onClick={() => {
                                setOpenedMenuMemberId(null);
                                handleKickMember(
                                  member.id,
                                  `${member.last_name} ${member.first_name}`
                                );
                              }}
                            >
                              Исключить
                            </button>
                          )}

                          {/* Покинуть команду - только для обычного участника (не капитан) */}
                          {!isCaptain && isCurrentUser && (
                            <button
                              className="nav-team-member-menu-item danger"
                              onClick={() => {
                                setOpenedMenuMemberId(null);
                                handleLeaveTeam();
                              }}
                            >
                              Покинуть команду
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Модалка подтверждения передачи капитанства */}
            {isTransferWindowOpen && selectedNewCaptainId !== null && (
              <div className="nav-team-small-window-backdrop">
                <div className="nav-team-small-window">
                  <p className="nav-team-small-window-title">
                    Передать капитанство
                  </p>

                  <p className="nav-team-small-window-text">
                    Вы уверены, что хотите передать капитанство?
                    После передачи вы больше не сможете управлять командой.
                  </p>

                  <div className="nav-team-small-window-buttons">
                    <button
                      className="nav-team-small-window-cancel"
                      onClick={() => {
                        setIsTransferWindowOpen(false);
                        setSelectedNewCaptainId(null);
                      }}
                    >
                      Отмена
                    </button>

                    <button
                      className="nav-team-small-window-confirm"
                      onClick={handleTransferCaptain}
                      disabled={isTransferring}
                    >
                      {isTransferring ? 'Передача...' : 'Подтвердить'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'score' && (
          <div className="nav-team-score">
            <div className="nav-team-score-list">
              {sortedMembers.map((member) => {
                const isCaptainMember = member.id === team.captain_id;
                const isCurrentUser = member.id === currentUser?.id;

                return (
                  <div key={member.id} className="nav-team-score-row">
                    <div className="nav-team-score-user">
                      <div className="nav-team-score-avatar">
                        <svg width="40" height="40" viewBox="0 0 32 32" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                          <defs>
                            <clipPath id="userCircleClip2">
                              <circle cx="16" cy="16" r="15"></circle>
                            </clipPath>
                          </defs>
                          <g clipPath="url(#userCircleClip2)">
                            <circle cx="16" cy="11" r="5"></circle>
                            <path d="M6 27c0-5.5 4.5-9 10-9s10 3.5 10 9"></path>
                          </g>
                          <circle cx="16" cy="16" r="15"></circle>
                        </svg>
                      </div>

                      <div className="nav-team-score-info">
                        <p className="nav-team-score-name">
                          {member.last_name} {member.first_name} {member.patronymic || ''}
                        </p>

                        <p className="nav-team-score-role">
                          {isCaptainMember ? 'Капитан' : 'Участник'}
                        </p>
                      </div>
                    </div>

                    {isCurrentUser ? (
                      // Для себя - серый заблокированный инпут
                      <input
                        className="nav-team-score-input disabled"
                        value=""
                        disabled
                        style={{ backgroundColor: '#e5e7eb', color: '#9ca3af', cursor: 'not-allowed' }}
                      />
                    ) : (
                      <input
                        className="nav-team-score-input"
                        value={memberScores[member.id] || ''}
                        onChange={(event) => {
                          const value = event.target.value;
                          if (/^\d{0,3}$/.test(value)) {
                            setMemberScores(prev => ({
                              ...prev,
                              [member.id]: value,
                            }));
                          }
                        }}
                        onBlur={(event) => {
                          handleScoreBlur(member.id, event.target.value);
                        }}
                        placeholder="0-100"
                        disabled={isVoting}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Правая панель — рейтинг */}
      <div className="nav-team-right">
        <p className="nav-team-right-title">Рейтинг</p>
        <div className="nav-team-rating-block">
          <p className="nav-team-rating-label">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FFD675" strokeWidth="2" strokeLinecap="round" style={{marginRight:6,verticalAlign:'middle'}}>
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            Позиция
          </p>
          <p className="nav-team-rating-value">
            {positionLoading ? 'Загрузка...' : teamPosition ? `${teamPosition.position}/${teamPosition.total}` : '—'}
          </p>
        </div>
        <div className="nav-team-rating-block">
          <p className="nav-team-rating-label">Баллы</p>
          <p className="nav-team-rating-value">{team.crc?.toFixed(2) || '—'}</p>
        </div>
        <div className="nav-team-rating-block">
          <p className="nav-team-rating-label">Лига</p>
          <p className="nav-team-rating-value">
            {team.league === 'novice' ? 'Новички' : team.league || '—'}
          </p>
        </div>
      </div>

    </div>
  );
}