import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { HeaderStudent } from '../../../../components/Header/HeaderStudent';
import { NavRating } from '../../../../components/Nav/NavRating';
import { useLeaderboard } from '../../../../hooks/useRating';
import { useCurrentUser } from '../../../../hooks/useAuth';
import { useTeamsByIds } from '../../../../hooks/useTeam';
import type { LeaderboardUser } from '../../../../types/leaderboard.types';
import { RATING_TABS } from '../../../../constants';
import '../../../../styles/RatingPage.css';

const ITEMS_PER_PAGE = 5;

export function RatingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const { data: currentUser } = useCurrentUser();
  
  // Решение проблемы скролла
  const scrollPositionRef = useRef(0);
  const isRestoringScrollRef = useRef(false);
  
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch
  } = useLeaderboard<LeaderboardUser>(
    'users', 
    debouncedSearch, 
    ITEMS_PER_PAGE, 
    offset
  );

  // Сохраняем позицию скролла
  const saveScrollPosition = useCallback(() => {
    scrollPositionRef.current = window.scrollY;
  }, []);

  // Восстанавливаем позицию скролла после загрузки
  useEffect(() => {
    if (!isLoading && scrollPositionRef.current > 0 && !isRestoringScrollRef.current) {
      isRestoringScrollRef.current = true;
      const restoreScroll = () => {
        window.scrollTo(0, scrollPositionRef.current);
      };
      restoreScroll();
      setTimeout(restoreScroll, 50);
      setTimeout(restoreScroll, 100);
      setTimeout(() => {
        isRestoringScrollRef.current = false;
      }, 150);
    }
  }, [isLoading, currentPage]);

  // Сброс страницы при изменении поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1);
      saveScrollPosition();
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, saveScrollPosition]);

  // Обработчик поиска
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    saveScrollPosition();
    setCurrentPage(1);
  };

  // Все пользователи из API
  const allUsers = useMemo(() => {
    return data?.result || [];
  }, [data?.result]);

  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Собираем уникальные team_id у пользователей (только для текущей страницы)
  const teamIds = useMemo(() => {
    return [...new Set(allUsers.map(user => user?.team_id).filter(id => id != null))] as number[];
  }, [allUsers]);

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

  const getDisplayPosition = (index: number) => {
    return (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      saveScrollPosition();
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
      saveScrollPosition();
      setCurrentPage(prev => prev - 1);
    }
  };

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
            <button onClick={() => refetch()}>Повторить</button>
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
          <NavRating tabs={RATING_TABS} />
        </div>

        <div className="rating-search">
          <input
            className="rating-search-input"
            placeholder="Введите ФИО студента"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="rating-table">
          <div className="rating-row rating-header">
            <div>Позиция</div>
            <div>ФИО</div>
            <div>Команда</div>
            <div>Балл</div>
          </div>

          {allUsers.length === 0 ? (
            <div className="rating-empty">Нет данных</div>
          ) : (
            allUsers.map((user, index) => {
              if (!user) return null;
              const isCurrentUser = user.id === currentUserId;
              const displayPosition = getDisplayPosition(index);
              
              return (
                <div 
                  key={user.id} 
                  className={`rating-row ${isCurrentUser ? 'current-user' : ''}`}
                >
                  <div className="rating-position">{displayPosition}</div>
                  <div className="rating-name">
                    {user.last_name} {user.first_name}
                    {user.patronymic && ` ${user.patronymic}`}
                  </div>
                  <div className="rating-team">
                    {user.team_id ? (teamNameMap.get(user.team_id) || '—') : '—'}
                  </div>
                  <div className="rating-score">{user.personal_rating}</div>
                </div>
              );
            })
          )}
        </div>

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="rating-pagination">
            <button
              className="pagination-nav-btn"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              ‹
            </button>
            
            <span className="pagination-counter">
              {currentPage} / {totalPages}
            </span>
            
            <button
              className="pagination-nav-btn"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              ›
            </button>
          </div>
        )}
      </main>
    </div>
  );
}