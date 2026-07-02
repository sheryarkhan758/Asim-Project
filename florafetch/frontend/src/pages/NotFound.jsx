import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#1b7a3d' }}>404 — Page not found</h1>
      <p>
        <Link to="/" style={{ color: '#1b7a3d', fontWeight: 600 }}>
          ← Back to home
        </Link>
      </p>
    </section>
  );
}
