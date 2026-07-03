import Container from '../ui/Container.jsx';
import StatCounter from '../ui/StatCounter.jsx';
import useReveal from '../../hooks/useReveal.js';
import { theme } from '../../styles/theme.js';

const STATS = [
  { value: 12000, suffix: '+', label: 'Plants delivered' },
  { value: 8500, suffix: '+', label: 'Happy customers' },
  { value: 60, suffix: '+', label: 'Plant varieties' },
  { value: 30, suffix: '+', label: 'Cities covered' },
];

// Full-bleed gradient band with numbers that count up when scrolled into view.
export default function StatsBand() {
  const [ref, visible] = useReveal({ threshold: 0.3 });

  return (
    <section
      ref={ref}
      className="ff-animated-gradient"
      style={{
        background: theme.gradient.cta,
        padding: '3rem 0',
        color: '#fff',
      }}
    >
      <Container
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {STATS.map((s) => (
          <StatCounter
            key={s.label}
            value={s.value}
            suffix={s.suffix}
            label={s.label}
            start={visible}
            light
          />
        ))}
      </Container>
    </section>
  );
}
