import { Suspense, lazy } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import DashboardLayout from '@/layout/DashboardLayout';
import RequireRole from '@/components/RequireRole';
import PageLoader from '@/components/PageLoader';
import ErrorPage from '@/pages/errors/ErrorPage';
import { ROLES } from '@/context/auth-context';

/* ---------------------------------------------------------------------------
 * Every page is a lazy import.
 *
 * Without this, opening the sign in screen downloads the Kanban board, the
 * chart library, and all twenty something other pages first: the build was one
 * 1.6 MB JavaScript file. Each lazy() below becomes its own chunk that the
 * browser only fetches when the route is visited.
 *
 * The cost is that a route change can now pause, which is what the Suspense
 * fallbacks are for. DashboardLayout holds one inside the shell, so the sidebar
 * and header stay put while the next page loads.
 * ------------------------------------------------------------------------- */

// Auth and standalone pages
const SignIn = lazy(() => import('@/pages/auth/SignIn'));
const SignUp = lazy(() => import('@/pages/auth/SignUp'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const LockScreen = lazy(() => import('@/pages/auth/LockScreen'));
const Maintenance = lazy(() => import('@/pages/maintenance/Maintenance'));
const NotFound = lazy(() => import('@/pages/not-found/NotFound'));

// Dashboard pages
const Home = lazy(() => import('@/pages/home/Home'));
const Analytics = lazy(() => import('@/pages/analytics/Analytics'));
const Charts = lazy(() => import('@/pages/charts/Charts'));
const Calendar = lazy(() => import('@/pages/calendar/Calendar'));
const Users = lazy(() => import('@/pages/users/Users'));
const Roles = lazy(() => import('@/pages/roles/Roles'));
const Tables = lazy(() => import('@/pages/tables/Tables'));
const Products = lazy(() => import('@/pages/products/Products'));
const Kanban = lazy(() => import('@/pages/kanban/Kanban'));
const Invoices = lazy(() => import('@/pages/invoices/Invoices'));
const Chat = lazy(() => import('@/pages/chat/Chat'));
const Notifications = lazy(() => import('@/pages/notifications/Notifications'));
const ActivityLog = lazy(() => import('@/pages/activity/ActivityLog'));
const Forms = lazy(() => import('@/pages/forms/Forms'));
const Pricing = lazy(() => import('@/pages/pricing/Pricing'));
const FAQ = lazy(() => import('@/pages/faq/FAQ'));
const Blank = lazy(() => import('@/pages/blank/Blank'));
const Profile = lazy(() => import('@/pages/profile/Profile'));
const Settings = lazy(() => import('@/pages/settings/Settings'));

const App = () => (
  <BrowserRouter>
    <Suspense fallback={<PageLoader variant="spinner" minHeight="100dvh" />}>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard/home" replace />} />

        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/lock" element={<LockScreen />} />
        <Route path="/maintenance" element={<Maintenance />} />

        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Navigate to="home" replace />} />
          <Route path="home" element={<Home />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="charts" element={<Charts />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="users" element={<Users />} />

          {/* Admin only. The sidebar hides this entry for other roles, and this
              guard is what stops someone who types the URL. */}
          <Route element={<RequireRole roles={[ROLES.ADMIN]} />}>
            <Route path="roles" element={<Roles />} />
          </Route>

          <Route path="tables" element={<Tables />} />
          <Route path="products" element={<Products />} />
          <Route path="kanban" element={<Kanban />} />
          <Route path="invoices" element={<Invoices />} />
          <Route path="chat" element={<Chat />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="activity" element={<ActivityLog />} />
          <Route path="forms" element={<Forms />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="blank" element={<Blank />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />

          <Route
            path="errors/400"
            element={
              <ErrorPage
                status="warning"
                title="400"
                subTitle="Bad Request. The server could not understand your request."
              />
            }
          />
          <Route
            path="errors/403"
            element={
              <ErrorPage
                status="403"
                title="403"
                subTitle="Sorry, you are not authorized to access this page."
              />
            }
          />
          <Route
            path="errors/404"
            element={
              <ErrorPage
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
              />
            }
          />
          <Route
            path="errors/500"
            element={
              <ErrorPage
                status="500"
                title="500"
                subTitle="Sorry, something went wrong on our server."
              />
            }
          />

          {/* Unknown /dashboard paths keep the shell rather than dropping the
              user onto a bare full page 404. */}
          <Route
            path="*"
            element={
              <ErrorPage
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
              />
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default App;
