import { Suspense } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import MainLayout from './MainLayout';
import ErrorBoundary from '@/components/ErrorBoundary';
import PageLoader from '@/components/PageLoader';
import { useAuth } from '@/context/useAuth';
import { REQUIRE_AUTH } from '@/config/appInfo';

/**
 * The shell every /dashboard route renders inside.
 *
 * Three things happen here, in order:
 *
 *  1. the auth gate, which only bites when VITE_REQUIRE_AUTH is true, so the
 *     template still opens straight to the dashboard as a public demo
 *  2. an ErrorBoundary keyed on the pathname, so a page that throws leaves the
 *     sidebar and header intact and navigating away clears the error
 *  3. a Suspense boundary, because every page is a lazy import: the shell stays
 *     on screen while the next page's chunk downloads
 */
const DashboardLayout = () => {
  const location = useLocation();
  const { isAuthenticated, locked } = useAuth();

  if (REQUIRE_AUTH && !isAuthenticated) {
    // `state.from` is what sends the user back where they were headed once they
    // have signed in.
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  if (isAuthenticated && locked) {
    return <Navigate to="/lock" replace />;
  }

  return (
    <MainLayout>
      <ErrorBoundary resetKey={location.pathname}>
        <Suspense fallback={<PageLoader />}>
          <Outlet />
        </Suspense>
      </ErrorBoundary>
    </MainLayout>
  );
};

export default DashboardLayout;
