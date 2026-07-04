import { Link } from 'react-router-dom';
import Container from './ui/Container.jsx';
import { Facebook, Instagram, TwitterX, Pinterest } from './ui/BrandIcons.jsx';
import { theme } from '../styles/theme.js';

const SOCIALS = [
  { label: 'Facebook', href: 'https://facebook.com', Icon: Facebook, brand: '#1877F2' },
  { label: 'Instagram', href: 'https://instagram.com', Icon: Instagram, brand: '#E1306C' },
  { label: 'X (Twitter)', href: 'https://x.com', Icon: TwitterX, brand: '#000000' },
  { label: 'Pinterest', href: 'https://pinterest.com', Icon: Pinterest, brand: '#BD081C' },
];

const COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All plants', to: '/shop' },
      { label: 'Indoor', to: '/shop?category=1' },
      { label: 'Outdoor', to: '/shop?category=2' },
      { label: 'Succulents', to: '/shop?category=3' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Care guides', to: '/care-guides' },
      { label: 'Contact', to: '/contact' },
      { label: 'FAQ', to: '/faq' },
    ],
  },
  {
    title: 'Account',
    links: [
      { label: 'Sign in', to: '/login' },
      { label: 'Create account', to: '/register' },
      { label: 'Your cart', to: '/cart' },
      { label: 'Your profile', to: '/profile' },
    ],
  },
];

const linkStyle = {
  color: 'rgba(255,255,255,0.75)',
  textDecoration: 'none',
  fontSize: '0.92rem',
  lineHeight: 2,
};

export default function Footer() {
  return (
    <footer
      style={{
        marginTop: 'auto',
        background: theme.color.primaryDark,
        color: '#fff',
        fontFamily: theme.font.body,
      }}
    >
      <Container style={{ padding: '3rem 1.5rem 1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(220px, 1.4fr) repeat(3, minmax(120px, 1fr))',
            gap: '2rem',
          }}
          className="ff-footer-grid"
        >
          {/* Brand blurb */}
          <div>
            <div style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span className="ff-float" aria-hidden="true">🌿</span> FloraFetch
            </div>
            <p style={{ color: 'rgba(255,255,255,0.72)', fontSize: '0.92rem', lineHeight: 1.7, margin: '0.8rem 0 1rem', maxWidth: 300 }}>
              Pakistan's friendliest online plant marketplace. Fresh greenery, safe delivery and
              care support, all with Cash on Delivery.
            </p>
            <div style={{ display: 'flex', gap: '0.6rem' }}>
              {SOCIALS.map(({ label, href, Icon, brand }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="ff-lift ff-social"
                  style={{
                    '--ff-brand': brand,
                    width: 38,
                    height: 38,
                    borderRadius: '50%',
                    background: 'rgba(255,255,255,0.12)',
                    color: '#fff',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textDecoration: 'none',
                  }}
                >
                  <Icon size={18} color="currentColor" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 style={{ margin: '0 0 0.6rem', fontSize: '0.95rem', color: '#fff' }}>{col.title}</h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="ff-underline" style={linkStyle}>
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.14)', margin: '2rem 0 1rem' }} />

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem 1.5rem',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: 'rgba(255,255,255,0.6)',
            fontSize: '0.85rem',
          }}
        >
          <span>© {new Date().getFullYear()} FloraFetch · Cash on Delivery across Pakistan</span>
          <span>Made with 🌱 · CS519 Spring 2026</span>
        </div>
      </Container>
    </footer>
  );
}
