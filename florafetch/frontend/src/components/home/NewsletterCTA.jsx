import { useState } from 'react';
import Container from '../ui/Container.jsx';
import Button from '../ui/Button.jsx';
import Reveal from '../Reveal.jsx';
import { subscribeNewsletter } from '../../api/newsletter.js';
import { theme } from '../../styles/theme.js';

// Email capture band — validates locally, then persists the subscriber via the
// backend /newsletter endpoint and shows the server's confirmation message.
export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
    if (!valid) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const res = await subscribeNewsletter(email.trim());
      setMessage(res.message || "You're on the list!");
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section style={{ padding: '3rem 0' }}>
      <Container>
        <Reveal
          style={{
            background: theme.gradient.hero,
            backgroundSize: '200% 200%',
            borderRadius: theme.radius.xl,
            padding: 'clamp(2rem, 5vw, 3.2rem)',
            textAlign: 'center',
            color: '#fff',
            boxShadow: theme.shadow.glow,
          }}
          className="ff-animated-gradient"
        >
          <div style={{ fontSize: '2.4rem' }} aria-hidden="true">
            🌱
          </div>
          <h2 style={{ margin: '0.4rem 0 0.5rem', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
            Grow your inbox, too
          </h2>
          <p style={{ margin: '0 auto 1.5rem', maxWidth: 520, opacity: 0.95, lineHeight: 1.6 }}>
            Get seasonal plant-care tips, restock alerts and subscriber-only offers. No spam — just
            greener days.
          </p>

          {done ? (
            <p
              role="status"
              style={{
                background: 'rgba(255,255,255,0.16)',
                display: 'inline-block',
                padding: '0.8rem 1.4rem',
                borderRadius: theme.radius.pill,
                fontWeight: 600,
              }}
            >
              🎉 {message}
            </p>
          ) : (
            <form
              onSubmit={submit}
              style={{
                display: 'flex',
                gap: '0.6rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                maxWidth: 520,
                margin: '0 auto',
              }}
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                aria-label="Email address"
                style={{
                  flex: '1 1 240px',
                  border: 'none',
                  borderRadius: theme.radius.pill,
                  padding: '0.8rem 1.2rem',
                  fontSize: '1rem',
                  color: theme.color.ink,
                }}
              />
              <Button type="submit" variant="light" style={{ boxShadow: 'none' }} disabled={submitting}>
                {submitting ? 'Subscribing…' : 'Subscribe'}
              </Button>
            </form>
          )}
          {error ? (
            <p style={{ margin: '0.75rem 0 0', color: '#ffe1dc', fontSize: '0.88rem' }}>{error}</p>
          ) : null}
        </Reveal>
      </Container>
    </section>
  );
}
