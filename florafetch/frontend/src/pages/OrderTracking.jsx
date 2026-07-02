import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getOrder } from '../api/orders.js';
import { formatDate } from '../utils/format.js';
import OrderStatusStepper from '../components/OrderStatusStepper.jsx';
import OrderItemList from '../components/OrderItemList.jsx';
import DeliveryInfo from '../components/DeliveryInfo.jsx';

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
    return <p style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#667' }}>Loading order…</p>;
  }

  if (status === 'notfound') {
    return (
      <section style={{ padding: '3rem 2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>🔎</div>
        <h1 style={{ color: '#2f4a38' }}>Order not found</h1>
        <p style={{ color: '#667' }}>We couldn't find this order under your account.</p>
        <Link to="/profile" style={{ color: '#1b7a3d', fontWeight: 600 }}>
          ← View your orders
        </Link>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section style={{ padding: '3rem 2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h1 style={{ color: '#2f4a38' }}>Something went wrong</h1>
        <p style={{ color: '#667' }}>We couldn't load this order. Please try again.</p>
        <Link to="/profile" style={{ color: '#1b7a3d', fontWeight: 600 }}>
          ← View your orders
        </Link>
      </section>
    );
  }

  return (
    <div className="ff-page" style={{ padding: '1.5rem', fontFamily: 'sans-serif', maxWidth: 900, margin: '0 auto' }}>
      <Link to="/profile" style={{ color: '#1b7a3d', fontSize: '0.9rem', fontWeight: 600 }}>
        ← Back to your orders
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.75rem' }}>
        <h1 style={{ color: '#2f4a38', margin: 0 }}>Order #{order.order_id}</h1>
        <span style={{ color: '#889' }}>Placed {formatDate(order.created_at)}</span>
      </div>

      <OrderStatusStepper status={order.status} />

      <div className="ff-split" style={{ '--ff-aside': 'minmax(260px, 340px)' }}>
        <OrderItemList items={order.items || []} />
        <DeliveryInfo order={order} />
      </div>
    </div>
  );
}
