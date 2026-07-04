import { useEffect, useState } from 'react';
import { getPlantReviews } from '../api/reviews.js';
import StarRating from './StarRating.jsx';
import { theme } from '../styles/theme.js';

function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString();
}

function ReviewPhoto({ url, alt }) {
  const [error, setError] = useState(false);
  if (!url || error) return null;
  return (
    <img
      src={url}
      alt={alt}
      loading="lazy"
      onError={() => setError(true)}
      style={{
        marginTop: '0.6rem',
        maxWidth: 160,
        borderRadius: theme.radius.md,
        border: `1px solid ${theme.color.border}`,
        display: 'block',
      }}
    />
  );
}

// Approved reviews for a plant, from GET /reviews/plant/:id.
export default function ReviewList({ plantId }) {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let active = true;
    setStatus('loading');
    getPlantReviews(plantId)
      .then((data) => {
        if (!active) return;
        setReviews(data.reviews || []);
        setStatus('ready');
      })
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
  }, [plantId]);

  const avg =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0) / reviews.length).toFixed(1)
      : null;

  return (
    <section style={{ marginTop: '3rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.9rem', flexWrap: 'wrap' }}>
        <h2 style={{ color: theme.color.ink, margin: 0 }}>Reviews</h2>
        {avg ? (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              color: theme.color.body,
              fontWeight: 600,
              background: theme.color.bgSoft,
              border: `1px solid ${theme.color.borderSoft}`,
              padding: '0.3rem 0.75rem',
              borderRadius: theme.radius.pill,
            }}
          >
            <StarRating rating={Math.round(avg)} /> {avg}
            <span style={{ color: theme.color.muted, fontWeight: 500 }}>({reviews.length})</span>
          </span>
        ) : null}
      </div>

      {status === 'loading' && <p style={{ color: theme.color.muted }}>Loading reviews…</p>}
      {status === 'error' && <p style={{ color: theme.color.danger }}>Could not load reviews.</p>}
      {status === 'ready' &&
        (reviews.length === 0 ? (
          <p style={{ color: theme.color.muted, marginTop: '1rem' }}>
            No reviews yet. Be the first to share how your plant arrived!
          </p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: '1.25rem 0 0', display: 'grid', gap: '1rem' }}>
            {reviews.map((r) => (
              <li
                key={r.review_id}
                className="ff-card"
                style={{
                  border: `1px solid ${theme.color.border}`,
                  borderRadius: theme.radius.lg,
                  padding: '1.25rem',
                  background: theme.color.white,
                  boxShadow: theme.shadow.sm,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ color: theme.color.ink }}>{r.reviewer || 'Verified buyer'}</strong>
                  <span style={{ color: theme.color.faint, fontSize: '0.8rem' }}>{formatDate(r.created_at)}</span>
                </div>
                <div style={{ margin: '0.45rem 0' }}>
                  <StarRating rating={r.rating} />
                </div>
                {r.review_text ? (
                  <p style={{ margin: '0.45rem 0 0', color: theme.color.body, lineHeight: 1.6 }}>{r.review_text}</p>
                ) : null}
                <ReviewPhoto url={r.photo_url} alt={`Review photo by ${r.reviewer || 'buyer'}`} />
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}
