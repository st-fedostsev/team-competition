// components/Header/HeaderStudent.tsx
import { useNavigate } from 'react-router-dom';
import { TopMenu } from './HeaderComponent';
import { HEADERS_LIST_STUDENT } from '../../constants';

export function HeaderStudent() {
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
    { label: 'Профиль', path: '/ProfileStudentPage' },
    { label: 'Выйти', onClick: handleLogout }
  ];

  return (
    <TopMenu 
      tabs={HEADERS_LIST_STUDENT} 
      userMenuItems={userMenuItems}
    />
  );
}