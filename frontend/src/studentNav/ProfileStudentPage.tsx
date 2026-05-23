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
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <circle cx="28" cy="28" r="27" stroke="#ccc" strokeWidth="1.5" />
            <circle cx="28" cy="22" r="9" stroke="#ccc" strokeWidth="1.5" />
            <path d="M8 50c0-11 9-20 20-20s20 9 20 20" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
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

      {isSearchTeamOpen && (
        <SearchTeamModal closeModal={() => setIsSearchTeamOpen(false)} />
      )}
    </div>
  );
}