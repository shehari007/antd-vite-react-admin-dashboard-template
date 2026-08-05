import { createContext } from 'react';

export const AuthContext = createContext(null);

/**
 * The roles the demo ships with.
 *
 * A role is just a string. Routes declare which ones they accept, the sidebar
 * hides what the current role cannot open, and `hasRole()` answers the question
 * anywhere else. Add your own by extending this object and using it in
 * src/layout/navConfig.jsx and src/routes.jsx.
 */
export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer',
};

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.EDITOR]: 'Editor',
  [ROLES.VIEWER]: 'Viewer',
};

/**
 * Stand in for your user table. Signing in with one of these emails gives you
 * that role, and any other email signs in as a viewer, so you can see how the
 * navigation and the guarded routes react without a backend.
 */
export const DEMO_USERS = [
  {
    id: 'usr_1',
    name: 'Sheharyar Butt',
    email: 'admin@vitedash.dev',
    role: ROLES.ADMIN,
    jobTitle: 'Product Owner',
  },
  {
    id: 'usr_2',
    name: 'Emma Wilson',
    email: 'editor@vitedash.dev',
    role: ROLES.EDITOR,
    jobTitle: 'Content Editor',
  },
  {
    id: 'usr_3',
    name: 'Liam Carter',
    email: 'viewer@vitedash.dev',
    role: ROLES.VIEWER,
    jobTitle: 'Analyst',
  },
];
