import { createBrowserRouter } from 'react-router';


import { ChooseRolePage } from '../pages/ChooseRolePage/ChooseRolePage';
import { LoginStudentPage } from '../pages/LoginStudentPage/LoginStudentPage';
import { RegisterAdminPage } from '../pages/admin/admin'
import { ProfilePage } from '../adminNav/ProfilePage'
import { ProfileStudentPage } from '../studentNav/ProfileStudentPage'
import { RegisterStudentPage } from '../pages/RegisterStudentPage/RegisterStudentPage';
import { LoginStudent } from '../pages/LoginStudent/LoginStudent';

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
    element: <ProfileStudentPage />,
  },
  {
    path: '/register-student',
    element: <RegisterStudentPage />,
  },
    {
    path: '/login-student',
    element: <LoginStudent />,
  },
]);