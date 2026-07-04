// Renders validation / error text. Used two ways:
//   variant="field", small inline message under a single input
//   variant="banner", a boxed error banner (e.g. an API error) above the form
// Renders nothing when there are no messages.
export default function ValidationMessages({ messages, variant = 'field' }) {
  const list = (Array.isArray(messages) ? messages : [messages]).filter(Boolean);
  if (list.length === 0) return null;

  if (variant === 'banner') {
    return (
      <div
        role="alert"
        style={{
          background: '#fdecea',
          border: '1px solid #f5c2c0',
          color: '#a1231d',
          borderRadius: 8,
          padding: '0.6rem 0.85rem',
          fontSize: '0.9rem',
          marginBottom: '1rem',
        }}
      >
        {list.length === 1 ? (
          list[0]
        ) : (
          <ul style={{ margin: 0, paddingLeft: '1.1rem' }}>
            {list.map((m, i) => (
              <li key={i}>{m}</li>
            ))}
          </ul>
        )}
      </div>
    );
  }

  // field variant
  return (
    <span style={{ color: '#c0392b', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
      {list[0]}
    </span>
  );
}
