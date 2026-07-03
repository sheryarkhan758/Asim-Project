import { useCart } from '../context/CartContext.jsx';
import CartTable from '../components/CartTable.jsx';
import OrderSummary from '../components/OrderSummary.jsx';
import Container from '../components/ui/Container.jsx';
import Button from '../components/ui/Button.jsx';
import { theme } from '../styles/theme.js';

export default function Cart() {
  const { items, count, total, loading } = useCart();

  // Initial load (only shown before the first cart snapshot arrives).
  if (loading && items.length === 0) {
    return (
      <Container style={{ padding: '4rem 1.5rem', textAlign: 'center', color: theme.color.muted }}>
        Loading your cart…
      </Container>
    );
  }

  // Empty-cart state.
  if (items.length === 0) {
    return (
      <Container style={{ padding: '4.5rem 1.5rem', textAlign: 'center' }}>
        <div
          style={{
            maxWidth: 460,
            margin: '0 auto',
            background: '#fff',
            border: `1px solid ${theme.color.border}`,
            borderRadius: theme.radius.xl,
            boxShadow: theme.shadow.sm,
            padding: '3rem 2rem',
          }}
        >
          <div style={{ fontSize: '3.4rem' }} aria-hidden="true">🪴</div>
          <h1 style={{ color: theme.color.ink, margin: '0.75rem 0 0.4rem', fontSize: '1.6rem' }}>
            Your cart is empty
          </h1>
          <p style={{ color: theme.color.muted, margin: '0 0 1.5rem' }}>
            Add some greenery to get started.
          </p>
          <Button to="/shop" variant="primary" shine>
            Browse plants →
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container as="div" className="ff-page" style={{ padding: '2.5rem 1.5rem 3.5rem' }}>
      <span
        style={{
          display: 'inline-block',
          fontWeight: 700,
          fontSize: '0.72rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: theme.color.primary,
          background: theme.color.primarySoft,
          padding: '0.3rem 0.8rem',
          borderRadius: theme.radius.pill,
        }}
      >
        Your basket
      </span>
      <h1 style={{ color: theme.color.ink, margin: '0.75rem 0 1.75rem', fontSize: 'clamp(1.7rem, 3vw, 2.2rem)' }}>
        Shopping cart{' '}
        <span style={{ color: theme.color.muted, fontSize: '1.1rem', fontWeight: 500 }}>({count})</span>
      </h1>

      <div className="ff-split" style={{ '--ff-aside': 'minmax(260px, 320px)' }}>
        <div style={{ minWidth: 0 }}>
          <CartTable items={items} />
        </div>
        <OrderSummary total={total} itemCount={count} />
      </div>
    </Container>
  );
}
