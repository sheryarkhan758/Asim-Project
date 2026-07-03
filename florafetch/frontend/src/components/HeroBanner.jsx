import Container from './ui/Container.jsx';
import Button from './ui/Button.jsx';
import { theme } from './../styles/theme.js';

export default function HeroBanner() {
  return (
    <section style={{ padding: '1.5rem 1.5rem 0' }}>
      <div
        className="ff-scale"
        style={{
          position: 'relative',
          overflow: 'hidden',
          background: theme.color.primaryDark,
          color: '#fff',
          borderRadius: theme.radius.xl,
          boxShadow: theme.shadow.glow,
          maxWidth: theme.maxWidth,
          margin: '0 auto',
        }}
      >
        {/* Forest photo layer — slowly zooms (Ken Burns) */}
        <div
          className="ff-kenburns"
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${theme.image.forest})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        />
        {/* Green overlay for text contrast */}
        <div
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, backgroundImage: theme.overlay.forest }}
        />

        {/* Decorative floating leaves */}
        <span
          aria-hidden="true"
          className="ff-float"
          style={{ position: 'absolute', top: '12%', left: '6%', fontSize: '2.6rem', opacity: 0.5 }}
        >
          🌿
        </span>
        <span
          aria-hidden="true"
          className="ff-float"
          style={{
            position: 'absolute',
            bottom: '14%',
            right: '8%',
            fontSize: '3.4rem',
            opacity: 0.45,
            animationDelay: '1.2s',
          }}
        >
          🪴
        </span>
        <span
          aria-hidden="true"
          className="ff-float"
          style={{
            position: 'absolute',
            top: '22%',
            right: '22%',
            fontSize: '1.8rem',
            opacity: 0.4,
            animationDelay: '0.6s',
          }}
        >
          🌱
        </span>

        <Container
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            padding: 'clamp(3rem, 7vw, 5rem) 1.5rem',
          }}
        >
          <span
            className="ff-up"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(255,255,255,0.16)',
              padding: '0.4rem 0.9rem',
              borderRadius: theme.radius.pill,
              fontSize: '0.82rem',
              fontWeight: 600,
              '--ff-delay': '60ms',
            }}
          >
            <span style={{ color: theme.color.star }}>★★★★★</span> Trusted by 8,500+ plant lovers
          </span>

          <h1
            className="ff-up"
            style={{
              margin: '1.1rem 0 0.6rem',
              fontSize: 'clamp(2.1rem, 5.5vw, 3.4rem)',
              lineHeight: 1.12,
              '--ff-delay': '160ms',
            }}
          >
            Bring your home to life
          </h1>
          <p
            className="ff-up"
            style={{
              margin: '0 auto 1.8rem',
              maxWidth: 560,
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              opacity: 0.95,
              lineHeight: 1.6,
              '--ff-delay': '260ms',
            }}
          >
            Fresh, healthy plants delivered to your doorstep across Pakistan — with Cash on Delivery
            and expert care guides for every leaf.
          </p>
          <div
            className="ff-up"
            style={{
              display: 'flex',
              gap: '0.8rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
              '--ff-delay': '360ms',
            }}
          >
            <Button to="/shop" variant="light" shine>
              Shop plants →
            </Button>
            <Button
              to="/care-guides"
              variant="ghost"
              style={{ color: '#fff', borderColor: 'rgba(255,255,255,0.7)' }}
            >
              Explore care guides
            </Button>
          </div>
        </Container>
      </div>
    </section>
  );
}
