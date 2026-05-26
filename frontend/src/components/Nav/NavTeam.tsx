import { useState } from 'react';
import { useMyTeam, useLeaveTeam, useKickMember } from '../../hooks/useTeam';
import { useUsersByIds } from '../../hooks/useUsers';
import { useCurrentUser } from '../../hooks/useAuth';
import type { Team } from '../../types/team.types';
import '../../styles/NavTeam.css';

interface NavTeamProps {
  team?: Team;
}

export function NavTeam({ team: propTeam }: NavTeamProps) {
  const [activeTab, setActiveTab] = useState<'members' | 'score'>('members');
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
                      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                        <circle cx="16" cy="16" r="15" stroke="#ccc" strokeWidth="1.2"/>
                        <circle cx="16" cy="12" r="5" stroke="#ccc" strokeWidth="1.2"/>
                        <path d="M4 28c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="#ccc" strokeWidth="1.2" strokeLinecap="round"/>
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
                  {showRemoveButton && (
                    <button 
                      className="nav-team-member-remove"
                      onClick={() => {
                        if (isCaptain && !isCurrentUser) {
                          handleKickMember(member.id, `${member.last_name} ${member.first_name}`);
                        } else if (isCurrentUser) {
                          handleLeaveTeam();
                        }
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round">
                        <circle cx="9" cy="7" r="4"/>
                        <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                        <path d="M17 11l4 4m0-4l-4 4"/>
                      </svg>
                    </button>
                  )}
                </div>
              );
            })}
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
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            Позиция
          </p>
          <p className="nav-team-rating-value">Скоро будет доступно</p>
        </div>
        <div className="nav-team-rating-block">
          <p className="nav-team-rating-label">CRC</p>
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