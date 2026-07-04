import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { formatPKR } from '../utils/format.js';

const badgeStyle = {
  fontSize: '0.7rem',
  fontWeight: 700,
  padding: '0.15rem 0.45rem',
  borderRadius: 999,
  background: '#e8f3ea',
  color: '#1b7a3d',
};

export default function ProductCard({ plant }) {
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [imgError, setImgError] = useState(false);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const outOfStock = Number(plant.stock_qty) <= 0;
  const showImage = plant.image_url && !imgError;

  const handleAdd = async () => {
    // Cart lives on the server behind auth, send guests to login first.
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/shop' } } });
      return;
    }
    setAdding(true);
    try {
      await addToCart(plant.plant_id, 1);
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    } catch {
      // A 401 is handled globally by the axios interceptor; ignore here.
    } finally {
      setAdding(false);
    }
  };

  return (
    <div
      className="ff-card"
      style={{
        display: 'flex',
        flexDirection: 'column',
        border: '1px solid #e2e8e4',
        borderRadius: 12,
        overflow: 'hidden',
        background: '#fff',
        boxShadow: '0 4px 14px rgba(27, 122, 61, 0.05)',
      }}
    >
      {/* Image (links to detail) */}
      <Link to={`/plant/${plant.plant_id}`} className="ff-zoom" style={{ display: 'block' }}>
        <div
          style={{
            aspectRatio: '1 / 1',
            background: '#eef5f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {showImage ? (
            <img
              src={plant.image_url}
              alt={plant.name}
              loading="lazy"
              onError={() => setImgError(true)}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <span style={{ fontSize: '3rem' }} role="img" aria-label="plant">
              🪴
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div style={{ padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', flex: 1 }}>
        <Link
          to={`/plant/${plant.plant_id}`}
          style={{ color: '#2f4a38', fontWeight: 700, textDecoration: 'none', fontSize: '1.05rem' }}
        >
          {plant.name}
        </Link>
        {plant.botanical_name ? (
          <span style={{ color: '#889', fontSize: '0.8rem', fontStyle: 'italic' }}>
            {plant.botanical_name}
          </span>
        ) : null}

        {/* Trait badges */}
        {(plant.is_low_maint || plant.is_pet_friendly) && (
          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {plant.is_low_maint ? <span style={badgeStyle}>Low Maintenance</span> : null}
            {plant.is_pet_friendly ? <span style={badgeStyle}>Pet Friendly</span> : null}
          </div>
        )}

        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            paddingTop: '0.4rem',
          }}
        >
          <strong style={{ color: '#1b7a3d', fontSize: '1.05rem' }}>{formatPKR(plant.price)}</strong>
          <button
            onClick={handleAdd}
            disabled={outOfStock || adding}
            className="ff-btn"
            style={{
              border: 'none',
              borderRadius: 8,
              padding: '0.45rem 0.7rem',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: outOfStock || adding ? 'default' : 'pointer',
              background: outOfStock ? '#e2e8e4' : added ? '#127a32' : '#1b7a3d',
              color: outOfStock ? '#889' : '#fff',
              whiteSpace: 'nowrap',
            }}
          >
            {outOfStock ? 'Out of stock' : added ? 'Added ✅' : adding ? 'Adding…' : 'Add to cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
