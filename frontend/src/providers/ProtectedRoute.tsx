// ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useAuth';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { data: user, isLoading } = useCurrentUser();
  
  if (isLoading) {
    return <div>Загрузка...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login-student" replace />;
  }
  
  return <>{children}</>;
}