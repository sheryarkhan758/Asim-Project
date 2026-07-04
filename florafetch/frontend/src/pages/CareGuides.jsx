import Container from '../components/ui/Container.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Accordion from '../components/ui/Accordion.jsx';
import Button from '../components/ui/Button.jsx';
import Reveal from '../components/Reveal.jsx';
import { theme } from '../styles/theme.js';
//12344
const GUIDES = [
  {
    icon: '💧',
    title: 'Watering the right way',
    tips: [
      'Check the top 2-3 cm of soil, water only when it feels dry.',
      'Water deeply until it drains, then empty the saucer.',
      'Most indoor plants prefer under- over over-watering.',
    ],
  },
  {
    icon: '☀️',
    title: 'Light & placement',
    tips: [
      'Bright, indirect light suits most houseplants best.',
      'Rotate pots weekly for even, balanced growth.',
      'Keep tender leaves off hot afternoon window glass.',
    ],
  },
  {
    icon: '🪴',
    title: 'Repotting & soil',
    tips: [
      'Repot when roots circle the pot or poke through the base.',
      'Go up just one pot size to avoid soggy soil.',
      'Use a light, well-draining mix, never garden clay.',
    ],
  },
  {
    icon: '🌡️',
    title: 'Humidity & temperature',
    tips: [
      'Group plants together to raise local humidity.',
      'Mist tropicals or set them on a pebble-water tray.',
      'Keep plants away from AC vents and cold drafts.',
    ],
  },
  {
    icon: '🌿',
    title: 'Feeding & fertiliser',
    tips: [
      'Feed during spring-summer growth, not in winter.',
      'Dilute liquid feed to half strength to be safe.',
      'Yellow lower leaves can signal it is time to feed.',
    ],
  },
  {
    icon: '🐛',
    title: 'Pests & problems',
    tips: [
      'Inspect new leaves and stems weekly for pests.',
      'Wipe leaves with mild soapy water at first sign.',
      'Isolate an affected plant to protect the rest.',
    ],
  },
];

const QUICK_FAQ = [
  {
    q: 'How often should I water my plant?',
    a: 'It depends on the plant, pot and season, but the finger test rarely fails: push a finger 2-3 cm into the soil. If it is dry, water; if it is still moist, wait a day or two. Overwatering is the most common way houseplants are lost.',
  },
  {
    q: 'My plant’s leaves are turning yellow. What’s wrong?',
    a: 'Yellowing usually points to watering issues (most often too much) or a lack of light or nutrients. Check that the pot drains freely, move the plant somewhere brighter but out of harsh direct sun, and consider a gentle feed during the growing season.',
  },
  {
    q: 'Which plants are best for beginners?',
    a: 'Start with forgiving, low-maintenance varieties like Snake Plant, Pothos, ZZ Plant or Aloe Vera. They tolerate irregular watering and a range of light conditions, filter the Shop by “Low Maintenance” to find them fast.',
  },
  {
    q: 'Are your plants safe for pets?',
    a: 'Many are! Look for the “Pet Friendly” badge on the product card, or use the pet-friendly filter in the Shop. If you have curious cats or dogs, we recommend sticking to labelled pet-safe varieties.',
  },
];

export default function CareGuides() {
  return (
    <>
      <PageHeader
        emoji="📖"
        eyebrow="Plant care library"
        title="Care guides for happy, healthy plants"
        subtitle="Simple, practical advice to help every leaf thrive, whether it's your first succulent or your fiftieth fern."
      />

      {/* Guide cards */}
      <section style={{ padding: '3.5rem 0' }}>
        <Container>
          <SectionHeading
            eyebrow="The essentials"
            title="Master the six fundamentals"
            subtitle="Get these right and 90% of plant problems simply never happen."
          />
          <Reveal
            className="ff-stagger"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
            }}
          >
            {GUIDES.map((g) => (
              <article
                key={g.title}
                className="ff-card"
                style={{
                  background: '#fff',
                  border: `1px solid ${theme.color.border}`,
                  borderRadius: theme.radius.lg,
                  boxShadow: theme.shadow.sm,
                  padding: '1.6rem',
                  height: '100%',
                }}
              >
                <div
                  aria-hidden="true"
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                    background: theme.color.primarySoft,
                    marginBottom: '1rem',
                  }}
                >
                  {g.icon}
                </div>
                <h3 style={{ margin: '0 0 0.7rem', fontSize: '1.12rem', color: theme.color.ink }}>
                  {g.title}
                </h3>
                <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {g.tips.map((t, i) => (
                    <li key={i} style={{ display: 'flex', gap: '0.5rem', color: theme.color.muted, fontSize: '0.93rem', lineHeight: 1.5 }}>
                      <span style={{ color: theme.color.primary, flexShrink: 0 }}>✅</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* Quick FAQ */}
      <section style={{ padding: '0 0 3.5rem', background: theme.color.bgSoft }}>
        <Container style={{ paddingTop: '3.5rem', maxWidth: 820 }}>
          <SectionHeading eyebrow="Quick answers" title="Common care questions" />
          <Accordion items={QUICK_FAQ} />
        </Container>
      </section>

      {/* CTA */}
      <section style={{ padding: '3.5rem 0 4rem' }}>
        <Container style={{ textAlign: 'center' }}>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: 'clamp(1.5rem, 3vw, 2rem)', color: theme.color.ink }}>
            Put these tips to work
          </h2>
          <p style={{ margin: '0 auto 1.5rem', maxWidth: 500, color: theme.color.muted }}>
            Every FloraFetch plant ships with a personalised care card. Pick your next green companion.
          </p>
          <Button to="/shop" variant="primary" shine>
            Shop plants ➡️
          </Button>
        </Container>
      </section>
    </>
  );
}
