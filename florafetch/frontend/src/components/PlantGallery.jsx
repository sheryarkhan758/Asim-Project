import { useState } from 'react';

// Single-image gallery with a graceful 🪴 fallback when the image is missing
// or fails to load (plant photos live at /uploads, proxied to the backend).
export default function PlantGallery({ imageUrl, alt }) {
  const [imgError, setImgError] = useState(false);
  const showImage = imageUrl && !imgError;

  return (
    <div
      style={{
        aspectRatio: '1 / 1',
        borderRadius: 16,
        overflow: 'hidden',
        background: '#eef5f0',
        border: '1px solid #e2e8e4',
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
