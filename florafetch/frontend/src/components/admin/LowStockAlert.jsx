import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPlants } from '../../api/plants.js';

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

  return (
    <section
      style={{
        background: '#fff',
        border: '1px solid #dfe5e0',
        borderRadius: 12,
        padding: '1.25rem',
        marginBottom: '2rem',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
        <h2 style={{ color: '#14331f', margin: 0 }}>
          ⚠️ Low stock <span style={{ fontSize: '0.85rem', color: '#889', fontWeight: 500 }}>(≤ {THRESHOLD})</span>
        </h2>
        <Link to="/admin/plants" style={{ color: '#1b7a3d', fontWeight: 600, fontSize: '0.9rem' }}>
          Manage inventory →
        </Link>
      </div>

      {status === 'loading' && <p style={{ color: '#667' }}>Checking stock…</p>}
      {status === 'error' && <p style={{ color: '#c0392b' }}>Could not load inventory.</p>}
      {status === 'ready' &&
        (plants.length === 0 ? (
          <p style={{ color: '#1b7a3d', margin: '0.75rem 0 0' }}>All plants are well stocked. 🌿</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: '0.75rem 0 0', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {plants.map((p) => (
              <li
                key={p.plant_id}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.25rem', borderBottom: '1px solid #eef2ef' }}
              >
                <Link to={`/plant/${p.plant_id}`} style={{ color: '#2f4a38', fontWeight: 600, textDecoration: 'none' }}>
                  {p.name}
                </Link>
                <span
                  style={{
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    color: Number(p.stock_qty) === 0 ? '#c0392b' : '#8a5a00',
                    background: Number(p.stock_qty) === 0 ? '#fbe9e7' : '#fff5e0',
                    padding: '0.2rem 0.6rem',
                    borderRadius: 999,
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
