import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { createReview } from '../api/reviews.js';
import { theme } from '../styles/theme.js';

const cardStyle = {
  border: `1px solid ${theme.color.border}`,
  borderRadius: theme.radius.lg,
  padding: 'clamp(1.1rem, 3vw, 1.5rem)',
  background: theme.color.white,
  boxShadow: theme.shadow.sm,
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
      <div style={{ ...cardStyle, background: theme.color.bgSoft }}>
        <p style={{ margin: 0, color: theme.color.body }}>
          <Link
            to="/login"
            state={{ from: { pathname: `/plant/${plantId}` } }}
            className="ff-underline"
            style={{ color: theme.color.primary, fontWeight: 700 }}
          >
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
      <h3 style={{ margin: '0 0 1rem', color: theme.color.ink }}>Write a review</h3>

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
              fontSize: '1.7rem',
              color: i <= (hover || rating) ? theme.color.star : theme.color.border,
              padding: '0 0.1rem',
              minWidth: 44,
              minHeight: 44,
              transition: 'color 0.15s ease',
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
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '0.7rem 0.85rem',
          borderRadius: theme.radius.md,
          border: `1.5px solid ${theme.color.border}`,
          fontFamily: theme.font.body,
          fontSize: '0.95rem',
          color: theme.color.ink,
          resize: 'vertical',
          background: theme.color.bgSoft,
        }}
      />

      <div style={{ margin: '0.85rem 0' }}>
        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: theme.color.body, marginBottom: '0.4rem' }}>
          Add a photo (optional)
        </label>
        <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
        <div style={{ fontSize: '0.75rem', color: theme.color.muted, marginTop: '0.3rem' }}>JPG/PNG up to 2 MB.</div>
      </div>

      {result ? (
        <p style={{ color: result.type === 'ok' ? theme.color.primary : theme.color.danger, fontWeight: 600, fontSize: '0.9rem', margin: '0 0 0.75rem' }}>
          {result.text}
        </p>
      ) : null}

      <button
        type="submit"
        className="ff-btn"
        disabled={submitting}
        style={{
          padding: '0.75rem 1.6rem',
          borderRadius: theme.radius.pill,
          border: 'none',
          background: submitting ? theme.color.primaryLight : theme.color.primary,
          color: '#fff',
          fontWeight: 700,
          fontSize: '0.98rem',
          cursor: submitting ? 'default' : 'pointer',
          boxShadow: theme.shadow.sm,
        }}
      >
        {submitting ? 'Submitting…' : 'Submit review'}
      </button>
    </form>
  );
}
