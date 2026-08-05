import { ACTIVITY_LOG, NOTIFICATIONS, PERMISSION_MATRIX, ROLE_SUMMARY } from '@/data/workspace';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getNotifications = async ({ filter = 'all' } = {}) => {
  await delay(350);
  if (filter === 'unread') return NOTIFICATIONS.filter((item) => !item.read);
  if (filter === 'read') return NOTIFICATIONS.filter((item) => item.read);
  return NOTIFICATIONS;
};

export const getActivityLog = async ({ actor = null, severity = null } = {}) => {
  await delay(400);
  return ACTIVITY_LOG.filter(
    (entry) => (!actor || entry.actor === actor) && (!severity || entry.severity === severity)
  );
};

export const getRoles = async () => {
  await delay(300);
  return { roles: ROLE_SUMMARY, permissions: PERMISSION_MATRIX };
};
