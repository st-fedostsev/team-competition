import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { HeaderStudent } from '../../../components/Header/HeaderStudent';
import { NavStudent } from '../../../components/Nav/NavStudent';
import { NameButton } from '../../../components/Buttons';
import { SearchTeamModal } from '../../../components/SearchTeamModal';
import { Modal } from '../../../components/ModalWindowComponent';
import { useCurrentUser } from '../../../hooks/useAuth';
import { useJoinTeam } from '../../../hooks/useTeam';
import { CancelButton } from '../../../components/Buttons';
import { JoinButton } from '../../../components/Buttons';
import { EyeIcon } from '../../../components/EyeIcon';
import { EyeClosedIcon } from '../../../components/EyeClosedIcon';
import '../../../styles/ProfilePage.css';

export function ProfileStudentPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isSearchTeamOpen, setIsSearchTeamOpen] = useState(false);
  const [isStudentIdVisible, setIsStudentIdVisible] = useState(false);
  
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
      <div className="profile-content">
        <div className="profile-card">
          <div className="profile-avatar">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
              <defs><clipPath id="avatarClip"><circle cx="28" cy="28" r="26" /></clipPath></defs>
              <g clipPath="url(#avatarClip)"><circle cx="28" cy="22" r="8" stroke="#3B3B3B" strokeWidth="1.5" /><path d="M8 50c0-11 9-20 20-20s20 9 20 20" stroke="#3B3B3B" strokeWidth="1.5" strokeLinecap="round" /></g>
              <circle cx="28" cy="28" r="27" stroke="#3B3B3B" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="profile-info">
            {/* данные из API */}
            <p className="profile-name">
              {user.last_name} {user.first_name}
            </p>
            <div className="profile-role profile-student-id">
              <span>
                Студенческий билет № {isStudentIdVisible ? user.student_id : '••••••'}
              </span>

              <button
                type="button"
                className="student-id-eye-button"
                onClick={() => setIsStudentIdVisible((prev) => !prev)}
                aria-label={isStudentIdVisible ? 'Скрыть номер студенческого билета' : 'Показать номер студенческого билета'}
              >
                {isStudentIdVisible ? <EyeIcon /> : <EyeClosedIcon />}
              </button>
            </div>
            
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
              <h2>
                Вступить в команду <span>Название?</span>
              </h2>

              <div className="join-team-avatar">
                <svg width="86" height="86" viewBox="0 0 86 86" fill="none">
                  <defs><clipPath id="joinTeamAvatarClip"><circle cx="43" cy="43" r="40" /></clipPath></defs>
                  <g clipPath="url(#joinTeamAvatarClip)"><circle cx="43" cy="31" r="12" stroke="#3B3B3B" strokeWidth="1.5" /><path d="M15 75c0-16 12.5-28 28-28s28 12 28 28" stroke="#3B3B3B" strokeWidth="1.5" strokeLinecap="round" /></g><circle cx="43" cy="43" r="40" stroke="#3B3B3B" strokeWidth="1.5" />
                </svg>
              </div>
              <div className='h1'>
                3 участника
              </div>
              <div className="join-team-modal-buttons">
                <CancelButton onClick={handleCancelJoin} />

                <JoinButton
                  onClick={handleJoinTeam}
                  disabled={isJoining}
                >
                  {isJoining ? 'Вступление...' : 'Вступить'}
                </JoinButton>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
}