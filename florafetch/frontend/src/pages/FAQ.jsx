import Container from '../components/ui/Container.jsx';
import PageHeader from '../components/ui/PageHeader.jsx';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Accordion from '../components/ui/Accordion.jsx';
import Button from '../components/ui/Button.jsx';
import { theme } from '../styles/theme.js';

const GROUPS = [
  {
    heading: 'Orders & delivery',
    items: [
      {
        q: 'Which cities do you deliver to?',
        a: 'We currently deliver to 30+ cities across Pakistan, including Lahore, Karachi, Islamabad, Rawalpindi, Faisalabad and Multan. Enter your address at checkout to confirm coverage and delivery time.',
      },
      {
        q: 'How long does delivery take?',
        a: 'Most orders arrive within 2–5 working days depending on your city. You can follow every stage — Confirmed, Quality Check, In Transit and Delivered — from your order tracking page.',
      },
      {
        q: 'Is delivery really free?',
        a: 'Delivery is free on orders over Rs 2,000. Smaller orders carry a modest flat delivery fee shown clearly at checkout before you confirm.',
      },
    ],
  },
  {
    heading: 'Payment',
    items: [
      {
        q: 'How do I pay?',
        a: 'We offer Cash on Delivery (COD) across Pakistan — pay only once your plant is safely in your hands. No card or advance payment required.',
      },
      {
        q: 'Can I pay online instead?',
        a: 'Right now COD is our primary method so you can shop with total confidence. Online payment options are on our roadmap and coming soon.',
      },
    ],
  },
  {
    heading: 'Plants & care',
    items: [
      {
        q: 'What if my plant arrives damaged?',
        a: "Our 7-day healthy-arrival guarantee has you covered. If a plant arrives damaged or unhealthy, contact us within 7 days with a photo and we'll replace it free of charge.",
      },
      {
        q: 'Do plants come with care instructions?',
        a: 'Yes — every plant ships with a personalised care card covering watering, light and feeding. You can also browse our Care Guides any time for deeper tips.',
      },
      {
        q: 'How do I know which plant suits my space?',
        a: 'Use the Shop filters for light level, maintenance and pet-friendliness, or reach out via Contact and our team will happily recommend the right plant for your room and routine.',
      },
    ],
  },
  {
    heading: 'Account & returns',
    items: [
      {
        q: 'Do I need an account to order?',
        a: 'You can browse freely, but a quick free account lets you check out, track orders and save delivery addresses. Creating one takes under a minute.',
      },
      {
        q: 'What is your return policy?',
        a: 'Because plants are living products, we focus on our arrival guarantee rather than standard returns. If anything is wrong on arrival, we make it right with a free replacement.',
      },
    ],
  },
];

export default function FAQ() {
  return (
    <>
      <PageHeader
        emoji="❓"
        eyebrow="Help centre"
        title="Frequently asked questions"
        subtitle="Everything you need to know about ordering, delivery, payment and plant care."
      />

      <section style={{ padding: '3.5rem 0' }}>
        <Container style={{ maxWidth: 840 }}>
          {GROUPS.map((group, gi) => (
            <div key={group.heading} style={{ marginBottom: gi < GROUPS.length - 1 ? '2.5rem' : 0 }}>
              <SectionHeading align="left" title={group.heading} style={{ marginBottom: '1rem' }} />
              <Accordion items={group.items} defaultOpen={-1} />
            </div>
          ))}
        </Container>
      </section>

      {/* Still need help */}
      <section style={{ padding: '0 0 4rem' }}>
        <Container>
          <div
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
            <div style={{ fontSize: '2.2rem' }} aria-hidden="true">🤝</div>
            <h2 style={{ margin: '0.4rem 0 0.5rem', fontSize: 'clamp(1.5rem, 3vw, 2rem)' }}>
              Still have a question?
            </h2>
            <p style={{ margin: '0 auto 1.5rem', maxWidth: 500, opacity: 0.95 }}>
              Our friendly team is happy to help with anything we haven't covered here.
            </p>
            <Button to="/contact" variant="light" shine>
              Contact us →
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
