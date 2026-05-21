import { useState } from 'react';
import { TopMenu } from '../components/TopMenu/TopMenu'; // Импортируем TopMenu
import { CreateSletter, CancelButton, CreateButton } from '../components/Button/Button';
import '../styles/ProfilePage.css';

export function ProfilePage() {
  // Хук состояния для управления модальным окном
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Открытие модального окна
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Закрытие модального окна
  const closeModal = () => {
    setIsModalOpen(false);
  };

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
          <p className="profile-name">Логин?</p>
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