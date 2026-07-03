import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import { formatPKR } from '../utils/format.js';
import { theme } from '../styles/theme.js';

const stepBtn = (disabled) => ({
  width: 32,
  height: 32,
  borderRadius: theme.radius.sm,
  border: `1px solid ${theme.color.border}`,
  background: disabled ? theme.color.bgSoft : '#fff',
  color: disabled ? theme.color.faint : theme.color.ink,
  fontSize: '1.1rem',
  lineHeight: 1,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: disabled ? 'default' : 'pointer',
  transition: 'border-color 0.15s ease, background 0.15s ease',
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
        gridTemplateColumns: '72px 1fr auto',
        gap: '1rem',
        alignItems: 'center',
        padding: '1.15rem 0',
        borderBottom: `1px solid ${theme.color.borderSoft}`,
        opacity: busy ? 0.6 : 1,
        transition: 'opacity 0.15s ease',
      }}
    >
      {/* Image */}
      <Link to={`/plant/${item.plant_id}`}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: theme.radius.md,
            background: theme.color.bgTint,
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
            <span style={{ fontSize: '1.8rem' }} role="img" aria-label="plant">
              🪴
            </span>
          )}
        </div>
      </Link>

      {/* Name + unit price + stepper */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', minWidth: 0 }}>
        <Link
          to={`/plant/${item.plant_id}`}
          className="ff-underline"
          style={{ color: theme.color.ink, fontWeight: 700, textDecoration: 'none', fontSize: '1.02rem' }}
        >
          {item.name}
        </Link>
        <span style={{ color: theme.color.muted, fontSize: '0.85rem' }}>{formatPKR(item.price)} each</span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
          <button
            aria-label="Decrease quantity"
            onClick={() => changeQty(item.quantity - 1)}
            disabled={busy || item.quantity <= 1}
            style={stepBtn(busy || item.quantity <= 1)}
          >
            −
          </button>
          <span style={{ minWidth: 28, textAlign: 'center', fontWeight: 700, color: theme.color.ink }}>
            {item.quantity}
          </span>
          <button
            aria-label="Increase quantity"
            onClick={() => changeQty(item.quantity + 1)}
            disabled={busy || (stock > 0 && item.quantity >= stock)}
            style={stepBtn(busy || (stock > 0 && item.quantity >= stock))}
          >
            +
          </button>
          {stock > 0 && item.quantity >= stock ? (
            <span style={{ fontSize: '0.75rem', color: theme.color.danger, fontWeight: 600 }}>Max stock</span>
          ) : null}
        </div>
      </div>

      {/* Line total + remove */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
        <strong style={{ color: theme.color.primary, fontSize: '1.05rem' }}>{formatPKR(lineTotal)}</strong>
        <button
          onClick={() => run(() => removeFromCart(item.cart_item_id))}
          disabled={busy}
          style={{
            background: 'none',
            border: 'none',
            color: theme.color.danger,
            cursor: busy ? 'default' : 'pointer',
            fontSize: '0.82rem',
            fontWeight: 600,
            padding: 0,
          }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}
