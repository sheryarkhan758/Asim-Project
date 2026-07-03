import { theme } from '../../styles/theme.js';

// Customer quote card: star rating, quote, and an avatar + name/location row.
export default function Testimonial({ quote, name, location, avatar = '🌱', rating = 5, style }) {
  return (
    <figure
      className="ff-card"
      style={{
        margin: 0,
        background: '#fff',
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.lg,
        padding: '1.6rem',
        boxShadow: theme.shadow.sm,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.9rem',
        height: '100%',
        ...style,
      }}
    >
      <div aria-label={`${rating} out of 5 stars`} style={{ color: theme.color.star, fontSize: '1rem', letterSpacing: '0.1em' }}>
        {'★'.repeat(rating)}
        <span style={{ color: '#e2e8e4' }}>{'★'.repeat(5 - rating)}</span>
      </div>
      <blockquote style={{ margin: 0, color: theme.color.body, fontSize: '1rem', lineHeight: 1.65 }}>
        “{quote}”
      </blockquote>
      <figcaption style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginTop: 'auto' }}>
        <span
          aria-hidden="true"
          style={{
            width: 42,
            height: 42,
            borderRadius: '50%',
            background: theme.color.primarySoft,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
          }}
        >
          {avatar}
        </span>
        <span>
          <strong style={{ display: 'block', color: theme.color.ink, fontSize: '0.95rem' }}>{name}</strong>
          <span style={{ color: theme.color.faint, fontSize: '0.82rem' }}>{location}</span>
        </span>
      </figcaption>
    </figure>
  );
}
