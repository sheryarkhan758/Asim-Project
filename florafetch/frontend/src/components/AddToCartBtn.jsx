import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';

const stepBtn = (disabled) => ({
  width: 36,
  height: 36,
  borderRadius: 8,
  border: '1px solid #cdddd2',
  background: '#fff',
  color: disabled ? '#bbb' : '#2f4a38',
  fontSize: '1.1rem',
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
      <div style={{ fontFamily: 'sans-serif' }}>
        <span
          style={{
            display: 'inline-block',
            padding: '0.6rem 1rem',
            borderRadius: 8,
            background: '#f4ecec',
            color: '#a1231d',
            fontWeight: 700,
          }}
        >
          Out of stock
        </span>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: 'sans-serif', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        {/* Quantity stepper */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            type="button"
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
              padding: '0.45rem',
              borderRadius: 8,
              border: '1px solid #cdddd2',
              fontSize: '1rem',
            }}
          />
          <button
            type="button"
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
          disabled={adding}
          style={{
            flex: '1 1 auto',
            minWidth: 160,
            padding: '0.7rem 1.4rem',
            borderRadius: 8,
            border: 'none',
            background: added ? '#127a32' : '#1b7a3d',
            color: '#fff',
            fontSize: '1rem',
            fontWeight: 700,
            cursor: adding ? 'default' : 'pointer',
          }}
        >
          {added ? 'Added to cart ✓' : adding ? 'Adding…' : 'Add to cart'}
        </button>
      </div>

      <span style={{ fontSize: '0.85rem', color: stock <= 5 ? '#c0392b' : '#667' }}>
        {stock <= 5 ? `Only ${stock} left in stock` : `${stock} in stock`}
      </span>

      {error ? <span style={{ color: '#c0392b', fontSize: '0.85rem' }}>{error}</span> : null}
    </div>
  );
}
