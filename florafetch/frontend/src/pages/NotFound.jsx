import Container from '../components/ui/Container.jsx';
import Button from '../components/ui/Button.jsx';
import { theme } from '../styles/theme.js';

export default function NotFound() {
  return (
    <section style={{ background: theme.color.bgSoft }}>
      <Container
        style={{
          minHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '4rem 1.5rem',
          gap: '0.75rem',
        }}
      >
        <div className="ff-float" style={{ fontSize: '4rem' }}>🪴</div>
        <span
          style={{
            fontWeight: 800,
            fontSize: '3rem',
            color: theme.color.primary,
            lineHeight: 1,
            fontFamily: theme.font.head,
          }}
        >
          404
        </span>
        <h1 style={{ margin: '0.25rem 0 0', color: theme.color.ink }}>Page not found</h1>
        <p style={{ margin: 0, color: theme.color.muted, maxWidth: 420, lineHeight: 1.6 }}>
          The page you're looking for may have wilted away or been moved. Let's get you back to greener ground.
        </p>
        <Button to="/" variant="primary" shine style={{ marginTop: '1rem' }}>
          ← Back to home
        </Button>
      </Container>
    </section>
  );
}
