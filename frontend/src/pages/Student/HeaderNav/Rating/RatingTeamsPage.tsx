// pages/Student/HeaderNav/RatingTeamsPage.tsx
import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { HeaderStudent } from '../../../../components/Header/HeaderStudent';
import { NavRating } from '../../../../components/Nav/NavRating';
import { useLeaderboard } from '../../../../hooks/useRating';
import type { LeaderboardTeam } from '../../../../types/leaderboard.types';
import { RATING_TABS } from '../../../../constants';
import '../../../../styles/RatingPage.css';

const ITEMS_PER_PAGE = 5;

export function RatingTeamsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  
  const scrollPositionRef = useRef(0);
  const isRestoringScrollRef = useRef(false);
  
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    refetch
  } = useLeaderboard<LeaderboardTeam>(
    'teams', 
    debouncedSearch, 
    ITEMS_PER_PAGE, 
    offset
  );

  const saveScrollPosition = useCallback(() => {
    scrollPositionRef.current = window.scrollY;
  }, []);

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

  // Все команды из API
  const allTeams = useMemo(() => {
    const items = data?.result || [];
    return items.map((team, index) => ({
      id: team.id,
      name: team.name,
      rating: team.crc,
      league: team.league,
      position: offset + index + 1,
    }));
  }, [data?.result, offset]);

  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const getLeagueDisplay = (league?: string) => {
    switch (league) {
      case 'novice': return 'Новички';
      case 'pro': return 'Профи';
      case 'legend': return 'Легенды';
      default: return '—';
    }
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

  if (isLoading) {
    return (
      <div className="rating-page">
        <HeaderStudent />
        <main className="rating-main">
          <div className="loading">Загрузка рейтинга команд...</div>
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
            placeholder="Введите название команды"
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </div>

        <div className="rating-table">
          <div className="rating-row rating-header">
            <div>Позиция</div>
            <div>Команда</div>
            <div>Лига</div>
            <div>Балл</div>
          </div>

          {allTeams.length === 0 ? (
            <div className="rating-empty">Нет данных</div>
          ) : (
            allTeams.map((team) => (
              <div key={team.id} className="rating-row">
                <div className="rating-position">{team.position}</div>
                <div className="rating-name">{team.name}</div>
                <div className="rating-league">{getLeagueDisplay(team.league)}</div>
                <div className="rating-score">{team.rating?.toFixed(2) || team.rating}</div>
              </div>
            ))
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