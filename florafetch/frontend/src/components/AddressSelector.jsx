import { useEffect, useState } from 'react';

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

// Choose a saved delivery address or type a new one. Reports the resolved
// address *string* up via onChange (POST /orders wants a plain string).
export default function AddressSelector({ saved, onChange }) {
  const hasSaved = saved.length > 0;
  const [choice, setChoice] = useState(hasSaved ? '0' : 'new'); // saved index or 'new'
  const [newText, setNewText] = useState('');

  const resolve = (nextChoice, text) =>
    nextChoice === 'new' ? text.trim() : saved[Number(nextChoice)]?.text || '';

  // Report the initial value once.
  useEffect(() => {
    onChange(resolve(choice, newText));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pick = (nextChoice) => {
    setChoice(nextChoice);
    onChange(resolve(nextChoice, newText));
  };

  const editNew = (text) => {
    setNewText(text);
    if (choice === 'new') onChange(text.trim());
  };

  return (
    <fieldset style={{ border: 'none', padding: 0, margin: 0 }}>
      <legend style={{ fontWeight: 700, color: '#2f4a38', marginBottom: '0.6rem' }}>
        Delivery address
      </legend>

      {hasSaved && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {saved.map((a, i) => (
            <label
              key={i}
              style={{
                display: 'flex',
                gap: '0.6rem',
                alignItems: 'flex-start',
                padding: '0.6rem 0.75rem',
                border: `1px solid ${choice === String(i) ? '#1b7a3d' : '#e2e8e4'}`,
                borderRadius: 8,
                cursor: 'pointer',
                background: choice === String(i) ? '#f2f8f3' : '#fff',
              }}
            >
              <input
                type="radio"
                name="address"
                checked={choice === String(i)}
                onChange={() => pick(String(i))}
                style={{ marginTop: '0.2rem' }}
              />
              <span>
                {a.label ? (
                  <strong style={{ display: 'block', color: '#2f4a38' }}>{a.label}</strong>
                ) : null}
                <span style={{ color: '#556' }}>{a.text}</span>
              </span>
            </label>
          ))}

          {/* New-address option */}
          <label
            style={{
              display: 'flex',
              gap: '0.6rem',
              alignItems: 'center',
              padding: '0.6rem 0.75rem',
              border: `1px solid ${choice === 'new' ? '#1b7a3d' : '#e2e8e4'}`,
              borderRadius: 8,
              cursor: 'pointer',
              background: choice === 'new' ? '#f2f8f3' : '#fff',
            }}
          >
            <input type="radio" name="address" checked={choice === 'new'} onChange={() => pick('new')} />
            <span style={{ color: '#2f4a38', fontWeight: 600 }}>＋ Enter a new address</span>
          </label>
        </div>
      )}

      {choice === 'new' && (
        <textarea
          value={newText}
          onChange={(e) => editNew(e.target.value)}
          placeholder="House / flat no, street, area, city…"
          rows={3}
          style={{ ...controlStyle, resize: 'vertical' }}
        />
      )}
    </fieldset>
  );
}
