import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderTechAdmin } from '../../../../components/Header/HeaderTechAdmin';
import { EditIcon } from '../../../../components/EditIcon';
import { SearchIcon } from '../../../../components/SearchIcon';
import { useLeaderboard } from '../../../../hooks/useRating';
import type { LeaderboardUser } from '../../../../types/leaderboard.types'
import { useTeamsByIds } from '../../../../hooks/useTeam';
import '../../../../styles/RatingTechPage.css';
import type { ApiError } from '../../../../types/error.types'

const ITEMS_PER_PAGE = 10;

export function RatingTechStudentsPage() {
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
  } = useLeaderboard<LeaderboardUser>('users', debouncedSearch, false); //

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

  const allStudents = useMemo(() => {
    return data?.pages?.flatMap(page => page?.items || []) || [];
  }, [data?.pages]);

  // Фильтрация Топ-10 на фронте
  const filteredStudents = useMemo(() => {
    if (showTop) {
      return allStudents.slice(0, 10);
    }
    return allStudents;
  }, [allStudents, showTop]);

  // Пагинация
  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentStudents = filteredStudents.slice(startIndex, endIndex);

  // Для отображения названий команд (только для текущей страницы)
  const teamIds = useMemo(() => {
    return [...new Set(currentStudents.map(student => student.team_id).filter(Boolean))] as number[];
  }, [currentStudents]);

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

        <label className="tech-rating-top-checkbox">
          <input
            checked={showTop}
            type="checkbox"
            onChange={handleTopOnlyChange}
          />
          <span>Топ-10</span>
        </label>

        <div className="tech-rating-table">
          <div className="tech-rating-row tech-rating-header tech-rating-students-row">
            <div>Позиция</div>
            <div>ФИО</div>
            <div>Команда</div>
            <div>Балл</div>
            <div></div>
          </div>

          {currentStudents.length === 0 ? (
            <div className="tech-rating-empty">Нет данных</div>
          ) : (
            currentStudents.map((student, index) => (
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