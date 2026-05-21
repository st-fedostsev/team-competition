// index.tsx
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryProvider } from './providers/QueryProvider';
import { router } from './providers/routes';
import './styles/main.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <QueryProvider>
    <RouterProvider router={router} />
  </QueryProvider>
);