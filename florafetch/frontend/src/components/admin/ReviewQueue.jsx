import { useState } from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../StarRating.jsx';
import ApproveBtn from './ApproveBtn.jsx';
import { formatDate } from '../../utils/format.js';

function ReviewPhoto({ url, alt }) {
  const [error, setError] = useState(false);
  if (!url || error) return null;
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      style={{ marginTop: '0.6rem', maxWidth: 180, borderRadius: 8, border: '1px solid #e2e8e4', display: 'block' }}
    />
  );
}

// A single pending review card.
function ReviewCard({ review, onApprove, approving }) {
  return (
    <li style={{ border: '1px solid #dfe5e0', borderRadius: 12, padding: '1.1rem', background: '#fff' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
            <StarRating rating={review.rating} />
            <strong style={{ color: '#2f4a38' }}>{review.reviewer || 'Anonymous'}</strong>
            <span style={{ color: '#889', fontSize: '0.8rem' }}>{formatDate(review.created_at)}</span>
          </div>
          <div style={{ marginTop: '0.35rem', color: '#556', fontSize: '0.9rem' }}>
            on{' '}
            <Link to={`/plant/${review.plant_id}`} style={{ color: '#1b7a3d', fontWeight: 600 }}>
              {review.plant_name || `Plant #${review.plant_id}`}
            </Link>
          </div>
        </div>
        <ApproveBtn onClick={() => onApprove(review)} approving={approving} />
      </div>

      {review.review_text ? (
        <p style={{ margin: '0.75rem 0 0', color: '#445', lineHeight: 1.5 }}>{review.review_text}</p>
      ) : (
        <p style={{ margin: '0.75rem 0 0', color: '#889', fontStyle: 'italic' }}>No written review.</p>
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
