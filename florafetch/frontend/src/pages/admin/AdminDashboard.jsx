import { useEffect, useState } from 'react';
import { getOrders } from '../../api/orders.js';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import SalesStats from '../../components/admin/SalesStats.jsx';
import LowStockAlert from '../../components/admin/LowStockAlert.jsx';
import RecentOrders from '../../components/admin/RecentOrders.jsx';
import { theme } from '../../styles/theme.js';

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let active = true;
    getOrders()
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

  return (
    <AdminLayout title="Dashboard">
      {status === 'loading' && <p style={{ color: theme.color.muted }}>Loading dashboard…</p>}
      {status === 'error' && <p style={{ color: theme.color.danger }}>Could not load order data.</p>}

      {status === 'ready' && (
        <>
          <SalesStats orders={orders} />
          <LowStockAlert />
          <RecentOrders orders={orders} />
        </>
      )}
    </AdminLayout>
  );
}
