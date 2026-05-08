import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import './styles/main.css'

import { router } from './providers/routes';

const root = createRoot(document.getElementById('root')!);

root.render(
  <RouterProvider router={router} />
);