import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPKR } from '../utils/format.js';
import Button from './ui/Button.jsx';
import { theme } from '../styles/theme.js';

// Summary panel with the "Green Total" subtotal and the checkout action.
export default function OrderSummary({ total, itemCount }) {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    // Checkout is auth-only; send guests to login and bring them back after.
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  return (
    <aside
      style={{
        background: '#fff',
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.md,
        padding: '1.5rem',
        height: 'fit-content',
        position: 'sticky',
        top: '1.5rem',
      }}
    >
      <h3 style={{ margin: '0 0 1.1rem', color: theme.color.ink, fontSize: '1.15rem' }}>Order summary</h3>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          color: theme.color.body,
          marginBottom: '0.75rem',
          fontSize: '0.95rem',
        }}
      >
        <span>Items</span>
        <span style={{ color: theme.color.muted, fontWeight: 600 }}>{itemCount}</span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          padding: '0.95rem 0 0.35rem',
          borderTop: `1px solid ${theme.color.border}`,
          marginTop: '0.5rem',
        }}
      >
        <span style={{ fontWeight: 700, color: theme.color.ink }}>🌿 Green Total</span>
        <strong style={{ fontSize: '1.45rem', color: theme.color.primary }}>{formatPKR(total)}</strong>
      </div>

      <Button
        variant="primary"
        onClick={handleCheckout}
        shine
        style={{ width: '100%', marginTop: '1rem' }}
      >
        Proceed to checkout ➡️
      </Button>

      <p style={{ margin: '0.9rem 0 0', fontSize: '0.8rem', color: theme.color.muted, textAlign: 'center' }}>
        💵 Cash on Delivery · pay when your plants arrive
      </p>
    </aside>
  );
}
