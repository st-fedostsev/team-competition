import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderTechAdmin } from '../../../../components/Header/HeaderTechAdmin';
import { EditIcon } from '../../../../components/EditIcon';
import { SearchIcon } from '../../../../components/SearchIcon';
import { useLeaderboard } from '../../../../hooks/useRating';
import type { LeaderboardTeam } from '../../../../types/leaderboard.types'
import '../../../../styles/RatingTechPage.css';
import type { ApiError } from '../../../../types/error.types'

const ITEMS_PER_PAGE = 5;

export function RatingTechTeamsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
    const [pageInput, setPageInput] = useState('');
  
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
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
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
      <div className="tech-rating-page">
        <HeaderTechAdmin />
        <main className="tech-rating-main">
          <div className="loading">Загрузка рейтинга команд...</div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="tech-rating-page">
        <HeaderTechAdmin />
        <main className="tech-rating-main">
          <div className="error">
            <p>Ошибка загрузки: {(error as ApiError)?.message || 'Неизвестная ошибка'}</p>
            <button onClick={() => refetch()}>Повторить</button>
          </div>
        </main>
      </div>
    );
  }


    const handlePageInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const pageNumber = parseInt(pageInput);

      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        saveScrollPosition();
        setCurrentPage(pageNumber);
        setPageInput('');
      } else {
        alert(`Введите число от 1 до ${totalPages}`);
      }
    }
  };

  const handlePageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPageInput(e.target.value);
  };

  return (
    <div className="tech-rating-page">
      <HeaderTechAdmin />

      <main className="tech-rating-main">
        <div className="tech-rating-control-row">
          <div className="tech-rating-tabs">
            <button
              className="tech-rating-tab"
              type="button"
              onClick={() => navigate('/admin/rating/students')}
            >
              Студенты
            </button>

            <button
              className="tech-rating-tab active"
              type="button"
              onClick={() => navigate('/admin/rating/teams')}
            >
              Команды
            </button>
          </div>
        </div>

        <div className="tech-rating-search">
          <input
            className="tech-rating-search-input"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Введите название команды"
          />

          <button className="tech-rating-search-button" type="button" aria-label="Поиск">
            <SearchIcon />
          </button>
        </div>

        <div className="tech-rating-table">
          <div className="tech-rating-row tech-rating-header tech-rating-teams-row">
            <div>Позиция</div>
            <div>Команда</div>
            <div>Лига</div>
            <div>Балл</div>
            <div></div>
          </div>

          {allTeams.length === 0 ? (
            <div className="tech-rating-empty">Нет данных</div>
          ) : (
            allTeams.map((team) => (
              <div className="tech-rating-row tech-rating-teams-row" key={team.id}>
                <div>{team.position}</div>
                <div>{team.name}</div>
                <div>{getLeagueDisplay(team.league)}</div>
                <div>{team.rating?.toFixed(2) || team.rating}</div>
                <div>
                  <button
                    className="tech-rating-edit-button"
                    type="button"
                    aria-label="Редактировать"
                  >
                    <EditIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {totalPages > 1 && (
          <div className="users-pagination">
            <button
              className="pagination-btn"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              ‹
            </button>

            <div className="pagination-page-input-wrapper">
              <input
                type="number"
                className="pagination-page-input"
                value={pageInput}
                onChange={handlePageInputChange}
                onKeyDown={handlePageInputKeyDown}
                placeholder={`${currentPage}`}
                min={1}
                max={totalPages}
              />

              <span className="pagination-total">
                {' '}
                / {totalPages}
              </span>
            </div>

            <button
              className="pagination-btn"
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