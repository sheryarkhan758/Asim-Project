import OrderRow from './OrderRow.jsx';

const th = { textAlign: 'left', padding: '0.6rem 0.75rem', color: '#889', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, borderBottom: '2px solid #e2e8e4' };

// All orders with a per-row StatusDropdown and expandable detail.
export default function OrderTable({ orders, onStatusChange, savingId }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700, fontFamily: 'sans-serif' }}>
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
