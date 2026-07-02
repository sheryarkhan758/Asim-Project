import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

const controlStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.6rem 0.75rem',
  borderRadius: 8,
  border: '1px solid #cdddd2',
  fontSize: '0.95rem',
  fontFamily: 'inherit',
  background: '#fff',
};
const labelStyle = { display: 'block', fontWeight: 700, color: '#2f4a38', marginBottom: '0.4rem' };

// Edit name + phone (PUT /auth/profile via AuthContext.updateProfile).
export default function ProfileForm() {
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type: 'ok'|'err', text }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setMessage({ type: 'err', text: 'Full name is required.' });
      return;
    }
    setSaving(true);
    setMessage(null);
    try {
      await updateProfile({ full_name: fullName.trim(), phone: phone.trim() || null });
      setMessage({ type: 'ok', text: 'Profile updated.' });
    } catch (err) {
      setMessage({ type: 'err', text: err.response?.data?.error || 'Could not update profile.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section style={{ border: '1px solid #e2e8e4', borderRadius: 12, padding: '1.25rem', background: '#fff', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#2f4a38', marginTop: 0 }}>Account details</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="full_name" style={labelStyle}>Full name</label>
          <input id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} style={controlStyle} />
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="email" style={labelStyle}>Email</label>
          <input id="email" value={user?.email || ''} disabled style={{ ...controlStyle, background: '#f4f6f4', color: '#889' }} />
          <span style={{ fontSize: '0.75rem', color: '#889' }}>Email can't be changed.</span>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="phone" style={labelStyle}>Phone</label>
          <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={controlStyle} />
        </div>

        {message ? (
          <p style={{ color: message.type === 'ok' ? '#1b7a3d' : '#c0392b', fontSize: '0.9rem', margin: '0 0 0.75rem' }}>
            {message.text}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={saving}
          style={{
            padding: '0.6rem 1.4rem',
            borderRadius: 8,
            border: 'none',
            background: saving ? '#7bbf93' : '#1b7a3d',
            color: '#fff',
            fontWeight: 700,
            cursor: saving ? 'default' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </section>
  );
}
