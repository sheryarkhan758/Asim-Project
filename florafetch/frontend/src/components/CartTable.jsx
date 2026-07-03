import CartItem from './CartItem.jsx';

// The list of cart lines. Each CartItem reads/writes the cart via CartContext.
export default function CartTable({ items }) {
  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '64px 1fr auto',
          gap: '1rem',
          paddingBottom: '0.5rem',
          borderBottom: '2px solid #e2e8e4',
          color: '#889',
          fontSize: '0.8rem',
          fontWeight: 700,
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
