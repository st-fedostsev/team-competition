import { createBrowserRouter } from 'react-router-dom';
import { ChooseRolePage } from '../pages/Login/ChooseRolePage';
import { LoginAdminPage } from '../pages/Login/LoginAdminPage';
// import { ProfilePage } from '../pages/Content Manager/Profile/ProfileContentManagerPage';
import { ProfileStudentPage } from '../pages/Student/Profile/ProfileStudentPage';
import { LoginStudent } from '../pages/Login/LoginStudentPage';
import { LentaPage } from '../pages/Student/HeaderNav/Event feed/EventsPage';
import { ChallengesPage } from '../pages/Student/HeaderNav/Event feed/ChallengesPage';
import { KnowledgePage } from '../pages/Student/HeaderNav/KnowledgePage';
import { CalendarPage } from '../pages/Student/HeaderNav/CalendarPage';
import { TeamProfilePage } from '../pages/Student/Profile/ProfileTeam/TeamProfilePage';
import { ProfileTechAdmin } from '../pages/Tech Admin/Profile/ProfileTechAdminPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AnnouncementsPage } from '../pages/Student/HeaderNav/Event feed/AnnouncementsPage';
import { RatingPage } from '../pages/Student/HeaderNav/RatingPage';
import { RatingTeamsPage } from '../pages/Student/HeaderNav/Event feed/RatingTeamsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ChooseRolePage />,
  },
  {
    path: '/login-admin',
    element: <LoginAdminPage />,
  },
  // {
  //   path: '/ProfilePage',
  //   element: <ProfilePage />,
  // },
  {
    path: '/ProfileStudentPage',
    element: (
      <ProtectedRoute>
          <ProfileStudentPage />
      </ProtectedRoute>
    ),
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
    path: '/announcements',
    element: (
      <ProtectedRoute>
           <AnnouncementsPage />
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
  {
  path: '/rating',
  element: <RatingPage />,
  },
  {
    path: '/rating/teams',
    element: (
      <ProtectedRoute>
          <RatingTeamsPage />
      </ProtectedRoute>
    ),
  }, 
]);
