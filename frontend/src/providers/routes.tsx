import { createBrowserRouter } from 'react-router-dom';
import { ChooseRolePage } from '../pages/ChooseRolePage/ChooseRolePage';
import { LoginStudentPage } from '../pages/LoginStudentPage/LoginStudentPage';
import { RegisterAdminPage } from '../pages/admin/admin';
import { ProfilePage } from '../adminNav/ProfilePage';
import { ProfileStudentPage } from '../studentNav/ProfileStudentPage';
import { RegisterStudentPage } from '../pages/RegisterStudentPage/RegisterStudentPage';
import { LoginStudent } from '../pages/LoginStudent/LoginStudent';
import { LentaPage } from '../lentaNav/LentaPage';
import { ChallengesPage } from '../lentaNav/ChallengesPage';
import { KnowledgePage } from '../lentaNav/KnowledgePage';
import { CalendarPage } from '../lentaNav/CalendarPage';
import { TeamProfilePage } from '../studentNav/TeamProfilePage';
import { ProfileTechAdmin } from '../pages/TechAdmin/ProfileTechAdmin';
import { ProtectedRoute } from './ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ChooseRolePage />,
  },
  {
    path: '/login-admin',
    element: <LoginStudentPage />,
  },
  {
    path: '/register-admin',
    element: <RegisterAdminPage />,
  },
  {
    path: '/ProfilePage',
    element: <ProfilePage />,
  },
  {
    path: '/ProfileStudentPage',
    element: (
      <ProtectedRoute>
          <ProfileStudentPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/register-student',
    element: <RegisterStudentPage />,
  },
  {
    path: '/login-student',
    element: <LoginStudent />,
  },
  {
    path: '/lenta',
    element: (
      <ProtectedRoute>
           <LentaPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/challenges',
    element: (
      <ProtectedRoute>
           <ChallengesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/knowledge',
    element: (
      <ProtectedRoute>
           <KnowledgePage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/calendar',
    element:(
      <ProtectedRoute>
          <CalendarPage />
      </ProtectedRoute>
    ),
  },
  { 
    path: '/team-profile', 
    element: <TeamProfilePage /> 
  },
  { 
    path: '/ProfileTechAdmin', 
    element: <ProfileTechAdmin /> 
  },
]);
