import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlants } from '../../api/plants.js';
import { theme } from '../../styles/theme.js';

const THRESHOLD = 5; // plants at or below this stock count are flagged

// Store-wide low-stock list from GET /plants (all plants, admin-visible).
export default function LowStockAlert() {
  const [plants, setPlants] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error

  useEffect(() => {
    let active = true;
    getPlants()
      .then((data) => {
        if (!active) return;
        const low = (data.plants || [])
          .filter((p) => Number(p.stock_qty) <= THRESHOLD)
          .sort((a, b) => a.stock_qty - b.stock_qty);
        setPlants(low);
        setStatus('ready');
      })
      .catch(() => active && setStatus('error'));
    return () => {
      active = false;
    };
  }, []);

  const hasLow = status === 'ready' && plants.length > 0;

  return (
    <section
      style={{
        background: hasLow ? '#fffaf2' : '#fff',
        border: `1px solid ${hasLow ? '#f2e0c0' : theme.color.border}`,
        borderRadius: theme.radius.lg,
        boxShadow: theme.shadow.sm,
        padding: '1.35rem 1.5rem',
        marginBottom: '2rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <h2
          style={{
            fontFamily: theme.font.head,
            color: theme.color.ink,
            fontSize: '1.15rem',
            fontWeight: 700,
            margin: 0,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
          }}
        >
          <span aria-hidden="true">⚠️</span> Low stock{' '}
          <span style={{ fontSize: '0.82rem', color: theme.color.muted, fontWeight: 500 }}>(≤ {THRESHOLD})</span>
        </h2>
        <Link
          to="/admin/plants"
          className="ff-underline"
          style={{ color: theme.color.primary, fontWeight: 700, fontSize: '0.9rem', textDecoration: 'none' }}
        >
          Manage inventory →
        </Link>
      </div>

      {status === 'loading' && <p style={{ color: theme.color.muted }}>Checking stock…</p>}
      {status === 'error' && <p style={{ color: theme.color.danger }}>Could not load inventory.</p>}
      {status === 'ready' &&
        (plants.length === 0 ? (
          <p style={{ color: theme.color.primary, margin: '0.75rem 0 0', fontWeight: 600 }}>
            All plants are well stocked. 🌿
          </p>
        ) : (
          <ul
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '1rem 0 0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.4rem',
            }}
          >
            {plants.map((p) => (
              <li
                key={p.plant_id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.55rem 0.75rem',
                  borderRadius: theme.radius.sm,
                  background: '#fff',
                  border: `1px solid ${theme.color.borderSoft}`,
                }}
              >
                <Link
                  to={`/plant/${p.plant_id}`}
                  style={{ color: theme.color.ink, fontWeight: 600, textDecoration: 'none' }}
                >
                  {p.name}
                </Link>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    color: Number(p.stock_qty) === 0 ? theme.color.danger : '#8a5a00',
                    background: Number(p.stock_qty) === 0 ? '#fbe9e7' : '#fff2d6',
                    padding: '0.25rem 0.7rem',
                    borderRadius: theme.radius.pill,
                  }}
                >
                  {Number(p.stock_qty) === 0 ? 'Out of stock' : `${p.stock_qty} left`}
                </span>
              </li>
            ))}
          </ul>
        ))}
    </section>
  );
}
