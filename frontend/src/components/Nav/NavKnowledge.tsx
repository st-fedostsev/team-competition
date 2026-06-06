import { NavLink } from 'react-router-dom';
import { KNOWLEDGE_TABS } from '../../constants';
import '../../styles/NavLenta.css';

export function NavKnowledge() {
  return (
    <div className="nav-lenta-tabs">
      {KNOWLEDGE_TABS.map((tab) => (
        <NavLink
          key={tab.value}
          to={tab.path}
          end={tab.path === '/knowledge'}
          className={({ isActive }) =>
            `nav-lenta-tab ${isActive ? 'active' : ''}`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </div>
  );
}