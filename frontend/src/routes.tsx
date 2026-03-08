import { PublicRoute, ProtectedRoute } from '@/components/common';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';

function HomePage() {
  return <div>Home</div>;
}

export const routes = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    element: <PublicRoute />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    path: '*',
    element: <div>404</div>,
  },
];
