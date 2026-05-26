import React, { useState, useEffect, useMemo } from 'react';
import { HeaderStudent } from '../../../components/Header/HeaderStudent';
import { NavRating } from '../../../components/Nav/NavRating';
import { useLeaderboard } from '../../../hooks/useRating';
import { useCurrentUser } from '../../../hooks/useAuth';
import { RATING_TABS } from '../../../constants';
import '../../../styles/RatingPage.css';

export function RatingPage() {
  const [activeTab, setActiveTab] = useState<'students' | 'teams'>('students');
  const [searchQuery, setSearchQuery] = useState('');
  const [topOnly, setTopOnly] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  
  const { data: currentUser } = useCurrentUser();
  const { data, isLoading, isError, error, fetchNextPage, hasNextPage, isFetchingNextPage } = useLeaderboard(
    activeTab === 'students' ? debouncedSearch : undefined
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const allUsers = data?.pages.flatMap(page => page.users) || [];
  
  // Фильтрация на фронте
  const filteredUsers = useMemo(() => {
    let result = [...allUsers];
    
    if (topOnly) {
      result = result.slice(0, 10);
    }
    
    return result;
  }, [allUsers, topOnly]);

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
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        <div className="rating-search">
          <input
            className="rating-search-input"
            placeholder="Введите студента"
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
              const isCurrentUser = user.id === currentUserId;
              const displayPosition = topOnly ? index + 1 : user.position;
              
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
                    {user.team_id ? `Команда ${user.team_id}` : '—'}
                  </div>
                  <div className="rating-score">{user.personal_rating}</div>
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