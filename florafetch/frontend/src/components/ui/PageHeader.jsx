import Container from './Container.jsx';
import { theme } from '../../styles/theme.js';

// Consistent gradient banner for interior pages (About, Contact, FAQ, …).
export default function PageHeader({ eyebrow, title, subtitle, emoji }) {
  return (
    <section
      style={{
        backgroundImage: `${theme.overlay.forestSoft}, url(${theme.image.forest})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        color: '#fff',
        padding: 'clamp(2.5rem, 6vw, 4rem) 0',
        textAlign: 'center',
      }}
    >
      <Container>
        {emoji ? (
          <div className="ff-float ff-up" style={{ fontSize: '2.6rem', '--ff-delay': '40ms' }}>
            {emoji}
          </div>
        ) : null}
        {eyebrow ? (
          <span
            className="ff-up"
            style={{
              display: 'inline-block',
              fontWeight: 700,
              fontSize: '0.72rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#eaf6ee',
              background: 'rgba(255,255,255,0.16)',
              padding: '0.3rem 0.8rem',
              borderRadius: theme.radius.pill,
              margin: '0.6rem 0',
              '--ff-delay': '120ms',
            }}
          >
            {eyebrow}
          </span>
        ) : null}
        <h1
          className="ff-up"
          style={{ margin: '0.5rem 0 0.4rem', fontSize: 'clamp(1.9rem, 4.5vw, 2.8rem)', '--ff-delay': '180ms' }}
        >
          {title}
        </h1>
        {subtitle ? (
          <p
            className="ff-up"
            style={{
              margin: '0 auto',
              maxWidth: 620,
              fontSize: '1.05rem',
              opacity: 0.95,
              lineHeight: 1.6,
              '--ff-delay': '260ms',
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </Container>
    </section>
  );
}
