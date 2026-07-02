import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { createOrder } from '../api/orders.js';
import AddressSelector from '../components/AddressSelector.jsx';
import DeliveryDatePicker from '../components/DeliveryDatePicker.jsx';
import OrderReview from '../components/OrderReview.jsx';
import PlaceOrderBtn from '../components/PlaceOrderBtn.jsx';

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
  border: '1px solid #e2e8e4',
  borderRadius: 12,
  padding: '1.25rem',
  background: '#fff',
  marginBottom: '1.25rem',
};

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
      <section style={{ padding: '3rem 2rem', fontFamily: 'sans-serif', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ fontSize: '3rem' }}>🌱✅</div>
        <h1 style={{ color: '#1b7a3d' }}>Order confirmed!</h1>
        <p style={{ color: '#556' }}>
          Thank you for your order <strong>#{confirmedOrder.order_id}</strong>. We'll prepare your plants
          with care. You'll pay <strong>Cash on Delivery</strong> when they arrive.
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <Link
            to={`/orders/${confirmedOrder.order_id}`}
            style={{ background: '#1b7a3d', color: '#fff', padding: '0.6rem 1.4rem', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}
          >
            Track your order →
          </Link>
          <Link
            to="/shop"
            style={{ border: '1px solid #1b7a3d', color: '#1b7a3d', padding: '0.6rem 1.4rem', borderRadius: 8, fontWeight: 700, textDecoration: 'none' }}
          >
            Continue shopping
          </Link>
        </div>
      </section>
    );
  }

  // --- Empty-cart guard ---
  if (items.length === 0) {
    return (
      <section style={{ padding: '3rem 2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>🛒</div>
        <h1 style={{ color: '#2f4a38' }}>Your cart is empty</h1>
        <p style={{ color: '#667' }}>Add some plants before checking out.</p>
        <Link to="/shop" style={{ color: '#1b7a3d', fontWeight: 600 }}>
          Browse plants →
        </Link>
      </section>
    );
  }

  // --- Checkout form ---
  return (
    <div className="ff-page" style={{ padding: '1.5rem', fontFamily: 'sans-serif', maxWidth: 1000, margin: '0 auto' }}>
      <h1 style={{ color: '#2f4a38', marginTop: 0 }}>Checkout</h1>

      <div className="ff-split" style={{ '--ff-aside': 'minmax(280px, 360px)' }}>
        {/* Left: delivery details */}
        <div>
          <div style={sectionStyle}>
            <AddressSelector saved={savedAddresses} onChange={setAddress} />
          </div>

          <div style={sectionStyle}>
            <DeliveryDatePicker value={deliveryDate} onChange={setDeliveryDate} min={today} />
          </div>

          <div style={sectionStyle}>
            <label htmlFor="special-instr" style={{ display: 'block', fontWeight: 700, color: '#2f4a38', marginBottom: '0.6rem' }}>
              Special handling instructions{' '}
              <span style={{ color: '#889', fontWeight: 400 }}>(optional)</span>
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
                padding: '0.6rem 0.75rem',
                borderRadius: 8,
                border: '1px solid #cdddd2',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                resize: 'vertical',
              }}
            />
          </div>
        </div>

        {/* Right: review + place order */}
        <div>
          <OrderReview items={items} total={total} />

          {error ? (
            <p style={{ color: '#c0392b', fontSize: '0.9rem', marginTop: '1rem' }}>{error}</p>
          ) : null}
          {!address.trim() ? (
            <p style={{ color: '#889', fontSize: '0.85rem', marginTop: '1rem' }}>
              Enter a delivery address to place your order.
            </p>
          ) : null}

          <div style={{ marginTop: '1rem' }}>
            <PlaceOrderBtn onClick={handlePlaceOrder} disabled={!canPlace} placing={placing} />
          </div>
        </div>
      </div>
    </div>
  );
}
