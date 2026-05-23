import { useNavigate, useLocation } from 'react-router-dom';
import '../../styles/NavLenta.css';


interface TabProps {
  label: string;
  path: string;
}

export function NavLenta(props: { tabs: TabProps[] }) {
  const navigate = useNavigate();
  const location = useLocation();



  return (
    <div className="nav-lenta-tabs">
      {props.tabs.map((tab) => (
        <button
          key={tab.path}
          className={`nav-lenta-tab ${location.pathname === tab.path ? 'active' : ''}`}
          onClick={() => navigate(tab.path)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
