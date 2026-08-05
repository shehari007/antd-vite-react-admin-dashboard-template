import { describe, expect, it } from 'vitest';
import { act, renderHook, waitFor } from '@testing-library/react';
import { AuthProvider } from './AuthContext';
import { useAuth } from './useAuth';
import { ROLES } from './auth-context';

const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;

describe('AuthProvider', () => {
  it('signs a known email in with its role', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn({ email: 'editor@vitedash.dev', password: 'anything' });
    });

    await waitFor(() => expect(result.current.isAuthenticated).toBe(true));
    expect(result.current.user.role).toBe(ROLES.EDITOR);
  });

  it('signs an unknown email in as a viewer rather than failing', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn({ email: 'someone@example.com', password: 'x' });
    });

    expect(result.current.user.role).toBe(ROLES.VIEWER);
  });

  it('persists the session so a reload stays signed in', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn({ email: 'admin@vitedash.dev', password: 'x' });
    });

    expect(JSON.parse(localStorage.getItem('dashboard-session')).user.email).toBe(
      'admin@vitedash.dev'
    );
  });

  it('clears the session on sign out', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn({ email: 'admin@vitedash.dev', password: 'x' });
    });
    await act(async () => {
      await result.current.signOut();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('dashboard-session')).toBeNull();
  });
});

describe('hasRole', () => {
  it('allows anything when no role is required', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.hasRole()).toBe(true);
    expect(result.current.hasRole([])).toBe(true);
  });

  it('denies a role the signed in user does not hold', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn({ email: 'viewer@vitedash.dev', password: 'x' });
    });

    expect(result.current.hasRole([ROLES.ADMIN])).toBe(false);
    expect(result.current.hasRole([ROLES.VIEWER])).toBe(true);
  });

  it('accepts a single role as well as a list', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn({ email: 'admin@vitedash.dev', password: 'x' });
    });

    expect(result.current.hasRole(ROLES.ADMIN)).toBe(true);
    expect(result.current.hasRole(ROLES.EDITOR)).toBe(false);
  });
});

describe('lock', () => {
  it('locks and unlocks without dropping the session', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.signIn({ email: 'admin@vitedash.dev', password: 'x' });
    });
    act(() => result.current.lock());

    expect(result.current.locked).toBe(true);
    expect(result.current.isAuthenticated).toBe(true);

    act(() => result.current.unlock());
    expect(result.current.locked).toBe(false);
  });
});
