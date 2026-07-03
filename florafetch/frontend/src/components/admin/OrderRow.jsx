import { useState } from 'react';
import { getOrder } from '../../api/orders.js';
import StatusDropdown from './StatusDropdown.jsx';
import OrderItemList from '../OrderItemList.jsx';
import DeliveryInfo from '../DeliveryInfo.jsx';
import { formatPKR, formatDate } from '../../utils/format.js';
import { theme } from '../../styles/theme.js';

const td = { padding: '0.7rem 0.85rem', borderBottom: `1px solid ${theme.color.borderSoft}`, color: theme.color.ink, verticalAlign: 'middle' };
const COL_COUNT = 6;

// One order row plus a lazily-loaded, expandable detail (items + delivery info).
export default function OrderRow({ order, onStatusChange, saving }) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState(null);
  const [detailStatus, setDetailStatus] = useState('idle'); // idle | loading | ready | error

  const toggle = async () => {
    const next = !expanded;
    setExpanded(next);
    if (next && !detail && detailStatus !== 'loading') {
      setDetailStatus('loading');
      try {
        const data = await getOrder(order.order_id);
        setDetail(data.order);
        setDetailStatus('ready');
      } catch {
        setDetailStatus('error');
      }
    }
  };

  return (
    <>
      <tr>
        <td style={{ ...td, width: 36 }}>
          <button
            onClick={toggle}
            aria-label={expanded ? 'Collapse' : 'Expand'}
            aria-expanded={expanded}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: theme.color.muted }}
          >
            {expanded ? '▾' : '▸'}
          </button>
        </td>
        <td style={{ ...td, fontWeight: 700, color: theme.color.primary }}>#{order.order_id}</td>
        <td style={td}>
          <div style={{ fontWeight: 600 }}>{order.customer_name || `User #${order.user_id}`}</div>
          {order.customer_email ? <div style={{ color: theme.color.muted, fontSize: '0.8rem' }}>{order.customer_email}</div> : null}
        </td>
        <td style={{ ...td, color: theme.color.body }}>{formatDate(order.created_at)}</td>
        <td style={{ ...td, fontWeight: 600 }}>{formatPKR(order.total_amount)}</td>
        <td style={{ ...td, textAlign: 'right' }}>
          <StatusDropdown value={order.status} disabled={saving} onChange={(s) => onStatusChange(order, s)} />
        </td>
      </tr>

      {expanded ? (
        <tr>
          <td colSpan={COL_COUNT} style={{ padding: '0 0.85rem 1.25rem', background: theme.color.bgSoft }}>
            {detailStatus === 'loading' && <p style={{ color: theme.color.muted }}>Loading order details…</p>}
            {detailStatus === 'error' && <p style={{ color: theme.color.danger }}>Could not load order details.</p>}
            {detailStatus === 'ready' && detail ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem', paddingTop: '0.75rem' }}>
                <OrderItemList items={detail.items || []} />
                <DeliveryInfo order={detail} />
              </div>
            ) : null}
          </td>
        </tr>
      ) : null}
    </>
  );
}
