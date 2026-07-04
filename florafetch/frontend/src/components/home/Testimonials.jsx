import Container from '../ui/Container.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import Testimonial from '../ui/Testimonial.jsx';
import Reveal from '../Reveal.jsx';
import { theme } from '../../styles/theme.js';

const REVIEWS = [
  {
    quote:
      'My fiddle-leaf fig arrived greener than any I found in a nursery, and the care card told me exactly where to place it. Three months on, it has four new leaves!',
    name: 'Ayesha K.',
    location: 'Lahore',
    avatar: '🌿',
    rating: 5,
  },
  {
    quote:
      'Cash on delivery made it so easy to trust a first order. The packaging was spotless and not a single leaf was bent. FloraFetch is my go-to now.',
    name: 'Bilal R.',
    location: 'Karachi',
    avatar: '🪴',
    rating: 5,
  },
  {
    quote:
      'Ordered succulents for my office desk and they were healthier than expected. Delivery was quick and the whole thing felt genuinely premium.',
    name: 'Sana M.',
    location: 'Islamabad',
    avatar: '🌵',
    rating: 4,
  },
];

// Social-proof grid on a soft tinted background.
export default function Testimonials() {
  return (
    <section style={{ padding: '3rem 0', background: theme.color.bgSoft }}>
      <Container>
        <SectionHeading
          eyebrow="Loved by plant parents"
          title="What our customers say"
          subtitle="Thousands of happy homes and offices across Pakistan have gone greener with FloraFetch."
        />
        <Reveal
          className="ff-stagger"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
          }}
        >
          {REVIEWS.map((r) => (
            <Testimonial key={r.name} {...r} />
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
