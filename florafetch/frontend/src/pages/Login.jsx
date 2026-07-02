import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import AuthForm from '../components/AuthForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Where to land after login: the page they were bounced from, else Home.
  const redirectTo = location.state?.from?.pathname || '/';

  // Already logged in? Skip the form.
  if (!loading && isAuthenticated) return <Navigate to={redirectTo} replace />;

  const handleSubmit = async ({ email, password }) => {
    setApiError('');
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.error || 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Welcome back"
      subtitle="Sign in to continue shopping for plants."
      footer={
        <>
          New to FloraFetch?{' '}
          <Link to="/register" style={{ color: '#1b7a3d', fontWeight: 600 }}>
            Create an account
          </Link>
        </>
      }
    >
      <AuthForm mode="login" onSubmit={handleSubmit} apiError={apiError} submitting={submitting} />
    </AuthCard>
  );
}
