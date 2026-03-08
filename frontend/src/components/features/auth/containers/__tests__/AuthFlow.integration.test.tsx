import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { http, HttpResponse } from 'msw';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { AuthProvider } from '@/context/AuthContext';
import { PublicRoute, ProtectedRoute } from '@/components/common';
import LoginPage from '@/pages/LoginPage';
import { server } from '@/test/server';

function PrivatePage() {
  return <h1>Private Home</h1>;
}

function appRouter(initialEntries: string[]) {
  return createMemoryRouter(
    [
      {
        path: '/',
        element: <ProtectedRoute />,
        children: [{ index: true, element: <PrivatePage /> }],
      },
      {
        element: <PublicRoute />,
        children: [{ path: '/login', element: <LoginPage /> }],
      },
    ],
    { initialEntries },
  );
}

// describe('Auth flow integration', () => {
//   it('redirects unauthenticated user to login', async () => {
//     localStorage.clear();

//     const router = appRouter(['/']);

//     render(
//       <AuthProvider>
//         <RouterProvider router={router} />
//       </AuthProvider>,
//     );

//     expect(
//       await screen.findByRole('heading', { name: 'Welcome back' }),
//     ).toBeInTheDocument();
//   });

//   it('logs in and reaches protected page', async () => {
//     localStorage.clear();

//     server.use(
//       http.post('/api/auth/refresh', () =>
//         HttpResponse.json({ message: 'unauthorized' }, { status: 401 }),
//       ),
//       http.post('/api/auth/login', () =>
//         HttpResponse.json({
//           token: 'access-token',
//           refreshToken: 'refresh-token',
//           email: 'user@amalitech.com',
//           name: 'Test User',
//           role: 'USER',
//         }),
//       ),
//     );

//     const router = appRouter(['/login']);

//     render(
//       <AuthProvider>
//         <RouterProvider router={router} />
//       </AuthProvider>,
//     );

//     await userEvent.type(
//       screen.getByPlaceholderText('your@example.com'),
//       'user@amalitech.com',
//     );
//     await userEvent.type(
//       screen.getByPlaceholderText('Enter password'),
//       'Password1!',
//     );
//     await userEvent.click(screen.getByRole('button', { name: 'Log In' }));

//     await waitFor(() => {
//       expect(screen.getByText('Private Home')).toBeInTheDocument();
//     });
//   });
// });

describe('Auth flow integration', () => {
  beforeEach(() => {
    localStorage.clear();

    // Handle refresh for every test to avoid MSW unhandled rejection
    server.use(
      http.post('/api/auth/refresh', () =>
        HttpResponse.json({ message: 'unauthorized' }, { status: 401 }),
      ),
    );
  });

  it('redirects unauthenticated user to login', async () => {
    const router = appRouter(['/']);

    render(
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>,
    );

    expect(
      await screen.findByRole('heading', { name: 'Welcome back' }),
    ).toBeInTheDocument();
  });

  it('logs in and reaches protected page', async () => {
    server.use(
      http.post('/api/auth/login', () =>
        HttpResponse.json({
          token: 'access-token',
          refreshToken: 'refresh-token',
          email: 'user@amalitech.com',
          name: 'Test User',
          role: 'USER',
        }),
      ),
    );

    const router = appRouter(['/login']);

    render(
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>,
    );

    // Wait until login form is actually on screen
    await screen.findByRole('heading', { name: 'Welcome back' });

    await userEvent.type(
      screen.getByPlaceholderText('your@example.com'),
      'user@amalitech.com',
    );
    await userEvent.type(
      screen.getByPlaceholderText('Enter password'),
      'Password1!',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Log In' }));

    await waitFor(() => {
      expect(screen.getByText('Private Home')).toBeInTheDocument();
    });
  });
});
