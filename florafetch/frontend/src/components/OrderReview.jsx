import { formatPKR } from '../utils/format.js';

// Read-only summary of the cart at checkout: line items, Green Total, and the
// Cash on Delivery notice (this phase has no online payment).
export default function OrderReview({ items, total }) {
  return (
    <aside
      style={{
        fontFamily: 'sans-serif',
        border: '1px solid #e2e8e4',
        borderRadius: 12,
        padding: '1.25rem',
        background: '#fbfdfb',
        height: 'fit-content',
      }}
    >
      <h3 style={{ margin: '0 0 1rem', color: '#2f4a38' }}>Order review</h3>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {items.map((item) => {
          const lineTotal = item.line_total != null ? item.line_total : item.price * item.quantity;
          return (
            <li key={item.cart_item_id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
              <span style={{ color: '#445' }}>
                {item.name} <span style={{ color: '#889' }}>× {item.quantity}</span>
              </span>
              <span style={{ color: '#2f4a38', whiteSpace: 'nowrap' }}>{formatPKR(lineTotal)}</span>
            </li>
          );
        })}
      </ul>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          padding: '0.75rem 0',
          borderTop: '1px solid #e2e8e4',
          marginTop: '0.75rem',
        }}
      >
        <span style={{ fontWeight: 700, color: '#2f4a38' }}>🌿 Green Total</span>
        <strong style={{ fontSize: '1.3rem', color: '#1b7a3d' }}>{formatPKR(total)}</strong>
      </div>

      {/* Cash on Delivery notice */}
      <div
        style={{
          marginTop: '0.5rem',
          padding: '0.75rem',
          borderRadius: 8,
          background: '#eef7f0',
          border: '1px solid #d4e8da',
          color: '#2f4a38',
          fontSize: '0.85rem',
        }}
      >
        <strong>💵 Cash on Delivery</strong>
        <p style={{ margin: '0.25rem 0 0', color: '#556' }}>
          Pay in cash when your plants arrive — no online payment needed.
        </p>
      </div>
    </aside>
  );
}
