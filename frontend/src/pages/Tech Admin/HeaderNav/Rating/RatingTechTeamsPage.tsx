import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderTechAdmin } from '../../../../components/Header/HeaderTechAdmin';
import { EditIcon } from '../../../../components/EditIcon';
import { SearchIcon } from '../../../../components/SearchIcon';
import { useLeaderboard } from '../../../../hooks/useRating';
import type { LeaderboardTeam } from '../../../../types/leaderboard.types'
import '../../../../styles/RatingTechPage.css';
import type { ApiError } from '../../../../types/error.types'

export function RatingTechTeamsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showTop, setShowTop] = useState(false);

  const { 
    data, 
    isLoading, 
    isError, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage 
  } = useLeaderboard<LeaderboardTeam>('teams', debouncedSearch, showTop);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const allTeams = useMemo(() => {
    return data?.pages?.flatMap(page => page?.items || []) || [];
  }, [data?.pages]);

  const getLeagueDisplay = (league?: string) => {
    switch (league) {
      case 'novice': return 'Новички';
      case 'pro': return 'Профи';
      case 'legend': return 'Легенды';
      default: return '—';
    }
  };

  const getDisplayPosition = (index: number) => {
    return index + 1;
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
            onChange={(event) => setSearchQuery(event.target.value)}
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
            onChange={(event) => setShowTop(event.target.checked)}
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

          {allTeams.length === 0 ? (
            <div className="tech-rating-empty">Нет данных</div>
          ) : (
            allTeams.map((team, index) => (
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

        {hasNextPage && (
          <div className="tech-rating-load-more">
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