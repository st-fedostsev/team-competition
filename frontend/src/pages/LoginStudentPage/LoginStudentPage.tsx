import { useNavigate } from 'react-router-dom';
import { LoginButton } from '../../components/Button/Button';
import '../../styles/LoginStudentPage.css';
import '../../styles/input.css';

export function LoginStudentPage() {
  const navigate = useNavigate();

  return (
    <div className="login-student-page">
      <div className="login-student-card">
        <h1 className="login-student-title">Вход</h1>
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

        <div className="login-student-buttons">
            <LoginButton onClick={() => navigate('/ProfilePage')} />
        </div>

        <p className="login-link">
          Уже есть аккаунт? <a href="/register-admin">Зарегистрироваться</a>
        </p>
      </div>
    </div>
  );
}

