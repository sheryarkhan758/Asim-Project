import { Link } from 'react-router-dom';

export default function HeroBanner() {
  return (
    <section
      style={{
        background: 'linear-gradient(135deg, #1b7a3d 0%, #2fa15a 100%)',
        color: '#fff',
        borderRadius: 18,
        padding: '3rem 2rem',
        margin: '1.5rem',
        textAlign: 'center',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ fontSize: '3rem' }}>🌿</div>
      <h1 style={{ margin: '0.5rem 0', fontSize: '2.2rem' }}>Bring your home to life</h1>
      <p style={{ margin: '0 auto 1.5rem', maxWidth: 540, fontSize: '1.05rem', opacity: 0.95 }}>
        Fresh, healthy plants delivered to your doorstep across Pakistan — with Cash on Delivery
        and expert care guides for every leaf.
      </p>
      <Link
        to="/shop"
        style={{
          display: 'inline-block',
          background: '#fff',
          color: '#1b7a3d',
          fontWeight: 700,
          padding: '0.7rem 1.6rem',
          borderRadius: 999,
          textDecoration: 'none',
        }}
      >
        Shop plants →
      </Link>
    </section>
  );
}
