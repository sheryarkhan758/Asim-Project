import { useState } from 'react';
import Container from '../components/ui/Container.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Button from '../components/ui/Button.jsx';
import Reveal from '../components/Reveal.jsx';
import { sendContactMessage } from '../api/contact.js';
import { theme } from '../styles/theme.js';

const CHANNELS = [
  { icon: '📧', title: 'Email us', value: 'hello@florafetch.pk', sub: 'We reply within a day' },
  { icon: '📞', title: 'Call / WhatsApp', value: '+92 300 1234567', sub: 'Mon–Sat, 9am–7pm' },
  { icon: '📍', title: 'Visit the nursery', value: 'Green Avenue, Lahore', sub: 'By appointment' },
];

const inputStyle = {
  width: '100%',
  border: `1px solid ${theme.color.border}`,
  borderRadius: theme.radius.md,
  padding: '0.75rem 0.9rem',
  fontSize: '1rem',
  fontFamily: theme.font.body,
  color: theme.color.ink,
  background: '#fff',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.85rem',
  fontWeight: 600,
  color: theme.color.body,
  marginBottom: '0.35rem',
};

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.message.trim()) {
      setError('Please share your name and a message.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await sendContactMessage({
        name: form.name.trim(),
        email: form.email.trim(),
        subject: form.subject.trim(),
        message: form.message.trim(),
      });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Could not send your message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <PageHeader
        emoji="💬"
        eyebrow="Get in touch"
        title="We'd love to hear from you"
        subtitle="Questions about an order, plant care or a bulk request? Our team is one message away."
      />

      {/* Contact channels */}
      <section style={{ padding: '3.5rem 0 1rem' }}>
        <Container>
          <Reveal
            className="ff-stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {CHANNELS.map((c) => (
              <div
                key={c.title}
                className="ff-card"
                style={{
                  background: '#fff',
                  border: `1px solid ${theme.color.border}`,
                  borderRadius: theme.radius.lg,
                  boxShadow: theme.shadow.sm,
                  padding: '1.6rem',
                  textAlign: 'center',
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    margin: '0 auto 0.9rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.7rem',
                    background: theme.color.primarySoft,
                  }}
                >
                  {c.icon}
                </div>
                <h3 style={{ margin: '0 0 0.3rem', fontSize: '1.05rem', color: theme.color.ink }}>{c.title}</h3>
                <div style={{ fontWeight: 700, color: theme.color.primary }}>{c.value}</div>
                <div style={{ color: theme.color.faint, fontSize: '0.85rem', marginTop: '0.2rem' }}>{c.sub}</div>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Form */}
      <section style={{ padding: '2.5rem 0 4rem' }}>
        <Container style={{ maxWidth: 720 }}>
          <div
            style={{
              background: '#fff',
              border: `1px solid ${theme.color.border}`,
              borderRadius: theme.radius.xl,
              boxShadow: theme.shadow.md,
              padding: 'clamp(1.5rem, 4vw, 2.5rem)',
            }}
          >
            <SectionHeading
              eyebrow="Send a message"
              title="Drop us a line"
              subtitle="Fill in the form and we'll get back to you as soon as we can."
            />

            {sent ? (
              <div
                role="status"
                style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  background: theme.color.bgSoft,
                  borderRadius: theme.radius.lg,
                }}
              >
                <div style={{ fontSize: '2.6rem' }} aria-hidden="true">🌱</div>
                <h3 style={{ margin: '0.5rem 0 0.3rem', color: theme.color.ink }}>Message sent!</h3>
                <p style={{ margin: 0, color: theme.color.muted }}>
                  Thanks, {form.name.split(' ')[0] || 'friend'}. We'll be in touch at {form.email} shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: 'grid', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>
                    <label style={labelStyle} htmlFor="c-name">Your name</label>
                    <input id="c-name" style={inputStyle} value={form.name} onChange={update('name')} placeholder="Jane Gardener" />
                  </div>
                  <div>
                    <label style={labelStyle} htmlFor="c-email">Email</label>
                    <input id="c-email" type="email" style={inputStyle} value={form.email} onChange={update('email')} placeholder="you@email.com" />
                  </div>
                </div>
                <div>
                  <label style={labelStyle} htmlFor="c-subject">Subject</label>
                  <input id="c-subject" style={inputStyle} value={form.subject} onChange={update('subject')} placeholder="Order, care advice, wholesale…" />
                </div>
                <div>
                  <label style={labelStyle} htmlFor="c-message">Message</label>
                  <textarea
                    id="c-message"
                    style={{ ...inputStyle, minHeight: 130, resize: 'vertical' }}
                    value={form.message}
                    onChange={update('message')}
                    placeholder="How can we help?"
                  />
                </div>
                {error ? (
                  <p style={{ margin: 0, color: theme.color.danger, fontSize: '0.9rem' }}>{error}</p>
                ) : null}
                <div>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send message →'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
