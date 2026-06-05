import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { HeaderTechAdmin } from '../../../../components/Header/HeaderTechAdmin';
import { EditIcon } from '../../../../components/EditIcon';
import { SearchIcon } from '../../../../components/SearchIcon';
import { useLeaderboard } from '../../../../hooks/useRating';
import type { LeaderboardUser } from '../../../../types/leaderboard.types';
import { useTeamsByIds } from '../../../../hooks/useTeam';
import '../../../../styles/RatingTechPage.css';
import type { ApiError } from '../../../../types/error.types';

const ITEMS_PER_PAGE = 5;

export function RatingTechStudentsPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInput, setPageInput] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<LeaderboardUser | null>(null);

  const [lastNameDraft, setLastNameDraft] = useState('');
  const [firstNameDraft, setFirstNameDraft] = useState('');
  const [patronymicDraft, setPatronymicDraft] = useState('');
  const [ratingDraft, setRatingDraft] = useState('');

  const [editedStudents, setEditedStudents] = useState<
    Record<
      number,
      {
        last_name: string;
        first_name: string;
        patronymic?: string;
        personal_rating: number;
      }
    >
  >({});

  const scrollPositionRef = useRef(0);
  const isRestoringScrollRef = useRef(false);

  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
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

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    saveScrollPosition();
    setCurrentPage(1);
  };

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

  const allStudents = useMemo(() => {
    return data?.result || [];
  }, [data?.result]);

  const displayedStudents = useMemo(() => {
    return allStudents.map((student) => {
      const editedStudent = editedStudents[student.id];

      if (!editedStudent) {
        return student;
      }

      return {
        ...student,
        ...editedStudent,
      };
    });
  }, [allStudents, editedStudents]);

  const totalCount = data?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

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

  const handleOpenEditModal = (student: LeaderboardUser) => {
    setSelectedStudent(student);

    setLastNameDraft(student.last_name || '');
    setFirstNameDraft(student.first_name || '');
    setPatronymicDraft(student.patronymic || '');
    setRatingDraft(String(student.personal_rating || 0));

    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedStudent(null);

    setLastNameDraft('');
    setFirstNameDraft('');
    setPatronymicDraft('');
    setRatingDraft('');
  };

  const handleSaveStudentChanges = () => {
    if (!selectedStudent) return;

    const lastName = lastNameDraft.trim();
    const firstName = firstNameDraft.trim();
    const patronymic = patronymicDraft.trim();
    const rating = Number(ratingDraft);

    if (!lastName) {
      alert('Введите фамилию');
      return;
    }

    if (!firstName) {
      alert('Введите имя');
      return;
    }

    if (Number.isNaN(rating) || rating < 0) {
      alert('Введите корректный балл');
      return;
    }

    setEditedStudents((prev) => ({
      ...prev,
      [selectedStudent.id]: {
        last_name: lastName,
        first_name: firstName,
        patronymic,
        personal_rating: rating,
      },
    }));

    handleCloseEditModal();
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
            <p>
              Ошибка загрузки: {(error as ApiError)?.message || 'Неизвестная ошибка'}
            </p>

            <button onClick={() => refetch()}>
              Повторить
            </button>
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

          <button
            className="tech-rating-search-button"
            type="button"
            aria-label="Поиск"
          >
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

          {displayedStudents.length === 0 ? (
            <div className="tech-rating-empty">Нет данных</div>
          ) : (
            displayedStudents.map((student, index) => (
              <div
                className="tech-rating-row tech-rating-students-row"
                key={student.id}
              >
                <div>{getDisplayPosition(index)}</div>

                <div>
                  {`${student.last_name} ${student.first_name} ${student.patronymic || ''}`}
                </div>

                <div>
                  {student.team_id ? (teamNameMap.get(student.team_id) || '—') : '—'}
                </div>

                <div>{student.personal_rating}</div>

                <div>
                  <button
                    className="tech-rating-edit-button"
                    type="button"
                    aria-label="Редактировать"
                    onClick={() => handleOpenEditModal(student)}
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

      {isEditModalOpen && selectedStudent && (
        <div
          className="tech-rating-modal-backdrop"
          onClick={handleCloseEditModal}
        >
          <div
            className="tech-rating-edit-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="tech-rating-edit-modal-header">
              <p className="tech-rating-edit-modal-title">
                Редактировать студента
              </p>

              <button
                className="tech-rating-edit-modal-close"
                type="button"
                onClick={handleCloseEditModal}
              >
                ×
              </button>
            </div>

            <div className="tech-rating-edit-modal-fields">
              <label className="tech-rating-edit-modal-field">
                <span>Фамилия</span>

                <input
                  value={lastNameDraft}
                  onChange={(event) => setLastNameDraft(event.target.value)}
                  placeholder="Фамилия"
                />
              </label>

              <label className="tech-rating-edit-modal-field">
                <span>Имя</span>

                <input
                  value={firstNameDraft}
                  onChange={(event) => setFirstNameDraft(event.target.value)}
                  placeholder="Имя"
                />
              </label>

              <label className="tech-rating-edit-modal-field">
                <span>Отчество</span>

                <input
                  value={patronymicDraft}
                  onChange={(event) => setPatronymicDraft(event.target.value)}
                  placeholder="Отчество"
                />
              </label>

              <label className="tech-rating-edit-modal-field">
                <span>Балл</span>

                <input
                  type="number"
                  value={ratingDraft}
                  onChange={(event) => setRatingDraft(event.target.value)}
                  placeholder="Балл"
                  min={0}
                />
              </label>
            </div>

            <div className="tech-rating-edit-modal-buttons">
              <button
                className="tech-rating-edit-modal-cancel"
                type="button"
                onClick={handleCloseEditModal}
              >
                Отмена
              </button>

              <button
                className="tech-rating-edit-modal-save"
                type="button"
                onClick={handleSaveStudentChanges}
              >
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}