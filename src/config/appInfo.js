/**
 * One place for the values you will want to change first when you fork this
 * template. Everything here is a plain constant, so you can rename the app and
 * repoint the links without hunting through components.
 */

export const APP_NAME = 'ViteDash';

/**
 * `__APP_VERSION__` is replaced at build time by Vite with the version field
 * from package.json (see vite.config.js). Setting VITE_APP_VERSION in .env
 * overrides it, which is handy when your CI stamps a build number.
 */
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || __APP_VERSION__;

/** Base URL your services talk to. See src/services/apiClient.js. */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

/**
 * When false the dashboard opens without a sign in, which is what you want for
 * a public demo. Set VITE_REQUIRE_AUTH=true in .env to gate every /dashboard
 * route behind the sign in screen.
 */
export const REQUIRE_AUTH = import.meta.env.VITE_REQUIRE_AUTH === 'true';

export const APP_LINKS = {
  github: 'https://github.com/shehari007/vitedash-vite-antd-dashboard-template',
  author: 'https://github.com/shehari007',
  email: 'mailto:shehariyar@gmail.com',
  docs: 'https://ant.design/docs/react/introduce',
  demo: 'https://vitedash.msyb.dev',
};
