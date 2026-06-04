// components/Header/HeaderGameAdmin.tsx
import { useNavigate } from 'react-router-dom';
import { TopMenu } from './HeaderComponent';
import { HEADERS_LIST_GAME_ADMIN } from '../../constants';

export function HeaderGameAdmin() {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (confirm('Вы уверены, что хотите выйти?')) {
      // Очищаем localStorage
      localStorage.clear();
      // Редирект на главную
      navigate('/');
    }
  };

  const userMenuItems = [
    { label: 'Профиль', path: '/ProfileGameAdminPage' },
    { label: 'Настройки', path: '/game-admin/settings' },
    { label: 'Выйти', onClick: handleLogout }
  ];

  return (
    <TopMenu 
      tabs={HEADERS_LIST_GAME_ADMIN} 
      userMenuItems={userMenuItems}
    />
  );
}