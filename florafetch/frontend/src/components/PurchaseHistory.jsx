import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../api/orders.js';
import { formatPKR, formatDate } from '../utils/format.js';

const STATUS_COLORS = {
  Confirmed: '#0d6efd',
  'Quality Check': '#b8860b',
  'In Transit': '#8a5a00',
  Delivered: '#1b7a3d',
};

// The user's past orders (GET /orders), each linking to its tracking page.
export default function PurchaseHistory() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let active = true;
    getOrders()
      .then((data) => {
        if (!active) return;
        setOrders(data.orders || []);
        setStatus('ready');
      })
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section style={{ border: '1px solid #e2e8e4', borderRadius: 12, padding: '1.25rem', background: '#fff', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#2f4a38', marginTop: 0 }}>Purchase history</h2>

      {status === 'loading' && <p style={{ color: '#667' }}>Loading your orders…</p>}
      {status === 'error' && <p style={{ color: '#c0392b' }}>Could not load your orders.</p>}
      {status === 'ready' &&
        (orders.length === 0 ? (
          <p style={{ color: '#889' }}>
            No orders yet.{' '}
            <Link to="/shop" style={{ color: '#1b7a3d', fontWeight: 600 }}>
              Start shopping →
            </Link>
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {orders.map((o) => (
              <li
                key={o.order_id}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', border: '1px solid #e2e8e4', borderRadius: 8, padding: '0.75rem 1rem', flexWrap: 'wrap' }}
              >
                <div>
                  <strong style={{ color: '#2f4a38' }}>Order #{o.order_id}</strong>
                  <div style={{ color: '#889', fontSize: '0.85rem' }}>
                    {formatDate(o.created_at)} · {formatPKR(o.total_amount)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.6rem',
                      borderRadius: 999,
                      background: '#eef5f0',
                      color: STATUS_COLORS[o.status] || '#556',
                    }}
                  >
                    {o.status}
                  </span>
                  <Link to={`/orders/${o.order_id}`} style={{ color: '#1b7a3d', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    Track →
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}
