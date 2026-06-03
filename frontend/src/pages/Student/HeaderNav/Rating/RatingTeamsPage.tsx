// pages/Student/HeaderNav/RatingTeamsPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { HeaderStudent } from '../../../../components/Header/HeaderStudent';
import { NavRating } from '../../../../components/Nav/NavRating';
import { useLeaderboard } from '../../../../hooks/useRating';
import { RATING_TABS } from '../../../../constants';
import '../../../../styles/RatingPage.css';

interface TeamLeaderboardItem {
  id: number;
  name: string;
  crc: number;
  league: 'novice' | 'pro' | 'legend';
  captain_id: number;
  members?: number[];
  members_count?: number;
  position?: number;
}

export function RatingTeamsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [topOnly, setTopOnly] = useState(false);
  
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useLeaderboard(
    'teams',
    debouncedSearch,
    topOnly
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const allTeams = useMemo(() => {
    const rawTeams = data?.pages?.flatMap(page => page?.items || []) || [];
    return rawTeams.map((team: any, index: number) => ({
      id: team.id,
      name: team.name,
      rating: team.crc,
      league: team.league,
      position: index + 1,
    }));
  }, [data?.pages]);

  const displayedTeams = useMemo(() => {
    let result = [...allTeams];
    if (topOnly) {
      result = result.slice(0, 10);
    }
    return result;
  }, [allTeams, topOnly]);

  const getLeagueDisplay = (league?: string) => {
    switch (league) {
      case 'novice': return 'Новички';
      case 'pro': return 'Профи';
      case 'legend': return 'Легенды';
      default: return '—';
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
          <NavRating tabs={RATING_TABS} />
        </div>

        <div className="rating-search">
          <input
            className="rating-search-input"
            placeholder="Введите название команды или лигу"
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
            <div>Команда</div>
            <div>Лига</div>
            <div>Балл</div>
          </div>

          {displayedTeams.length === 0 ? (
            <div className="rating-empty">Нет данных</div>
          ) : (
            displayedTeams.map((team) => {
              const displayPosition = topOnly ? team.position : team.position;
              
              return (
                <div key={team.id} className="rating-row">
                  <div className="rating-position">{displayPosition}</div>
                  <div className="rating-name">{team.name}</div>
                  <div className="rating-league">{getLeagueDisplay(team.league)}</div>
                  <div className="rating-score">{team.rating?.toFixed(2) || team.rating}</div>
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