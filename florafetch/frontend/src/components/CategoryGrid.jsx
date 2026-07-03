import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories } from '../api/categories.js';

// Emoji per known category name; falls back to a seedling for anything new.
const CATEGORY_ICON = {
  Indoor: '🪴',
  Outdoor: '🌳',
  Succulents: '🌵',
  Flowering: '🌸',
  Medicinal: '🌿',
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
    <section style={{ padding: '1rem 1.5rem 2rem', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#2f4a38' }}>Shop by category</h2>

      {status === 'loading' && <p style={{ color: '#667' }}>Loading categories…</p>}
      {status === 'error' && <p style={{ color: '#c0392b' }}>Could not load categories.</p>}
      {status === 'ready' &&
        (categories.length ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
              gap: '1rem',
            }}
          >
            {categories.map((cat) => (
              <Link
                key={cat.category_id}
                to={`/shop?category=${cat.category_id}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '1.25rem 1rem',
                  border: '1px solid #e2e8e4',
                  borderRadius: 12,
                  background: '#fff',
                  textDecoration: 'none',
                  color: '#2f4a38',
                }}
              >
                <span style={{ fontSize: '2rem' }} role="img" aria-label={cat.name}>
                  {CATEGORY_ICON[cat.name] || '🌱'}
                </span>
                <strong>{cat.name}</strong>
              </Link>
            ))}
          </div>
        ) : (
          <p style={{ color: '#667' }}>No categories yet.</p>
        ))}
    </section>
  );
}
