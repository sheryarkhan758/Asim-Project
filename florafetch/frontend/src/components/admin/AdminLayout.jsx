import { Link, NavLink } from 'react-router-dom';
import { theme } from '../../styles/theme.js';

// Distinct admin chrome (dark green bar + section tabs on a neutral canvas),
// deliberately different from the storefront's light theme. Reusable across
// the admin pages; `active` marks the current section.
const TABS = [
  { to: '/admin', label: 'Dashboard', end: true, icon: '📊' },
  { to: '/admin/plants', label: 'Inventory', end: false, icon: '🪴' },
  { to: '/admin/orders', label: 'Orders', end: false, icon: '📦' },
  { to: '/admin/reviews', label: 'Reviews', end: false, icon: '⭐' },
];

export default function AdminLayout({ title, children }) {
  return (
    <div
      style={{
        background: theme.color.bgSoft,
        minHeight: 'calc(100vh - 140px)',
        fontFamily: theme.font.body,
      }}
    >
      {/* Admin top bar */}
      <div
        style={{
          background: theme.gradient.cta,
          color: '#fff',
          padding: '1.1rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
          boxShadow: theme.shadow.md,
        }}
      >
        <span
          style={{
            fontFamily: theme.font.head,
            fontWeight: 800,
            fontSize: '1.2rem',
            letterSpacing: '0.01em',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          🌿 FloraFetch{' '}
          <span
            style={{
              fontWeight: 600,
              fontSize: '0.7rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              background: 'rgba(255,255,255,0.16)',
              padding: '0.25rem 0.7rem',
              borderRadius: theme.radius.pill,
            }}
          >
            Admin
          </span>
        </span>
        <Link
          to="/"
          style={{
            color: '#eafaef',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'rgba(255,255,255,0.12)',
            padding: '0.45rem 1rem',
            borderRadius: theme.radius.pill,
          }}
        >
          ← View store
        </Link>
      </div>

      {/* Section tabs */}
      <nav
        style={{
          background: '#fff',
          borderBottom: `1px solid ${theme.color.border}`,
          padding: '0 1.5rem',
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          boxShadow: theme.shadow.sm,
        }}
      >
        {TABS.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            style={({ isActive }) => ({
              color: isActive ? theme.color.primary : theme.color.muted,
              textDecoration: 'none',
              padding: '0.9rem 1.1rem',
              fontWeight: isActive ? 700 : 600,
              fontSize: '0.92rem',
              borderBottom: isActive
                ? `3px solid ${theme.color.primary}`
                : '3px solid transparent',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'color 0.18s ease',
            })}
          >
            <span aria-hidden="true">{t.icon}</span>
            {t.label}
          </NavLink>
        ))}
      </nav>

      {/* Content */}
      <div style={{ padding: '2rem 1.5rem', maxWidth: 1120, margin: '0 auto' }}>
        {title ? (
          <h1
            style={{
              fontFamily: theme.font.head,
              color: theme.color.ink,
              margin: '0 0 1.5rem',
              fontSize: '1.9rem',
              fontWeight: 800,
              letterSpacing: '-0.01em',
            }}
          >
            {title}
          </h1>
        ) : null}
        {children}
      </div>
    </div>
  );
}
