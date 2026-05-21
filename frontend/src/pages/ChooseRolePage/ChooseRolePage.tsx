import { useNavigate } from 'react-router-dom';
import { StudentButton, AdminButton } from '../../components/Button/Button';
import '../../styles/ChooseRolePage.css';

export function ChooseRolePage() {
  const navigate = useNavigate();

  return (
    <div className="choose-role-page">
      <div className="choose-role-card">
        <h1 className="choose-role-title">Войти как</h1>

        <div className="choose-role-buttons">
          <StudentButton onClick={() => navigate('/register-student')} />
          <AdminButton onClick={() => navigate('/register-admin')} />
        </div>
      </div>
    </div>
  );
}