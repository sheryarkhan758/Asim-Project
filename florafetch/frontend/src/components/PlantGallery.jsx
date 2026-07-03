import { useState } from 'react';
import { theme } from '../styles/theme.js';

// Single-image gallery with a graceful 🪴 fallback when the image is missing
// or fails to load (plant photos live at /uploads, proxied to the backend).
export default function PlantGallery({ imageUrl, alt }) {
  const [imgError, setImgError] = useState(false);
  const showImage = imageUrl && !imgError;

  return (
    <div
      style={{
        aspectRatio: '1 / 1',
        borderRadius: theme.radius.xl,
        overflow: 'hidden',
        background: theme.gradient.soft,
        border: `1px solid ${theme.color.border}`,
        boxShadow: theme.shadow.md,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {showImage ? (
        <img
          src={imageUrl}
          alt={alt}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{ fontSize: '5rem' }} role="img" aria-label="plant">
          🪴
        </span>
      )}
    </div>
  );
}
