import { useEffect, useRef, useState } from 'react';
import { useMyTeam, useLeaveTeam, useKickMember } from '../../hooks/useTeam';
import { useUsersByIds } from '../../hooks/useUsers';
import { useCurrentUser } from '../../hooks/useAuth';
import type { Team } from '../../types/team.types';
import { useTeamPosition } from '../../hooks/useRating';
import '../../styles/NavTeam.css';

interface NavTeamProps {
  team?: Team;
}

export function NavTeam({ team: propTeam }: NavTeamProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'score'>('members');
  const [memberScores, setMemberScores] = useState<Record<number, string>>({});
  const [openedMenuMemberId, setOpenedMenuMemberId] = useState<number | null>(null);
  const [isTransferWindowOpen, setIsTransferWindowOpen] = useState(false);
  const [selectedNewCaptainId, setSelectedNewCaptainId] = useState<number | ''>('');
  const menuRef = useRef<HTMLDivElement | null>(null);
  const { data: hookTeam, isLoading, refetch } = useMyTeam();
  const { data: currentUser } = useCurrentUser();
  const { mutate: leaveTeam } = useLeaveTeam();
  const { mutate: kickMember } = useKickMember();

  const team = propTeam || hookTeam;
  const memberIds = (team?.members || []) as number[];
  const memberQueries = useUsersByIds(memberIds);
  const isLoadingMembers = memberQueries.some(q => q.isLoading);
  const membersList = memberQueries.map(q => q.data).filter(Boolean);

  const isCaptain = team?.captain_id === currentUser?.id;

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
              const showRemoveButton = isCaptain || isCurrentUser;
              const isCaptainMember = member.id === team.captain_id;

              return (
                <div key={member.id} className="nav-team-member-row">
                  <div className="nav-team-member-left">
                    <div className="nav-team-member-avatar">
                          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <defs><clipPath id="userCircleClip"><circle cx="16" cy="16" r="15"></circle></clipPath></defs>
                            <g clip-path="url(#userCircleClip)"><circle cx="16" cy="11" r="5"></circle><path d="M6 27c0-5.5 4.5-9 10-9s10 3.5 10 9"></path></g>
                            <circle cx="16" cy="16" r="15"></circle>
                          </svg>
                    </div>
                    <div>
                      <p className="nav-team-member-name">
                        {member.last_name} {member.first_name} {member.patronymic || ''}
                      </p>
                      {/* Показываем роль: Капитан или Участник */}
                      <p className="nav-team-member-role">
                        {isCaptainMember ? 'Капитан' : 'Участник'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Кнопка удаления/выхода */}
                  {/* Кнопка действий */}
                  {showRemoveButton && (
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
                          {isCaptain && (
                            <button
                              className="nav-team-member-menu-item"
                              onClick={() => {
                                setOpenedMenuMemberId(null);
                                setSelectedNewCaptainId('');
                                setIsTransferWindowOpen(true);
                              }}
                            >
                              Передать капитанство
                            </button>
                          )}

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

                          {isCurrentUser && !isCaptain && (
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

                  {isTransferWindowOpen && (
                    <div className="nav-team-small-window-backdrop">
                      <div className="nav-team-small-window">
                        <p className="nav-team-small-window-title">
                          Передать капитанство
                        </p>

                        <select
                          className="nav-team-small-window-select"
                          value={selectedNewCaptainId}
                          onChange={(e) => {
                            setSelectedNewCaptainId(Number(e.target.value));
                          }}
                        >
                          <option value="">
                            Выберите участника
                          </option>

                          {sortedMembers
                            .filter(item => item.id !== currentUser?.id)
                            .map(item => (
                              <option key={item.id} value={item.id}>
                                {item.last_name} {item.first_name} {item.patronymic || ''}
                              </option>
                            ))}
                        </select>

                        <div className="nav-team-small-window-buttons">
                          <button
                            className="nav-team-small-window-cancel"
                            onClick={() => {
                              setIsTransferWindowOpen(false);
                              setSelectedNewCaptainId('');
                            }}
                          >
                            Отмена
                          </button>

                          <button
                            className="nav-team-small-window-confirm"
                            onClick={() => {
                              console.log('Передать капитанство пользователю:', selectedNewCaptainId);

                              // Здесь потом второй разработчик подключит API
                              setIsTransferWindowOpen(false);
                              setSelectedNewCaptainId('');
                            }}
                          >
                            Передать
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

          {activeTab === 'score' && (
            <div className="nav-team-score">
              <p className="nav-team-score-title">Участник</p>

              <div className="nav-team-score-list">
                {sortedMembers.map((member) => {
                  const isCaptainMember = member.id === team.captain_id;

                  return (
                    <div key={member.id} className="nav-team-score-row">
                      <div className="nav-team-score-user">
                        <div className="nav-team-score-avatar">
                          <svg width="40" height="40" viewBox="0 0 32 32" fill="none" stroke="#333" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                            <defs><clipPath id="userCircleClip"><circle cx="16" cy="16" r="15"></circle></clipPath></defs>
                            <g clip-path="url(#userCircleClip)"><circle cx="16" cy="11" r="5"></circle><path d="M6 27c0-5.5 4.5-9 10-9s10 3.5 10 9"></path></g>
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
                      />
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