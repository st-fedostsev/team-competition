// components/Header/HeaderTechAdmin.tsx
import { TopMenu } from './HeaderComponent';
import { HEADERS_LIST_TECH_ADMIN } from '../../constants';

// Компонент-обертка
export function HeaderTechAdmin() {
  return <TopMenu tabs={HEADERS_LIST_TECH_ADMIN} />;
}

