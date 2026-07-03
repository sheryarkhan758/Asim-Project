import Container from '../ui/Container.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import FeatureCard from '../ui/FeatureCard.jsx';
import Reveal from '../Reveal.jsx';

const BENEFITS = [
  {
    icon: '🌿',
    title: 'Nursery-fresh & healthy',
    text: 'Every plant is hand-picked and inspected the morning it ships, so it arrives thriving — not tired from a warehouse shelf.',
  },
  {
    icon: '📦',
    title: 'Safe, roots-protected packing',
    text: 'Custom boxes cradle the pot and soil so your plant survives the journey across Pakistan without a bruised leaf.',
  },
  {
    icon: '💚',
    title: 'Care support that sticks',
    text: 'A tailored care guide ships with every plant, plus tips on watering, light and feeding whenever you need them.',
  },
  {
    icon: '🔄',
    title: 'Worry-free guarantee',
    text: "If your plant arrives damaged, we'll replace it free within 7 days. Simply reach out — no complicated returns.",
  },
];

// "Why FloraFetch" value-proposition grid.
export default function WhyUs() {
  return (
    <section style={{ padding: '3.5rem 0' }}>
      <Container>
        <SectionHeading
          eyebrow="Why FloraFetch"
          title="Plants you can trust, delivered with care"
          subtitle="We obsess over the details so your greenery shows up happy, healthy and ready to grow."
        />
        <Reveal
          className="ff-stagger"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {BENEFITS.map((b) => (
            <FeatureCard key={b.title} icon={b.icon} title={b.title}>
              {b.text}
            </FeatureCard>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
