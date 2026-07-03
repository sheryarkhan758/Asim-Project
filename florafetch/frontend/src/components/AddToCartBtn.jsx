import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { theme } from '../styles/theme.js';

const stepBtn = (disabled) => ({
  width: 40,
  height: 40,
  borderRadius: theme.radius.md,
  border: `1.5px solid ${theme.color.border}`,
  background: theme.color.white,
  color: disabled ? theme.color.faint : theme.color.primary,
  fontSize: '1.2rem',
  fontWeight: 700,
  lineHeight: 1,
  cursor: disabled ? 'default' : 'pointer',
});

// Quantity stepper + add button wired to CartContext. Quantity is clamped to
// the plant's available stock; guests are routed to /login first.
export default function AddToCartBtn({ plant }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const stock = Number(plant.stock_qty) || 0;
  const outOfStock = stock <= 0;

  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState('');

  const clamp = (n) => Math.max(1, Math.min(stock, n));

  const handleAdd = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/plant/${plant.plant_id}` } } });
      return;
    }
    setError('');
    setAdding(true);
    try {
      await addToCart(plant.plant_id, qty);
      setAdded(true);
      setTimeout(() => setAdded(false), 1800);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not add to cart. Please try again.');
    } finally {
      setAdding(false);
    }
  };

  if (outOfStock) {
    return (
      <div>
        <span
          style={{
            display: 'inline-block',
            padding: '0.7rem 1.2rem',
            borderRadius: theme.radius.pill,
            background: '#f7ecec',
            color: theme.color.danger,
            fontWeight: 700,
          }}
        >
          Out of stock
        </span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Quantity stepper */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.25rem',
            border: `1px solid ${theme.color.borderSoft}`,
            borderRadius: theme.radius.lg,
            background: theme.color.bgSoft,
          }}
        >
          <button
            type="button"
            className="ff-btn"
            aria-label="Decrease quantity"
            onClick={() => setQty((q) => clamp(q - 1))}
            disabled={qty <= 1}
            style={stepBtn(qty <= 1)}
          >
            −
          </button>
          <input
            type="number"
            min="1"
            max={stock}
            value={qty}
            onChange={(e) => setQty(clamp(Number(e.target.value) || 1))}
            aria-label="Quantity"
            style={{
              width: 56,
              textAlign: 'center',
              padding: '0.5rem',
              borderRadius: theme.radius.md,
              border: `1.5px solid ${theme.color.border}`,
              fontSize: '1rem',
              fontWeight: 700,
              color: theme.color.ink,
              background: theme.color.white,
            }}
          />
          <button
            type="button"
            className="ff-btn"
            aria-label="Increase quantity"
            onClick={() => setQty((q) => clamp(q + 1))}
            disabled={qty >= stock}
            style={stepBtn(qty >= stock)}
          >
            +
          </button>
        </div>

        <button
          onClick={handleAdd}
          className="ff-btn"
          disabled={adding}
          style={{
            flex: '1 1 auto',
            minWidth: 170,
            padding: '0.8rem 1.5rem',
            borderRadius: theme.radius.pill,
            border: 'none',
            background: added ? theme.color.primaryLight : theme.color.primary,
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: adding ? 'default' : 'pointer',
            boxShadow: theme.shadow.sm,
          }}
        >
          {added ? 'Added to cart ✓' : adding ? 'Adding…' : 'Add to cart'}
        </button>
      </div>

      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: stock <= 5 ? theme.color.danger : theme.color.muted }}>
        {stock <= 5 ? `Only ${stock} left in stock` : `${stock} in stock`}
      </span>

      {error ? <span style={{ color: theme.color.danger, fontSize: '0.85rem' }}>{error}</span> : null}
    </div>
  );
}
