import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { createReview } from '../api/reviews.js';

const cardStyle = {
  border: '1px solid #e2e8e4',
  borderRadius: 12,
  padding: '1.1rem',
  background: '#fbfdfb',
  fontFamily: 'sans-serif',
};

// Submit a review (rating + text + optional photo) via POST /reviews. New
// reviews start unapproved, so they land in the admin moderation queue.
export default function ReviewForm({ plantId }) {
  const { isAuthenticated } = useAuth();
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null); // { type: 'ok'|'err', text }

  if (!isAuthenticated) {
    return (
      <div style={cardStyle}>
        <p style={{ margin: 0, color: '#556' }}>
          <Link to="/login" state={{ from: { pathname: `/plant/${plantId}` } }} style={{ color: '#1b7a3d', fontWeight: 600 }}>
            Log in
          </Link>{' '}
          to write a review.
        </p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating < 1 || rating > 5) {
      setResult({ type: 'err', text: 'Please choose a rating between 1 and 5 stars.' });
      return;
    }
    setSubmitting(true);
    setResult(null);
    try {
      const fd = new FormData();
      fd.append('plant_id', String(plantId));
      fd.append('rating', String(rating));
      if (text.trim()) fd.append('review_text', text.trim());
      if (photo) fd.append('photo', photo);
      await createReview(fd);
      setResult({ type: 'ok', text: 'Thanks! Your review was submitted and is pending approval.' });
      setText('');
      setPhoto(null);
      setRating(5);
    } catch (err) {
      setResult({ type: 'err', text: err.response?.data?.error || 'Could not submit your review.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={cardStyle}>
      <h3 style={{ margin: '0 0 0.75rem', color: '#2f4a38' }}>Write a review</h3>

      {/* Star picker */}
      <div style={{ marginBottom: '0.75rem' }} role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            aria-label={`${i} star${i > 1 ? 's' : ''}`}
            aria-pressed={rating === i}
            onClick={() => setRating(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(0)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.6rem',
              color: i <= (hover || rating) ? '#f5a623' : '#d9e2dc',
              padding: '0 0.1rem',
              minWidth: 44,
              minHeight: 44,
            }}
          >
            ★
          </button>
        ))}
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share how your plant arrived and how it's doing…"
        rows={3}
        style={{ width: '100%', boxSizing: 'border-box', padding: '0.6rem 0.75rem', borderRadius: 8, border: '1px solid #cdddd2', fontFamily: 'inherit', resize: 'vertical' }}
      />

      <div style={{ margin: '0.6rem 0' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', color: '#556', marginBottom: '0.3rem' }}>
          Add a photo (optional)
        </label>
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
        <div style={{ fontSize: '0.75rem', color: '#889', marginTop: '0.25rem' }}>JPG/PNG up to 2 MB.</div>
      </div>

      {result ? (
        <p style={{ color: result.type === 'ok' ? '#1b7a3d' : '#c0392b', fontSize: '0.9rem', margin: '0 0 0.6rem' }}>
          {result.text}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={submitting}
        style={{ padding: '0.6rem 1.4rem', borderRadius: 8, border: 'none', background: submitting ? '#7bbf93' : '#1b7a3d', color: '#fff', fontWeight: 700, cursor: submitting ? 'default' : 'pointer' }}
      >
        {submitting ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  );
}
