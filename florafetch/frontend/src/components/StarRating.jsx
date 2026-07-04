import { theme } from '../styles/theme.js';

// Renders a 1-5 star rating. Read-only display used across reviews.
export default function StarRating({ rating, size = 16 }) {
  const value = Math.max(0, Math.min(5, Math.round(Number(rating) || 0)));
  return (
    <span aria-label={`${value} out of 5 stars`} style={{ whiteSpace: 'nowrap', lineHeight: 1, letterSpacing: '1px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} style={{ color: i <= value ? theme.color.star : theme.color.border, fontSize: size }}>
          {i <= value ? '⭐' : '☆'}
        </span>
      ))}
    </span>
  );
}
