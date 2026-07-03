import CartItem from './CartItem.jsx';
import { theme } from '../styles/theme.js';

// The list of cart lines. Each CartItem reads/writes the cart via CartContext.
export default function CartTable({ items }) {
  return (
    <div
      style={{
        background: '#fff',
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.sm,
        padding: '0.5rem 1.5rem',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '72px 1fr auto',
          gap: '1rem',
          padding: '0.9rem 0',
          borderBottom: `2px solid ${theme.color.border}`,
          color: theme.color.faint,
          fontSize: '0.72rem',
          fontWeight: 700,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        <span>Item</span>
        <span>Details</span>
        <span style={{ textAlign: 'right' }}>Total</span>
      </div>

      {items.map((item) => (
        <CartItem key={item.cart_item_id} item={item} />
      ))}
    </div>
  );
}
