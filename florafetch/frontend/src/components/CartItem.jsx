import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPKR } from '../utils/format.js';

const stepBtn = (disabled) => ({
  width: 30,
  height: 30,
  borderRadius: 6,
  border: '1px solid #cdddd2',
  background: '#fff',
  color: disabled ? '#bbb' : '#2f4a38',
  fontSize: '1rem',
  cursor: disabled ? 'default' : 'pointer',
});

// One cart line: image, name, unit price, quantity stepper, line total, remove.
export default function CartItem({ item }) {
  const { updateQuantity, removeFromCart } = useCart();
  const [busy, setBusy] = useState(false);
  const [imgError, setImgError] = useState(false);

  const stock = Number(item.stock_qty) || 0;
  const lineTotal = item.line_total != null ? item.line_total : item.price * item.quantity;
  const showImage = item.image_url && !imgError;

  const run = async (fn) => {
    setBusy(true);
    try {
      await fn();
    } catch {
      // Context resynced from the server on failure; nothing to do here.
    } finally {
      setBusy(false);
    }
  };

  const changeQty = (next) => {
    if (next < 1 || (stock && next > stock) || busy) return;
    run(() => updateQuantity(item, next));
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '64px 1fr auto',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem 0',
        borderBottom: '1px solid #eef2ef',
        opacity: busy ? 0.6 : 1,
      }}
    >
      {/* Image */}
      <Link to={`/plant/${item.plant_id}`}>
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 8,
            background: '#eef5f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {showImage ? (
            <img
              src={item.image_url}
              alt={item.name}
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: '1.6rem' }} role="img" aria-label="plant">
              🪴
            </span>
          )}
        </div>
      </Link>

      {/* Name + unit price + stepper */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0 }}>
        <Link
          to={`/plant/${item.plant_id}`}
          style={{ color: '#2f4a38', fontWeight: 700, textDecoration: 'none' }}
        >
          {item.name}
        </Link>
        <span style={{ color: '#667', fontSize: '0.85rem' }}>{formatPKR(item.price)} each</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
          <button
            aria-label="Decrease quantity"
            onClick={() => changeQty(item.quantity - 1)}
            disabled={busy || item.quantity <= 1}
            style={stepBtn(busy || item.quantity <= 1)}
          >
            −
          </button>
          <span style={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }}>{item.quantity}</span>
          <button
            aria-label="Increase quantity"
            onClick={() => changeQty(item.quantity + 1)}
            disabled={busy || (stock > 0 && item.quantity >= stock)}
            style={stepBtn(busy || (stock > 0 && item.quantity >= stock))}
          >
            +
          </button>
          {stock > 0 && item.quantity >= stock ? (
            <span style={{ fontSize: '0.75rem', color: '#c0392b' }}>Max stock</span>
          ) : null}
        </div>
      </div>

      {/* Line total + remove */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.4rem' }}>
        <strong style={{ color: '#1b7a3d' }}>{formatPKR(lineTotal)}</strong>
        <button
          onClick={() => run(() => removeFromCart(item.cart_item_id))}
          disabled={busy}
          style={{
            background: 'none',
            border: 'none',
            color: '#c0392b',
            cursor: busy ? 'default' : 'pointer',
            fontSize: '0.85rem',
            padding: 0,
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
