import { useNavigate } from 'react-router-dom';
import { StudentButton, AdminButton } from '../../components/Buttons';
import '../../styles/ChooseRolePage.css';

export function ChooseRolePage() {
  const navigate = useNavigate();

  return (
    <div className="choose-role-page">
      <div className="choose-role-card">
        <h1 className="choose-role-title">Войти как</h1>

        <div className="choose-role-buttons">
          <StudentButton onClick={() => navigate('/login-student')} />
          <AdminButton onClick={() => navigate('/login-admin')} />
        </div>
      </div>
    </div>
  );
}