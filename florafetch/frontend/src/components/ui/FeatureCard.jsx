import { theme } from '../../styles/theme.js';

// Icon + title + description tile. Used in benefit/feature grids. Lifts on
// hover via the shared `.ff-card` class.
export default function FeatureCard({ icon, title, children, style }) {
  return (
    <div
      className="ff-card"
      style={{
        background: '#fff',
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.lg,
        padding: '1.6rem 1.4rem',
        boxShadow: theme.shadow.sm,
        height: '100%',
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 52,
          height: 52,
          borderRadius: 14,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.6rem',
          background: theme.color.primarySoft,
          marginBottom: '1rem',
        }}
      >
        {icon}
      </div>
      <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.12rem', color: theme.color.ink }}>{title}</h3>
      <p style={{ margin: 0, color: theme.color.muted, fontSize: '0.95rem', lineHeight: 1.6 }}>
        {children}
      </p>
    </div>
  );
}
