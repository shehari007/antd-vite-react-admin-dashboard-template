import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ForgotPassword from './pages/auth/ForgotPassword';
import Home from './pages/home/Home';
import { ProtectedRoute } from './ProtectedRoute';
import Blank from './pages/blank/Blank';
import Users from './pages/users/Users';
import Profile from './pages/profile/Profile';
import Settings from './pages/settings/Settings';
import Forms from './pages/forms/Forms';
import Tables from './pages/tables/Tables';
import Analytics from './pages/analytics/Analytics';
import Calendar from './pages/calendar/Calendar';
import Kanban from './pages/kanban/Kanban';
import Invoices from './pages/invoices/Invoices';
import Pricing from './pages/pricing/Pricing';
import Chat from './pages/chat/Chat';
import FAQ from './pages/faq/FAQ';
import NotFound from './pages/not-found/NotFound';
import ErrorPage from './pages/errors/ErrorPage';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard/home" />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route index element={<Navigate to="home" replace />} />
        <Route path="home" element={<Home />} />
        <Route path="blank" element={<Blank />} />
        <Route path="tables" element={<Tables />} />
        <Route path="forms" element={<Forms />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="users" element={<Users />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="calendar" element={<Calendar />} />
        <Route path="kanban" element={<Kanban />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="chat" element={<Chat />} />
        <Route path="faq" element={<FAQ />} />
        <Route
          path="errors/400"
          element={
            <ErrorPage status="warning" title="400" subTitle="Bad Request. The server could not understand your request." />
          }
        />
        <Route
          path="errors/403"
          element={
            <ErrorPage status="403" title="403" subTitle="Sorry, you are not authorized to access this page." />
          }
        />
        <Route
          path="errors/404"
          element={<ErrorPage status="404" title="404" subTitle="Sorry, the page you visited does not exist." />}
        />
        <Route
          path="errors/500"
          element={<ErrorPage status="500" title="500" subTitle="Sorry, something went wrong on our server." />}
        />
        {/* Unknown /dashboard paths keep the shell rather than dropping the
            user onto a bare full-page 404. */}
        <Route
          path="*"
          element={<ErrorPage status="404" title="404" subTitle="Sorry, the page you visited does not exist." />}
        />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  </BrowserRouter>
);

export default App;
