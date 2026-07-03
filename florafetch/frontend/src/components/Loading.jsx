// Lightweight fallback shown while a lazy-loaded route chunk is fetched.
// The leaf gently floats and a ring pulses beneath it so waits feel alive.
export default function Loading({ label = 'Loading…' }) {
  return (
    <div
      className="ff-fade"
      style={{ padding: '3rem 2rem', textAlign: 'center', color: '#667', fontFamily: 'sans-serif' }}
    >
      <span
        className="ff-float ff-ring"
        role="img"
        aria-label="loading"
        style={{ fontSize: '1.6rem', display: 'inline-block', borderRadius: '50%', padding: '0.4rem' }}
      >
        🌿
      </span>
      <p style={{ margin: '0.75rem 0 0' }}>{label}</p>
    </div>
  );
}
