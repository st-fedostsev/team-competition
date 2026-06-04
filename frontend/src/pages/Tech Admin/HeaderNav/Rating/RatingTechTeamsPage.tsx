import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderTechAdmin } from '../../../../components/Header/HeaderTechAdmin';
import { EditIcon } from '../../../../components/EditIcon';
import { SearchIcon } from '../../../../components/SearchIcon';
import { useLeaderboard } from '../../../../hooks/useRating';
import type { LeaderboardTeam } from '../../../../types/leaderboard.types'
import '../../../../styles/RatingTechPage.css';
import type { ApiError } from '../../../../types/error.types'

const ITEMS_PER_PAGE = 10;

export function RatingTechTeamsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showTop, setShowTop] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { 
    data, 
    isLoading, 
    isError, 
    error, 
  } = useLeaderboard<LeaderboardTeam>('teams', debouncedSearch, false); // всегда false, фильтруем на фронте

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Обработчик поиска
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setCurrentPage(1);
  };

  // Обработчик чекбокса Топ-10
  const handleTopOnlyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowTop(event.target.checked);
    setCurrentPage(1);
  };

  const allTeams = useMemo(() => {
    return data?.pages?.flatMap(page => page?.items || []) || [];
  }, [data?.pages]);

  // Фильтрация Топ-10 на фронте
  const filteredTeams = useMemo(() => {
    if (showTop) {
      return allTeams.slice(0, 10);
    }
    return allTeams;
  }, [allTeams, showTop]);

  // Пагинация
  const totalPages = Math.ceil(filteredTeams.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTeams = filteredTeams.slice(startIndex, endIndex);

  const getLeagueDisplay = (league?: string) => {
    switch (league) {
      case 'novice': return 'Новички';
      case 'pro': return 'Профи';
      case 'legend': return 'Легенды';
      default: return '—';
    }
  };

  const getDisplayPosition = (index: number) => {
    return (currentPage - 1) * ITEMS_PER_PAGE + index + 1;
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 1) {
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
            <button onClick={() => window.location.reload()}>Повторить</button>
          </div>
        </main>
      </div>
    );
  }

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

        <label className="tech-rating-top-checkbox">
          <input
            checked={showTop}
            type="checkbox"
            onChange={handleTopOnlyChange}
          />
          <span>Топ-10</span>
        </label>

        <div className="tech-rating-table">
          <div className="tech-rating-row tech-rating-header tech-rating-teams-row">
            <div>Позиция</div>
            <div>Команда</div>
            <div>Лига</div>
            <div>Балл</div>
            <div></div>
          </div>

          {currentTeams.length === 0 ? (
            <div className="tech-rating-empty">Нет данных</div>
          ) : (
            currentTeams.map((team, index) => (
              <div className="tech-rating-row tech-rating-teams-row" key={team.id}>
                <div>{getDisplayPosition(index)}</div>
                <div>{team.name}</div>
                <div>{getLeagueDisplay(team.league)}</div>
                <div>{team.crc?.toFixed(2) || team.crc}</div>
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

        {/* Пагинация */}
        {totalPages > 1 && (
          <div className="tech-rating-pagination">
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