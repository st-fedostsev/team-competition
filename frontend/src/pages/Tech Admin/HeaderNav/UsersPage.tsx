// pages/Tech Admin/Users/UsersPage.tsx
import React, { useState } from 'react';
import { HeaderTechAdmin } from '../../../components/Header/HeaderTechAdmin';
import { CreatePlusButton, CancelButton, CreateButton } from '../../../components/Buttons';
import { Modal } from '../../../components/ModalWindowComponent';
import '../../../styles/UsersPage.css';

type FilterTab = 'all' | 'students' | 'admins';

const MOCK_STUDENTS = [
  { id: 1, name: 'Иванов Иван Иванович', sub: 'Команда Альфа', is_blocked: false },
  { id: 2, name: 'Петрова Мария Сергеевна', sub: 'Команда Бета', is_blocked: true },
  { id: 3, name: 'Сидоров Алексей Петрович', sub: 'Без команды', is_blocked: false },
];

const MOCK_ADMINS = [
  { id: 4, name: 'Козлов Дмитрий Андреевич', sub: 'Контент-менеджер', is_blocked: false },
  { id: 5, name: 'Николаева Анна Викторовна', sub: 'Игровой администратор', is_blocked: true },
];

type MockUser = { id: number; name: string; sub: string; is_blocked: boolean };

export function UsersPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [students, setStudents] = useState<MockUser[]>(MOCK_STUDENTS);
  const [admins, setAdmins] = useState<MockUser[]>(MOCK_ADMINS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Форма администратора
  const [formLogin, setFormLogin] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('');

  // Форма студента
  const [formFio, setFormFio] = useState('');
  const [formStudentId, setFormStudentId] = useState('');
  const [formGrade, setFormGrade] = useState('');

  const handleBanToggle = (id: number) => {
    setStudents((prev) =>
      prev.map((u) => (u.id === id ? { ...u, is_blocked: !u.is_blocked } : u))
    );
    setAdmins((prev) =>
      prev.map((u) => (u.id === id ? { ...u, is_blocked: !u.is_blocked } : u))
    );
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormLogin('');
    setFormPassword('');
    setFormRole('');
    setFormFio('');
    setFormStudentId('');
    setFormGrade('');
  };

  const handleCreate = () => {
    handleCloseModal();
  };

  const getVisibleUsers = (): MockUser[] => {
    let list: MockUser[] = [];
    if (activeFilter === 'all') list = [...students, ...admins];
    else if (activeFilter === 'students') list = students;
    else list = admins;

    if (!searchQuery.trim()) return list;
    return list.filter((u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const visibleUsers = getVisibleUsers();

  return (
    <div className="users-page">
      <HeaderTechAdmin />

      <main className="users-main">

        {/* Строка: фильтр слева, кнопка Создать справа */}
        <div className="users-header-row">
          <div className="users-filter">
            <button
              className={`users-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
              onClick={() => setActiveFilter('all')}
            >
              Все
            </button>
            <button
              className={`users-filter-btn ${activeFilter === 'students' ? 'active' : ''}`}
              onClick={() => setActiveFilter('students')}
            >
              Студенты
            </button>
            <button
              className={`users-filter-btn ${activeFilter === 'admins' ? 'active' : ''}`}
              onClick={() => setActiveFilter('admins')}
            >
              Администраторы
            </button>
          </div>

          {(activeFilter === 'admins' || activeFilter === 'students') && (
            <CreatePlusButton onClick={() => setIsModalOpen(true)} />
          )}
        </div>

        {/* Поиск */}
        <div className="users-search">
          <input
            className="users-search-input"
            placeholder="Введите название"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <span className="users-search-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
        </div>

        {/* Карточки */}
        <div className="users-list">
          {visibleUsers.length === 0 ? (
            <div className="users-empty">Пользователи не найдены</div>
          ) : (
            visibleUsers.map((user) => (
              <div key={user.id} className="user-card">
                <div className="user-card-info">
                  <div className="user-card-avatar">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#bbb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="8" r="4" />
                      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
                    </svg>
                  </div>
                  <div className="user-card-details">
                    <span className="user-card-name">{user.name}</span>
                    <span className="user-card-sub">{user.sub}</span>
                  </div>
                </div>

                <button
                  className={`btn-block ${user.is_blocked ? 'btn-block--unban' : 'btn-block--ban'}`}
                  onClick={() => handleBanToggle(user.id)}
                >
                  {user.is_blocked ? 'Разблокировать' : 'Заблокировать'}
                </button>
              </div>
            ))
          )}
        </div>
      </main>

      {/* Модалка для администратора */}
      {isModalOpen && activeFilter === 'admins' && (
        <Modal closeModal={handleCloseModal}>
          <div className="create-admin-modal">
            <div className="create-admin-field">
              <label className="create-admin-label">Введите логин</label>
              <input
                className="create-admin-input"
                type="text"
                value={formLogin}
                onChange={(e) => setFormLogin(e.target.value)}
              />
            </div>

            <div className="create-admin-field">
              <label className="create-admin-label">Введите пароль</label>
              <input
                className="create-admin-input"
                type="password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
              />
            </div>

            <div className="create-admin-field">
              <label className="create-admin-label">Укажите роль</label>
              <div className="create-admin-select-wrapper">
                <select
                  className="create-admin-select"
                  value={formRole}
                  onChange={(e) => setFormRole(e.target.value)}
                >
                  <option value="" disabled />
                  <option value="content_manager">Контент-менеджер</option>
                  <option value="game_admin">Игровой администратор</option>
                  <option value="technical_admin">Тех. администратор</option>
                </select>
              </div>
            </div>

            <div className="create-admin-actions">
              <CancelButton onClick={handleCloseModal} />
              <CreateButton onClick={handleCreate} />
            </div>
          </div>
        </Modal>
      )}

      {isModalOpen && activeFilter === 'students' && (
        <Modal closeModal={handleCloseModal}>
          <div className="create-admin-modal">
            <div className="create-admin-field">
              <label className="create-admin-label">ФИО</label>
              <input
                className="create-admin-input"
                type="text"
                value={formFio}
                onChange={(e) => setFormFio(e.target.value)}
              />
            </div>

            <div className="create-admin-field">
              <label className="create-admin-label">Номер студенческого билета</label>
              <input
                className="create-admin-input"
                type="text"
                value={formStudentId}
                onChange={(e) => setFormStudentId(e.target.value)}
              />
            </div>

            <div className="create-admin-field">
              <label className="create-admin-label">Средний балл</label>
              <input
                className="create-admin-input"
                type="text"
                value={formGrade}
                onChange={(e) => setFormGrade(e.target.value)}
              />
            </div>

            <div className="create-admin-actions">
              <CancelButton onClick={handleCloseModal} />
              <CreateButton onClick={handleCreate} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
