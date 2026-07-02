import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const linkStyle = ({ isActive }) => ({
  color: isActive ? '#1b7a3d' : '#333',
  textDecoration: 'none',
  fontWeight: isActive ? 700 : 500,
});

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
      className="ff-navbar"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1.5rem',
        padding: '0.75rem 1.5rem',
        borderBottom: '1px solid #e2e8e4',
        fontFamily: 'sans-serif',
        flexWrap: 'wrap',
      }}
    >
      {/* Logo */}
      <Link
        to="/"
        style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1b7a3d', textDecoration: 'none' }}
      >
        🌿 FloraFetch
      </Link>

      {/* Primary nav */}
      <nav style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <NavLink to="/" style={linkStyle} end>
          Home
        </NavLink>
        <NavLink to="/shop" style={linkStyle}>
          Shop
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" style={linkStyle}>
            Admin
          </NavLink>
        )}
      </nav>

      {/* Right side: cart + auth */}
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <NavLink to="/cart" style={linkStyle}>
          Cart{count > 0 ? ` (${count})` : ''}
        </NavLink>

        {isAuthenticated ? (
          <>
            <NavLink to="/profile" style={linkStyle}>
              {user?.full_name || 'Profile'}
            </NavLink>
            <button
              onClick={handleLogout}
              style={{
                border: '1px solid #1b7a3d',
                background: 'transparent',
                color: '#1b7a3d',
                borderRadius: 6,
                padding: '0.35rem 0.8rem',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <NavLink to="/login" style={linkStyle}>
              Login
            </NavLink>
            <NavLink to="/register" style={linkStyle}>
              Register
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}
