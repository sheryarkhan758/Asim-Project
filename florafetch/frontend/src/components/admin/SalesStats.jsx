import { formatPKR } from '../../utils/format.js';
import { theme } from '../../styles/theme.js';

const STATUSES = ['Confirmed', 'Quality Check', 'In Transit', 'Delivered'];
const STATUS_COLOR = {
  Confirmed: '#0d6efd',
  'Quality Check': '#b8860b',
  'In Transit': '#8a5a00',
  Delivered: '#1b7a3d',
};

// Clean KPI card: a thin top accent, a small colour dot beside the label and a
// large figure. No decorative icons — the number is the focus.
function StatCard({ label, value, accent, big }) {
  const c = accent || theme.color.primary;
  return (
    <div
      className="ff-card"
      style={{
        background: '#fff',
        border: `1px solid ${theme.color.border}`,
        borderTop: `3px solid ${c}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.sm,
        padding: '1.25rem 1.4rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span style={{ width: 9, height: 9, borderRadius: '50%', background: c, flexShrink: 0 }} aria-hidden="true" />
        <span
          style={{
            fontSize: '0.74rem',
            color: theme.color.muted,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          fontFamily: theme.font.head,
          fontSize: big ? '2rem' : '1.7rem',
          fontWeight: 800,
          color: theme.color.ink,
          marginTop: '0.5rem',
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
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
      <h2
        style={{
          fontFamily: theme.font.head,
          color: theme.color.ink,
          fontSize: '1.25rem',
          fontWeight: 700,
          margin: '0 0 1rem',
        }}
      >
        Sales overview
      </h2>

      {/* Headline totals */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <StatCard label="Total orders" value={totalOrders} accent={theme.color.primary} big />
        <StatCard label="Total revenue" value={formatPKR(totalRevenue)} accent={theme.color.accent} big />
      </div>

      {/* Per-status breakdown */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '1rem',
        }}
      >
        {STATUSES.map((s) => (
          <StatCard key={s} label={s} value={byStatus[s]} accent={STATUS_COLOR[s]} />
        ))}
      </div>
    </section>
  );
}
