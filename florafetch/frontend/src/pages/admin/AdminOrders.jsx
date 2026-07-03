import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../api/orders.js';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import OrderTable from '../../components/admin/OrderTable.jsx';
import { theme } from '../../styles/theme.js';

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [savingId, setSavingId] = useState(null);
  const [feedback, setFeedback] = useState(null); // { type, text }

  useEffect(() => {
    let active = true;
    getAllOrders()
      .then((data) => {
        if (!active) return;
        setOrders(data.orders || []);
        setStatus('ready');
      })
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
  }, []);

  const flash = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleStatusChange = async (order, newStatus) => {
    if (newStatus === order.status) return;
    setSavingId(order.order_id);
    try {
      const { order: updated } = await updateOrderStatus(order.order_id, newStatus);
      // Patch just this row's status from the server's response.
      setOrders((prev) =>
        prev.map((o) => (o.order_id === order.order_id ? { ...o, status: updated.status } : o))
      );
      flash('ok', `Order #${order.order_id} → ${updated.status}`);
    } catch (err) {
      flash('err', err.response?.data?.error || 'Could not update order status.');
    } finally {
      setSavingId(null);
    }
  };

  return (
    <AdminLayout title="Orders">
      {feedback ? (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.75rem 1rem',
            borderRadius: theme.radius.md,
            fontSize: '0.9rem',
            fontWeight: 600,
            background: feedback.type === 'ok' ? theme.color.primarySoft : '#fdecea',
            border: `1px solid ${feedback.type === 'ok' ? '#b6ddc2' : '#f5c2c0'}`,
            color: feedback.type === 'ok' ? theme.color.primary : '#a1231d',
          }}
        >
          {feedback.text}
        </div>
      ) : null}

      <div style={{ background: '#fff', border: `1px solid ${theme.color.border}`, borderRadius: theme.radius.lg, boxShadow: theme.shadow.sm, padding: '1.35rem' }}>
        {status === 'loading' && <p style={{ color: theme.color.muted }}>Loading orders…</p>}
        {status === 'error' && <p style={{ color: theme.color.danger }}>Could not load orders.</p>}
        {status === 'ready' &&
          (orders.length === 0 ? (
            <p style={{ color: theme.color.muted }}>No orders have been placed yet.</p>
          ) : (
            <OrderTable orders={orders} onStatusChange={handleStatusChange} savingId={savingId} />
          ))}
      </div>
    </AdminLayout>
  );
}
