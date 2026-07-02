import { useEffect, useState } from 'react';
import { getCategories } from '../api/categories.js';

const labelStyle = { display: 'block', fontWeight: 700, color: '#2f4a38', marginBottom: '0.4rem' };
const controlStyle = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.5rem',
  borderRadius: 8,
  border: '1px solid #cdddd2',
  fontSize: '0.95rem',
  background: '#fff',
};

// Controlled filter panel. `values` come from the URL (Shop owns them); every
// change is reported up via onChange(key, value) using the backend's param
// names (category, low_maint, pet_friendly, min_price, max_price).
export default function FilterSidebar({ values, onChange, onClear }) {
  const [categories, setCategories] = useState([]);

  // Price fields commit on blur / Enter (not every keystroke) to avoid a
  // refetch per character while typing.
  const [minLocal, setMinLocal] = useState(values.min_price);
  const [maxLocal, setMaxLocal] = useState(values.max_price);
  useEffect(() => setMinLocal(values.min_price), [values.min_price]);
  useEffect(() => setMaxLocal(values.max_price), [values.max_price]);

  useEffect(() => {
    let active = true;
    getCategories()
      .then((data) => active && setCategories(data.categories || []))
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const commit = (key) => (val) => {
    if (val !== values[key]) onChange(key, val);
  };

  const hasFilters =
    values.category || values.low_maint || values.pet_friendly || values.min_price || values.max_price;

  return (
    <aside
      style={{
        fontFamily: 'sans-serif',
        border: '1px solid #e2e8e4',
        borderRadius: 12,
        padding: '1.25rem',
        background: '#fbfdfb',
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        height: 'fit-content',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, color: '#2f4a38' }}>Filters</h3>
        {hasFilters ? (
          <button
            onClick={onClear}
            style={{ background: 'none', border: 'none', color: '#1b7a3d', cursor: 'pointer', fontSize: '0.85rem' }}
          >
            Clear all
          </button>
        ) : null}
      </div>

      {/* Category */}
      <div>
        <label htmlFor="filter-category" style={labelStyle}>
          Category
        </label>
        <select
          id="filter-category"
          value={values.category}
          onChange={(e) => onChange('category', e.target.value)}
          style={controlStyle}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.category_id} value={String(c.category_id)}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Trait toggles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={values.low_maint}
            onChange={(e) => onChange('low_maint', e.target.checked)}
          />
          Low Maintenance
        </label>
        <label style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={values.pet_friendly}
            onChange={(e) => onChange('pet_friendly', e.target.checked)}
          />
          Pet Friendly
        </label>
      </div>

      {/* Price range */}
      <div>
        <label style={labelStyle}>Price range (Rs)</label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            type="number"
            min="0"
            placeholder="Min"
            value={minLocal}
            onChange={(e) => setMinLocal(e.target.value)}
            onBlur={() => commit('min_price')(minLocal)}
            onKeyDown={(e) => e.key === 'Enter' && commit('min_price')(minLocal)}
            style={controlStyle}
          />
          <span style={{ color: '#889' }}>–</span>
          <input
            type="number"
            min="0"
            placeholder="Max"
            value={maxLocal}
            onChange={(e) => setMaxLocal(e.target.value)}
            onBlur={() => commit('max_price')(maxLocal)}
            onKeyDown={(e) => e.key === 'Enter' && commit('max_price')(maxLocal)}
            style={controlStyle}
          />
        </div>
      </div>
    </aside>
  );
}
