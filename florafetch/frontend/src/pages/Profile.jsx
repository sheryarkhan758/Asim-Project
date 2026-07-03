import { useAuth } from '../context/AuthContext.jsx';
import ProfileForm from '../components/ProfileForm.jsx';
import AddressManager from '../components/AddressManager.jsx';
import PurchaseHistory from '../components/PurchaseHistory.jsx';
import Container from '../components/ui/Container.jsx';
import { theme } from '../styles/theme.js';

export default function Profile() {
  const { user } = useAuth();

  return (
    <Container as="div" className="ff-page" style={{ padding: '2.5rem 1.5rem 3.5rem', maxWidth: 920 }}>
      <span
        style={{
          display: 'inline-block',
          fontWeight: 700,
          fontSize: '0.72rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: theme.color.primary,
          background: theme.color.primarySoft,
          padding: '0.3rem 0.8rem',
          borderRadius: theme.radius.pill,
        }}
      >
        Your account
      </span>
      <h1 style={{ color: theme.color.ink, margin: '0.75rem 0 0.35rem', fontSize: 'clamp(1.7rem, 3vw, 2.2rem)' }}>
        My profile
      </h1>
      {user ? (
        <p style={{ color: theme.color.muted, margin: '0 0 1.75rem' }}>Signed in as {user.email}</p>
      ) : (
        <div style={{ height: '1.75rem' }} />
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <ProfileForm />
        <AddressManager />
        <PurchaseHistory />
      </div>
    </Container>
  );
}
