import { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { createOrder } from '../api/orders.js';
import AddressSelector from '../components/AddressSelector.jsx';
import DeliveryDatePicker from '../components/DeliveryDatePicker.jsx';
import OrderReview from '../components/OrderReview.jsx';
import PlaceOrderBtn from '../components/PlaceOrderBtn.jsx';
import Container from '../components/ui/Container.jsx';
import Button from '../components/ui/Button.jsx';
import { theme } from '../styles/theme.js';

// Normalize the user's app-defined `addresses` blob into [{ label, text }].
// Handles arrays of strings, arrays of objects, or a single string.
function normalizeAddresses(addresses) {
  const toEntry = (a, i) => {
    if (typeof a === 'string') return a.trim() ? { label: '', text: a.trim() } : null;
    if (a && typeof a === 'object') {
      const text = a.address || a.text || a.full || a.line || '';
      return text ? { label: a.label || a.name || `Address ${i + 1}`, text } : null;
    }
    return null;
  };
  if (!addresses) return [];
  if (Array.isArray(addresses)) return addresses.map(toEntry).filter(Boolean);
  const single = toEntry(addresses, 0);
  return single ? [single] : [];
}

const sectionStyle = {
  background: '#fff',
  border: `1px solid ${theme.color.border}`,
  borderRadius: theme.radius.lg,
  boxShadow: theme.shadow.sm,
  padding: '1.5rem',
  marginBottom: '1.5rem',
};

const stepBadge = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 26,
  height: 26,
  borderRadius: theme.radius.pill,
  background: theme.color.primarySoft,
  color: theme.color.primary,
  fontWeight: 800,
  fontSize: '0.85rem',
  marginRight: '0.6rem',
};

const labelStyle = { display: 'block', fontWeight: 700, color: theme.color.ink, marginBottom: '0.6rem' };

export default function Checkout() {
  const { user } = useAuth();
  const { items, total, refreshCart } = useCart();

  const savedAddresses = useMemo(() => normalizeAddresses(user?.addresses), [user]);
  const today = new Date().toISOString().slice(0, 10);

  const [address, setAddress] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [specialInstr, setSpecialInstr] = useState('');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const canPlace = address.trim().length > 0 && items.length > 0;

  const handlePlaceOrder = async () => {
    if (!canPlace) return;
    setError('');
    setPlacing(true);
    try {
      const { order } = await createOrder({
        delivery_address: address.trim(),
        delivery_date: deliveryDate || null,
        special_instr: specialInstr.trim() || null,
      });
      await refreshCart(); // backend emptied the cart on success — resync UI
      setConfirmedOrder(order);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not place your order. Please try again.');
    } finally {
      setPlacing(false);
    }
  };

  // --- Confirmation view (after a successful order) ---
  if (confirmedOrder) {
    return (
      <Container style={{ padding: '4rem 1.5rem', maxWidth: 620 }}>
        <div
          style={{
            background: '#fff',
            border: `1px solid ${theme.color.border}`,
            borderRadius: theme.radius.xl,
            boxShadow: theme.shadow.md,
            padding: '3rem 2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3.2rem' }} aria-hidden="true">🌱✅</div>
          <h1 style={{ color: theme.color.primary, margin: '0.75rem 0 0.5rem', fontSize: '1.7rem' }}>
            Order confirmed!
          </h1>
          <p style={{ color: theme.color.body, lineHeight: 1.6, margin: '0 auto', maxWidth: 440 }}>
            Thank you for your order <strong style={{ color: theme.color.ink }}>#{confirmedOrder.order_id}</strong>.
            We'll prepare your plants with care. You'll pay{' '}
            <strong style={{ color: theme.color.ink }}>Cash on Delivery</strong> when they arrive.
          </p>
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.75rem', flexWrap: 'wrap' }}>
            <Button to={`/orders/${confirmedOrder.order_id}`} variant="primary" shine>
              Track your order →
            </Button>
            <Button to="/shop" variant="ghost">
              Continue shopping
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  // --- Empty-cart guard ---
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
          <div style={{ fontSize: '3.4rem' }} aria-hidden="true">🛒</div>
          <h1 style={{ color: theme.color.ink, margin: '0.75rem 0 0.4rem', fontSize: '1.6rem' }}>
            Your cart is empty
          </h1>
          <p style={{ color: theme.color.muted, margin: '0 0 1.5rem' }}>Add some plants before checking out.</p>
          <Button to="/shop" variant="primary" shine>
            Browse plants →
          </Button>
        </div>
      </Container>
    );
  }

  // --- Checkout form ---
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
        Almost there
      </span>
      <h1 style={{ color: theme.color.ink, margin: '0.75rem 0 1.75rem', fontSize: 'clamp(1.7rem, 3vw, 2.2rem)' }}>
        Checkout
      </h1>

      <div className="ff-split" style={{ '--ff-aside': 'minmax(280px, 360px)' }}>
        {/* Left: delivery details */}
        <div>
          <div style={sectionStyle}>
            <h2 style={{ display: 'flex', alignItems: 'center', margin: '0 0 1rem', color: theme.color.ink, fontSize: '1.15rem' }}>
              <span style={stepBadge}>1</span>Delivery address
            </h2>
            <AddressSelector saved={savedAddresses} onChange={setAddress} />
          </div>

          <div style={sectionStyle}>
            <h2 style={{ display: 'flex', alignItems: 'center', margin: '0 0 1rem', color: theme.color.ink, fontSize: '1.15rem' }}>
              <span style={stepBadge}>2</span>Delivery preferences
            </h2>
            <DeliveryDatePicker value={deliveryDate} onChange={setDeliveryDate} min={today} />

            <div style={{ marginTop: '1.25rem' }}>
              <label htmlFor="special-instr" style={labelStyle}>
                Special handling instructions{' '}
                <span style={{ color: theme.color.muted, fontWeight: 400 }}>(optional)</span>
              </label>
              <textarea
                id="special-instr"
                value={specialInstr}
                onChange={(e) => setSpecialInstr(e.target.value)}
                placeholder="e.g. Fragile — leave at the door, call on arrival, keep upright…"
                rows={3}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.7rem 0.85rem',
                  borderRadius: theme.radius.md,
                  border: `1px solid ${theme.color.border}`,
                  fontSize: '0.95rem',
                  fontFamily: theme.font.body,
                  background: theme.color.bgSoft,
                  resize: 'vertical',
                }}
              />
            </div>
          </div>
        </div>

        {/* Right: review + place order */}
        <div style={{ position: 'sticky', top: '1.5rem' }}>
          <OrderReview items={items} total={total} />

          {error ? (
            <p
              style={{
                color: theme.color.danger,
                fontSize: '0.9rem',
                marginTop: '1rem',
                background: '#fdecea',
                border: '1px solid #f5c6c0',
                borderRadius: theme.radius.md,
                padding: '0.7rem 0.85rem',
              }}
            >
              {error}
            </p>
          ) : null}
          {!address.trim() ? (
            <p style={{ color: theme.color.muted, fontSize: '0.85rem', marginTop: '1rem', textAlign: 'center' }}>
              Enter a delivery address to place your order.
            </p>
          ) : null}

          <div style={{ marginTop: '1rem' }}>
            <PlaceOrderBtn onClick={handlePlaceOrder} disabled={!canPlace} placing={placing} />
          </div>
        </div>
      </div>
    </Container>
  );
}
