import { createBrowserRouter } from 'react-router';


import { ChooseRolePage } from '../pages/ChooseRolePage/ChooseRolePage';
import { LoginStudentPage } from '../pages/LoginStudentPage/LoginStudentPage';
import { RegisterAdminPage } from '../pages/admin/admin'
import { ProfilePage } from '../adminNav/ProfilePage'

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
  }
]);