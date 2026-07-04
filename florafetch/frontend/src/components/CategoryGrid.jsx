import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/categories.js';
import Container from './ui/Container.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Reveal from './Reveal.jsx';
import { theme } from '../styles/theme.js';

// Emoji per known category name; falls back to a seedling for anything new.
const CATEGORY_ICON = {
  'Indoor Plants': '🪴',
  'Outdoor Plants': '🌳',
  'Air Purifying Plants': '🍃',
  'Medicinal Plants': '🌿',
};

export default function CategoryGrid() {
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let active = true;
    getCategories()
      .then((data) => {
        if (!active) return;
        setCategories(data.categories || []);
        setStatus('ready');
      })
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section style={{ padding: '3rem 0' }}>
      <Container>
        <SectionHeading
          eyebrow="Find your fit"
          title="Shop by category"
          subtitle="From low light indoor greens to air purifying and medicinal plants. Start where you belong."
        />

        {status === 'loading' && (
          <p style={{ color: theme.color.muted, textAlign: 'center' }}>Loading categories…</p>
        )}
        {status === 'error' && (
          <p style={{ color: theme.color.danger, textAlign: 'center' }}>
            Could not load categories.
          </p>
        )}
        {status === 'ready' &&
          (categories.length ? (
            <Reveal
              className="ff-stagger"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.25rem',
              }}
            >
              {categories.map((cat) => (
                <Link
                  key={cat.category_id}
                  to={`/shop?category=${cat.category_id}`}
                  className="ff-lift"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '1.6rem 1rem',
                    border: `1px solid ${theme.color.border}`,
                    borderRadius: theme.radius.lg,
                    background: '#fff',
                    textDecoration: 'none',
                    color: theme.color.ink,
                    boxShadow: theme.shadow.sm,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: theme.color.primarySoft,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.9rem',
                    }}
                  >
                    {CATEGORY_ICON[cat.name] || '🌱'}
                  </span>
                  <strong style={{ fontSize: '1rem' }}>{cat.name}</strong>
                </Link>
              ))}
            </Reveal>
          ) : (
            <p style={{ color: theme.color.muted, textAlign: 'center' }}>No categories yet.</p>
          ))}
      </Container>
    </section>
  );
}
