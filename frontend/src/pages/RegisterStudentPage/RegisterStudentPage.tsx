import { useNavigate } from 'react-router';
import { RegisterButton } from '../../components/Button/Button';
import '../../styles/AdminPage.css';
import '../../styles/input.css';

export function RegisterStudentPage() {
  const navigate = useNavigate();

  return (
    <div className="admin-page">
      <div className="admin-card">
        <h1 className="admin-title">Регистрация</h1>
        <div className='admin-inputs'>
            <input
            type="text"
            placeholder="Введите ФИО"
            className="input-text input"
            required
          />
          <input
            type="text"
            placeholder="Введите номер студенческого"
            className="input-text input"
            required
          />
        </div>

        <div className="admin-buttons">
            <RegisterButton onClick={() => navigate('/login-student')} />
        </div>

        <p className="login-link">
          Уже есть аккаунт? <a href="/login-student">Войти</a>
        </p>
      </div>
    </div>
  );
}

