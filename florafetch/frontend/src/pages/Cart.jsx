import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext.jsx';
import CartTable from '../components/CartTable.jsx';
import OrderSummary from '../components/OrderSummary.jsx';

export default function Cart() {
  const { items, count, total, loading } = useCart();

  // Initial load (only shown before the first cart snapshot arrives).
  if (loading && items.length === 0) {
    return <p style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#667' }}>Loading your cart…</p>;
  }

  // Empty-cart state.
  if (items.length === 0) {
    return (
      <section style={{ padding: '3rem 2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>🛒</div>
        <h1 style={{ color: '#2f4a38' }}>Your cart is empty</h1>
        <p style={{ color: '#667' }}>Add some greenery to get started.</p>
        <Link
          to="/shop"
          style={{
            display: 'inline-block',
            marginTop: '0.5rem',
            background: '#1b7a3d',
            color: '#fff',
            padding: '0.6rem 1.4rem',
            borderRadius: 8,
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Browse plants →
        </Link>
      </section>
    );
  }

  return (
    <div className="ff-page" style={{ padding: '1.5rem', fontFamily: 'sans-serif', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ color: '#2f4a38', marginTop: 0 }}>Your cart</h1>

      <div className="ff-split" style={{ '--ff-aside': 'minmax(260px, 300px)' }}>
        <div style={{ minWidth: 0 }}>
          <CartTable items={items} />
        </div>
        <OrderSummary total={total} itemCount={count} />
      </div>
    </div>
  );
}
