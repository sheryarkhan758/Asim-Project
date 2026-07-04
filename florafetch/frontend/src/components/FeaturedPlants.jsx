import { useEffect, useState } from 'react';
import { getPlants } from '../api/plants.js';
import ProductGrid from './ProductGrid.jsx';
import Container from './ui/Container.jsx';
import SectionHeading from './ui/SectionHeading.jsx';
import Button from './ui/Button.jsx';
import { theme } from '../styles/theme.js';

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
    <section style={{ padding: '3rem 0' }}>
      <Container>
        <SectionHeading
          align="center"
          eyebrow="Fresh picks"
          title="Featured plants"
          subtitle="Handpicked favourites that thrive in Pakistani homes, ready to ship today."
        />

        {status === 'loading' && (
          <p style={{ color: theme.color.muted, textAlign: 'center' }}>Loading plants…</p>
        )}
        {status === 'error' && (
          <p style={{ color: theme.color.danger, textAlign: 'center' }}>
            Could not load plants right now.
          </p>
        )}
        {status === 'ready' &&
          (plants.length ? (
            <>
              <ProductGrid plants={plants} />
              <div style={{ textAlign: 'center', marginTop: '1.75rem' }}>
                <Button to="/shop" variant="ghost">
                  Browse all plants →
                </Button>
              </div>
            </>
          ) : (
            <p style={{ color: theme.color.muted, textAlign: 'center' }}>
              No plants available yet. Check back soon.
            </p>
          ))}
      </Container>
    </section>
  );
}
