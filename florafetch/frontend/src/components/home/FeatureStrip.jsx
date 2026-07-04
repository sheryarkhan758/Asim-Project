import Container from '../ui/Container.jsx';
import Reveal from '../Reveal.jsx';
import { theme } from '../../styles/theme.js';

const ITEMS = [
  { icon: '🚚', title: 'Free delivery', sub: 'On orders over Rs 2,000' },
  { icon: '💵', title: 'Cash on Delivery', sub: 'Pay when it arrives' },
  { icon: '🌱', title: '7 day guarantee', sub: 'Healthy arrival promise' },
  { icon: '📖', title: 'Expert care guides', sub: 'For every plant' },
];

// Trust badges shown right under the hero — reassurance at a glance.
export default function FeatureStrip() {
  return (
    <Container style={{ marginTop: '-1.5rem', marginBottom: '0.5rem', position: 'relative', zIndex: 2 }}>
      <Reveal
        className="ff-stagger"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))',
          gap: '0.5rem',
          background: '#fff',
          border: `1px solid ${theme.color.border}`,
          borderRadius: theme.radius.lg,
          boxShadow: theme.shadow.md,
          padding: '1.1rem 0.5rem',
        }}
      >
        {ITEMS.map((it) => (
          <div
            key={it.title}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.8rem',
              padding: '0.4rem 1rem',
            }}
          >
            <span style={{ fontSize: '1.7rem' }} aria-hidden="true">
              {it.icon}
            </span>
            <span>
              <strong style={{ display: 'block', color: theme.color.ink, fontSize: '0.95rem' }}>
                {it.title}
              </strong>
              <span style={{ color: theme.color.faint, fontSize: '0.82rem' }}>{it.sub}</span>
            </span>
          </div>
        ))}
      </Reveal>
    </Container>
  );
}
