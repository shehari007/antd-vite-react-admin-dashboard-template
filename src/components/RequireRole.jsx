import { Button, Result } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/context/useAuth';

/**
 * Role gate for a group of routes.
 *
 *   <Route element={<RequireRole roles={[ROLES.ADMIN]} />}>
 *     <Route path="roles" element={<Roles />} />
 *   </Route>
 *
 * Hiding an item in the sidebar is a courtesy. This is the part that actually
 * stops someone who pastes the URL, and in a real app the same check has to
 * exist on the server too, because everything here runs on the user's machine
 * and can be edited.
 */
const RequireRole = ({ roles }) => {
  const { hasRole } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (hasRole(roles)) return <Outlet />;

  return (
    <Result
      status="403"
      title={t('page.forbidden.title')}
      subTitle={t('page.forbidden.subtitle')}
      extra={
        <Button type="primary" onClick={() => navigate('/dashboard/home')}>
          {t('nav.items.dashboard')}
        </Button>
      }
    />
  );
};

export default RequireRole;
