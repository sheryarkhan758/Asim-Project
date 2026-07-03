import { Link } from 'react-router-dom';
import { formatPKR, formatDate } from '../../utils/format.js';
import { theme } from '../../styles/theme.js';

const LIMIT = 8;
const STATUS_COLOR = {
  Confirmed: '#0d6efd',
  'Quality Check': '#b8860b',
  'In Transit': '#8a5a00',
  Delivered: '#1b7a3d',
};

const thStyle = {
  textAlign: 'left',
  padding: '0.7rem 0.85rem',
  color: theme.color.muted,
  fontSize: '0.72rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontWeight: 700,
  background: theme.color.bgSoft,
  borderBottom: `1px solid ${theme.color.border}`,
};
const tdStyle = {
  padding: '0.7rem 0.85rem',
  borderBottom: `1px solid ${theme.color.borderSoft}`,
  color: theme.color.ink,
};

// Latest orders with quick links into order management (from the orders list).
export default function RecentOrders({ orders }) {
  const recent = [...orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at) || b.order_id - a.order_id)
    .slice(0, LIMIT);

  return (
    <section
      style={{
        background: '#fff',
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.sm,
        padding: '1.35rem 1.5rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <h2
          style={{
            fontFamily: theme.font.head,
            color: theme.color.ink,
            fontSize: '1.15rem',
            fontWeight: 700,
            margin: 0,
          }}
        >
          Recent orders
        </h2>
        <Link
          to="/admin/orders"
          className="ff-underline"
          style={{ color: theme.color.primary, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}
        >
          Manage all →
        </Link>
      </div>

      {recent.length === 0 ? (
        <p style={{ color: theme.color.muted, margin: '0.75rem 0 0' }}>No orders to show yet.</p>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: '1rem', border: `1px solid ${theme.color.borderSoft}`, borderRadius: theme.radius.md }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 520 }}>
            <thead>
              <tr>
                <th style={thStyle}>Order</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Total</th>
                <th style={thStyle}>Status</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o.order_id}>
                  <td style={{ ...tdStyle, fontWeight: 700, color: theme.color.primary }}>#{o.order_id}</td>
                  <td style={{ ...tdStyle, color: theme.color.body }}>{formatDate(o.created_at)}</td>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{formatPKR(o.total_amount)}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        padding: '0.25rem 0.7rem',
                        borderRadius: theme.radius.pill,
                        background: theme.color.primarySoft,
                        color: STATUS_COLOR[o.status] || theme.color.body,
                      }}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <Link
                      to={`/orders/${o.order_id}`}
                      style={{ color: theme.color.primary, fontWeight: 700, whiteSpace: 'nowrap', textDecoration: 'none' }}
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
