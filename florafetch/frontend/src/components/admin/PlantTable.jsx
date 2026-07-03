import { useState } from 'react';
import { formatPKR } from '../../utils/format.js';
import { theme } from '../../styles/theme.js';

const th = {
  textAlign: 'left',
  padding: '0.75rem 0.85rem',
  color: theme.color.muted,
  fontSize: '0.72rem',
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  fontWeight: 700,
  background: theme.color.bgSoft,
  borderBottom: `1px solid ${theme.color.border}`,
};
const td = {
  padding: '0.7rem 0.85rem',
  borderBottom: `1px solid ${theme.color.borderSoft}`,
  color: theme.color.ink,
  verticalAlign: 'middle',
};

function Thumb({ url, alt }) {
  const [error, setError] = useState(false);
  const show = url && !error;
  return (
    <div
      style={{
        width: 46,
        height: 46,
        borderRadius: theme.radius.md,
        background: theme.color.primarySoft,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
        border: `1px solid ${theme.color.borderSoft}`,
      }}
    >
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
  border: `1.5px solid ${color}`,
  color,
  borderRadius: theme.radius.pill,
  padding: '0.35rem 0.85rem',
  fontSize: '0.8rem',
  fontWeight: 700,
  cursor: 'pointer',
});

// Stock level badge with primary/warning/danger tints.
function StockBadge({ qty }) {
  const n = Number(qty);
  const tone =
    n === 0
      ? { bg: '#fbe9e7', fg: theme.color.danger }
      : n <= 5
      ? { bg: '#fff2d6', fg: '#8a5a00' }
      : { bg: theme.color.primarySoft, fg: theme.color.primary };
  return (
    <span
      style={{
        fontWeight: 700,
        fontSize: '0.8rem',
        color: tone.fg,
        background: tone.bg,
        padding: '0.25rem 0.7rem',
        borderRadius: theme.radius.pill,
      }}
    >
      {n === 0 ? 'Out of stock' : `${qty} in stock`}
    </span>
  );
}

// Table of all plants with per-row Edit / Delete actions.
export default function PlantTable({ plants, categoryName, onEdit, onDelete }) {
  return (
    <div style={{ overflowX: 'auto', border: `1px solid ${theme.color.borderSoft}`, borderRadius: theme.radius.md }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
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
                      <div style={{ color: theme.color.muted, fontSize: '0.8rem', fontStyle: 'italic' }}>{p.botanical_name}</div>
                    ) : null}
                  </div>
                </div>
              </td>
              <td style={{ ...td, color: theme.color.body }}>
                {categoryName(p.category_id) ? (
                  <span
                    style={{
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      color: theme.color.primary,
                      background: theme.color.primarySoft,
                      padding: '0.25rem 0.7rem',
                      borderRadius: theme.radius.pill,
                    }}
                  >
                    {categoryName(p.category_id)}
                  </span>
                ) : (
                  '—'
                )}
              </td>
              <td style={{ ...td, fontWeight: 600 }}>{formatPKR(p.price)}</td>
              <td style={td}>
                <StockBadge qty={p.stock_qty} />
              </td>
              <td style={{ ...td, textAlign: 'right', whiteSpace: 'nowrap' }}>
                <button className="ff-btn" onClick={() => onEdit(p)} style={{ ...actionBtn(theme.color.primary), marginRight: '0.5rem' }}>
                  Edit
                </button>
                <button className="ff-btn" onClick={() => onDelete(p)} style={actionBtn(theme.color.danger)}>
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
