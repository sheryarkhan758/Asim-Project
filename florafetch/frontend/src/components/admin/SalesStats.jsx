import { formatPKR } from '../../utils/format.js';

const STATUSES = ['Confirmed', 'Quality Check', 'In Transit', 'Delivered'];
const STATUS_COLOR = {
  Confirmed: '#0d6efd',
  'Quality Check': '#b8860b',
  'In Transit': '#8a5a00',
  Delivered: '#1b7a3d',
};

function StatCard({ label, value, accent }) {
  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #dfe5e0',
        borderRadius: 12,
        padding: '1.1rem 1.25rem',
        borderTop: `4px solid ${accent || '#1b7a3d'}`,
      }}
    >
      <div style={{ fontSize: '0.8rem', color: '#889', fontWeight: 700, textTransform: 'uppercase' }}>{label}</div>
      <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#14331f', marginTop: '0.35rem' }}>{value}</div>
    </div>
  );
}

// Totals + per-status breakdown computed from the admin's orders list.
export default function SalesStats({ orders }) {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);
  const byStatus = STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  return (
    <section style={{ marginBottom: '2rem' }}>
      <h2 style={{ color: '#14331f' }}>Sales overview</h2>

      {/* Headline totals */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
        <StatCard label="Total orders" value={totalOrders} accent="#1b7a3d" />
        <StatCard label="Total revenue" value={formatPKR(totalRevenue)} accent="#0d6efd" />
      </div>

      {/* Per-status breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
        {STATUSES.map((s) => (
          <StatCard key={s} label={s} value={byStatus[s]} accent={STATUS_COLOR[s]} />
        ))}
      </div>
    </section>
  );
}
