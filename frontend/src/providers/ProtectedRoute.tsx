// guards/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useAuth';
import { UserRole } from '../types/auth.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { data: user, isLoading } = useCurrentUser();
  
  if (isLoading) {
    return <div>Загрузка...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login-student" replace />;
  }
  
  // Преобразуем строку в enum
  const userRole = user.role as UserRole;
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}