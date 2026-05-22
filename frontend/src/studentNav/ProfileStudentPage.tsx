import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopMenu } from '../components/TopMenu/TopMenu';
import { NavStudent } from '../components/NavStudent/NavStudent';
import { NameButton } from '../components/Button/Button';
import { SearchTeamModal } from './SearchTeamModal';
import { useCurrentUser } from '../hooks/useAuth';
import '../styles/ProfilePage.css';

export function ProfileStudentPage() {
  const navigate = useNavigate();
  const [isSearchTeamOpen, setIsSearchTeamOpen] = useState(false);
  
  // Получаем данные пользователя из React Query (с кешированием)
  const { data: user, isLoading, isError, error, refetch } = useCurrentUser();


   // Хук для выхода
   // Временно закомментировано, пока нет кнопки выхода
  //   const { mutate: logout, isPending: isLoggingOut } = useLogout();
  //  Обработчик для выхода
  //   const handleLogout = () => {
  //   if (confirm('Вы уверены, что хотите выйти?')) {
  //     logout();
  //   }
  // };


  // Показываем загрузку
  if (isLoading) {
    return (
      <div className="profile-container">
        <TopMenu />
        <div className="profile-card">
          <div className="loading">Загрузка профиля...</div>
        </div>
        <NavStudent />
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
        <NavStudent />
      </div>
    );
  }

  // Если нет пользователя
  if (!user) {
    navigate('/login-student', { replace: true });
    return null;
  }

  return (
    <div className="profile-container">
      <TopMenu />

      {/* Карточка профиля с реальными данными */}
      <div className="profile-card">
        <div className="profile-avatar">
          <i className="fas fa-user-circle"></i>
        </div>
        <div className="profile-info">
          {/* данные из API */}
          <p className="profile-name">
            {user.last_name} {user.first_name}
          </p>
          <p className="profile-role">
            Студенческий билет № {user.student_id}
          </p>
          
          <div className="name-button">
            <span className="team-label">Команда:</span>
            <NameButton onClick={() => setIsSearchTeamOpen(true)} />
          </div>
        </div>
      </div>

      <NavStudent />

      {/* Модальное окно поиска команды */}
      {isSearchTeamOpen && (
        <SearchTeamModal closeModal={() => setIsSearchTeamOpen(false)} />
      )}
    </div>
  );
}