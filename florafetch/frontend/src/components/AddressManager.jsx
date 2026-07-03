import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { normalizeAddresses } from '../utils/addresses.js';

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
    <section style={{ border: '1px solid #e2e8e4', borderRadius: 12, padding: '1.25rem', background: '#fff', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#2f4a38', marginTop: 0 }}>Saved addresses</h2>

      {addresses.length === 0 ? (
        <p style={{ color: '#889' }}>You haven't saved any delivery addresses yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {addresses.map((a, i) => (
            <li
              key={i}
              style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', justifyContent: 'space-between', border: '1px solid #e2e8e4', borderRadius: 8, padding: '0.6rem 0.75rem' }}
            >
              <span>
                {a.label ? <strong style={{ display: 'block', color: '#2f4a38' }}>{a.label}</strong> : null}
                <span style={{ color: '#556' }}>{a.text}</span>
              </span>
              <button
                onClick={() => handleRemove(i)}
                disabled={busy}
                style={{ background: 'none', border: 'none', color: '#c0392b', cursor: busy ? 'default' : 'pointer', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Add new address */}
      <form onSubmit={handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
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
        {error ? <span style={{ color: '#c0392b', fontSize: '0.85rem' }}>{error}</span> : null}
        <button
          type="submit"
          disabled={busy}
          style={{
            alignSelf: 'flex-start',
            padding: '0.55rem 1.2rem',
            borderRadius: 8,
            border: '1px solid #1b7a3d',
            background: busy ? '#eef5f0' : '#fff',
            color: '#1b7a3d',
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
