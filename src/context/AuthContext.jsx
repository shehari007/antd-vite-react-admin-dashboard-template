import { useCallback, useMemo, useState } from 'react';
import { AuthContext, DEMO_USERS } from './auth-context';
import * as authService from '@/services/authService';
import { REQUIRE_AUTH } from '@/config/appInfo';

const SESSION_KEY = 'dashboard-session';
const LOCK_KEY = 'dashboard-locked';

/**
 * Session storage note for when you make this real.
 *
 * localStorage is readable by any script on the page, so a token kept here is
 * exposed to a cross site scripting bug. It is fine for a template with a fake
 * token, and the safer production shape is an httpOnly cookie set by your
 * backend, with this provider holding only the user profile.
 */
const readSession = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(SESSION_KEY) || 'null');
    return stored?.user ? stored : null;
  } catch {
    return null;
  }
};

const writeSession = (session) => {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch {
    /* private browsing, the session simply will not survive a reload */
  }
};

const readLocked = () => {
  try {
    return localStorage.getItem(LOCK_KEY) === 'true';
  } catch {
    return false;
  }
};

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(readSession);
  const [locked, setLocked] = useState(readLocked);
  const [pending, setPending] = useState(false);

  const persist = useCallback((next) => {
    setSession(next);
    writeSession(next);
  }, []);

  const setLockedState = useCallback((value) => {
    setLocked(value);
    try {
      if (value) localStorage.setItem(LOCK_KEY, 'true');
      else localStorage.removeItem(LOCK_KEY);
    } catch {
      /* nothing to do, the lock just will not survive a reload */
    }
  }, []);

  const signIn = useCallback(
    async (values) => {
      setPending(true);
      try {
        const result = await authService.signIn(values);
        persist(result);
        setLockedState(false);
        return result.user;
      } finally {
        setPending(false);
      }
    },
    [persist, setLockedState]
  );

  const signUp = useCallback(
    async (values) => {
      setPending(true);
      try {
        const result = await authService.signUp(values);
        persist(result);
        setLockedState(false);
        return result.user;
      } finally {
        setPending(false);
      }
    },
    [persist, setLockedState]
  );

  const signOut = useCallback(async () => {
    await authService.signOut();
    persist(null);
    setLockedState(false);
  }, [persist, setLockedState]);

  const value = useMemo(() => {
    const signedInUser = session?.user || null;
    /**
     * With VITE_REQUIRE_AUTH off the template is a public demo, so an anonymous
     * visitor is shown as the demo administrator. That is what keeps every page
     * browsable, including the role gated ones, without a sign in step.
     *
     * Turn the flag on and this fallback disappears: `user` is null until
     * someone actually signs in, and DashboardLayout redirects to /signin.
     */
    const user = signedInUser || (REQUIRE_AUTH ? null : DEMO_USERS[0]);

    return {
      user,
      token: session?.token || null,
      isAuthenticated: Boolean(signedInUser),
      isDemoUser: !signedInUser && Boolean(user),
      isPending: pending,
      locked,
      signIn,
      signUp,
      signOut,
      lock: () => setLockedState(true),
      unlock: () => setLockedState(false),
      /**
       * Accepts a single role or a list. No argument means "any signed in
       * user", which is how unguarded routes ask the question.
       */
      hasRole: (roles) => {
        if (!roles || (Array.isArray(roles) && roles.length === 0)) return true;
        if (!user) return false;
        return Array.isArray(roles) ? roles.includes(user.role) : user.role === roles;
      },
    };
  }, [session, pending, locked, signIn, signUp, signOut, setLockedState]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
