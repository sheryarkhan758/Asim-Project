import { formatPKR } from '../utils/format.js';
import { theme } from '../styles/theme.js';

// Read-only summary of the cart at checkout: line items, Green Total, and the
// Cash on Delivery notice (this phase has no online payment).
export default function OrderReview({ items, total }) {
  return (
    <aside
      style={{
        background: '#fff',
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.md,
        padding: '1.5rem',
        height: 'fit-content',
      }}
    >
      <h3 style={{ margin: '0 0 1.1rem', color: theme.color.ink, fontSize: '1.15rem' }}>Order review</h3>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
        {items.map((item) => {
          const lineTotal = item.line_total != null ? item.line_total : item.price * item.quantity;
          return (
            <li key={item.cart_item_id} style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
              <span style={{ color: theme.color.body }}>
                {item.name} <span style={{ color: theme.color.muted }}>× {item.quantity}</span>
              </span>
              <span style={{ color: theme.color.ink, whiteSpace: 'nowrap', fontWeight: 600 }}>
                {formatPKR(lineTotal)}
              </span>
            </li>
          );
        })}
      </ul>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          padding: '0.95rem 0 0.35rem',
          borderTop: `1px solid ${theme.color.border}`,
          marginTop: '0.85rem',
        }}
      >
        <span style={{ fontWeight: 700, color: theme.color.ink }}>🌿 Green Total</span>
        <strong style={{ fontSize: '1.45rem', color: theme.color.primary }}>{formatPKR(total)}</strong>
      </div>

      {/* Cash on Delivery notice */}
      <div
        style={{
          marginTop: '0.85rem',
          padding: '0.85rem 1rem',
          borderRadius: theme.radius.md,
          background: theme.color.bgTint,
          border: `1px solid ${theme.color.border}`,
          color: theme.color.ink,
          fontSize: '0.85rem',
        }}
      >
        <strong>💵 Cash on Delivery</strong>
        <p style={{ margin: '0.3rem 0 0', color: theme.color.body }}>
          Pay in cash when your plants arrive — no online payment needed.
        </p>
      </div>
    </aside>
  );
}
