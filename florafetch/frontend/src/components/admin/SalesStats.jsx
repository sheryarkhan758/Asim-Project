import { formatPKR } from '../../utils/format.js';
import { theme } from '../../styles/theme.js';

const STATUSES = ['Confirmed', 'Quality Check', 'In Transit', 'Delivered'];
const STATUS_COLOR = {
  Confirmed: '#0d6efd',
  'Quality Check': '#b8860b',
  'In Transit': '#8a5a00',
  Delivered: '#1b7a3d',
};
const STATUS_ICON = {
  Confirmed: '✅',
  'Quality Check': '🔍',
  'In Transit': '🚚',
  Delivered: '📬',
};

function StatCard({ label, value, accent, icon, big }) {
  return (
    <div
      className="ff-card"
      style={{
        background: '#fff',
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.sm,
        padding: '1.35rem 1.4rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          flexShrink: 0,
          borderRadius: theme.radius.md,
          background: theme.color.primarySoft,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.35rem',
        }}
        aria-hidden="true"
      >
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: '0.74rem',
            color: theme.color.muted,
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: theme.font.head,
            fontSize: big ? '1.85rem' : '1.6rem',
            fontWeight: 800,
            color: accent || theme.color.primary,
            marginTop: '0.25rem',
            lineHeight: 1.1,
          }}
        >
          {value}
        </div>
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
        <StatCard label="Total orders" value={totalOrders} accent={theme.color.primary} icon="🧾" big />
        <StatCard label="Total revenue" value={formatPKR(totalRevenue)} accent={theme.color.accent} icon="💰" big />
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
          <StatCard key={s} label={s} value={byStatus[s]} accent={STATUS_COLOR[s]} icon={STATUS_ICON[s]} />
        ))}
      </div>
    </section>
  );
}
