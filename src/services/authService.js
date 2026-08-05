import { DEMO_USERS, ROLES } from '@/context/auth-context';

/**
 * Fake authentication.
 *
 * Everything in this file is the piece you replace with real network calls. The
 * shapes it returns are what the rest of the app already expects, so if your
 * backend returns `{ user, token }` you can swap the bodies and change nothing
 * else. A real version of signIn looks like:
 *
 *   export const signIn = async ({ email, password }) => {
 *     const response = await apiClient.post('/auth/login', { email, password });
 *     return { user: response.user, token: response.token };
 *   };
 */

const FAKE_LATENCY_MS = 450;

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const findDemoUser = (email) => {
  const match = DEMO_USERS.find(
    (user) => user.email.toLowerCase() === String(email || '').toLowerCase()
  );
  if (match) return match;

  // Any unknown email still gets in, as the lowest privilege role, so the demo
  // never dead ends on a typo.
  return {
    id: 'usr_guest',
    name: String(email || 'Guest User').split('@')[0],
    email: email || 'guest@vitedash.dev',
    role: ROLES.VIEWER,
    jobTitle: 'Guest',
  };
};

export const signIn = async ({ email }) => {
  await delay(FAKE_LATENCY_MS);
  const user = findDemoUser(email);
  return {
    user,
    // Not a real token. A real one is opaque to the client and, ideally, kept
    // in an httpOnly cookie rather than localStorage.
    token: `demo.${btoa(user.id)}.${Date.now()}`,
  };
};

export const signUp = async ({ email, name }) => {
  await delay(FAKE_LATENCY_MS);
  const user = {
    id: `usr_${Date.now()}`,
    name: name || String(email || '').split('@')[0],
    email,
    role: ROLES.VIEWER,
    jobTitle: 'New Member',
  };
  return { user, token: `demo.${btoa(user.id)}.${Date.now()}` };
};

export const requestPasswordReset = async ({ email }) => {
  await delay(FAKE_LATENCY_MS);
  return { sentTo: email };
};

export const signOut = async () => {
  await delay(120);
  return true;
};
