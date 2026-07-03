import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Gate for authenticated-only routes. Redirects to /login (remembering where
// the user was headed) when there is no session. Waits out the initial
// token-validation so a logged-in user isn't briefly bounced on refresh.
export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div style={{ padding: '2rem' }}>Loading…</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}
