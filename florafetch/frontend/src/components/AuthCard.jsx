import { Link } from 'react-router-dom';

// Plant-themed card container shared by the Login and Register pages.
export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div
      style={{
        minHeight: 'calc(100vh - 140px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'linear-gradient(160deg, #f2f8f3 0%, #e8f3ea 100%)',
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: '#fff',
          borderRadius: 16,
          border: '1px solid #dcebe0',
          boxShadow: '0 10px 30px rgba(27, 122, 61, 0.08)',
          padding: '2rem',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <Link
            to="/"
            style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1b7a3d', textDecoration: 'none' }}
          >
            🌿 FloraFetch
          </Link>
          <h1 style={{ margin: '0.75rem 0 0.25rem', fontSize: '1.4rem', color: '#2f4a38' }}>{title}</h1>
          {subtitle ? <p style={{ margin: 0, color: '#667', fontSize: '0.9rem' }}>{subtitle}</p> : null}
        </div>

        {children}

        {footer ? (
          <p style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.9rem', color: '#556' }}>
            {footer}
          </p>
        ) : null}
      </div>
    </div>
  );
}
