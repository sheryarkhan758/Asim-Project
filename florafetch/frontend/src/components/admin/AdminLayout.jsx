import { Link, NavLink } from 'react-router-dom';

// Distinct admin chrome (dark green bar + section tabs on a neutral canvas),
// deliberately different from the storefront's light theme. Reusable across
// the admin pages; `active` marks the current section.
const TABS = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/plants', label: 'Inventory', end: false },
  { to: '/admin/orders', label: 'Orders', end: false },
  { to: '/admin/reviews', label: 'Reviews', end: false },
];

export default function AdminLayout({ title, children }) {
  return (
    <div style={{ background: '#eef1ee', minHeight: 'calc(100vh - 140px)', fontFamily: 'sans-serif' }}>
      {/* Admin top bar */}
      <div
        style={{
          background: '#14331f',
          color: '#fff',
          padding: '1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '0.02em' }}>
          🌿 FloraFetch <span style={{ opacity: 0.7, fontWeight: 500 }}>Admin</span>
        </span>
        <Link to="/" style={{ color: '#bfe6cb', textDecoration: 'none', fontSize: '0.9rem' }}>
          ← View store
        </Link>
      </div>

      {/* Section tabs */}
      <nav
        style={{
          background: '#1b3d27',
          padding: '0 1.5rem',
          display: 'flex',
          gap: '0.25rem',
          overflowX: 'auto',
        }}
      >
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            style={({ isActive }) => ({
              color: isActive ? '#fff' : '#a9cdb5',
              textDecoration: 'none',
              padding: '0.75rem 1rem',
              fontWeight: isActive ? 700 : 500,
              borderBottom: isActive ? '3px solid #4caf72' : '3px solid transparent',
              whiteSpace: 'nowrap',
            })}
          >
            {t.label}
          </NavLink>
        ))}
      </nav>

      {/* Content */}
      <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto' }}>
        {title ? <h1 style={{ color: '#14331f', marginTop: 0 }}>{title}</h1> : null}
        {children}
      </div>
    </div>
  );
}
