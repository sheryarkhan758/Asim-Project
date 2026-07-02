// Generic stub used by every not-yet-built page. Pages are wired into the
// router now; their real UI (per the spec's component list) comes later.
export default function Placeholder({ title, note }) {
  return (
    <section style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1b7a3d' }}>{title}</h1>
      <p style={{ color: '#667' }}>{note || 'This page is coming soon.'}</p>
    </section>
  );
}
