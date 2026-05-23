// components/Header/HeaderStudent.tsx
import { TopMenu } from './HeaderComponent';
import { HEADERS_LIST_STUDENT } from '../../constants';

// Компонент-обертка
export function HeaderStudent() {
  return <TopMenu tabs={HEADERS_LIST_STUDENT} />;
}

