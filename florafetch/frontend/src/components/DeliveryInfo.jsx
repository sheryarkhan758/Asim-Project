import { formatPKR, formatDate } from '../utils/format.js';

const rowStyle = { display: 'flex', gap: '0.75rem', padding: '0.5rem 0', borderBottom: '1px solid #eef2ef' };
const labelStyle = { minWidth: 130, color: '#889', fontWeight: 600, fontSize: '0.85rem' };
const valueStyle = { color: '#2f4a38', flex: 1 };

// Delivery + payment details for an order.
export default function DeliveryInfo({ order }) {
  const date = formatDate(order.delivery_date);

  return (
    <section
      style={{
        fontFamily: 'sans-serif',
        border: '1px solid #e2e8e4',
        borderRadius: 12,
        padding: '1.25rem',
        background: '#fbfdfb',
        height: 'fit-content',
      }}
    >
      <h2 style={{ color: '#2f4a38', marginTop: 0 }}>Delivery details</h2>

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
        <span style={valueStyle}>
          💵 {order.payment_method || 'COD'} — pay on delivery
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '0.85rem', marginTop: '0.35rem' }}>
        <span style={{ fontWeight: 700, color: '#2f4a38' }}>🌿 Green Total</span>
        <strong style={{ fontSize: '1.25rem', color: '#1b7a3d' }}>{formatPKR(order.total_amount)}</strong>
      </div>
    </section>
  );
}
