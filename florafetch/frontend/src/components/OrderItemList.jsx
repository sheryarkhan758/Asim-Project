import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPKR } from '../utils/format.js';

function ItemImage({ url, alt }) {
  const [error, setError] = useState(false);
  const show = url && !error;
  return (
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 8,
        background: '#eef5f0',
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
        <span style={{ fontSize: '1.4rem' }} role="img" aria-label="plant">🪴</span>
      )}
    </div>
  );
}

// The plants included in an order (from order.items).
export default function OrderItemList({ items }) {
  return (
    <section style={{ fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#2f4a38' }}>Items</h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {items.map((item) => {
          const lineTotal = item.line_total != null ? item.line_total : item.price * item.quantity;
          return (
            <li
              key={item.item_id}
              style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid #eef2ef' }}
            >
              <ItemImage url={item.image_url} alt={item.name} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <Link to={`/plant/${item.plant_id}`} style={{ color: '#2f4a38', fontWeight: 700, textDecoration: 'none' }}>
                  {item.name}
                </Link>
                <div style={{ color: '#667', fontSize: '0.85rem' }}>
                  {formatPKR(item.price)} × {item.quantity}
                </div>
              </div>
              <strong style={{ color: '#1b7a3d', whiteSpace: 'nowrap' }}>{formatPKR(lineTotal)}</strong>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
