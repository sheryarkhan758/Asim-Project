import { Link, NavLink } from 'react-router-dom';
import { Dashboard, Box, Bag, Star, Leaf, ArrowLeft } from '../ui/BrandIcons.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { theme } from '../../styles/theme.js';

// Admin chrome: a clean, professional header (brand + account) with a section
// tab strip beneath it, sitting on a neutral canvas. Deliberately restrained —
// no loud gradients — so it reads like a real management console.
const TABS = [
  { to: '/admin', label: 'Dashboard', end: true, Icon: Dashboard },
  { to: '/admin/plants', label: 'Inventory', end: false, Icon: Box },
  { to: '/admin/orders', label: 'Orders', end: false, Icon: Bag },
  { to: '/admin/reviews', label: 'Reviews', end: false, Icon: Star },
];

export default function AdminLayout({ title, children }) {
  const { user } = useAuth();
  const name = user?.full_name || 'Administrator';
  const initial = (name.trim()[0] || 'A').toUpperCase();

  return (
    <div style={{ background: theme.color.bgSoft, minHeight: 'calc(100vh - 140px)', fontFamily: theme.font.body }}>
      {/* Header: brand + account */}
      <header
        style={{
          background: '#fff',
          borderBottom: `1px solid ${theme.color.border}`,
          padding: '0.85rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem' }}>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: theme.radius.md,
              background: theme.color.primary,
              color: '#fff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Leaf size={22} color="currentColor" />
          </span>
          <span style={{ lineHeight: 1.15 }}>
            <span style={{ display: 'block', fontFamily: theme.font.head, fontWeight: 800, fontSize: '1.05rem', color: theme.color.ink }}>
              FloraFetch
            </span>
            <span style={{ display: 'block', fontSize: '0.68rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: theme.color.muted }}>
              Admin panel
            </span>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Link
            to="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              color: theme.color.body,
              textDecoration: 'none',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: `1px solid ${theme.color.border}`,
              borderRadius: theme.radius.pill,
              padding: '0.42rem 0.9rem',
            }}
          >
            <ArrowLeft size={15} color="currentColor" /> View store
          </Link>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
            <span
              aria-hidden="true"
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: theme.color.primarySoft,
                color: theme.color.primary,
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '0.9rem',
              }}
            >
              {initial}
            </span>
            <span style={{ lineHeight: 1.2 }} className="ff-admin-account">
              <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: theme.color.ink }}>{name}</span>
              <span style={{ display: 'block', fontSize: '0.72rem', color: theme.color.muted }}>Administrator</span>
            </span>
          </span>
        </div>
      </header>

      {/* Section tabs */}
      <nav
        style={{
          background: '#fff',
          borderBottom: `1px solid ${theme.color.border}`,
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
            className="ff-admin-tab"
            style={({ isActive }) => ({
              color: isActive ? theme.color.primary : theme.color.muted,
              textDecoration: 'none',
              padding: '0.9rem 1rem',
              fontWeight: isActive ? 700 : 600,
              fontSize: '0.9rem',
              borderBottom: isActive ? `2.5px solid ${theme.color.primary}` : '2.5px solid transparent',
              marginBottom: '-1px',
              whiteSpace: 'nowrap',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'color 0.15s ease',
            })}
          >
            <t.Icon size={17} color="currentColor" />
            {t.label}
          </NavLink>
        ))}
      </nav>

      {/* Content */}
      <div style={{ padding: '2rem 1.5rem', maxWidth: 1160, margin: '0 auto' }}>
        {title ? (
          <h1
            style={{
              fontFamily: theme.font.head,
              color: theme.color.ink,
              margin: '0 0 1.5rem',
              fontSize: '1.7rem',
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
