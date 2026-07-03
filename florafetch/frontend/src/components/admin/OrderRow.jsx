import { useState } from 'react';
import { getOrder } from '../../api/orders.js';
import StatusDropdown from './StatusDropdown.jsx';
import OrderItemList from '../OrderItemList.jsx';
import DeliveryInfo from '../DeliveryInfo.jsx';
import { formatPKR, formatDate } from '../../utils/format.js';

const td = { padding: '0.6rem 0.75rem', borderBottom: '1px solid #eef2ef', color: '#2f4a38', verticalAlign: 'middle' };
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
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', color: '#556' }}
          >
            {expanded ? '▾' : '▸'}
          </button>
        </td>
        <td style={{ ...td, fontWeight: 700 }}>#{order.order_id}</td>
        <td style={td}>
          <div>{order.customer_name || `User #${order.user_id}`}</div>
          {order.customer_email ? <div style={{ color: '#889', fontSize: '0.8rem' }}>{order.customer_email}</div> : null}
        </td>
        <td style={td}>{formatDate(order.created_at)}</td>
        <td style={td}>{formatPKR(order.total_amount)}</td>
        <td style={{ ...td, textAlign: 'right' }}>
          <StatusDropdown value={order.status} disabled={saving} onChange={(s) => onStatusChange(order, s)} />
        </td>
      </tr>

      {expanded ? (
        <tr>
          <td colSpan={COL_COUNT} style={{ padding: '0 0.75rem 1.25rem', background: '#f7faf8' }}>
            {detailStatus === 'loading' && <p style={{ color: '#667' }}>Loading order details…</p>}
            {detailStatus === 'error' && <p style={{ color: '#c0392b' }}>Could not load order details.</p>}
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
