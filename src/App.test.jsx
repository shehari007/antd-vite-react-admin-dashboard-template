import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';
import { ThemeModeProvider } from '@/context/ThemeModeContext';
import { AuthProvider } from '@/context/AuthContext';

/**
 * The smoke test.
 *
 * Unit tests cannot catch a bad import path, a component that was renamed but
 * not updated in the route table, or a provider left out of the stack. This one
 * boots the whole app the way main.jsx does and waits for a real page to
 * appear, so any of those fails here rather than in someone's browser.
 */
const renderApp = () =>
  render(
    <ThemeModeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeModeProvider>
  );

describe('App', () => {
  it('boots, redirects to the dashboard, and lazy loads the home page', async () => {
    renderApp();

    // The router starts at "/" and redirects to /dashboard/home, which is a
    // lazy chunk, so the shell paints before the page does.
    await waitFor(
      () => {
        expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument();
      },
      { timeout: 5000 }
    );
  });

  it('renders the sidebar navigation from the translation files', async () => {
    renderApp();

    await waitFor(() => expect(screen.getAllByText('Dashboard').length).toBeGreaterThan(0));

    // Section labels and group titles are always in the DOM. Their children are
    // not: only the group owning the current route is expanded, which is why
    // this checks for "Management" rather than "Products".
    expect(screen.getByText('Workspace')).toBeInTheDocument();
    expect(screen.getByText('Management')).toBeInTheDocument();
    expect(screen.getByText('Page Library')).toBeInTheDocument();
  });

  it('shows the account card for the demo user', async () => {
    renderApp();

    await waitFor(() => expect(screen.getAllByText('Sheharyar Butt').length).toBeGreaterThan(0));
  });
});
