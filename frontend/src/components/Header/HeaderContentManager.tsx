// components/Header/HeaderContentManager.tsx
import { useNavigate } from 'react-router-dom';
import { TopMenu } from './HeaderComponent';
import { HEADERS_LIST_CONTENT_MANAGER } from '../../constants';

export function HeaderContentManager() {
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
    { label: 'Профиль', path: '/tech-admin/profile' },
    { label: 'Настройки', path: '/tech-admin/settings' },
    { label: 'Выйти', onClick: handleLogout }
  ];

  return (
    <TopMenu 
      tabs={HEADERS_LIST_CONTENT_MANAGER} 
      userMenuItems={userMenuItems}
    />
  );
}