import { useEffect, useState } from 'react';
import { getPlantsByCategory } from '../api/plants.js';
import ProductGrid from './ProductGrid.jsx';

const MAX_RELATED = 4;

// "Frequently bought with" strip — other plants in the same category.
export default function RelatedItems({ categoryId, currentPlantId }) {
  const [plants, setPlants] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    if (categoryId == null) {
      setStatus('ready');
      setPlants([]);
      return;
    }
    let active = true;
    setStatus('loading');
    getPlantsByCategory(categoryId)
      .then((data) => {
        if (!active) return;
        const others = (data.plants || []).filter((p) => p.plant_id !== currentPlantId);
        setPlants(others.slice(0, MAX_RELATED));
        setStatus('ready');
      })
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
  }, [categoryId, currentPlantId]);

  // Nothing to show — quietly render nothing rather than an empty heading.
  if (status !== 'ready' || plants.length === 0) return null;

  return (
    <section style={{ marginTop: '2.5rem', fontFamily: 'sans-serif' }}>
      <h2 style={{ color: '#2f4a38' }}>You might also like</h2>
      <ProductGrid plants={plants} />
    </section>
  );
}
