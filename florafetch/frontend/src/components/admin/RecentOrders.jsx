import { Link } from 'react-router-dom';
import { formatPKR, formatDate } from '../../utils/format.js';

const LIMIT = 8;
const STATUS_COLOR = {
  Confirmed: '#0d6efd',
  'Quality Check': '#b8860b',
  'In Transit': '#8a5a00',
  Delivered: '#1b7a3d',
};

const thStyle = { textAlign: 'left', padding: '0.6rem 0.75rem', color: '#889', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, borderBottom: '2px solid #e2e8e4' };
const tdStyle = { padding: '0.6rem 0.75rem', borderBottom: '1px solid #eef2ef', color: '#2f4a38' };

// Latest orders with quick links into order management (from the orders list).
export default function RecentOrders({ orders }) {
  const recent = [...orders]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at) || b.order_id - a.order_id)
    .slice(0, LIMIT);

  return (
    <section
      style={{
        background: '#fff',
        border: '1px solid #dfe5e0',
        borderRadius: 12,
        padding: '1.25rem',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <h2 style={{ color: '#14331f', margin: 0 }}>Recent orders</h2>
        <Link to="/admin/orders" style={{ color: '#1b7a3d', fontWeight: 600, fontSize: '0.9rem' }}>
          Manage all →
        </Link>
      </div>

      {recent.length === 0 ? (
        <p style={{ color: '#889', margin: '0.75rem 0 0' }}>No orders to show yet.</p>
      ) : (
        <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
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
                  <td style={{ ...tdStyle, fontWeight: 700 }}>#{o.order_id}</td>
                  <td style={tdStyle}>{formatDate(o.created_at)}</td>
                  <td style={tdStyle}>{formatPKR(o.total_amount)}</td>
                  <td style={tdStyle}>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: 999,
                        background: '#eef5f0',
                        color: STATUS_COLOR[o.status] || '#556',
                      }}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right' }}>
                    <Link to={`/orders/${o.order_id}`} style={{ color: '#1b7a3d', fontWeight: 600, whiteSpace: 'nowrap' }}>
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
