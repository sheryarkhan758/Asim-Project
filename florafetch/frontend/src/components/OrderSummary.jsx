import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { formatPKR } from '../utils/format.js';

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
        fontFamily: 'sans-serif',
        border: '1px solid #e2e8e4',
        borderRadius: 12,
        padding: '1.25rem',
        background: '#fbfdfb',
        height: 'fit-content',
      }}
    >
      <h3 style={{ margin: '0 0 1rem', color: '#2f4a38' }}>Order summary</h3>

      <div style={{ display: 'flex', justifyContent: 'space-between', color: '#556', marginBottom: '0.5rem' }}>
        <span>
          Items <span style={{ color: '#889' }}>({itemCount})</span>
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          padding: '0.75rem 0',
          borderTop: '1px solid #e2e8e4',
          marginTop: '0.5rem',
        }}
      >
        <span style={{ fontWeight: 700, color: '#2f4a38' }}>🌿 Green Total</span>
        <strong style={{ fontSize: '1.3rem', color: '#1b7a3d' }}>{formatPKR(total)}</strong>
      </div>

      <button
        onClick={handleCheckout}
        style={{
          width: '100%',
          marginTop: '0.75rem',
          padding: '0.75rem',
          borderRadius: 8,
          border: 'none',
          background: '#1b7a3d',
          color: '#fff',
          fontSize: '1rem',
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Proceed to checkout →
      </button>

      <p style={{ margin: '0.75rem 0 0', fontSize: '0.8rem', color: '#889', textAlign: 'center' }}>
        Cash on Delivery · pay when your plants arrive
      </p>
    </aside>
  );
}
