import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { normalizeAddresses } from '../utils/addresses.js';
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

// Add/remove saved delivery addresses, persisted as the addresses JSON array
// (PUT /auth/profile via AuthContext.updateProfile).
export default function AddressManager() {
  const { user, updateProfile } = useAuth();
  const addresses = normalizeAddresses(user?.addresses);

  const [label, setLabel] = useState('');
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const persist = async (nextList) => {
    setBusy(true);
    setError('');
    try {
      await updateProfile({ addresses: nextList });
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save addresses.');
    } finally {
      setBusy(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Please enter an address.');
      return;
    }
    const next = [...addresses, { label: label.trim(), text: text.trim() }];
    await persist(next);
    setLabel('');
    setText('');
  };

  const handleRemove = async (index) => {
    const next = addresses.filter((_, i) => i !== index);
    await persist(next);
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
      <h2 style={{ color: theme.color.ink, marginTop: 0, marginBottom: '1.1rem', fontSize: '1.2rem' }}>
        Saved addresses
      </h2>

      {addresses.length === 0 ? (
        <p style={{ color: theme.color.muted }}>You haven't saved any delivery addresses yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
          {addresses.map((a, i) => (
            <li
              key={i}
              style={{
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                border: `1px solid ${theme.color.border}`,
                borderRadius: theme.radius.md,
                background: theme.color.bgSoft,
                padding: '0.85rem 1rem',
              }}
            >
              <span>
                {a.label ? <strong style={{ display: 'block', color: theme.color.ink }}>{a.label}</strong> : null}
                <span style={{ color: theme.color.body }}>{a.text}</span>
              </span>
              <button
                onClick={() => handleRemove(i)}
                disabled={busy}
                style={{ background: 'none', border: 'none', color: theme.color.danger, cursor: busy ? 'default' : 'pointer', fontSize: '0.82rem', fontWeight: 600, whiteSpace: 'nowrap' }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add new address */}
      <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Label (e.g. Home, Office) — optional"
          style={controlStyle}
        />
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="House / flat no, street, area, city…"
          rows={2}
          style={{ ...controlStyle, resize: 'vertical' }}
        />
        {error ? <span style={{ color: theme.color.danger, fontSize: '0.85rem' }}>{error}</span> : null}
        <button
          type="submit"
          disabled={busy}
          style={{
            alignSelf: 'flex-start',
            padding: '0.6rem 1.3rem',
            borderRadius: theme.radius.pill,
            border: `1.5px solid ${theme.color.primary}`,
            background: busy ? theme.color.primarySoft : '#fff',
            color: theme.color.primary,
            fontWeight: 700,
            cursor: busy ? 'default' : 'pointer',
          }}
        >
          {busy ? 'Saving…' : '＋ Add address'}
        </button>
      </form>
    </section>
  );
}
