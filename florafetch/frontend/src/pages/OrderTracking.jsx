import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrder } from '../api/orders.js';
import { formatDate } from '../utils/format.js';
import OrderStatusStepper from '../components/OrderStatusStepper.jsx';
import OrderItemList from '../components/OrderItemList.jsx';
import DeliveryInfo from '../components/DeliveryInfo.jsx';
import Container from '../components/ui/Container.jsx';
import Button from '../components/ui/Button.jsx';
import { theme } from '../styles/theme.js';

function StatusCard({ emoji, title, text }) {
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
        {emoji ? <div style={{ fontSize: '3.2rem' }} aria-hidden="true">{emoji}</div> : null}
        <h1 style={{ color: theme.color.ink, margin: '0.75rem 0 0.4rem', fontSize: '1.5rem' }}>{title}</h1>
        <p style={{ color: theme.color.muted, margin: '0 0 1.5rem' }}>{text}</p>
        <Button to="/profile" variant="ghost">
          ← View your orders
        </Button>
      </div>
    </Container>
  );
}

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | notfound | error

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setOrder(null);
    getOrder(id)
      .then((data) => {
        if (!active) return;
        setOrder(data.order);
        setStatus('ready');
      })
      .catch((err) => {
        if (!active) return;
        setStatus(err.response?.status === 404 ? 'notfound' : 'error');
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (status === 'loading') {
    return (
      <Container style={{ padding: '4rem 1.5rem', textAlign: 'center', color: theme.color.muted }}>
        Loading order…
      </Container>
    );
  }

  if (status === 'notfound') {
    return (
      <StatusCard
        emoji="🔎"
        title="Order not found"
        text="We couldn't find this order under your account."
      />
    );
  }

  if (status === 'error') {
    return (
      <StatusCard
        title="Something went wrong"
        text="We couldn't load this order. Please try again."
      />
    );
  }

  return (
    <Container as="div" className="ff-page" style={{ padding: '2.5rem 1.5rem 3.5rem' }}>
      <Link
        to="/profile"
        className="ff-underline"
        style={{ color: theme.color.primary, fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none' }}
      >
        ← Back to your orders
      </Link>

      <div
        style={{
          background: '#fff',
          border: `1px solid ${theme.color.border}`,
          borderRadius: theme.radius.lg,
          boxShadow: theme.shadow.sm,
          padding: '1.5rem 1.75rem',
          margin: '1rem 0 1.5rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            flexWrap: 'wrap',
            gap: '0.5rem',
          }}
        >
          <h1 style={{ color: theme.color.ink, margin: 0, fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            Order #{order.order_id}
          </h1>
          <span style={{ color: theme.color.muted, fontSize: '0.9rem' }}>Placed {formatDate(order.created_at)}</span>
        </div>

        <OrderStatusStepper status={order.status} />
      </div>

      <div className="ff-split" style={{ '--ff-aside': 'minmax(260px, 340px)' }}>
        <OrderItemList items={order.items || []} />
        <DeliveryInfo order={order} />
      </div>
    </Container>
  );
}
