import { formatPKR, formatDate } from '../utils/format.js';
import { theme } from '../styles/theme.js';

const rowStyle = {
  display: 'flex',
  gap: '0.75rem',
  padding: '0.7rem 0',
  borderBottom: `1px solid ${theme.color.borderSoft}`,
};
const labelStyle = { minWidth: 130, color: theme.color.muted, fontWeight: 600, fontSize: '0.85rem' };
const valueStyle = { color: theme.color.ink, flex: 1 };

// Delivery + payment details for an order.
export default function DeliveryInfo({ order }) {
  const date = formatDate(order.delivery_date);

  return (
    <section
      style={{
        background: '#fff',
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.sm,
        padding: '1.5rem',
        height: 'fit-content',
      }}
    >
      <h2 style={{ color: theme.color.ink, marginTop: 0, marginBottom: '0.75rem', fontSize: '1.2rem' }}>
        Delivery details
      </h2>

      <div style={rowStyle}>
        <span style={labelStyle}>Address</span>
        <span style={valueStyle}>{order.delivery_address}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Delivery date</span>
        <span style={valueStyle}>{date || 'As soon as possible'}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Instructions</span>
        <span style={valueStyle}>{order.special_instr || '—'}</span>
      </div>
      <div style={rowStyle}>
        <span style={labelStyle}>Payment</span>
        <span style={valueStyle}>💵 {order.payment_method || 'COD'} — pay on delivery</span>
      </div>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          paddingTop: '1rem',
          marginTop: '0.35rem',
        }}
      >
        <span style={{ fontWeight: 700, color: theme.color.ink }}>🌿 Green Total</span>
        <strong style={{ fontSize: '1.35rem', color: theme.color.primary }}>{formatPKR(order.total_amount)}</strong>
      </div>
    </section>
  );
}
