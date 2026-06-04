// pages/LoginAdminPage/LoginAdminPage.tsx
import { useState, type FormEvent } from 'react';
import { useAdminLogin } from '../../hooks/useAuth';
import { LoginButton } from '../../components/Buttons';
import { EyeIcon } from '../../components/EyeIcon';
import { EyeClosedIcon } from '../../components/EyeClosedIcon';
import '../../styles/LoginStudentPage.css';
import '../../styles/input.css';


export function LoginAdminPage() {
  const [loginValue, setLoginValue] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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

  const handleSubmit = (e: FormEvent) => {
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

        <form
          onSubmit={handleSubmit}
          style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
        >
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

              <div className="password-input-wrapper">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  placeholder="Введите пароль"
                  className={`input-text input password-input ${errors.password ? 'error' : ''}`}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({ ...errors, password: '' });
                  }}
                  disabled={isPending}
                  required
                />

                <button
                  type="button"
                  className="password-eye-button"
                  onClick={() => setIsPasswordVisible((prev) => !prev)}
                  disabled={isPending}
                  aria-label={isPasswordVisible ? 'Скрыть пароль' : 'Показать пароль'}
                >
                  {isPasswordVisible ? <EyeIcon /> : <EyeClosedIcon />}
                </button>
              </div>

            {errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          {apiError && (
            <div className="error-message api-error">
              {apiError.message || 'Ошибка входа. Проверьте логин и пароль'}
            </div>
          )}

          <div
            className="login-student-buttons"
            style={{ display: 'flex', marginTop: 'auto', paddingBottom: '10%' }}
          >
            <LoginButton disabled={isPending} />
          </div>
        </form>
      </div>
    </div>
  );
}