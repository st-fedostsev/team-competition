// pages/TechAdmin/Users/UsersPage.tsx
import { useState, useEffect } from 'react';
import { HeaderTechAdmin } from '../../../components/Header/HeaderTechAdmin';
import { CreatePlusButton, CancelButton, CreateButton } from '../../../components/Buttons';
import { Modal } from '../../../components/ModalWindowComponent';
import { useAdminUsers, useRegisterUser, useBanUser } from '../../../hooks/useTechAdmin';
import { useCurrentUser } from '../../../hooks/useAuth';
import { useTeamsByIds } from '../../../hooks/useTeam';
import type { UserRole } from '../../../types/techadmin.types';
import '../../../styles/UsersPage.css';
import type { ApiError } from '../../../types/error.types'

type FilterTab = 'all' | 'students' | 'admins';

export function UsersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Форма администратора
  const [formLogin, setFormLogin] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState<'' | UserRole>('');
  const [formFioAdmin, setFormFioAdmin] = useState('');

  // Форма студента
  const [formFioStudent, setFormFioStudent] = useState('');
  const [formStudentId, setFormStudentId] = useState('');
  const [formRating, setFormRating] = useState('');

  // Хуки
  const { data: currentUser } = useCurrentUser();
  
  // Определяем роли для фильтрации
  const getRolesByFilter = (): UserRole[] | undefined => {
    if (activeFilter === 'students') {
      return ['student'];
    }
    if (activeFilter === 'admins') {
      return ['content_manager', 'game_admin', 'technical_admin'];
    }
    return undefined; // 'all' - не передаём роли, получаем всех
  };
  
  const rolesFilter = getRolesByFilter();
  
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = 
    useAdminUsers(debouncedSearch, rolesFilter);
  
  const { mutate: registerUser, isPending: isRegistering } = useRegisterUser();
  const { mutate: banUser, isPending: isBanning } = useBanUser();

  // Debounce поиска
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Все пользователи
  const allUsers = data?.pages.flatMap(page => page.users) || [];

  // Фильтруем текущего админа
  const filteredUsers = allUsers.filter(user => {
    if (!user) return false;
    if (!currentUser) return true;
    return user.id !== currentUser.id;
  });

  // Собираем уникальные team_id у студентов
  const teamIds = [...new Set(filteredUsers.map(user => user.team_id).filter(Boolean))] as number[];

  // Получаем названия команд через хук
  const teamQueries = useTeamsByIds(teamIds);

  // Создаём Map для быстрого доступа к названиям команд
  const teamNameMap = new Map<number, string>();
  teamQueries.forEach((query, index) => {
    if (query.data?.name) {
      teamNameMap.set(teamIds[index], query.data.name);
    }
  });

  const handleBanToggle = (userId: number, isBlocked: boolean) => {
    if (confirm(`Вы уверены, что хотите ${isBlocked ? 'разблокировать' : 'заблокировать'} пользователя?`)) {
      banUser({ user_id: userId, ban: !isBlocked });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormLogin('');
    setFormPassword('');
    setFormRole('');
    setFormFioAdmin('');
    setFormFioStudent('');
    setFormStudentId('');
    setFormRating('');
  };

  const handleCreate = () => {
    if (activeFilter === 'admins') {
      if (!formLogin || !formPassword || !formRole || !formFioAdmin) {
        alert('Заполните все поля');
        return;
      }
      
      const nameParts = formFioAdmin.trim().split(' ');
      const last_name = nameParts[0] || '';
      const first_name = nameParts[1] || '';
      const patronymic = nameParts[2] || '';
      
      registerUser({
        last_name,
        first_name,
        patronymic,
        user_role: formRole as UserRole,
        login: formLogin,
        password: formPassword,
        student_id: 0,
        personal_rating: 0
      }, {
        onSuccess: () => {
          alert('Администратор успешно создан!');
          handleCloseModal();
          refetch();
        },
        onError: (error: Error & ApiError) => {
          alert(error.response?.data?.msg || 'Ошибка создания администратора');
        },
      });
    } else {
      if (!formFioStudent || !formStudentId) {
        alert('Заполните обязательные поля');
        return;
      }
      
      // Проверка рейтинга
      const rating = Number(formRating);
      if (formRating && (rating < 0 || rating > 100)) {
        alert('Рейтинговый балл должен быть от 0 до 100');
        return;
      }

      const nameParts = formFioStudent.trim().split(' ');
      const last_name = nameParts[0] || '';
      const first_name = nameParts[1] || '';
      const patronymic = nameParts[2] || '';
      
      registerUser({
        last_name,
        first_name,
        patronymic,
        student_id: Number(formStudentId),
        user_role: 'student',
        personal_rating: rating || 0,
      }, {
        onSuccess: () => {
          alert('Студент успешно создан!');
          handleCloseModal();
          refetch();
        },
        onError: (error: Error & ApiError) => {
          alert(error.response?.data?.msg || 'Ошибка создания студента');
        },
      });
    }
  };

  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'student': return 'Студент';
      case 'content_manager': return 'Контент-менеджер';
      case 'game_admin': return 'Игровой администратор';
      case 'technical_admin': return 'Тех. администратор';
      default: return role;
    }
  };

  if (isLoading) {
    return (
      <div className="users-page">
        <HeaderTechAdmin />
        <main className="users-main">
          <div className="loading">Загрузка пользователей...</div>
        </main>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="users-page">
        <HeaderTechAdmin />
        <main className="users-main">
          <div className="error">
            <p>Ошибка загрузки пользователей</p>
            <button onClick={() => refetch()}>Повторить</button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="users-page">
      <HeaderTechAdmin />

      <main className="users-main">

        <div className="users-header-row">
          <div className="users-filter">
            <button
              className={`users-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Все {activeFilter === 'all' && `(${filteredUsers.length})`}
            </button>
            <button
              className={`users-filter-btn ${activeFilter === 'students' ? 'active' : ''}`}
              onClick={() => setActiveFilter('students')}
            >
              Студенты {activeFilter === 'students' && `(${filteredUsers.filter(u => u.role === 'student').length})`}
            </button>
            <button
              className={`users-filter-btn ${activeFilter === 'admins' ? 'active' : ''}`}
              onClick={() => setActiveFilter('admins')}
            >
              Администраторы {activeFilter === 'admins' && `(${filteredUsers.filter(u => u.role !== 'student').length})`}
            </button>
          </div>

          {(activeFilter === 'students' || activeFilter === 'admins') && (
            <CreatePlusButton onClick={() => setIsModalOpen(true)} />
          )}
        </div>

        <div className="users-search">
          <input
            className="users-search-input"
            placeholder="Поиск по ФИО или логину"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="users-search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>

        <div className="users-list">
          {filteredUsers.length === 0 ? (
            <div className="users-empty">Пользователи не найдены</div>
          ) : (
            filteredUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-card-info">
                  <div className="user-card-avatar">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <div className="user-card-details">
                    <span className="user-card-name">
                      {user.last_name} {user.first_name} {user.patronymic || ''}
                    </span>
                    <span className="user-card-sub">
                      {user.role === 'student' 
                        ? (teamNameMap.get(user.team_id!) || 'Без команды')
                        : getRoleDisplay(user.role)
                      }
                    </span>
                    {user.role === 'student' && user.personal_rating !== undefined && (
                      <span className="user-card-rating">
                        Рейтинг: {user.personal_rating}
                      </span>
                    )}
                    {user.role !== 'student' && user.login && (
                      <span className="user-card-login">
                        Логин: {user.login}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  className={`btn-block ${user.is_blocked ? 'btn-block--unban' : 'btn-block--ban'}`}
                  onClick={() => handleBanToggle(user.id, user.is_blocked)}
                  disabled={isBanning}
                >
                  {user.is_blocked ? 'Разблокировать' : 'Заблокировать'}
                </button>
              </div>
            ))
          )}
        </div>

        {hasNextPage && (
          <div className="users-load-more">
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

      {/* Модалка для создания администратора */}
      {isModalOpen && activeFilter === 'admins' && (
        <Modal closeModal={handleCloseModal}>
          <div className="create-admin-modal">
            <h3 className="create-admin-title">Создание администратора</h3>
            
            <div className="create-admin-field">
              <label className="create-admin-label">ФИО</label>
              <input
                className="create-admin-input"
                type="text"
                placeholder="Иванов Иван Иванович"
                value={formFioAdmin}
                onChange={(e) => setFormFioAdmin(e.target.value)}
              />
            </div>

            <div className="create-admin-field">
              <label className="create-admin-label">Логин</label>
              <input
                className="create-admin-input"
                type="text"
                placeholder="ivanov"
                value={formLogin}
                onChange={(e) => setFormLogin(e.target.value)}
              />
            </div>

            <div className="create-admin-field">
              <label className="create-admin-label">Пароль</label>
              <input
                className="create-admin-input"
                type="password"
                placeholder="••••••"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
              />
            </div>

            <div className="create-admin-field">
              <label className="create-admin-label">Роль</label>
              <div className="create-admin-select-wrapper">
                <select
                  className="create-admin-select"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value as UserRole)}
                >
                  <option value="" disabled>Выберите роль</option>
                  <option value="content_manager">Контент-менеджер</option>
                  <option value="game_admin">Игровой администратор</option>
                  <option value="technical_admin">Тех. администратор</option>
                </select>
              </div>
            </div>

            <div className="create-admin-actions">
              <CancelButton onClick={handleCloseModal} />
              <CreateButton onClick={handleCreate} disabled={isRegistering} />
            </div>
          </div>
        </Modal>
      )}

      {/* Модалка для создания студента */}
      {isModalOpen && activeFilter === 'students' && (
        <Modal closeModal={handleCloseModal}>
          <div className="create-admin-modal">
            <h3 className="create-admin-title">Создание студента</h3>
            
            <div className="create-admin-field">
              <label className="create-admin-label">ФИО</label>
              <input
                className="create-admin-input"
                type="text"
                placeholder="Иванов Иван Иванович"
                value={formFioStudent}
                onChange={(e) => setFormFioStudent(e.target.value)}
              />
            </div>

            <div className="create-admin-field">
              <label className="create-admin-label">Номер студенческого билета</label>
              <input
                className="create-admin-input"
                type="number"
                placeholder="123456"
                value={formStudentId}
                onChange={(e) => setFormStudentId(e.target.value)}
              />
            </div>

            <div className="create-admin-field">
              <label className="create-admin-label">Рейтинговый балл</label>
              <input
                className="create-admin-input"
                type="number"
                placeholder="0"
                value={formRating}
                onChange={(e) => setFormRating(e.target.value)}
              />
            </div>

            <div className="create-admin-actions">
              <CancelButton onClick={handleCloseModal} />
              <CreateButton onClick={handleCreate} disabled={isRegistering} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}