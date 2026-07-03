import Container from '../components/ui/Container.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import FeatureCard from '../components/ui/FeatureCard.jsx';
import Button from '../components/ui/Button.jsx';
import Reveal from '../components/Reveal.jsx';
import StatCounter from '../components/ui/StatCounter.jsx';
import useReveal from '../hooks/useReveal.js';
import { theme } from '../styles/theme.js';

const VALUES = [
  { icon: '🌱', title: 'Freshness first', text: 'We ship straight from trusted growers so plants spend days, not weeks, in transit.' },
  { icon: '🤝', title: 'Honest & local', text: 'Cash on Delivery, fair prices and real support — built for how Pakistan shops.' },
  { icon: '🌍', title: 'Greener planet', text: 'More plants in more homes means cleaner air and calmer spaces for everyone.' },
  { icon: '💬', title: 'Always here to help', text: 'From choosing your first plant to reviving a droopy one, our team has your back.' },
];

const JOURNEY = [
  { year: '2024', title: 'A balcony experiment', text: 'Two friends started gifting cuttings to neighbours who kept asking where to buy healthy plants.' },
  { year: '2025', title: 'FloraFetch is born', text: 'We launched online with 8 plants, a single delivery van and a promise: healthy or replaced.' },
  { year: '2026', title: 'Growing nationwide', text: 'Now serving 30+ cities with 60+ varieties and thousands of thriving plant parents.' },
];

function StatsRow() {
  const [ref, visible] = useReveal({ threshold: 0.3 });
  const stats = [
    { value: 12000, suffix: '+', label: 'Plants delivered' },
    { value: 8500, suffix: '+', label: 'Happy customers' },
    { value: 60, suffix: '+', label: 'Plant varieties' },
    { value: 30, suffix: '+', label: 'Cities covered' },
  ];
  return (
    <div
      ref={ref}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: '1.5rem',
        background: '#fff',
        border: `1px solid ${theme.color.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.sm,
        padding: '2rem 1.5rem',
      }}
    >
      {stats.map((s) => (
        <StatCounter key={s.label} value={s.value} suffix={s.suffix} label={s.label} start={visible} />
      ))}
    </div>
  );
}

export default function About() {
  return (
    <>
      <PageHeader
        emoji="🌿"
        eyebrow="Our story"
        title="Rooted in a love for green living"
        subtitle="FloraFetch exists to make it effortless for every home in Pakistan to enjoy fresh, healthy plants — delivered with genuine care."
      />

      {/* Mission */}
      <section style={{ padding: '3.5rem 0' }}>
        <Container>
          <Reveal
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
              alignItems: 'center',
            }}
          >
            <div>
              <SectionHeading
                align="left"
                eyebrow="Our mission"
                title="Plants for every home, cared for like our own"
                subtitle="We believe a little greenery changes a space — and a person. So we sweat the details most stores skip: how a plant is grown, packed, delivered and supported after it lands on your windowsill."
                style={{ marginBottom: '1.25rem' }}
              />
              <Button to="/shop" variant="primary">
                Start shopping →
              </Button>
            </div>
            <div
              style={{
                background: theme.gradient.soft,
                borderRadius: theme.radius.xl,
                padding: '2.5rem',
                textAlign: 'center',
                border: `1px solid ${theme.color.border}`,
              }}
            >
              <div style={{ fontSize: '5rem' }} aria-hidden="true">🪴</div>
              <p style={{ margin: '1rem 0 0', color: theme.color.body, fontStyle: 'italic', lineHeight: 1.6 }}>
                “A room with a plant is a room with a heartbeat.”
              </p>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Values */}
      <section style={{ padding: '1rem 0 3.5rem' }}>
        <Container>
          <SectionHeading eyebrow="What we stand for" title="Our values" />
          <Reveal
            className="ff-stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {VALUES.map((v) => (
              <FeatureCard key={v.title} icon={v.icon} title={v.title}>
                {v.text}
              </FeatureCard>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Stats */}
      <section style={{ padding: '0 0 3.5rem' }}>
        <Container>
          <StatsRow />
        </Container>
      </section>

      {/* Journey timeline */}
      <section style={{ padding: '0 0 3.5rem' }}>
        <Container>
          <SectionHeading eyebrow="How we grew" title="Our journey so far" />
          <Reveal
            className="ff-stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {JOURNEY.map((j) => (
              <div
                key={j.year}
                className="ff-card"
                style={{
                  background: '#fff',
                  border: `1px solid ${theme.color.border}`,
                  borderRadius: theme.radius.lg,
                  boxShadow: theme.shadow.sm,
                  padding: '1.6rem',
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    fontFamily: theme.font.head,
                    fontWeight: 800,
                    fontSize: '1.4rem',
                    color: theme.color.primary,
                    marginBottom: '0.5rem',
                  }}
                >
                  {j.year}
                </span>
                <h3 style={{ margin: '0 0 0.4rem', fontSize: '1.1rem', color: theme.color.ink }}>{j.title}</h3>
                <p style={{ margin: 0, color: theme.color.muted, fontSize: '0.95rem', lineHeight: 1.6 }}>{j.text}</p>
              </div>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Closing CTA */}
      <section style={{ padding: '0 0 4rem' }}>
        <Container>
          <Reveal
            className="ff-animated-gradient"
            style={{
              background: theme.gradient.cta,
              borderRadius: theme.radius.xl,
              padding: 'clamp(2rem, 5vw, 3rem)',
              textAlign: 'center',
              color: '#fff',
              boxShadow: theme.shadow.glow,
            }}
          >
            <h2 style={{ margin: '0 0 0.5rem', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
              Ready to bring the outside in?
            </h2>
            <p style={{ margin: '0 auto 1.5rem', maxWidth: 520, opacity: 0.95 }}>
              Join thousands of happy plant parents across Pakistan.
            </p>
            <Button to="/shop" variant="light" shine>
              Explore the collection →
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
