import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HeaderStudent } from '../../../components/Header/HeaderStudent';
import { NavStudent } from '../../../components/Nav/NavStudent';
import { NameButton } from '../../../components/Buttons';
import { SearchTeamModal } from '../../../components/SearchTeamModal';
import { Modal } from '../../../components/ModalWindowComponent';
import { useCurrentUser } from '../../../hooks/useAuth';
import { useJoinTeam } from '../../../hooks/useTeam';
import '../../../styles/ProfilePage.css';

export function ProfileStudentPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearchTeamOpen, setIsSearchTeamOpen] = useState(false);
  
  // Получаем данные пользователя
  const { data: user, isLoading, isError, error, refetch } = useCurrentUser();
  const { mutate: joinTeam, isPending: isJoining } = useJoinTeam();

  // Проверяем наличие secret_code в URL
  const codeFromUrl = searchParams.get('code');
  const isJoinModalOpen = !!codeFromUrl && !user?.team_id;

  const handleJoinTeam = () => {
    if (!codeFromUrl) return;
    
    joinTeam(
      { secret_code: codeFromUrl },
      {
        onSuccess: () => {
          setSearchParams({});
          refetch();
        },
      }
    );
  };

  const handleCancelJoin = () => {
    setSearchParams({});
  };

  // Показываем загрузку
  if (isLoading) {
    return (
      <div className="profile-container">
        <HeaderStudent/>
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
        <HeaderStudent/>
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
      <HeaderStudent/>

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

      {/* Модальное окно подтверждения вступления по ссылке */}
      {isJoinModalOpen && (
        <Modal closeModal={handleCancelJoin}>
          <div className="join-team-modal-body">
            <h2>Вступление в команду</h2>
            <p>Вы хотите вступить в команду?</p>
            <div className="join-team-modal-buttons">
              <button 
                className="cancel-join-btn" 
                onClick={handleCancelJoin}
              >
                Отмена
              </button>
              <button 
                className="confirm-join-btn" 
                onClick={handleJoinTeam}
                disabled={isJoining}
              >
                {isJoining ? 'Вступление...' : 'Вступить'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}