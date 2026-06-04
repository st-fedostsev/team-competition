import { useState, useEffect, useMemo } from 'react';
import { HeaderStudent } from '../../../../components/Header/HeaderStudent';
import { NavRating } from '../../../../components/Nav/NavRating';
import { useLeaderboard } from '../../../../hooks/useRating';
import { useCurrentUser } from '../../../../hooks/useAuth';
import { useTeamsByIds } from '../../../../hooks/useTeam';
import type { LeaderboardUser } from '../../../../types/leaderboard.types';
import { RATING_TABS } from '../../../../constants';
import '../../../../styles/RatingPage.css';

export function RatingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [topOnly, setTopOnly] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useLeaderboard<LeaderboardUser>(
    'users',
    debouncedSearch,
    topOnly
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const allUsers = useMemo(() => {
  return data?.pages?.flatMap(page => page?.items || []) || [];
  }, [data?.pages]); // зависим только от data.pages
  
  // Фильтрация на фронте
  const filteredUsers = useMemo(() => {
    let result = [...allUsers];
    
    if (topOnly) {
      result = result.slice(0, 10);
    }
    
    return result;
  }, [allUsers, topOnly]);

  // Собираем уникальные team_id у пользователей (только если есть)
  const teamIds = useMemo(() => {
    return [...new Set(filteredUsers.map(user => user?.team_id).filter(id => id != null))] as number[];
  }, [filteredUsers]);

  // Получаем названия команд
  const teamQueries = useTeamsByIds(teamIds);

  // Создаём Map для быстрого доступа к названиям команд
  const teamNameMap = useMemo(() => {
    const map = new Map<number, string>();
    teamQueries.forEach((query, index) => {
      if (query.data?.name && teamIds[index]) {
        map.set(teamIds[index], query.data.name);
      }
    });
    return map;
  }, [teamQueries, teamIds]);

  const currentUserId = currentUser?.id;

  if (isLoading) {
    return (
      <div className="rating-page">
        <HeaderStudent />
        <main className="rating-main">
          <div className="loading">Загрузка рейтинга...</div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rating-page">
        <HeaderStudent />
        <main className="rating-main">
          <div className="error">
            <p>Ошибка загрузки: {error?.message || 'Неизвестная ошибка'}</p>
            <button onClick={() => window.location.reload()}>Повторить</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="rating-page">
      <HeaderStudent />

      <main className="rating-main">
        <div className="rating-switch">
          <NavRating 
            tabs={RATING_TABS}
          />
        </div>

        <div className="rating-search">
          <input
            className="rating-search-input"
            placeholder="Введите ФИО студента или название команды"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <label className="rating-top">
          <input 
            type="checkbox" 
            checked={topOnly}
            onChange={(e) => setTopOnly(e.target.checked)}
          />
          <span>Топ-10</span>
        </label>

        <div className="rating-table">
          <div className="rating-row rating-header">
            <div>Позиция</div>
            <div>ФИО</div>
            <div>Команда</div>
            <div>Балл</div>
          </div>

          {filteredUsers.length === 0 ? (
  <div className="rating-empty">Нет данных</div>
) : (
  filteredUsers.map((user, index) => {
    if (!user) return null;
    const studentUser = user as LeaderboardUser;
    const isCurrentUser = studentUser.id === currentUserId;
    
    return (
      <div 
        key={studentUser.id} 
        className={`rating-row ${isCurrentUser ? 'current-user' : ''}`}
      >
        <div className="rating-position">{index + 1}</div>
        <div className="rating-name">
          {studentUser.last_name} {studentUser.first_name}
          {studentUser.patronymic && ` ${studentUser.patronymic}`}
        </div>
        <div className="rating-team">
          {studentUser.team_id ? (teamNameMap.get(studentUser.team_id) || '—') : '—'}
        </div>
        <div className="rating-score">{studentUser.personal_rating}</div>
      </div>
    );
  })
)}
        </div>

        {!topOnly && hasNextPage && (
          <div className="rating-load-more">
            <button 
              className="load-more-button"
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? 'Загрузка...' : 'Загрузить ещё 20'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}