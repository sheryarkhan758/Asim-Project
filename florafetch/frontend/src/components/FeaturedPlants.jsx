import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlants } from '../api/plants.js';
import ProductGrid from './ProductGrid.jsx';

const FEATURED_COUNT = 4;

export default function FeaturedPlants() {
  const [plants, setPlants] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let active = true;
    getPlants()
      .then((data) => {
        if (!active) return;
        setPlants((data.plants || []).slice(0, FEATURED_COUNT));
        setStatus('ready');
      })
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
  }, []);

  return (
    <section style={{ padding: '1rem 1.5rem', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h2 style={{ color: '#2f4a38' }}>Featured plants</h2>
        <Link to="/shop" style={{ color: '#1b7a3d', fontWeight: 600, fontSize: '0.9rem' }}>
          View all →
        </Link>
      </div>

      {status === 'loading' && <p style={{ color: '#667' }}>Loading plants…</p>}
      {status === 'error' && <p style={{ color: '#c0392b' }}>Could not load plants right now.</p>}
      {status === 'ready' &&
        (plants.length ? (
          <ProductGrid plants={plants} />
        ) : (
          <p style={{ color: '#667' }}>No plants available yet — check back soon.</p>
        ))}
    </section>
  );
}
