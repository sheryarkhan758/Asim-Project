import { useEffect, useState } from 'react';
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

const optionStyle = (active) => ({
  display: 'flex',
  gap: '0.6rem',
  alignItems: 'flex-start',
  padding: '0.8rem 0.9rem',
  border: `1.5px solid ${active ? theme.color.primary : theme.color.border}`,
  borderRadius: theme.radius.md,
  cursor: 'pointer',
  background: active ? theme.color.primarySoft : '#fff',
  transition: 'border-color 0.15s ease, background 0.15s ease',
});

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
      <legend
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          padding: 0,
          margin: -1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
          border: 0,
        }}
      >
        Delivery address
      </legend>
      {hasSaved && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.85rem' }}>
          {saved.map((a, i) => (
            <label key={i} style={optionStyle(choice === String(i))}>
              <input
                type="radio"
                name="address"
                checked={choice === String(i)}
                onChange={() => pick(String(i))}
                style={{ marginTop: '0.2rem', accentColor: theme.color.primary }}
              />
              <span>
                {a.label ? (
                  <strong style={{ display: 'block', color: theme.color.ink }}>{a.label}</strong>
                ) : null}
                <span style={{ color: theme.color.body }}>{a.text}</span>
              </span>
            </label>
          ))}

          {/* New-address option */}
          <label style={{ ...optionStyle(choice === 'new'), alignItems: 'center' }}>
            <input
              type="radio"
              name="address"
              checked={choice === 'new'}
              onChange={() => pick('new')}
              style={{ accentColor: theme.color.primary }}
            />
            <span style={{ color: theme.color.ink, fontWeight: 600 }}>＋ Enter a new address</span>
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
