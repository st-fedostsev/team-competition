// pages/LoginAdminPage/LoginAdminPage.tsx
import { useState } from 'react';
import { useAdminLogin } from '../../hooks/useAuth';
import { LoginButton } from '../../components/Buttons';
import '../../styles/LoginStudentPage.css';
import '../../styles/input.css';

export function LoginAdminPage() {
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ login: '', password: '' });
  
  const { mutate: adminLogin, isPending, error: apiError } = useAdminLogin();

  const validateForm = () => {
    const newErrors = { login: '', password: '' };
    let isValid = true;

    if (!loginValue.trim()) {
      newErrors.login = 'Введите логин';
      isValid = false;
    }

    if (!password.trim()) {
      newErrors.password = 'Введите пароль';
      isValid = false;
    } else if (password.length < 3) {
      newErrors.password = 'Пароль должен содержать минимум 3 символа';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    adminLogin({
      login: loginValue,
      password: password,
    });
  };

  return (
    <div className="login-student-page">
      <div className="login-student-card">
        <h1 className="login-student-title">Вход</h1>
        
         <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
          <div className="admin-inputs">
            <input
              type="text"
              placeholder="Введите логин"
              className={`input-text input ${errors.login ? 'error' : ''}`}
              value={loginValue}
              onChange={(e) => {
                setLoginValue(e.target.value);
                if (errors.login) setErrors({ ...errors, login: '' });
              }}
              disabled={isPending}
              required
            />
            {errors.login && (
              <span className="error-message">{errors.login}</span>
            )}
            
            <input
              type="password"
              placeholder="Введите пароль"
              className={`input-text input ${errors.password ? 'error' : ''}`}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              disabled={isPending}
              required
            />
            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {apiError && (
            <div className="error-message api-error">
              {apiError.message || 'Ошибка входа. Проверьте логин и пароль'}
            </div>
          )}
          
          <div className="login-student-buttons" style={{ display: 'flex', marginTop: 'auto', paddingBottom: '10%' }}>
            <LoginButton 
              onClick={() => handleSubmit}
              disabled={isPending}
            />
          </div>
        </form>
      </div>
    </div>
  );
}