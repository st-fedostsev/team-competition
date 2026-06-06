import { createBrowserRouter } from 'react-router-dom';
import { ChooseRolePage } from '../pages/Login/ChooseRolePage';
import { LoginAdminPage } from '../pages/Login/LoginAdminPage';
import { ProfileContentManagerPage } from '../pages/Content Manager/Profile/ProfileContentManagerPage';
// import { ProfilePage } from '../pages/Content Manager/Profile/ProfileContentManagerPage';
import { UserRole } from '../types/auth.types';
import { ProfileStudentPage } from '../pages/Student/Profile/ProfileStudentPage';
import { LoginStudent } from '../pages/Login/LoginStudentPage';
import { LentaPage } from '../pages/Student/HeaderNav/Event feed/EventsPage';
import { ChallengesPage } from '../pages/Student/HeaderNav/Event feed/ChallengesPage';
import { KnowledgePage } from '../pages/Student/HeaderNav/KnowledgePage';
import { CalendarPage } from '../pages/Student/HeaderNav/CalendarPage';
import { TeamProfilePage } from '../pages/Student/Profile/ProfileTeam/TeamProfilePage';
import { ProfileTechAdmin } from '../pages/Tech Admin/Profile/ProfileTechAdminPage';
import { ProtectedRoute } from './ProtectedRoute';
import { AnnouncementsPage } from '../pages/Student/HeaderNav/Event feed/NewsPage';
import { RatingPage } from '../pages/Student/HeaderNav/Rating/RatingStudentPage';
import { RatingTeamsPage } from '../pages/Student/HeaderNav/Rating/RatingTeamsPage';
import { UsersPage } from '../pages/Tech Admin/HeaderNav/UsersPage';
import { RatingTechTeamsPage } from '../pages/Tech Admin/HeaderNav/Rating/RatingTechTeamsPage';
import { RatingTechStudentsPage } from '../pages/Tech Admin/HeaderNav/Rating/RatingTechStudentPage';
import { IntegrationsPage } from '../pages/Tech Admin/HeaderNav/IntegrationsPage';
import { NewsContentManagerPage } from '../pages/Content Manager/Profile/HeaderNav/LentaContentManagerPage';
import { ModerationPage } from '../pages/Content Manager/Profile/HeaderNav/ModerationPage';
import { ProfileGameAdminPage } from '../pages/GameAdmin/Profile/ProfileGameAdminPage';
import { TeamsGameAdminPage } from '../pages/GameAdmin/Profile/HeaderNav/TeamsGameAdminPage';
import { RatingGameAdminPage, RatingGameAdminTeamsPage } from '../pages/GameAdmin/Profile/HeaderNav/RatimgGameAdminPage';
import { MyKnowledgeAnnouncementsPage } from '../pages/Student/HeaderNav/MyKnowledgeAnnouncementsPage';
import { KnowledgeResponsesPage } from '../pages/Student/HeaderNav/KnowledgeResponsesPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ChooseRolePage />,
  },
  {
    path: '/login-admin',
    element: <LoginAdminPage />,
  },
  {
    path: '/ProfileContentManager',
    element: (
      <ProtectedRoute>
        <ProfileContentManagerPage />
      </ProtectedRoute>
    ),
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
    path: '/ContentManager/lenta',
    element: (
      <ProtectedRoute>
           <NewsContentManagerPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/moderation',
    element: (
      <ProtectedRoute>
           <ModerationPage />
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
  element: (
    <ProtectedRoute allowedRoles={[UserRole.STUDENT]}>
      <RatingPage />
    </ProtectedRoute>
  ),
  },
  {
    path: '/rating/teams',
    element: (
      <ProtectedRoute>
          <RatingTeamsPage />
      </ProtectedRoute>
    ),
  }, 
  {
    path: '/admin/users',
    element: <UsersPage />
  },
  {
    path: '/admin/rating/teams',
    element: <RatingTechTeamsPage />
  },
  {
    path: '/admin/rating/students',
    element: <RatingTechStudentsPage  />
  },
  {
    path: '/admin/integrations',
    element: <IntegrationsPage />
  },
  {
    path: '/game-admin/teams',
    element: (
      <ProtectedRoute>
        <TeamsGameAdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/ProfileGameAdminPage',
    element: (
      <ProtectedRoute>
        <ProfileGameAdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/game-admin/rating',
    element: (
      <ProtectedRoute>
        <RatingGameAdminPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/game-admin/rating/teams',
    element: (
      <ProtectedRoute>
        <RatingGameAdminTeamsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/knowledge/my',
    element: (
      <ProtectedRoute>
        <MyKnowledgeAnnouncementsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: '/knowledge/responses',
    element: (
      <ProtectedRoute>
        <KnowledgeResponsesPage />
      </ProtectedRoute>
    ),
  },
]);
