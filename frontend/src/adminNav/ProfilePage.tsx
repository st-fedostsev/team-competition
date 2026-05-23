import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopMenu } from '../components/TopMenu/TopMenu'; // Импортируем TopMenu
import { CreateSletter, CancelButton, CreateButton } from '../components/Button/Button';
import '../styles/ProfilePage.css';
import { useCurrentUser } from '../hooks/useAuth';

export function ProfilePage() {
  const navigate = useNavigate();
  // Хук состояния для управления модальным окном
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { data: user, isLoading, isError, error, refetch } = useCurrentUser();
  // Открытие модального окна
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
  };

   // Показываем загрузку
  if (isLoading) {
    return (
      <div className="profile-container">
        <TopMenu />
        <div className="profile-card">
          <div className="loading">Загрузка профиля...</div>
        </div>
      </div>
    );
  }

  // Показываем ошибку
  if (isError) {
    return (
      <div className="profile-container">
        <TopMenu />
        <div className="profile-card">
          <div className="error">
            <p>Ошибка загрузки: {error?.message || 'Неизвестная ошибка'}</p>
            <button onClick={() => refetch()}>Повторить</button>
          </div>
        </div>
      </div>
    );
  }

  // Если нет пользователя - редирект на логин
  if (!user) {
    navigate('/login-admin', { replace: true });
    return null;
  }

  return (
    <div className="profile-container">
      {/* Вставляем TopMenu */}
      <TopMenu />

      {/* Карточка с профилем */}
      <div className="profile-card">
        <div className="profile-avatar">
          <i className="fas fa-user-circle"></i>
        </div>
        <div className="profile-info">
          <p className="profile-name">
            {user.login}
          </p>
          <p className="profile-role">Роль: контент-менеджер</p>
        </div>
      </div>

      {/* Кнопка для создания рассылки */}
      <div className="create-newsletter">
        <CreateSletter onClick={openModal} /> {/* Передаем openModal для открытия модалки */}
      </div>

      {/* Модальное окно */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Создание рассылки</h2>
            <form>
              <input type="text" placeholder="Введите название" />
              <input type="text" placeholder="Введите описание" />
              <div className="modal-buttons">
                <CancelButton onClick={closeModal} />
                <CreateButton type="submit"/>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}