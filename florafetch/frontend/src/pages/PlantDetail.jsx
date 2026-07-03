import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getPlant } from '../api/plants.js';
import { formatPKR } from '../utils/format.js';
import PlantGallery from '../components/PlantGallery.jsx';
import CareGuide from '../components/CareGuide.jsx';
import AddToCartBtn from '../components/AddToCartBtn.jsx';
import ReviewList from '../components/ReviewList.jsx';
import ReviewForm from '../components/ReviewForm.jsx';
import RelatedItems from '../components/RelatedItems.jsx';

export default function PlantDetail() {
  const { id } = useParams();
  const [plant, setPlant] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | ready | notfound | error

  useEffect(() => {
    let active = true;
    setStatus('loading');
    setPlant(null);
    getPlant(id)
      .then((data) => {
        if (!active) return;
        setPlant(data.plant);
        setStatus('ready');
      })
      .catch((err) => {
        if (!active) return;
        setStatus(err.response?.status === 404 ? 'notfound' : 'error');
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (status === 'loading') {
    return <p style={{ padding: '2rem', fontFamily: 'sans-serif', color: '#667' }}>Loading plant…</p>;
  }

  if (status === 'notfound') {
    return (
      <section style={{ padding: '3rem 2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>🥀</div>
        <h1 style={{ color: '#2f4a38' }}>Plant not found</h1>
        <p style={{ color: '#667' }}>This plant may have been removed or the link is incorrect.</p>
        <Link to="/shop" style={{ color: '#1b7a3d', fontWeight: 600 }}>
          ← Back to the shop
        </Link>
      </section>
    );
  }

  if (status === 'error') {
    return (
      <section style={{ padding: '3rem 2rem', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h1 style={{ color: '#2f4a38' }}>Something went wrong</h1>
        <p style={{ color: '#667' }}>We couldn't load this plant. Please try again.</p>
        <Link to="/shop" style={{ color: '#1b7a3d', fontWeight: 600 }}>
          ← Back to the shop
        </Link>
      </section>
    );
  }

  const plantId = plant.plant_id;

  return (
    <article className="ff-page" style={{ padding: '1.5rem', fontFamily: 'sans-serif', maxWidth: 1000, margin: '0 auto' }}>
      <Link to="/shop" style={{ color: '#1b7a3d', fontSize: '0.9rem', fontWeight: 600 }}>
        ← Back to shop
      </Link>

      {/* Top: gallery + core info */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2rem',
          marginTop: '1rem',
          alignItems: 'start',
        }}
      >
        <PlantGallery imageUrl={plant.image_url} alt={plant.name} />

        <div>
          <h1 style={{ color: '#2f4a38', margin: '0 0 0.25rem' }}>{plant.name}</h1>
          {plant.botanical_name ? (
            <p style={{ fontStyle: 'italic', color: '#889', margin: '0 0 1rem' }}>{plant.botanical_name}</p>
          ) : null}

          <p style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1b7a3d', margin: '0 0 1rem' }}>
            {formatPKR(plant.price)}
          </p>

          <div style={{ display: 'flex', gap: '1.25rem', color: '#556', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {plant.size ? <span>Size: <strong>{plant.size}</strong></span> : null}
            <span>Stock: <strong>{plant.stock_qty}</strong></span>
          </div>

          <AddToCartBtn plant={plant} />
        </div>
      </div>

      {/* Care guide */}
      <CareGuide plant={plant} />

      {/* Reviews */}
      <ReviewList plantId={plantId} />
      <div style={{ marginTop: '1rem' }}>
        <ReviewForm plantId={plantId} />
      </div>

      {/* Related items */}
      <RelatedItems categoryId={plant.category_id} currentPlantId={plantId} />
    </article>
  );
}
