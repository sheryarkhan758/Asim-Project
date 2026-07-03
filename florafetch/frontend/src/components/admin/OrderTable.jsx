import OrderRow from './OrderRow.jsx';
import { theme } from '../../styles/theme.js';

const th = {
  textAlign: 'left',
  padding: '0.75rem 0.85rem',
  color: theme.color.muted,
  fontSize: '0.72rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontWeight: 700,
  background: theme.color.bgSoft,
  borderBottom: `1px solid ${theme.color.border}`,
};

// All orders with a per-row StatusDropdown and expandable detail.
export default function OrderTable({ orders, onStatusChange, savingId }) {
  return (
    <div style={{ overflowX: 'auto', border: `1px solid ${theme.color.borderSoft}`, borderRadius: theme.radius.md }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
        <thead>
          <tr>
            <th style={th} aria-label="Expand" />
            <th style={th}>Order</th>
            <th style={th}>Customer</th>
            <th style={th}>Date</th>
            <th style={th}>Total</th>
            <th style={{ ...th, textAlign: 'right' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <OrderRow
              key={o.order_id}
              order={o}
              onStatusChange={onStatusChange}
              saving={savingId === o.order_id}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}
