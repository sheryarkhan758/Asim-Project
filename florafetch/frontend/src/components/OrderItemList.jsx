import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPKR } from '../utils/format.js';
import { theme } from '../styles/theme.js';

function ItemImage({ url, alt }) {
  const [error, setError] = useState(false);
  const show = url && !error;
  return (
    <div
      style={{
        width: 60,
        height: 60,
        borderRadius: theme.radius.md,
        background: theme.color.bgTint,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      {show ? (
        <img src={url} alt={alt} onError={() => setError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ fontSize: '1.5rem' }} role="img" aria-label="plant">🪴</span>
      )}
    </div>
  );
}

// The plants included in an order (from order.items).
export default function OrderItemList({ items }) {
  return (
    <section
      style={{
        background: '#fff',
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.sm,
        padding: '0.5rem 1.5rem',
      }}
    >
      <h2 style={{ color: theme.color.ink, fontSize: '1.2rem', margin: '1rem 0 0.25rem' }}>Items</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item) => {
          const lineTotal = item.line_total != null ? item.line_total : item.price * item.quantity;
          return (
            <li
              key={item.item_id}
              style={{
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
                padding: '1rem 0',
                borderBottom: `1px solid ${theme.color.borderSoft}`,
              }}
            >
              <ItemImage url={item.image_url} alt={item.name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link
                  to={`/plant/${item.plant_id}`}
                  className="ff-underline"
                  style={{ color: theme.color.ink, fontWeight: 700, textDecoration: 'none' }}
                >
                  {item.name}
                </Link>
                <div style={{ color: theme.color.muted, fontSize: '0.85rem' }}>
                  {formatPKR(item.price)} × {item.quantity}
                </div>
              </div>
              <strong style={{ color: theme.color.primary, whiteSpace: 'nowrap' }}>{formatPKR(lineTotal)}</strong>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
