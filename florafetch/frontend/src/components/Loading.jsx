// Lightweight fallback shown while a lazy-loaded route chunk is fetched.
export default function Loading({ label = 'Loading…' }) {
  return (
    <div style={{ padding: '3rem 2rem', textAlign: 'center', color: '#667', fontFamily: 'sans-serif' }}>
      <span role="img" aria-label="loading" style={{ fontSize: '1.6rem' }}>🌿</span>
      <p style={{ margin: '0.5rem 0 0' }}>{label}</p>
    </div>
  );
}
