// pages/LoginStudent/LoginStudent.tsx
import { useState } from 'react';
import { useStudentLogin } from '../../hooks/useAuth';
import '../../styles/LoginStudentPage.css';
import '../../styles/input.css';

export function LoginStudent() {
  const [fullName, setFullName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [errors, setErrors] = useState({ fullName: '', studentId: '' });
  
  // Хук для входа
  const { mutate: login, isPending, error: apiError } = useStudentLogin();

  // Валидация формы
  const validateForm = () => {
    const newErrors = { fullName: '', studentId: '' };
    let isValid = true;

    if (!fullName.trim()) {
      newErrors.fullName = 'Введите ФИО';
      isValid = false;
    } else if (fullName.trim().split(' ').length < 2) {
      newErrors.fullName = 'Введите имя и фамилию';
      isValid = false;
    }

    if (!studentId.trim()) {
      newErrors.studentId = 'Введите номер студенческого';
      isValid = false;
    } else if (!/^\d+$/.test(studentId.trim())) {
      newErrors.studentId = 'Только цифры';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Разделяем ФИО на фамилию и имя
  const parseFullName = (name: string) => {
    const parts = name.trim().split(' ');
    return {
      last_name: parts[0] || '',
      first_name: parts[1] || '',
    };
  };

  // Обработчик отправки
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const { last_name, first_name } = parseFullName(fullName);
    
    login({
      last_name,
      first_name,
      student_id: Number(studentId),
    });
  };

  return (
    <div className="login-student-page">
      <div className="login-student-card">
        <h1 className="login-student-title">Вход</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="admin-inputs">
            <input
              type="text"
              placeholder="Введите ФИО"
              className={`input-text input ${errors.fullName ? 'error' : ''}`}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (errors.fullName) setErrors({ ...errors, fullName: '' });
              }}
              disabled={isPending}
              required
            />
            {errors.fullName && (
              <span className="error-message">{errors.fullName}</span>
            )}
            
            <input
              type="text"
              placeholder="Введите номер студенческого"
              className={`input-text input ${errors.studentId ? 'error' : ''}`}
              value={studentId}
              onChange={(e) => {
                setStudentId(e.target.value);
                if (errors.studentId) setErrors({ ...errors, studentId: '' });
              }}
              disabled={isPending}
              required
            />
            {errors.studentId && (
              <span className="error-message">{errors.studentId}</span>
            )}
          </div>

          {apiError && (
            <div className="error-message api-error">
              {apiError.message || 'Ошибка входа. Проверьте данные'}
            </div>
          )}

          <div className="login-student-buttons">
            <button 
              type="submit"
              className="login-button"
              disabled={isPending}
            >
              {isPending ? 'Вход...' : 'Войти'}
            </button>
          </div>
        </form>

        <p className="login-link">
          Нет аккаунта? <a href="/register-admin">Зарегистрироваться</a>
        </p>
      </div>
    </div>
  );
}