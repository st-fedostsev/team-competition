import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderTechAdmin } from '../../../../components/Header/HeaderTechAdmin';
import { EditIcon } from '../../../../components/EditIcon';
import { SearchIcon } from '../../../../components/SearchIcon';
import { useLeaderboard } from '../../../../hooks/useRating';
import type { LeaderboardUser } from '../../../../types/leaderboard.types'
import { useTeamsByIds } from '../../../../hooks/useTeam';
import '../../../../styles/RatingTechPage.css';
import type { ApiError } from '../../../../types/error.types'

const ITEMS_PER_PAGE = 5;

export function RatingTechStudentsPage() {
  const navigate = useNavigate();
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
  } = useLeaderboard<LeaderboardUser>(
    'users', 
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

  // Все студенты из API
  const allStudents = useMemo(() => {
    return data?.result || [];
  }, [data?.result]);

  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Для отображения названий команд (только для текущей страницы)
  const teamIds = useMemo(() => {
    return [...new Set(allStudents.map(student => student.team_id).filter(Boolean))] as number[];
  }, [allStudents]);

  const teamQueries = useTeamsByIds(teamIds);
  
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

  if (isLoading) {
    return (
      <div className="tech-rating-page">
        <HeaderTechAdmin />
        <main className="tech-rating-main">
          <div className="loading">Загрузка рейтинга студентов...</div>
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

  return (
    <div className="tech-rating-page">
      <HeaderTechAdmin />

      <main className="tech-rating-main">
        <div className="tech-rating-control-row">
          <div className="tech-rating-tabs">
            <button
              className="tech-rating-tab active"
              type="button"
              onClick={() => navigate('/admin/rating/students')}
            >
              Студенты
            </button>

            <button
              className="tech-rating-tab"
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
            placeholder="Введите ФИО или команду"
          />

          <button className="tech-rating-search-button" type="button" aria-label="Поиск">
            <SearchIcon />
          </button>
        </div>

        <div className="tech-rating-table">
          <div className="tech-rating-row tech-rating-header tech-rating-students-row">
            <div>Позиция</div>
            <div>ФИО</div>
            <div>Команда</div>
            <div>Балл</div>
            <div></div>
          </div>

          {allStudents.length === 0 ? (
            <div className="tech-rating-empty">Нет данных</div>
          ) : (
            allStudents.map((student, index) => (
              <div className="tech-rating-row tech-rating-students-row" key={student.id}>
                <div>{getDisplayPosition(index)}</div>
                <div>{`${student.last_name} ${student.first_name} ${student.patronymic || ''}`}</div>
                <div>{student.team_id ? (teamNameMap.get(student.team_id) || '—') : '—'}</div>
                <div>{student.personal_rating}</div>
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