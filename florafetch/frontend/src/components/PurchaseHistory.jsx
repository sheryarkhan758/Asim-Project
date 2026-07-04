import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders } from '../api/orders.js';
import { formatPKR, formatDate } from '../utils/format.js';
import { theme } from '../styles/theme.js';

const STATUS_COLORS = {
  Confirmed: '#0d6efd',
  'Quality Check': '#b8860b',
  'In Transit': '#8a5a00',
  Delivered: theme.color.primary,
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
    <section
      style={{
        background: '#fff',
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.sm,
        padding: '1.75rem',
      }}
    >
      <h2 style={{ color: theme.color.ink, marginTop: 0, marginBottom: '1.1rem', fontSize: '1.2rem' }}>
        Purchase history
      </h2>

      {status === 'loading' && <p style={{ color: theme.color.muted }}>Loading your orders…</p>}
      {status === 'error' && <p style={{ color: theme.color.danger }}>Could not load your orders.</p>}
      {status === 'ready' &&
        (orders.length === 0 ? (
          <p style={{ color: theme.color.muted }}>
            No orders yet.{' '}
            <Link to="/shop" className="ff-underline" style={{ color: theme.color.primary, fontWeight: 600, textDecoration: 'none' }}>
              Start shopping ➡️
            </Link>
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {orders.map((o) => (
              <li
                key={o.order_id}
                className="ff-card"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '1rem',
                  border: `1px solid ${theme.color.border}`,
                  borderRadius: theme.radius.md,
                  background: theme.color.bgSoft,
                  padding: '1rem 1.15rem',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <strong style={{ color: theme.color.ink }}>Order #{o.order_id}</strong>
                  <div style={{ color: theme.color.muted, fontSize: '0.85rem' }}>
                    {formatDate(o.created_at)} · {formatPKR(o.total_amount)}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.28rem 0.7rem',
                      borderRadius: theme.radius.pill,
                      background: '#fff',
                      border: `1px solid ${theme.color.border}`,
                      color: STATUS_COLORS[o.status] || theme.color.body,
                    }}
                  >
                    {o.status}
                  </span>
                  <Link
                    to={`/orders/${o.order_id}`}
                    className="ff-underline"
                    style={{ color: theme.color.primary, fontWeight: 600, whiteSpace: 'nowrap', textDecoration: 'none' }}
                  >
                    Track ➡️
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}
