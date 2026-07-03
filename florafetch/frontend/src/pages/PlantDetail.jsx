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
import Container from '../components/ui/Container.jsx';
import { theme } from '../styles/theme.js';

const backLink = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.35rem',
  color: theme.color.primary,
  fontSize: '0.9rem',
  fontWeight: 700,
  textDecoration: 'none',
};

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
    return (
      <Container style={{ padding: '3rem 1.5rem' }}>
        <p style={{ color: theme.color.muted }}>Loading plant…</p>
      </Container>
    );
  }

  if (status === 'notfound') {
    return (
      <Container style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3.5rem' }}>🥀</div>
        <h1 style={{ color: theme.color.ink }}>Plant not found</h1>
        <p style={{ color: theme.color.muted }}>This plant may have been removed or the link is incorrect.</p>
        <Link to="/shop" className="ff-underline" style={backLink}>
          ← Back to the shop
        </Link>
      </Container>
    );
  }

  if (status === 'error') {
    return (
      <Container style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h1 style={{ color: theme.color.ink }}>Something went wrong</h1>
        <p style={{ color: theme.color.muted }}>We couldn't load this plant. Please try again.</p>
        <Link to="/shop" className="ff-underline" style={backLink}>
          ← Back to the shop
        </Link>
      </Container>
    );
  }

  const plantId = plant.plant_id;

  return (
    <div className="ff-page" style={{ background: theme.color.bgSoft, padding: '1.75rem 0 3.5rem' }}>
      <Container>
        <article>
          <Link to="/shop" className="ff-underline" style={backLink}>
            ← Back to shop
          </Link>

          {/* Top: gallery + core info */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2.5rem',
              marginTop: '1.25rem',
              alignItems: 'start',
            }}
          >
            <PlantGallery imageUrl={plant.image_url} alt={plant.name} />

            <div
              style={{
                background: theme.color.white,
                border: `1px solid ${theme.color.border}`,
                borderRadius: theme.radius.lg,
                boxShadow: theme.shadow.sm,
                padding: 'clamp(1.5rem, 3vw, 2rem)',
              }}
            >
              <h1 style={{ color: theme.color.ink, margin: '0 0 0.35rem' }}>{plant.name}</h1>
              {plant.botanical_name ? (
                <p style={{ fontStyle: 'italic', color: theme.color.faint, margin: '0 0 1rem' }}>
                  {plant.botanical_name}
                </p>
              ) : null}

              <p style={{ fontSize: '2rem', fontWeight: 800, color: theme.color.primary, margin: '0 0 1.25rem' }}>
                {formatPKR(plant.price)}
              </p>

              {/* Trait / spec badges */}
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                {plant.size ? (
                  <span style={pill}>
                    <span style={pillLabel}>Size</span> {plant.size}
                  </span>
                ) : null}
                <span style={pill}>
                  <span style={pillLabel}>Stock</span> {plant.stock_qty}
                </span>
              </div>

              <AddToCartBtn plant={plant} />
            </div>
          </div>

          {/* Care guide */}
          <CareGuide plant={plant} />

          {/* Reviews */}
          <ReviewList plantId={plantId} />
          <div style={{ marginTop: '1.25rem' }}>
            <ReviewForm plantId={plantId} />
          </div>

          {/* Related items */}
          <RelatedItems categoryId={plant.category_id} currentPlantId={plantId} />
        </article>
      </Container>
    </div>
  );
}

const pill = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '0.4rem',
  background: theme.color.primarySoft,
  color: theme.color.primaryDark,
  fontWeight: 700,
  fontSize: '0.9rem',
  padding: '0.45rem 0.9rem',
  borderRadius: theme.radius.pill,
};
const pillLabel = {
  fontSize: '0.7rem',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  color: theme.color.primary,
  fontWeight: 700,
};
