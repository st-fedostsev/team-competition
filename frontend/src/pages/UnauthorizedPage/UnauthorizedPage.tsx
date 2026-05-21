// pages/UnauthorizedPage/UnauthorizedPage.tsx
import { Link } from 'react-router-dom';

export function UnauthorizedPage() {
  return (
    <div className="unauthorized-page">
      <h1>403 - Доступ запрещен</h1>
      <p>У вас нет прав для доступа к этой странице.</p>
      <Link to="/">Вернуться на главную</Link>
    </div>
  );
}