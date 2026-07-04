import { useEffect, useState } from 'react';
import { getModerationQueue, approveReview } from '../../api/reviews.js';
import AdminLayout from '../../components/admin/AdminLayout.jsx';
import ReviewQueue from '../../components/admin/ReviewQueue.jsx';
import { CheckCircle } from '../../components/ui/BrandIcons.jsx';
import { theme } from '../../styles/theme.js';

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
            padding: '0.75rem 1rem',
            borderRadius: theme.radius.md,
            fontSize: '0.9rem',
            fontWeight: 600,
            background: feedback.type === 'ok' ? theme.color.primarySoft : '#fdecea',
            border: `1px solid ${feedback.type === 'ok' ? '#b6ddc2' : '#f5c2c0'}`,
            color: feedback.type === 'ok' ? theme.color.primary : '#a1231d',
          }}
        >
          {feedback.text}
        </div>
      ) : null}

      {status === 'loading' && <p style={{ color: theme.color.muted }}>Loading pending reviews…</p>}
      {status === 'error' && <p style={{ color: theme.color.danger }}>Could not load the moderation queue.</p>}
      {status === 'ready' &&
        (reviews.length === 0 ? (
          <div style={{ background: '#fff', border: `1px solid ${theme.color.border}`, borderRadius: theme.radius.lg, boxShadow: theme.shadow.sm, padding: '2.5rem', textAlign: 'center', color: theme.color.muted }}>
            <div style={{ display: 'flex', justifyContent: 'center', color: theme.color.primary }}><CheckCircle size={44} color="currentColor" /></div>
            <p style={{ fontFamily: theme.font.head, fontWeight: 700, color: theme.color.ink, margin: '0.75rem 0 0' }}>No reviews pending moderation.</p>
          </div>
        ) : (
          <>
            <p style={{ color: theme.color.muted, marginTop: 0, fontWeight: 500 }}>
              {reviews.length} review{reviews.length === 1 ? '' : 's'} awaiting approval
            </p>
            <ReviewQueue reviews={reviews} onApprove={handleApprove} approvingId={approvingId} />
          </>
        ))}
    </AdminLayout>
  );
}
