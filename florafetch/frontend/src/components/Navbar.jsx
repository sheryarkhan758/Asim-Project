import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

// Pill nav link: fills + lifts on hover, solid primary pill on the active route
// (styling lives in .ff-navlink / .ff-navlink.active in animations.css).
const navPill = ({ isActive }) => `ff-navlink${isActive ? ' active' : ''}`;

export default function Navbar() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header
      className="ff-navbar ff-down"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '1.25rem',
        padding: '0.7rem 1.5rem',
        background: 'rgba(255, 255, 255, 0.92)',
        backdropFilter: 'saturate(180%) blur(10px)',
        WebkitBackdropFilter: 'saturate(180%) blur(10px)',
        borderBottom: '1px solid #e8efe9',
        boxShadow: '0 4px 20px rgba(27, 122, 61, 0.05)',
        flexWrap: 'wrap',
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        className="ff-lift"
        style={{
          fontSize: '1.4rem',
          fontWeight: 800,
          color: '#1b7a3d',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.3rem',
        }}
      >
        <span className="ff-float" aria-hidden="true">🌿</span> FloraFetch
      </Link>

      {/* Primary nav */}
      <nav style={{ display: 'flex', gap: '0.3rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <NavLink to="/" className={navPill} end>
          Home
        </NavLink>
        <NavLink to="/shop" className={navPill}>
          Shop
        </NavLink>
        <NavLink to="/care-guides" className={navPill}>
          Care Guides
        </NavLink>
        <NavLink to="/about" className={navPill}>
          About
        </NavLink>
        <NavLink to="/contact" className={navPill}>
          Contact
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={navPill}>
            Admin
          </NavLink>
        )}
      </nav>

      {/* Right side: cart + auth */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <NavLink to="/cart" className={navPill}>
          <span aria-hidden="true">🛒</span> Cart
          {count > 0 ? <span className="ff-nav-badge">{count}</span> : null}
        </NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to="/profile" className={navPill}>
              {user?.full_name?.split(' ')[0] || 'Profile'}
            </NavLink>
            <button onClick={handleLogout} className="ff-nav-ghost">
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={navPill}>
              Login
            </NavLink>
            <NavLink to="/register" className="ff-nav-cta">
              Register
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
