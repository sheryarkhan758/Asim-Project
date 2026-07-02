import { useEffect, useState } from 'react';
import { getPlantReviews } from '../api/reviews.js';
import StarRating from './StarRating.jsx';

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
        marginTop: '0.5rem',
        maxWidth: 160,
        borderRadius: 8,
        border: '1px solid #e2e8e4',
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
    <section style={{ marginTop: '2.5rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <h2 style={{ color: '#2f4a38', margin: 0 }}>Reviews</h2>
        {avg ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#667' }}>
            <StarRating rating={Math.round(avg)} /> {avg} ({reviews.length})
          </span>
        ) : null}
      </div>

      {status === 'loading' && <p style={{ color: '#667' }}>Loading reviews…</p>}
      {status === 'error' && <p style={{ color: '#c0392b' }}>Could not load reviews.</p>}
      {status === 'ready' &&
        (reviews.length === 0 ? (
          <p style={{ color: '#667' }}>No reviews yet — be the first to share how your plant arrived!</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: '1rem 0 0', display: 'grid', gap: '1rem' }}>
            {reviews.map((r) => (
              <li
                key={r.review_id}
                style={{ border: '1px solid #e2e8e4', borderRadius: 12, padding: '1rem', background: '#fff' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                  <strong style={{ color: '#2f4a38' }}>{r.reviewer || 'Verified buyer'}</strong>
                  <span style={{ color: '#889', fontSize: '0.8rem' }}>{formatDate(r.created_at)}</span>
                </div>
                <div style={{ margin: '0.35rem 0' }}>
                  <StarRating rating={r.rating} />
                </div>
                {r.review_text ? <p style={{ margin: '0.35rem 0 0', color: '#445', lineHeight: 1.5 }}>{r.review_text}</p> : null}
                <ReviewPhoto url={r.photo_url} alt={`Review photo by ${r.reviewer || 'buyer'}`} />
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}
