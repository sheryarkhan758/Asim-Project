import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { theme } from '../styles/theme.js';

const controlStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.7rem 0.85rem',
  borderRadius: theme.radius.md,
  border: `1px solid ${theme.color.border}`,
  fontSize: '0.95rem',
  fontFamily: theme.font.body,
  background: theme.color.bgSoft,
};
const labelStyle = { display: 'block', fontWeight: 700, color: theme.color.ink, marginBottom: '0.4rem' };

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
    <section
      style={{
        background: '#fff',
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.sm,
        padding: '1.75rem',
      }}
    >
      <h2 style={{ color: theme.color.ink, marginTop: 0, marginBottom: '1.25rem', fontSize: '1.2rem' }}>
        Account details
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.1rem' }}>
          <label htmlFor="full_name" style={labelStyle}>Full name</label>
          <input id="full_name" value={fullName} onChange={(e) => setFullName(e.target.value)} style={controlStyle} />
        </div>

        <div style={{ marginBottom: '1.1rem' }}>
          <label htmlFor="email" style={labelStyle}>Email</label>
          <input
            id="email"
            value={user?.email || ''}
            disabled
            style={{ ...controlStyle, background: theme.color.borderSoft, color: theme.color.muted, cursor: 'not-allowed' }}
          />
          <span style={{ fontSize: '0.75rem', color: theme.color.muted }}>Email can't be changed.</span>
        </div>

        <div style={{ marginBottom: '1.25rem' }}>
          <label htmlFor="phone" style={labelStyle}>Phone</label>
          <input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} style={controlStyle} />
        </div>

        {message ? (
          <p
            style={{
              color: message.type === 'ok' ? theme.color.primary : theme.color.danger,
              fontSize: '0.9rem',
              margin: '0 0 0.9rem',
              fontWeight: 600,
            }}
          >
            {message.text}
          </p>
        ) : null}

        <button
          className="ff-btn"
          type="submit"
          disabled={saving}
          style={{
            padding: '0.7rem 1.6rem',
            borderRadius: theme.radius.pill,
            border: 'none',
            background: saving ? theme.color.primaryLight : theme.color.primary,
            color: '#fff',
            fontWeight: 700,
            fontFamily: theme.font.body,
            cursor: saving ? 'default' : 'pointer',
            boxShadow: theme.shadow.sm,
          }}
        >
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </form>
    </section>
  );
}
