import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthCard from '../components/AuthCard.jsx';
import AuthForm from '../components/AuthForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || '/';

  if (!loading && isAuthenticated) return <Navigate to={redirectTo} replace />;

  // register() in AuthContext registers then logs the user straight in.
  const handleSubmit = async ({ full_name, email, phone, password }) => {
    setApiError('');
    setSubmitting(true);
    try {
      await register({
        full_name: full_name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        password,
      });
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setApiError(err.response?.data?.error || 'Unable to create your account. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthCard
      title="Create your account"
      subtitle="Join FloraFetch and bring your home to life with plants."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1b7a3d', fontWeight: 600 }}>
            Sign in
          </Link>
        </>
      }
    >
      <AuthForm mode="register" onSubmit={handleSubmit} apiError={apiError} submitting={submitting} />
    </AuthCard>
  );
}
