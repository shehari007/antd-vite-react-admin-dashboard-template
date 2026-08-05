import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeModeProvider } from '@/context/ThemeModeContext';
import { AuthProvider } from '@/context/AuthContext';

/**
 * Render a component with everything the app normally provides.
 *
 * MemoryRouter rather than BrowserRouter, because tests need to start on a
 * given route and jsdom has no address bar to set one from.
 *
 *   renderWithProviders(<LayoutFooter />, { route: '/dashboard/home' });
 */
export const renderWithProviders = (ui, { route = '/dashboard/home', ...options } = {}) =>
  render(ui, {
    wrapper: ({ children }) => (
      <MemoryRouter initialEntries={[route]}>
        <ThemeModeProvider>
          <AuthProvider>{children}</AuthProvider>
        </ThemeModeProvider>
      </MemoryRouter>
    ),
    ...options,
  });
