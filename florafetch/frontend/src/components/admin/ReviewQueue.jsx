import { useState } from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating.jsx';
import ApproveBtn from './ApproveBtn.jsx';
import { formatDate } from '../../utils/format.js';
import { theme } from '../../styles/theme.js';

function ReviewPhoto({ url, alt }) {
  const [error, setError] = useState(false);
  if (!url || error) return null;
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      style={{ marginTop: '0.75rem', maxWidth: 180, borderRadius: theme.radius.md, border: `1px solid ${theme.color.border}`, display: 'block' }}
    />
  );
}

// A single pending review card.
function ReviewCard({ review, onApprove, approving }) {
  return (
    <li
      className="ff-card"
      style={{
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.sm,
        padding: '1.35rem 1.5rem',
        background: '#fff',
        borderLeft: `4px solid ${theme.color.star}`,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <StarRating rating={review.rating} />
            <strong style={{ fontFamily: theme.font.head, color: theme.color.ink }}>{review.reviewer || 'Anonymous'}</strong>
            <span style={{ color: theme.color.muted, fontSize: '0.8rem' }}>{formatDate(review.created_at)}</span>
          </div>
          <div style={{ marginTop: '0.4rem', color: theme.color.muted, fontSize: '0.9rem' }}>
            on{' '}
            <Link to={`/plant/${review.plant_id}`} style={{ color: theme.color.primary, fontWeight: 700, textDecoration: 'none' }}>
              {review.plant_name || `Plant #${review.plant_id}`}
            </Link>
          </div>
        </div>
        <ApproveBtn onClick={() => onApprove(review)} approving={approving} />
      </div>

      {review.review_text ? (
        <p
          style={{
            margin: '1rem 0 0',
            color: theme.color.body,
            lineHeight: 1.6,
            fontStyle: 'italic',
            paddingLeft: '0.9rem',
            borderLeft: `3px solid ${theme.color.borderSoft}`,
          }}
        >
          “{review.review_text}”
        </p>
      ) : (
        <p style={{ margin: '1rem 0 0', color: theme.color.faint, fontStyle: 'italic' }}>No written review.</p>
      )}

      <ReviewPhoto url={review.photo_url} alt={`Review of ${review.plant_name || 'plant'}`} />
    </li>
  );
}

// The moderation queue of pending reviews.
export default function ReviewQueue({ reviews, onApprove, approvingId }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {reviews.map((r) => (
        <ReviewCard key={r.review_id} review={r} onApprove={onApprove} approving={approvingId === r.review_id} />
      ))}
    </ul>
  );
}
