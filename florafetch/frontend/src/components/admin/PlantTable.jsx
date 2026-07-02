import { useState } from 'react';
import { formatPKR } from '../../utils/format.js';

const th = { textAlign: 'left', padding: '0.6rem 0.75rem', color: '#889', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, borderBottom: '2px solid #e2e8e4' };
const td = { padding: '0.6rem 0.75rem', borderBottom: '1px solid #eef2ef', color: '#2f4a38', verticalAlign: 'middle' };

function Thumb({ url, alt }) {
  const [error, setError] = useState(false);
  const show = url && !error;
  return (
    <div style={{ width: 44, height: 44, borderRadius: 8, background: '#eef5f0', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      {show ? (
        <img src={url} alt={alt} onError={() => setError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        <span style={{ fontSize: '1.2rem' }} role="img" aria-label="plant">🪴</span>
      )}
    </div>
  );
}

const actionBtn = (color) => ({
  background: 'none',
  border: `1px solid ${color}`,
  color,
  borderRadius: 6,
  padding: '0.3rem 0.7rem',
  fontSize: '0.8rem',
  fontWeight: 600,
  cursor: 'pointer',
});

// Table of all plants with per-row Edit / Delete actions.
export default function PlantTable({ plants, categoryName, onEdit, onDelete }) {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640, fontFamily: 'sans-serif' }}>
        <thead>
          <tr>
            <th style={th}>Plant</th>
            <th style={th}>Category</th>
            <th style={th}>Price</th>
            <th style={th}>Stock</th>
            <th style={{ ...th, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {plants.map((p) => (
            <tr key={p.plant_id}>
              <td style={td}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <Thumb url={p.image_url} alt={p.name} />
                  <div>
                    <div style={{ fontWeight: 700 }}>{p.name}</div>
                    {p.botanical_name ? (
                      <div style={{ color: '#889', fontSize: '0.8rem', fontStyle: 'italic' }}>{p.botanical_name}</div>
                    ) : null}
                  </div>
                </div>
              </td>
              <td style={td}>{categoryName(p.category_id) || '—'}</td>
              <td style={td}>{formatPKR(p.price)}</td>
              <td style={td}>
                <span style={{ fontWeight: 700, color: Number(p.stock_qty) === 0 ? '#c0392b' : Number(p.stock_qty) <= 5 ? '#8a5a00' : '#2f4a38' }}>
                  {p.stock_qty}
                </span>
              </td>
              <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                <button onClick={() => onEdit(p)} style={{ ...actionBtn('#1b7a3d'), marginRight: '0.5rem' }}>
                  Edit
                </button>
                <button onClick={() => onDelete(p)} style={actionBtn('#c0392b')}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
