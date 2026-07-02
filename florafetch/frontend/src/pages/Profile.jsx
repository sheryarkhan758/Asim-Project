import { useAuth } from '../context/AuthContext.jsx';
import ProfileForm from '../components/ProfileForm.jsx';
import AddressManager from '../components/AddressManager.jsx';
import PurchaseHistory from '../components/PurchaseHistory.jsx';

export default function Profile() {
  const { user } = useAuth();

  return (
    <div style={{ padding: '1.5rem', fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto' }}>
      <h1 style={{ color: '#2f4a38', marginTop: 0 }}>My profile</h1>
      {user ? <p style={{ color: '#667', marginTop: '-0.5rem' }}>Signed in as {user.email}</p> : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1rem' }}>
        <ProfileForm />
        <AddressManager />
        <PurchaseHistory />
      </div>
    </div>
  );
}
