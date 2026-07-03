import { useEffect, useState } from 'react';
import { getModerationQueue, approveReview } from '../../api/reviews.js';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import ReviewQueue from '../../components/admin/ReviewQueue.jsx';

export default function AdminReviews() {
  const [reviews, setReviews] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [approvingId, setApprovingId] = useState(null);
  const [feedback, setFeedback] = useState(null); // { type, text }

  useEffect(() => {
    let active = true;
    getModerationQueue()
      .then((data) => {
        if (!active) return;
        setReviews(data.reviews || []);
        setStatus('ready');
      })
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
  }, []);

  const flash = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleApprove = async (review) => {
    setApprovingId(review.review_id);
    try {
      await approveReview(review.review_id);
      // Approved reviews leave the moderation queue.
      setReviews((prev) => prev.filter((r) => r.review_id !== review.review_id));
      flash('ok', 'Review approved and published.');
    } catch (err) {
      flash('err', err.response?.data?.error || 'Could not approve the review.');
    } finally {
      setApprovingId(null);
    }
  };

  return (
    <AdminLayout title="Review moderation">
      {feedback ? (
        <div
          style={{
            marginBottom: '1rem',
            padding: '0.6rem 0.9rem',
            borderRadius: 8,
            fontSize: '0.9rem',
            background: feedback.type === 'ok' ? '#e8f5ec' : '#fdecea',
            border: `1px solid ${feedback.type === 'ok' ? '#b6ddc2' : '#f5c2c0'}`,
            color: feedback.type === 'ok' ? '#1b7a3d' : '#a1231d',
          }}
        >
          {feedback.text}
        </div>
      ) : null}

      {status === 'loading' && <p style={{ color: '#667' }}>Loading pending reviews…</p>}
      {status === 'error' && <p style={{ color: '#c0392b' }}>Could not load the moderation queue.</p>}
      {status === 'ready' &&
        (reviews.length === 0 ? (
          <div style={{ background: '#fff', border: '1px solid #dfe5e0', borderRadius: 12, padding: '2rem', textAlign: 'center', color: '#667' }}>
            <div style={{ fontSize: '2.5rem' }}>🎉</div>
            <p style={{ fontWeight: 600, color: '#2f4a38', margin: '0.5rem 0 0' }}>No reviews pending moderation.</p>
          </div>
        ) : (
          <>
            <p style={{ color: '#556', marginTop: 0 }}>
              {reviews.length} review{reviews.length === 1 ? '' : 's'} awaiting approval
            </p>
            <ReviewQueue reviews={reviews} onApprove={handleApprove} approvingId={approvingId} />
          </>
        ))}
    </AdminLayout>
  );
}
